import uuid
from typing import List, Optional
from uuid import UUID

from fastapi import Depends, APIRouter
from fastapi.params import Query
from fastapi_filter import FilterDepends
from starlette import status
from starlette.responses import JSONResponse, Response

from cuply.auth.base_config import current_user, current_active_user, current_active_user_optional
from cuply.auth.models import UserModel
from cuply.dependencies import UOWDepAsync
from cuply.series.exceptions.forecast_competition import (
    CannotBetForecastSeriesAlreadyPlayed,
    ForecastCompetitionIsNotAllowed,
    ForecastBetOfOtherUserCannotBeChanged, ForecastForSeriesAlreadyExists,
)
from cuply.series.filters.forecast_competition import ForecastCompetitionBetFilter
from cuply.series.filters.series import SeriesModelFilter
from cuply.series.schemas.forecast_comptetition import ForecastCompetitionBetWriteSchema, \
    CurrentUserForecastCompetitionBetReadSchema
from cuply.series.services.feedback import SeriesFeedbackService
from cuply.series.schemas.feedback import (
    SeriesFeedbackReadSchema,
    SeriesFeedbackWithAuthorReadSchema,
    SeriesFeedbackCreateSchema,
)
from cuply.series.services.forecast_competition import ForecastCompetitionBetService
from cuply.series.services.series import SeriesService

router = APIRouter(
    prefix="/tournaments",
    tags=["Series"],
)


feedback_service = SeriesFeedbackService()
forecast_bets_service = ForecastCompetitionBetService()
series_service = SeriesService()


@router.get("/series/all-series")
async def get_all_series_paginated(
    uow: UOWDepAsync,
    filter_instance: SeriesModelFilter = FilterDepends(SeriesModelFilter),
    page: int = Query(1, ge=0),
    per_page: int = Query(100, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
    user: UserModel = Depends(current_active_user_optional),
):
    """ Get all series paginated. """
    async with uow:
        result = await series_service.get_all_series_paginated(
            uow,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            user=user,
            filter_instance=filter_instance,
        )
    return result


@router.get(
    path="/{tournament_id}/series/{series_id}/feedbacks/on-me",
    response_model=List[SeriesFeedbackReadSchema],
)
async def get_series_feedback_on_me(
    tournament_id: int,
    series_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_user),
):
    async with uow:
        result = await feedback_service.get_feedbacks_on_user(
            tournament_id=tournament_id,
            series_id=series_id,
            uow=uow,
            user=user,
        )
    return result


@router.get(
    path="/{tournament_id}/series/{series_id}/feedbacks",
    response_model=List[SeriesFeedbackWithAuthorReadSchema],
)
async def get_series_feedbacks(
    tournament_id: int,
    series_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_user),
):
    async with uow:
        result = await feedback_service.get_feedbacks(
            tournament_id=tournament_id,
            series_id=series_id,
            uow=uow,
            user=user,
        )
    return result


@router.post(
    path="/{tournament_id}/series/{series_id}/feedbacks",
    response_model=SeriesFeedbackReadSchema,
)
async def add_series_feedback(
    tournament_id: int,
    series_id: UUID,
    schema: SeriesFeedbackCreateSchema,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_user),
):
    async with uow:
        result = await feedback_service.add_feedback(
            tournament_id=tournament_id,
            series_id=series_id,
            schema=schema,
            uow=uow,
            user=user,
        )
    return result


