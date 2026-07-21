""" Schemas for interaction with Telegram. """
import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator
from pydantic_core.core_schema import FieldValidationInfo

import config


class TelegramTokenVerifierReadSchema(BaseModel):
    """ Read schema TelegramTokenVerifierModel. """
    token: str
    tg_login: str
    expires_at: datetime.datetime

    full_link: str = Field(default=None, validate_default=True)

    model_config = ConfigDict(from_attributes=True)

    @field_validator("full_link", mode="before")
    def generate_is_registered(cls, value, info: FieldValidationInfo):
        return f"{config.ConfigEnv.TELEGRAM_SERVER_URL}/{config.ConfigEnv.TELEGRAM_BOT_NAME}?start={info.data['token']}"


class UserSetTelegramLoginSchema(BaseModel):
    """ Schema to change user Telegram login. """
    tg_login: str

    @field_validator("tg_login")
    def validate_username(cls, value):
        if value.startswith(config.ConfigEnv.TELEGRAM_SERVER_URL):
            value = value[len(config.ConfigEnv.TELEGRAM_SERVER_URL):]
        if value.startswith("@") or value.startswith("/"):
            value = value[1:]

        return value
