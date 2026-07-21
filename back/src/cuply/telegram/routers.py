"""Routers for interaction with Telegram."""
from fastapi import Depends, APIRouter
from starlette import status
from starlette.requests import Request
from starlette.responses import Response

import config
import constants
from cuply.auth.base_config import current_active_user
from cuply.auth.models import UserModel
from cuply.dependencies import UOWDepAsync
from cuply.series.services.series import SeriesService
from cuply.telegram.exceptions import (
    TokenNotFoundError,
    AnotherUsernameError,
    TokenAlreadyUsedError,
    TokenExpiredError,
    UserNotFoundError, UserWithThisAccountAlreadyExists,
)
from cuply.telegram.schemas import UserSetTelegramLoginSchema
from cuply.telegram.services import (
    TelegramTokenVerifierService,
    TelegramService,
    TelegramCommandHandlerService
)
from logs import cuply_logger

router = APIRouter(
    prefix="/telegram",
    tags=["Telegram"],
)

# Константа для кнопки "Мои игры"
BUTTON_MY_GAMES = "Мои игры"


@router.post("/create-verification-code")
async def create_verification_code(
        schema: UserSetTelegramLoginSchema,
        uow: UOWDepAsync,
        user: UserModel = Depends(current_active_user),
):
    """Endpoint to get verification code for a given user."""
    verification_service = TelegramTokenVerifierService()

    async with uow:
        result = await verification_service.create_verification_code(uow, schema, user)
    return result


@router.post("/webhook/{tg_auth_token}")
async def webhook(
        tg_auth_token: str,
        request: Request,
        uow: UOWDepAsync,
):
    """Endpoint для получения данных от Telegram."""
    telegram_service = TelegramService()
    verification_service = TelegramTokenVerifierService()
    series_service = SeriesService()

    command_handler_service = TelegramCommandHandlerService(
        verifier_service=verification_service,
        telegram_service=telegram_service,
        series_service=series_service
    )

    if tg_auth_token != config.ConfigEnv.TELEGRAM_AUTH_TOKEN:
        return Response(status_code=status.HTTP_200_OK)

    data = await request.json()

    cuply_logger.info(data)

    try:
        message_data = data["message"]

        chat_id = message_data["chat"]["id"]
        username = message_data["from"].get("username")
        message = message_data.get("text")

        chat_type = message_data["chat"].get("type")
        if chat_type in ["group", "supergroup"]:
            return Response(status_code=status.HTTP_200_OK)

        if not username:
            await telegram_service.send_message(
                chat_id=chat_id,
                message="Не удалось определить ваш Telegram username. Пожалуйста, убедитесь, что он указан в настройках."
            )
            return Response(status_code=status.HTTP_200_OK)
    except KeyError:
        return Response(status_code=status.HTTP_200_OK)

    try:
        async with uow:
            if message.startswith("/start "):
                # Handle /start TOKEN command for verification
                token = message.split(" ")[1]
                if token == "greeting":
                    await command_handler_service.handle_welcome_start_command(uow, username=username, chat_id=chat_id)
                else:
                    await command_handler_service.handle_verification_start_command(uow, token=token, username=username,
                                                                                    chat_id=chat_id)
            elif message == "/start":
                # Handle /start command for regular users
                await command_handler_service.handle_welcome_start_command(uow, username=username, chat_id=chat_id)
            elif message == "/games" or message == BUTTON_MY_GAMES:
                # Handle /games command or "Мои игры" button
                await command_handler_service.handle_games_command(uow, username=username, chat_id=chat_id)

    except UserNotFoundError:
        cuply_logger.info(f"User '{username}' not found by Telegram")
        await telegram_service.send_message(
            chat_id=chat_id,
            message="Пользователь не найден. Пожалуйста, свяжите ваш аккаунт."
        )
    except TokenNotFoundError:
        await telegram_service.send_message(
            chat_id=chat_id,
            message=constants.TG_TOKEN_NOT_FOUND_MSG,
        )
    except AnotherUsernameError as ex:
        feedback = constants.TG_ANOTHER_USERNAME_SPECIFIED_MSG.format(
            specified=ex.specified_username,
            received=ex.receiver_username,
        )
        await telegram_service.send_message(
            chat_id=chat_id,
            message=feedback
        )
    except TokenAlreadyUsedError:
        await telegram_service.send_message(
            chat_id=chat_id,
            message=constants.TG_TOKEN_ALREADY_USED_MSG,
        )
    except TokenExpiredError:
        await telegram_service.send_message(
            chat_id=chat_id,
            message=constants.TG_TOKEN_EXPIRED_MSG,
        )
    except UserWithThisAccountAlreadyExists:
        await telegram_service.send_message(
            chat_id=chat_id,
            message=constants.TG_USER_ALREADY_EXISTS_MSG,
        )
    except Exception:
        cuply_logger.exception("Unexpected error when processing Telegram message")
        try:
            await telegram_service.send_message(
                chat_id=chat_id,
                message="Произошла ошибка при обработке вашего запроса."
            )
        except Exception:
            cuply_logger.exception("Unexpected error when sending error message to Telegram")

    return Response(status_code=status.HTTP_200_OK)
