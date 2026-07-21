""" Endpoints for user management. """
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.params import Query
from fastapi_filter import FilterDepends
from starlette import status
from starlette.responses import Response, JSONResponse

from cuply.auth.base_config import (
    current_active_user,
    current_user,
    current_user_not_checked,
    current_active_user_optional,
)
from cuply.auth.managers import UserManager, get_user_manager
from cuply.auth.models import UserModel
from cuply.auth.schemas import (
    UserReadSchema,
    UserShortReadSchema,
    UserUpdateSchema,
    UserUpdatePasswordSchema,
    UserWithRolesReadSchema,
)
from cuply.dependencies import UOWDepAsync
from cuply.users.exceptions.roles import UserCannotDeleteOwnSystemRolesException
from cuply.users.filters.roles import SystemUserRoleFilter
from cuply.users.schemas.roles import (
    SystemUserRoleReadSchema,
    SystemUserRoleCreateSchema,
)
from cuply.users.services.roles import SystemUserRoleService
from cuply.users.services.users import UserService


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


user_service = UserService()
system_role_service = SystemUserRoleService()


@router.get(
    "/roles/{user_role_id}",
    response_model=SystemUserRoleReadSchema,
)
async def get_system_user_role(
    user_role_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_user),
) -> SystemUserRoleReadSchema:
    async with uow:
        result = await system_role_service.get_user_role(uow, user_role_id, user)
    return result


@router.get("/roles")
async def get_system_user_roles(
    uow: UOWDepAsync,
    filter_instance: SystemUserRoleFilter = FilterDepends(SystemUserRoleFilter),
    page: int = Query(1, ge=0),
    per_page: int = Query(100, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
    user: UserModel = Depends(current_user),
) -> dict:
    async with uow:
        result = await system_role_service.get_user_roles(
            uow,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            filter_instance=filter_instance,
            user=user,
        )
    return result


@router.post(
    "/roles",
    response_model=SystemUserRoleReadSchema,
)
async def create_system_user_role(
    schema: SystemUserRoleCreateSchema,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_user),
) -> SystemUserRoleReadSchema:
    async with uow:
        result = await system_role_service.create_user_role(uow, schema, user)
    return result


@router.delete("/roles/{user_role_id}")
async def delete_system_user_role(
    uow: UOWDepAsync,
    user_role_id: UUID,
    user: UserModel = Depends(current_user),
):
    try:
        async with uow:
            await system_role_service.delete_user_role(uow, user_role_id, user)
    except UserCannotDeleteOwnSystemRolesException:
        err_type, err_msg = 'Пользователь не может удалять собственные роли', 'user_cannot_delete_own_system_roles'
        return JSONResponse(
            content={"detail": {"type": err_type, "msg": err_msg}},
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/current", response_model=UserWithRolesReadSchema)
async def get_current_user(
    uow: UOWDepAsync,
    user: UserModel = Depends(current_user_not_checked),
) -> UserWithRolesReadSchema:
    """ Get current user info. """
    async with uow:
        result = await user_service.get_current_user(uow, user)
    return result


@router.get("/{user_id}")
async def get_user(
    user_id: int,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user_optional),
) -> UserReadSchema | UserShortReadSchema:
    """ Get user by id. """
    async with uow:
        result = await user_service.get(uow, user_id, user)
    return result


@router.patch("/{user_id}", response_model=UserReadSchema)
async def update_user(
    user_id: int,
    schema: UserUpdateSchema,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
) -> UserReadSchema:
    """ Update user info. """
    async with uow:
        result = await user_service.update(uow, user_id, schema, user)
    return result


@router.patch("/{user_id}/password", response_model=UserReadSchema)
async def update_user_password(
    user_id: int,
    user_update_password: UserUpdatePasswordSchema,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    """ Update user password. """
    async with uow:
        result = await user_service.update_password(uow, user_id, user_update_password, user_manager, user)
    return result


@router.get("/")
async def get_users(
    uow: UOWDepAsync,
    page: int = Query(1, ge=0),
    per_page: int = Query(100, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
    user: UserModel = Depends(current_user),
):
    async with uow:
        result = await user_service.get_all_users_paginated(
            uow,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            user=user,
        )
    return result
