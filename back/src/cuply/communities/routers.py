# communities/routers.py
from typing import Optional, List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi_filter import FilterDepends
from starlette.responses import Response, JSONResponse
from cuply.auth.base_config import current_active_user, current_user, current_active_user_optional
from cuply.auth.models import UserModel
from cuply.communities.exceptions import UserCannotDeleteOwnCommunityRolesException
from cuply.communities.filters import CommunityFilter, CommunityUserRoleFilter
from cuply.communities.schemas import CommunityReadSchema, CommunityCreateSchema, \
    CommunityUpdateSchema, CommunityUserRoleReadSchema, CommunityUserRoleCreateSchema
from cuply.communities.services import CommunityService, CommunityUserRoleService
from cuply.dependencies import UOWDepAsync


router = APIRouter(prefix="/communities", tags=["Communities"])


community_service = CommunityService()
community_role_service = CommunityUserRoleService()


@router.get("")
async def get_communities(
    uow: UOWDepAsync,
    filter_instance: CommunityFilter = FilterDepends(CommunityFilter),
    page: int = Query(1, ge=0),
    per_page: int = Query(20, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
    user: UserModel = Depends(current_active_user_optional),
):
    async with uow:
        result = await community_service.get_all_paginated(
            uow=uow,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            filter_instance=filter_instance,
            user=user,
        )
    return result


@router.post("", response_model=CommunityReadSchema)
async def create_community(
    schema: CommunityCreateSchema,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    async with uow:
        result = await community_service.create(uow, schema, user=user)
    return result


@router.get("/{community_id_or_slug}", response_model=CommunityReadSchema)
async def get_community(
    community_id_or_slug: str,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user_optional),
):
    async with uow:
        result = await community_service.get(uow, community_id_or_slug, user=user)
    return result


@router.put("/{community_id}", response_model=CommunityReadSchema)
async def update_community(
    community_id: UUID,
    schema: CommunityUpdateSchema,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    """
    Обновить сообщество.
    """
    async with uow:
        community = await uow.community_repo.find_one(id=community_id)
        if community and community.creator_id != user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")

        result = await community_service.update(uow, community_id, schema, user=user)
    return result


@router.delete("/{community_id}")
async def delete_community(
    community_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    async with uow:
        community = await uow.community_repo.find_one(id=community_id)
        if community and community.creator_id != user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")

        await community_service.delete(uow, community_id, user=user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/{community_id}/roles/{user_role_id}",
    response_model=CommunityUserRoleReadSchema,
)
async def get_community_user_role(
    community_id: UUID,
    user_role_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_user),
) -> CommunityUserRoleReadSchema:
    async with uow:
        result = await community_role_service.get_user_role(uow, community_id, user_role_id, user)
    return result


@router.get("/{community_id}/roles")
async def get_community_user_roles(
    community_id: UUID,
    uow: UOWDepAsync,
    filter_instance: CommunityUserRoleFilter = FilterDepends(CommunityUserRoleFilter),
    page: int = Query(1, ge=0),
    per_page: int = Query(100, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
    user: UserModel = Depends(current_active_user),
) -> dict:
    async with uow:
        result = await community_role_service.get_user_roles(
            uow,
            community_id=community_id,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            filter_instance=filter_instance,
            user=user,
        )
    return result


@router.post(
    "/{community_id}/roles",
    response_model=CommunityUserRoleReadSchema,
)
async def create_community_user_role(
    community_id: UUID,
    schema: CommunityUserRoleCreateSchema,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
) -> CommunityUserRoleReadSchema:
    async with uow:
        result = await community_role_service.create_user_role(uow, community_id, schema, user)
    return result


@router.delete("/{community_id}/roles/{user_role_id}")
async def delete_community_user_role(
    community_id: UUID,
    uow: UOWDepAsync,
    user_role_id: UUID,
    user: UserModel = Depends(current_active_user),
):
    try:
        async with uow:
            await community_role_service.delete_user_role(uow, community_id, user_role_id, user)
    except UserCannotDeleteOwnCommunityRolesException:
        err_type, err_msg = 'Пользователь не может удалять собственные роли', 'user_cannot_delete_own_community_roles'
        return JSONResponse(
            content={"detail": {"type": err_type, "msg": err_msg}},
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    return Response(status_code=status.HTTP_204_NO_CONTENT)

