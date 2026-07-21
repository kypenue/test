from typing import Optional

from fastapi import Depends, Request, HTTPException
from fastapi_users import (
    BaseUserManager,
    IntegerIDMixin,
    InvalidPasswordException,
    exceptions,
    models,
    schemas,
)
from sqlalchemy.exc import IntegrityError
from starlette import status

from backlib.utils import has_number, has_character
from config import ConfigEnv
from cuply.auth.email_helpers import send_email_async
from cuply.auth.models import UserModel, UserRoles
from cuply.auth.schemas import UserCreateSchema
from cuply.auth.utils import get_user_db
from logs import cuply_logger


class UserManager(IntegerIDMixin, BaseUserManager[UserModel, int]):
    reset_password_token_secret = ConfigEnv.AUTH_SECRET_KEY
    verification_token_secret = ConfigEnv.AUTH_SECRET_KEY

    async def on_after_register(self, user: UserModel, request: Optional[Request] = None):
        cuply_logger.info(f"User ('{user.id}', '{user.username}') has registered")

    async def on_after_forgot_password(
        self,
        user: UserModel,
        token: str,
        request: Optional[Request] = None,
    ):
        cuply_logger.info(f"User with id '{user.id}' has forgot its password. Reset token: {token}")
        await send_email_async(
            subject="CUPLY - сброс пароля",
            email_to=user.email,
            body={
                "name": user.name,
                "app_url": ConfigEnv.APP_URL,
                "token": token
            },
            template_name="forgot_password.html"
        )

    async def on_after_request_verify(
        self,
        user: UserModel,
        token: str,
        request: Optional[Request] = None,
    ):
        cuply_logger.info(f"User with id '{user.id}' wants to verify email. Verify token: {token}")
        await send_email_async(
            subject="CUPLY - подтверждение почты",
            email_to=user.email,
            body={
                "name": user.name,
                "app_url": ConfigEnv.APP_URL,
                "token": token
            },
            template_name="verify_email.html"
        )

    async def validate_password(
        self,
        password: str,
        user: UserCreateSchema | UserModel,
    ) -> None:
        if len(password) < 8:
            raise InvalidPasswordException(
                reason="Пароль должен быть не короче 8 символов"
            )
        if not has_number(password):
            raise InvalidPasswordException(
                reason="В пароле должна быть хотя бы одна цифра"
            )
        if not has_character(password):
            raise InvalidPasswordException(
                reason="В пароле должна быть хотя бы одна буква"
            )

    async def create(
        self,
        user_create: schemas.UC,
        safe: bool = False,
        request: Optional[Request] = None,
    ) -> models.UP:
        await self.validate_password(user_create.password, user_create)

        existing_user = await self.user_db.get_by_email(user_create.email)
        if existing_user is not None:
            raise exceptions.UserAlreadyExists()

        user_dict = (
            user_create.create_update_dict()
            if safe
            else user_create.create_update_dict_superuser()
        )
        password = user_dict.pop("password")
        user_dict["hashed_password"] = self.password_helper.hash(password)
        user_dict["role"] = UserRoles.PLAYER

        try:
            created_user = await self.user_db.create(user_dict)
        except IntegrityError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пользователь с такой почтой или логином уже существует"
            )

        await self.on_after_register(created_user, request)

        return created_user

    async def verify_password_custom(self, password: str, hashed_password: str):
        return self.password_helper.verify_and_update(plain_password=password, hashed_password=hashed_password)

    async def hash_password_custom(self, password: str):
        return self.password_helper.hash(password)


async def get_user_manager(user_db=Depends(get_user_db)) -> UserManager:
    yield UserManager(user_db)
