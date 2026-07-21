import asyncio
import multiprocessing
import os
import traceback
import datetime as dt
from logging.config import dictConfig

import uvicorn
import sentry_sdk
import telegram
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_utilities import repeat_every
from sqlalchemy import text
from starlette.requests import Request
from starlette.responses import JSONResponse

from backlib.databases import get_db
from config import ConfigEnv
from constants import API_PREFIX_V1
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.matches.models import MatchModel, MatchStatus
from cuply.matches.schemas.matches import SeriesMatchUpdateSchema
from cuply.matches.services.results import MatchResultService
from cuply.teams.ws import manager
from logs import CuplyLogMiddleware
from logs import cuply_logger
from logs.config import log_config
from routers import all_routers


dictConfig(log_config)

cuply_app = FastAPI()


origins = [
    "*",
]


cuply_app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
cuply_app.add_middleware(
    CuplyLogMiddleware,
)


worker_id = os.getpid() % (multiprocessing.cpu_count() * 2 + 1)


@cuply_app.exception_handler(Exception)
async def custom_exception_handler(request: Request, exc: Exception):
    cuply_logger.error(f"Unhandled exception: {exc}")
    cuply_logger.error(traceback.format_exc())

    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred."},
    )


@cuply_app.get("/health")
def check_health():
    return {"message": "It is working"}


@cuply_app.get("/db_health")
def check_db():
    session = next(get_db())
    return {"message": session.execute(text("SELECT 1")).scalar_one()}


@cuply_app.on_event("startup")
async def startup():
    asyncio.create_task(manager.start_polling())


@cuply_app.on_event("startup")
@repeat_every(seconds=120, logger=cuply_logger, wait_first=True)
async def lifespan():
    uow = AsyncUnitOfWork()
    match_result_service = MatchResultService()
    async with uow:
        matches: list[MatchModel] = await uow.match_repo.find_waiting_matches()
        now = dt.datetime.now(dt.timezone.utc)
        for match in matches:
            cuply_logger.info(f"Time diff: '{now - match.updated_at}', now: '{now}', match_latest_update: {match.updated_at} ")
            if now - match.updated_at > dt.timedelta(minutes=60):
                to_update = SeriesMatchUpdateSchema(status=MatchStatus.CONFIRMED_BY_CRON)
                cuply_logger.info(f"Confirming match '{match.id}'")
                data = to_update.model_dump(exclude_unset=True)
                await uow.match_repo.edit_one(match.id, data)
                await uow.commit()

                await match_result_service.update_next_matches_status(
                    series_id=match.series_id,
                    current_match=None,
                    uow=uow,
                )


if worker_id == 0 and ConfigEnv.TELEGRAM_BOT_TOKEN:
    @cuply_app.on_event("startup")
    async def update_telegram_usernames():
        from cuply.telegram.services import TelegramService
        from cuply.auth.models import UserModel

        while True:
            users_data = []

            uow = AsyncUnitOfWork()
            async with uow:
                users = await uow.user_repo.get_full_users(UserModel.chat_id != None)
                for user in users:
                    users_data.append({
                        'id': user.id,
                        'tg_login': user.tg_login,
                        'chat_id': user.chat_id,
                    })

            for user in users_data:
                try:
                    telegram_service = TelegramService()
                    username = await telegram_service.get_username_by_chat_id(user['chat_id'])
                except telegram.error.TelegramError:
                    cuply_logger.exception(f"Cannot load username for user with id={user['id']}")
                    continue
                except (telegram.error.TimedOut, telegram.error.RetryAfter):
                    cuply_logger.exception(f"Cannot load username for user with id={user['id']}")
                    await asyncio.sleep(60)
                    continue

                if username and user['tg_login'] != username:
                    uow = AsyncUnitOfWork()
                    async with uow:
                        cuply_logger.info(f'Update telegram login from "{user['tg_login']}" to "{username}"')
                        await uow.user_repo.edit_one(user['id'], {
                            'tg_login': username,
                        })
                        await uow.commit()

                await asyncio.sleep(5)


for router in all_routers:
    cuply_app.include_router(router)
cuply_app.mount(API_PREFIX_V1, cuply_app)


sentry_sdk.init(
    dsn=ConfigEnv.SENTRY_DSN,
    traces_sample_rate=1.0,
)


if __name__ == "__main__":
    uvicorn.run(cuply_app, host="0.0.0.0", port=8001)
