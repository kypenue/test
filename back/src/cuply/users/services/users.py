""" Services to interact with users. """
from fastapi import HTTPException
from fastapi_users import InvalidPasswordException
from fastapi_users.jwt import generate_jwt
from sqlalchemy import func
from starlette import status

import constants
from backlib.pagination import AsyncPaginator
from backlib.repo_helpers import raise_not_found_if_none
from config import ConfigEnv
from cuply.auth.email_helpers import send_email_async
from cuply.auth.exceptions import UserWithThatEmailAlreadyExists
from cuply.auth.managers import UserManager
from cuply.auth.models import UserModel
from cuply.auth.schemas import (
    UserReadSchema,
    UserShortReadSchema,
    UserUpdateSchema,
    UserUpdatePasswordSchema,
    UserWithRolesReadSchema,
    UserUpdateEmailSchema,
)
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.users.models import SystemUserRoleModel


class UserService:
    """ Service to interact with users. """
    async def get(self, uow: AsyncUnitOfWork, user_id: int, user: UserModel) -> UserReadSchema | UserShortReadSchema:
        """ Get user by id. """
        requested_user = await uow.user_repo.find_one(id=user_id)
        raise_not_found_if_none(requested_user, user_id)
        if not user or not user.is_verified or not user.tg_login:
            return UserShortReadSchema.model_validate(requested_user)
        return UserReadSchema.model_validate(requested_user)

    async def get_all_users_paginated(
        self,
        uow: AsyncUnitOfWork,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        user: UserModel,
    ):
        sn_exp = func.concat(UserModel.surname, ' ', UserModel.name)
        ns_exp = func.concat(UserModel.name, ' ', UserModel.surname)

        paginator = AsyncPaginator(
            session=uow.session,
            model_class=UserModel,
            schema_class=UserReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            search_by=['email', 'username', 'surname', 'name', sn_exp, ns_exp],
            query=uow.user_repo.get_full_user_query(sn_exp=sn_exp, ns_exp=ns_exp),
            check_fields=False,
        )
        return await paginator.get_result()

    async def get_current_user(self, uow: AsyncUnitOfWork, user: UserModel) -> UserWithRolesReadSchema:
        """ Get user by id. """
        requested_user = await uow.user_repo.get_full_user(UserModel.id == user.id)
        system_roles = await uow.system_role_repo.get_full_user_roles(SystemUserRoleModel.user_id == user.id)
        return UserWithRolesReadSchema.model_validate(
            requested_user,
            context={"system_roles": [role.role_type for role in system_roles]},
        )

    async def update(
        self,
        uow: AsyncUnitOfWork,
        user_id: int,
        schema: UserUpdateSchema,
        user: UserModel,
    ) -> UserReadSchema:
        """ Update user by id. """
        if user_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=constants.NOT_ENOUGH_PERMISSIONS_MSG,
            )

        data = schema.model_dump(exclude_unset=True)

        user = await uow.user_repo.find_one(id=user_id)
        raise_not_found_if_none(user, user_id)

        await uow.user_repo.edit_one(user_id, data)
        user = await uow.user_repo.find_one(id=user_id)

        await uow.commit()

        return UserReadSchema.model_validate(user)

    async def update_password(
        self,
        uow: AsyncUnitOfWork,
        user_id: int,
        schema: UserUpdatePasswordSchema,
        user_manager: UserManager,
        user: UserModel,
    ) -> UserReadSchema:
        """ Update user password. """
        if user_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=constants.NOT_ENOUGH_PERMISSIONS_MSG,
            )

        if schema.new_password == schema.old_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Passwords are the same",
            )

        is_same, hash_pass = await user_manager.verify_password_custom(schema.old_password, user.hashed_password)
        if not is_same:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Old password is wrong",
            )

        try:
            await user_manager.validate_password(password=schema.new_password, user=user)
        except InvalidPasswordException as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=e.reason,
            )

        data = {"hashed_password": await user_manager.hash_password_custom(schema.new_password)}

        item_id = await uow.user_repo.edit_one(user.id, data)
        raise_not_found_if_none(item_id, user.id)

        user = await uow.user_repo.find_one(id=user.id)

        await uow.commit()

        return UserReadSchema.model_validate(user)

    async def update_email(
        self,
        uow: AsyncUnitOfWork,
        schema: UserUpdateEmailSchema,
        user: UserModel,
    ) :
        """ Change user email. """
        data = schema.model_dump()

        email = data['email']

        user = await uow.user_repo.find_one(email=email)
        if user:
            raise UserWithThatEmailAlreadyExists()

        token_data = {
            "sub": str(user.id),
            "email": email,
            "aud": "verify-email",
        }
        token = generate_jwt(
            token_data,
            ConfigEnv.AUTH_SECRET_KEY,
            3600,
        )

        await send_email_async(
            subject="CUPLY - подтверждение почты",
            email_to=email,
            body={
                "name": user.name,
                "app_url": ConfigEnv.APP_URL,
                "token": token
            },
            template_name="verify_email.html",
        )

        await uow.user_repo.edit_one(
            user.id,
            {
                'email': email,
                'is_verified': False,
            }
        )

        await uow.commit()
