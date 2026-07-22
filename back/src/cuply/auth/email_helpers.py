import os.path
from pathlib import Path
from typing import Optional

from fastapi_mail import ConnectionConfig, MessageSchema, FastMail, MessageType

from config import ConfigEnv
from logs import cuply_logger


BASE_DIR = Path(__file__).resolve().parent.parent

conf = ConnectionConfig(
    MAIL_USERNAME=ConfigEnv.EMAIL_USERNAME,
    MAIL_PASSWORD=ConfigEnv.EMAIL_PASSWORD,
    MAIL_FROM=ConfigEnv.EMAIL_FROM,
    MAIL_PORT=ConfigEnv.EMAIL_PORT,
    MAIL_SERVER=ConfigEnv.EMAIL_HOST,
    MAIL_FROM_NAME=ConfigEnv.EMAIL_FROM_NAME,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    TEMPLATE_FOLDER=os.path.join(BASE_DIR, "templates", "email")
)


async def send_email_async(
    subject: str,
    email_to: str,
    body: dict,
    template_name: Optional[str] = None,    
):
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        template_body=body,
        subtype=MessageType.html,
    )

    fm = FastMail(conf)
    cuply_logger.info(f"Sending message to email: '{email_to}'")
    await fm.send_message(message, template_name=template_name)
