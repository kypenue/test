""" Endpoints for platform management. """
from typing import Optional, List

from fastapi import APIRouter, Depends
from fastapi.params import Query
from fastapi_filter import FilterDepends
from starlette import status
from starlette.responses import Response

from cuply.dependencies import UOWDepAsync
from cuply.auth.base_config import (
    current_superuser,
    current_active_user_optional,
)
from cuply.auth.models import UserModel
from cuply.platforms.filters import PlatformFilter
from cuply.platforms.schemas import (
    PlatformReadSchema,
    PlatformCreateSchema,
    PlatformUpdateSchema,
)
from cuply.platforms.services import PlatformService


router = APIRouter(
    prefix="/platforms",
    tags=["Platforms"],
)


platform_service = PlatformService()


@router.get("/")
async def get_platforms(
    uow: UOWDepAsync,
    filter_instance: PlatformFilter = FilterDepends(PlatformFilter),
    page: int = Query(1, ge=0),
    per_page: int = Query(100, ge=0),
    search: str = Query(None),
    order_by: Optional[List[str]] = Query(None),
    _: UserModel = Depends(current_active_user_optional),
) -> dict:
    """ Get all platforms paginated. """
    async with uow:
        result = await platform_service.get_all_paginated(
            uow,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            filter_instance=filter_instance,
        )
    return result


@router.get("/{platform_id}", response_model=PlatformReadSchema)
async def get_platform(
    platform_id: int,
    uow: UOWDepAsync,
    _: UserModel = Depends(current_active_user_optional),
) -> PlatformReadSchema:
    """ Get one platform by id. """
    async with uow:
        result = await platform_service.get(uow, platform_id)
    return result


@router.post("/")
async def create_platform(
    schema: PlatformCreateSchema,
    uow: UOWDepAsync,
    _: UserModel = Depends(current_superuser),
) -> PlatformReadSchema:
    """ Create platforms. """
    async with uow:
        result = await platform_service.create(uow, schema)
    return result


@router.put("/{platform_id}")
async def update_platform(
    platform_id: int,
    schema: PlatformUpdateSchema,
    uow: UOWDepAsync,
    _: UserModel = Depends(current_superuser),
) -> PlatformReadSchema:
    """ Update game by id. """
    async with uow:
        result = await platform_service.update(uow, platform_id, schema)
    return result


@router.delete("/{platform_id}")
async def delete_platform(
    platform_id: int,
    uow: UOWDepAsync,
    _: UserModel = Depends(current_superuser),
):
    """ Delete game by id. """
    async with uow:
        await platform_service.delete(uow, platform_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