@router.get("/{tournament_id}/series/my")
async def get_my_series_in_tournament(
    tournament_id: int,
    uow: UOWDepAsync,
    page: int = Query(1, ge=0),
    per_page: int = Query(100, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
    user: UserModel = Depends(current_active_user),
):
    """ Get series of current user. """
    async with uow:
        result = await series_service.get_my_series_in_tournament_paginated(
            uow,
            tournament_id=tournament_id,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            user=user,
        )
    return result


@router.get("/series/my")
async def get_all_my_series(
    uow: UOWDepAsync,
    page: int = Query(1, ge=0),
    per_page: int = Query(100, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
    user: UserModel = Depends(current_active_user),
):
    """ Get series of current user. """
    async with uow:
        result = await series_service.get_my_series_paginated(
            uow,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            user=user,
        )
    return result


@router.get("/{tournament_id}/users/{user_id}/series")
async def get_user_series_in_tournament(
    tournament_id: int,
    user_id: int,
    uow: UOWDepAsync,
    page: int = Query(1, ge=0),
    per_page: int = Query(100, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
    user: UserModel = Depends(current_active_user),
):
    """ Get series of current user. """
    async with uow:
        result = await series_service.get_user_series_in_tournament_paginated(
            uow,
            tournament_id=tournament_id,
            user_id=user_id,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            user=user,
        )
    return result


@router.get("/users/{user_id}/series")
async def get_all_user_series(
    user_id: int,
    uow: UOWDepAsync,
    page: int = Query(1, ge=0),
    per_page: int = Query(100, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
    user: UserModel = Depends(current_active_user),
):
    """ Get series of current user. """
    async with uow:
        result = await series_service.get_user_series_paginated(
            uow,
            user_id=user_id,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            user=user,
        )
    return result


@router.get("/{tournament_id}/series")
async def get_all_user_series(
        tournament_id: int,
        uow: UOWDepAsync,
        page: int = Query(1, ge=0),
        per_page: int = Query(100, ge=0),
        order_by: Optional[List[str]] = Query(None),
        search: str = Query(None),
):
    """ Get series of current user. """
    async with uow:
        result = await series_service.get_series_in_tournament_paginated(
            uow,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            tournament_id=tournament_id,
        )

    return result


@router.get("/series/pair")
async def get_all_series_by_two_users(
    uow: UOWDepAsync,
    user1_id: int,
    user2_id: int,
    page: int = Query(1, ge=0),
    per_page: int = Query(100, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
    user: UserModel = Depends(current_active_user),
):
    """ Get series of current user. """
    async with uow:
        result = await series_service.get_series_by_two_users_paginated(
            uow,
            user1_id=user1_id,
            user2_id=user2_id,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            user=user,
        )
    return result


@router.get(
    "/{tournament_id}/series/{series_id}/forecast-bets/my",
    response_model=CurrentUserForecastCompetitionBetReadSchema,
)
async def get_current_user_bet_status(
    tournament_id: int,
    series_id: uuid.UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_user),
) -> CurrentUserForecastCompetitionBetReadSchema:
    """ Get bet for current user in series. """
    async with uow:
        result = await forecast_bets_service.get_current_user_bet_status(
            uow=uow,
            tournament_id=tournament_id,
            series_id=series_id,
            user=user,
        )
    return result


@router.get("/{tournament_id}/series/{series_id}/forecast-bets")
async def get_all_forecast_bets_in_series(
    tournament_id: int,
    series_id: uuid.UUID,
    uow: UOWDepAsync,
    filter_instance: ForecastCompetitionBetFilter = FilterDepends(ForecastCompetitionBetFilter),
    page: int = Query(1, ge=0),
    per_page: int = Query(100, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
):
    """ Get forecast bets of current series. """
    try:
        async with uow:
            result = await forecast_bets_service.get_forecast_bets_paginated(
                uow=uow,
                page=page,
                per_page=per_page,
                order_by=order_by,
                search=search,
                tournament_id=tournament_id,
                series_id=series_id,
                filter_instance=filter_instance,
            )
        return result
    except ForecastCompetitionIsNotAllowed:
        err_type, err_msg = (
            "forecast_competition_is_not_allowed",
            "Для данного турнира не установлен конкурс прогнозов",
        )

    return JSONResponse(
        content={"detail": {"type": err_type, "msg": err_msg}},
        status_code=status.HTTP_400_BAD_REQUEST,
    )


@router.get("/{tournament_id}/series/{series_id}/forecast-bets/{bet_id}")
async def get_forecast_bet_in_series(
    tournament_id: int,
    series_id: uuid.UUID,
    bet_id: uuid.UUID,
    uow: UOWDepAsync,
):
    """ Get forecast bets of current series. """
    try:
        async with uow:
            result = await forecast_bets_service.get_forecast_bet(
                uow=uow,
                tournament_id=tournament_id,
                series_id=series_id,
                bet_id=bet_id,
            )
        return result
    except ForecastCompetitionIsNotAllowed:
        err_type, err_msg = (
            "forecast_competition_is_not_allowed",
            "Для данного турнира не установлен конкурс прогнозов",
        )

    return JSONResponse(
        content={"detail": {"type": err_type, "msg": err_msg}},
        status_code=status.HTTP_400_BAD_REQUEST,
    )


@router.post("/{tournament_id}/series/{series_id}/forecast-bets")
async def create_forecast_bet_in_series(
    tournament_id: int,
    series_id: uuid.UUID,
    uow: UOWDepAsync,
    schema: ForecastCompetitionBetWriteSchema,
    user: UserModel = Depends(current_user),
):
    """ Get forecast bets of current series. """
    try:
        async with uow:
            result = await forecast_bets_service.create_forecast_bet(
                uow=uow,
                tournament_id=tournament_id,
                series_id=series_id,
                schema=schema,
                user=user,
            )
        return result
    except ForecastCompetitionIsNotAllowed:
        err_type, err_msg = (
            "forecast_competition_is_not_allowed",
            "Для данного турнира не установлен конкурс прогнозов",
        )
    except ForecastForSeriesAlreadyExists:
        err_type, err_msg = (
            "forecast_for_series_already_exists",
            "Для данной серии уже создан прогноз",
        )
    except CannotBetForecastSeriesAlreadyPlayed:
        err_type, err_msg = (
            "cannot_bet_series_that_is_already_played",
            "Нельзя сделать прогноз для уже сыгранной серии",
        )

    return JSONResponse(
        content={"detail": {"type": err_type, "msg": err_msg}},
        status_code=status.HTTP_400_BAD_REQUEST,
    )


@router.put("/{tournament_id}/series/{series_id}/forecast-bets/{bet_id}")
async def update_forecast_bet_in_series(
    tournament_id: int,
    series_id: uuid.UUID,
    bet_id: uuid.UUID,
    uow: UOWDepAsync,
    schema: ForecastCompetitionBetWriteSchema,
    user: UserModel = Depends(current_user),
):
    """ Update forecast bets of current series. """
    try:
        async with uow:
            result = await forecast_bets_service.update_forecast_bet(
                uow=uow,
                tournament_id=tournament_id,
                series_id=series_id,
                bet_id=bet_id,
                schema=schema,
                user=user,
            )
        return result
    except ForecastCompetitionIsNotAllowed:
        err_type, err_msg = (
            "forecast_competition_is_not_allowed",
            "Для данного турнира не установлен конкурс прогнозов",
        )
    except CannotBetForecastSeriesAlreadyPlayed:
        err_type, err_msg = (
            "cannot_bet_series_that_is_already_played",
            "Нельзя сделать прогноз для уже сыгранной серии",
        )
    except ForecastBetOfOtherUserCannotBeChanged:
        err_type, err_msg = (
            "cannot_change_bet_of_other_user",
            "Запрещено изменять ставку другого пользователя",
        )

    return JSONResponse(
        content={"detail": {"type": err_type, "msg": err_msg}},
        status_code=status.HTTP_400_BAD_REQUEST,
    )


@router.delete("/{tournament_id}/series/{series_id}/forecast-bets/{bet_id}")
async def delete_forecast_bet_in_series(
    tournament_id: int,
    series_id: uuid.UUID,
    bet_id: uuid.UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_user),
):
    """ Delete forecast bets of current series. """
    try:
        async with uow:
            await forecast_bets_service.delete_forecast_bet(
                uow=uow,
                tournament_id=tournament_id,
                series_id=series_id,
                bet_id=bet_id,
                user=user,
            )
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except ForecastCompetitionIsNotAllowed:
        err_type, err_msg = (
            "forecast_competition_is_not_allowed",
            "Для данного турнира не установлен конкурс прогнозов",
        )
    except CannotBetForecastSeriesAlreadyPlayed:
        err_type, err_msg = (
            "cannot_bet_series_that_is_already_played",
            "Нельзя сделать прогноз для уже сыгранной серии",
        )
    except ForecastBetOfOtherUserCannotBeChanged:
        err_type, err_msg = (
            "cannot_change_bet_of_other_user",
            "Запрещено изменять ставку другого пользователя",
        )

    return JSONResponse(
        content={"detail": {"type": err_type, "msg": err_msg}},
        status_code=status.HTTP_400_BAD_REQUEST,
    )
