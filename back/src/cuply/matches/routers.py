from typing import Optional, List
from uuid import UUID

from fastapi import Depends, APIRouter
from fastapi.params import Query
from fastapi_filter import FilterDepends

from cuply.auth.base_config import current_user
from cuply.auth.models import UserModel
from cuply.dependencies import UOWDepAsync
from cuply.matches.filters.complaints import MathComplaintModelFilter
from cuply.matches.schemas.complaints import (
    MatchComplaintReadSchema,
    MatchComplaintUpdateSchema,
    MatchComplaintCreateSchemaDto,
)
from cuply.matches.schemas.results import (
    MatchResultReadSchema,
    MatchResultCreateOrUpdateSchemaDto,
)
from cuply.matches.schemas.matches import SeriesMatchReadSchema
from cuply.matches.services.complaints import MatchComplaintService
from cuply.matches.services.results import MatchResultService
from cuply.matches.services.matches import MatchService


router = APIRouter(
    prefix="/tournaments",
    tags=["Matches"],
)


match_service = MatchService()
match_result_service = MatchResultService()
match_complaint_service = MatchComplaintService()


@router.get("/{tournament_id}/series/{series_id}/matches")
async def get_matches(
    tournament_id: int,
    series_id: UUID,
    uow: UOWDepAsync,
    page: int = Query(1, ge=0),
    per_page: int = Query(100, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
    user: UserModel = Depends(current_user),
):
    async with uow:
        result = await match_service.get_matches(
            tournament_id=tournament_id,
            series_id=series_id,
            uow=uow,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            user=user,
        )
    return result


@router.get(
    path="/{tournament_id}/series/{series_id}/matches/{match_id}",
    response_model=SeriesMatchReadSchema,
)
async def get_match(
    tournament_id: int,
    series_id: UUID,
    match_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_user),
):
    async with uow:
        result = await match_service.get_match(
            tournament_id=tournament_id,
            series_id=series_id,
            match_id=match_id,
            uow=uow,
            user=user,
        )
    return result


@router.post(
    path="/{tournament_id}/series/{series_id}/matches/{match_id}/match-results",
    response_model=MatchResultReadSchema,
)
async def set_match_result(
    tournament_id: int,
    series_id: UUID,
    match_id: UUID,
    schema: MatchResultCreateOrUpdateSchemaDto,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_user),
):
    async with uow:
        result = await match_result_service.set_match_result(
            tournament_id=tournament_id,
            series_id=series_id,
            match_id=match_id,
            schema=schema,
            uow=uow,
            user=user,
        )
    return result


@router.get("/{tournament_id}/complaints")
async def get_tournament_complaints(
    tournament_id: int,
    uow: UOWDepAsync,
    filter_instance: MathComplaintModelFilter = FilterDepends(MathComplaintModelFilter),
    page: int = Query(1, ge=0),
    per_page: int = Query(100, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
    user: UserModel = Depends(current_user),
):
    async with uow:
        result = await match_complaint_service.get_tournament_complaints_paginated(
            uow=uow,
            tournament_id=tournament_id,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            filter_instance=filter_instance,
            user=user,
        )
    return result


@router.get("/{tournament_id}/series/{series_id}/complaints")
async def get_series_complaints(
    tournament_id: int,
    series_id: UUID,
    uow: UOWDepAsync,
    filter_instance: MathComplaintModelFilter = FilterDepends(MathComplaintModelFilter),
    page: int = Query(1, ge=0),
    per_page: int = Query(100, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
    user: UserModel = Depends(current_user),
):
    async with uow:
        result = await match_complaint_service.get_series_complaints_paginated(
            uow=uow,
            tournament_id=tournament_id,
            series_id=series_id,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            filter_instance=filter_instance,
            user=user,
        )
    return result


@router.get("/{tournament_id}/series/{series_id}/matches/{match_id}/complaints")
async def get_match_complaints(
    tournament_id: int,
    series_id: UUID,
    match_id: UUID,
    uow: UOWDepAsync,
    filter_instance: MathComplaintModelFilter = FilterDepends(MathComplaintModelFilter),
    page: int = Query(1, ge=0),
    per_page: int = Query(100, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
    user: UserModel = Depends(current_user),
):
    async with uow:
        result = await match_complaint_service.get_match_complaints_paginated(
            uow=uow,
            tournament_id=tournament_id,
            series_id=series_id,
            match_id=match_id,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            filter_instance=filter_instance,
            user=user,
        )
    return result


@router.post(
    path="/{tournament_id}/series/{series_id}/matches/{match_id}/complaints",
    response_model=MatchComplaintReadSchema,
)
async def create_match_complaint(
    tournament_id: int,
    series_id: UUID,
    match_id: UUID,
    schema: MatchComplaintCreateSchemaDto,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_user),
):
    async with uow:
        result = await match_complaint_service.create_complaint(
            tournament_id=tournament_id,
            series_id=series_id,
            match_id=match_id,
            schema=schema,
            uow=uow,
            user=user,
        )
    return result


@router.patch(
    path="/{tournament_id}/series/{series_id}/matches/{match_id}/complaints/{complaint_id}",
    response_model=MatchComplaintReadSchema,
)
async def update_match_complaint(
    tournament_id: int,
    series_id: UUID,
    match_id: UUID,
    complaint_id: UUID,
    schema: MatchComplaintUpdateSchema,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_user),
):
    async with uow:
        result = await match_complaint_service.update_complaint(
            tournament_id=tournament_id,
            series_id=series_id,
            match_id=match_id,
            complaint_id=complaint_id,
            schema=schema,
            uow=uow,
            user=user,
        )
    return result
