from fastapi import BackgroundTasks

from config import ConfigEnv
from cuply.auth.email_helpers import send_email_async
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.feedback.schemas import FeedbackCreateSchema
from cuply.telegram.services import TelegramService


class FeedbackService:
    async def create(
        self,
        uow: AsyncUnitOfWork,
        schema: FeedbackCreateSchema,
        background_tasks: BackgroundTasks,
    ):
        data = schema.model_dump()
        feedback_id = await uow.feedback_repo.add_one(data)
        await uow.commit()

        message = (
            f"[{ConfigEnv.ENV}] Заявка на обратную связь #({feedback_id})\n\nEmail: {data['email']}"
            f"\nTG: {data.get('tg_login') or '-'}"
            f"\n\n{data.get('message') or '-'}"
        )
        telegram_service = TelegramService()
        background_tasks.add_task(
            telegram_service.send_message,
            chat_id=ConfigEnv.FEEDBACK_APPLICATIONS_TELEGRAM_CHAT_ID,
            message=message,
            thread_id=ConfigEnv.FEEDBACK_APPLICATIONS_TELEGRAM_CHAT_THREAD_ID,
        )

        data['id'] = feedback_id

        background_tasks.add_task(
            send_email_async,
            subject=f'Заявка на обратную связь #{feedback_id}',
            email_to=ConfigEnv.FEEDBACK_APPLICATIONS_EMAIL,
            body=data,
            template_name='feedback_application.html',
        )
