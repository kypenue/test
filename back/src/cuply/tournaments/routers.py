""" Endpoints for registration management. """
from typing import Optional, List
from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.params import Query
from fastapi_filter import FilterDepends
from starlette import status
from starlette.responses import Response, JSONResponse

from cuply.auth.base_config import current_active_user, current_active_user_optional, current_user
from cuply.auth.models import UserModel
from cuply.dependencies import UOWDepAsync
from cuply.series.exceptions.forecast_competition import ForecastCompetitionIsNotAllowed
from cuply.series.filters.forecast_competition import ForecastCompetitionBetFilter
from cuply.series.routers import forecast_bets_service
from cuply.series.services.forecast_competition import ForecastCompetitionBetService
from cuply.tournaments.exceptions.roles import UserCannotDeleteOwnTournamentRolesException
from cuply.tournaments.exceptions.tournaments import CannotStartTournamentException
from cuply.tournaments.filters.registration import TournamentRegisteredUserFilter
from cuply.tournaments.filters.roles import TournamentUserRoleFilter
from cuply.tournaments.filters.tournaments import TournamentFilter
from cuply.tournaments.schemas.roles import TournamentUserRoleReadSchema, TournamentUserRoleCreateSchema
from cuply.tournaments.schemas.tournaments import (
    TournamentUpdateSchema,
    TournamentPersonalReadSchema,
    TournamentRegulationReadSchema,
    TournamentSetLifecycleStatusSchema,
    TournamentCreateSchema,
    TournamentReadSchema,
    TournamentPartialUpdateSchema,
)
from cuply.tournaments.schemas.registration import (
    TournamentRegisteredUserReadSchema,
)
from cuply.tournaments.services.roles import TournamentUserRoleService
from cuply.tournaments.services.tournaments import TournamentService
from cuply.tournaments.services.registration import TournamentRegistrationService
from cuply.tournaments.exceptions.registration import (
    TelegramNotVerifiedRegistrationError,
    UserBlockedRegistrationError,
    RegistrationNotStartedError,
    RegistrationEndedError,
    TooManyParticipantsError,
    AgeLimitRegistrationError,
    UserAlreadyRegisteredError,
    PlatformNotFoundError,
)
from cuply.tournaments.schemas.user_block import UserBlockReadSchema, UserBlockWriteSchema
from cuply.tournaments.services.user_block import UserBlockService
from cuply.tournaments.schemas.registration import (
    TournamentRegisteredUserWriteSchema,
    TournamentSetRegistrationStatusSchema,
)
from cuply.tournaments.schemas.platforms import (
    TournamentAllowedPlatformReadSchema,
    TournamentAllowedPlatformWriteSchema,
)
from cuply.tournaments.services.platforms import TournamentAllowedPlatformService


router = APIRouter(
    prefix="/tournaments",
    tags=["Tournaments"],
)


tournament_service = TournamentService()
registration_service = TournamentRegistrationService()
user_block_service = UserBlockService()
tournament_platform_service = TournamentAllowedPlatformService()
tournament_role_service = TournamentUserRoleService()
forecast_bets_service = ForecastCompetitionBetService()


@router.get("/")
async def get_tournaments(
    uow: UOWDepAsync,
    filter_instance: TournamentFilter = FilterDepends(TournamentFilter),
    show_recommended: Optional[bool] = Query(None),
    show_my: Optional[bool] = Query(None),
    can_manage: Optional[bool] = Query(None),
    page: int = Query(1, ge=0),
    per_page: int = Query(100, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
    user: UserModel = Depends(current_active_user_optional),
):
    """ Get tournaments paginated. """
    async with uow:
        result = await tournament_service.get_all_paginated(
            uow,
            show_recommended=show_recommended,
            show_my=show_my,
            can_manage=can_manage,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            filter_instance=filter_instance,
            user=user,
        )
    return result


@router.get("/{tournament_id}", response_model=TournamentReadSchema)
async def get_tournament(
    tournament_id: int,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user_optional),
) -> TournamentReadSchema:
    """ Get tournament by id. """
    async with uow:
        result = await tournament_service.get(uow, tournament_id, user)
    return result


@router.get("/{tournament_id}/regulations", response_model=TournamentRegulationReadSchema)
async def get_tournament_with_regulation(
    tournament_id: int,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_user),
) -> TournamentRegulationReadSchema:
    """ Get tournament regulations. """
    async with uow:
        result = await tournament_service.get_with_regulation(uow, tournament_id, user)
    return result


@router.post("/", response_model=TournamentReadSchema)
async def create_tournament(
    uow: UOWDepAsync,
    schema: TournamentCreateSchema,
    user: UserModel = Depends(current_active_user),
) -> TournamentReadSchema:
    """ Create tournament. """
    async with uow:
        result = await tournament_service.create(uow, schema, user)
    return result


@router.put("/{tournament_id}", response_model=TournamentReadSchema)
async def update_tournament(
    tournament_id: int,
    uow: UOWDepAsync,
    schema: TournamentUpdateSchema,
    user: UserModel = Depends(current_active_user),
) -> TournamentReadSchema:
    """ Update tournament by id. """
    async with uow:
        result = await tournament_service.update(uow, tournament_id, schema, user)
    return result


@router.patch("/{tournament_id}", response_model=TournamentReadSchema)
async def patch_tournament(
    tournament_id: int,
    uow: UOWDepAsync,
    schema: TournamentPartialUpdateSchema,
    user: UserModel = Depends(current_active_user),
) -> TournamentReadSchema:
    """ Update tournament by id. """
    async with uow:
        result = await tournament_service.patch(uow, tournament_id, schema, user)
    return result


@router.post(
    "/{tournament_id}/set-lifecycle-status",
    response_model=TournamentSetLifecycleStatusSchema,
)
async def set_lifecycle_status(
    tournament_id: int,
    uow: UOWDepAsync,
    schema: TournamentSetLifecycleStatusSchema,
    user: UserModel = Depends(current_active_user),
):
    """ Set lifecycle status of tournament by id. """
    try:
        async with uow:
            await tournament_service.set_lifecycle_status(uow, tournament_id, schema, user)
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except CannotStartTournamentException:
        err_type, err_msg = (
            "cannot_open_tournament",
            "Для старта турнира число участников турнира должно быть не менее трех",
        )

    return JSONResponse(
        content={"detail": {"type": err_type, "msg": err_msg}},
        status_code=status.HTTP_400_BAD_REQUEST,
    )

@router.get(
    "/{tournament_id}/me",
    response_model=TournamentPersonalReadSchema,
)
async def get_tournament_personal(
    tournament_id: int,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
) -> TournamentPersonalReadSchema:
    """ Get tournament personal details. """
    async with uow:
        result = await tournament_service.get_personal_info(uow, tournament_id, user)
    return result


@router.post("/{tournament_id}/open-registration")
async def open_registration(
    tournament_id: int,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    """ Open tournament registration by id. """
    try:
        async with uow:
            await tournament_service.open_registration(uow, tournament_id, user)
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except:
        err_type, err_msg = None, None

    return JSONResponse(
        content={"detail": {"type": err_type, "msg": err_msg}},
        status_code=status.HTTP_400_BAD_REQUEST,
    )


@router.post("/{tournament_id}/close-registration")
async def close_registration(
    tournament_id: int,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    """ Close tournament registration by id. """
    try:
        async with uow:
            await tournament_service.close_registration(uow, tournament_id, user)
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except:
        err_type, err_msg = None, None

    return JSONResponse(
        content={"detail": {"type": err_type, "msg": err_msg}},
        status_code=status.HTTP_400_BAD_REQUEST,
    )


@router.post("/{tournament_id}/open-tournament")
async def open_tournament(
    tournament_id: int,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    """ Open tournament by id. """
    try:
        async with uow:
            await tournament_service.open_tournament(uow, tournament_id, user)
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except CannotStartTournamentException:
        err_type, err_msg = "cannot_open_tournament", "Для старта турнира число участников турнира должно быть не менее трех"
    except:
        err_type, err_msg = None, None

    return JSONResponse(
        content={"detail": {"type": err_type, "msg": err_msg}},
        status_code=status.HTTP_400_BAD_REQUEST,
    )


@router.post("/{tournament_id}/close-tournament")
async def close_tournament(
    tournament_id: int,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    """ Close tournament by id. """
    try:
        async with uow:
            await tournament_service.close_tournament(uow, tournament_id, user)
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except:
        err_type, err_msg = None, None

    return JSONResponse(
        content={"detail": {"type": err_type, "msg": err_msg}},
        status_code=status.HTTP_400_BAD_REQUEST,
    )


@router.post(
    "/{tournament_id}/register",
    response_model=TournamentRegisteredUserReadSchema,
)
async def register(
    tournament_id: int,
    uow: UOWDepAsync,
    schema: TournamentRegisteredUserWriteSchema,
    user: UserModel = Depends(current_user),
) -> TournamentRegisteredUserReadSchema | JSONResponse:
    """ Register for tournament. """
    try:
        async with uow:
            result = await registration_service.register(
                uow,
                tournament_id=tournament_id,
                schema=schema,
                user=user,
            )
        return result
    except TelegramNotVerifiedRegistrationError:
        err_type, err_msg = "telegram_not_verified_error", "Не указан телеграм"
    except UserBlockedRegistrationError:
        err_type, err_msg = "user_blocked_error", "Вы заблокированы на участие в турнирах этого организатора"
    except RegistrationNotStartedError:
        err_type, err_msg = "registration_not_started_error", "Регистрация еще не началась"
    except RegistrationEndedError:
        err_type, err_msg = "registration_ended_error", "Регистрация уже закончилась"
    except TooManyParticipantsError:
        err_type, err_msg = "too_many_participants_error", "Максимальное количество участников уже достигнуто"
    except AgeLimitRegistrationError:
        err_type, err_msg = "age_limit_error", "Вы не подходите под возрастные ограничения"
    except UserAlreadyRegisteredError:
        err_type, err_msg = "already_registered", "Вы уже зарегистрированы на турнир"
    except PlatformNotFoundError:
        err_type, err_msg = "platform_not_found", "Данная платформа не заявлена в турнире"

    return JSONResponse(
        content={"detail": {"type": err_type, "msg": err_msg}},
        status_code=status.HTTP_400_BAD_REQUEST,
    )


@router.post("/{tournament_id}/unregister")
async def unregister(
    tournament_id: int,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_user),
):
    """ Unregister from tournament. """
    async with uow:
        await registration_service.unregister(uow, tournament_id, user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/{tournament_id}/participants/{participant_id}")
async def get_participant(
    tournament_id: int,
    participant_id: int,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    """ Get tournament participant by id. """
    async with uow:
        result = await registration_service.get_registration(
            uow,
            tournament_id=tournament_id,
            registration_id=participant_id,
            user=user,
        )
    return result


@router.get("/{tournament_id}/participants")
async def get_participants(
    tournament_id: int,
    uow: UOWDepAsync,
    filter_instance: TournamentRegisteredUserFilter = FilterDepends(TournamentRegisteredUserFilter),
    page: int = Query(1, ge=0),
    per_page: int = Query(100, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
    assigned_to_tournament: Optional[bool] = None,
    user: UserModel = Depends(current_active_user),
) -> dict:
    """ Get tournament participants. """
    async with uow:
        result = await registration_service.get_all_users_paginated(
            uow,
            tournament_id=tournament_id,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            filter_instance=filter_instance,
            user=user,
            assigned_to_tournament=assigned_to_tournament,
        )
    return result


@router.get("/{tournament_id}/participants/report/xlsx")
async def get_participants_xlsx(
    tournament_id: int,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    """ Get tournament participant excel report. """
    async with uow:
        report = await registration_service.get_participants_xlsx(uow, tournament_id, user)
    return Response(
        report.getvalue(),
        headers= {
            'Content-Disposition': 'attachment; filename="report.xlsx"',
        },
        media_type='application/vnd.ms-excel',
    )


@router.post("/{tournament_id}/participants/{participant_id}")
async def set_status(
    tournament_id: int,
    participant_id: int,
    uow: UOWDepAsync,
    schema: TournamentSetRegistrationStatusSchema,
    user: UserModel = Depends(current_active_user),
):
    """ Set status of tournament participants. """
    try:
        async with uow:
            await registration_service.set_registration_status(uow, tournament_id, participant_id, schema, user)
    except TooManyParticipantsError as ex:
        err_type, err_msg = 'too_many_participants', str(ex)
        return JSONResponse(
            content={"detail": {"type": err_type, "msg": err_msg}},
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    return Response(status_code=status.HTTP_200_OK)


@router.get("/users/block/{block_id}")
async def get_blocked_user(
    block_id: int,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
) -> UserBlockReadSchema:
    """ Get blocked user. """
    async with uow:
        result = await user_block_service.get_block_user(uow, block_id, user)
    return result


@router.get("/users/block")
async def get_blocked_users(
    uow: UOWDepAsync,
    page: int = Query(1, ge=0),
    per_page: int = Query(100, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
    user: UserModel = Depends(current_active_user),
) -> dict:
    """ Get blocked users. """
    async with uow:
        result = await user_block_service.get_block_users(
            uow,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            user=user,
        )
    return result


@router.post("/users/{user_id}/block")
async def set_blocking(
    user_id: int,
    uow: UOWDepAsync,
    schema: UserBlockWriteSchema,
    user: UserModel = Depends(current_active_user),
) -> UserBlockReadSchema:
    """ Set blocking status for user. """
    async with uow:
        result = await user_block_service.set_block_user(uow, user_id, schema, user)
    return result


@router.delete("/users/{user_id}/block")
async def delete_blocking(
    user_id: int,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    """ Unset blocking status for user. """
    async with uow:
        await user_block_service.delete_block_user(uow, user_id, user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    path="/{tournament_id}/allowed-platforms/{allowed_platform_id}",
    response_model=TournamentAllowedPlatformReadSchema,
)
async def get_allowed_platform(
    tournament_id: int,
    allowed_platform_id: int,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_user),
) -> TournamentAllowedPlatformReadSchema:
    """ Get allowed platform by id. """
    async with uow:
        result = await tournament_platform_service.get_platform(uow, tournament_id, allowed_platform_id, user)
    return result


@router.get("/{tournament_id}/allowed-platforms")
async def get_allowed_platforms(
    tournament_id: int,
    uow: UOWDepAsync,
    page: int = Query(1, ge=0),
    per_page: int = Query(100, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
    user: UserModel = Depends(current_user),
) -> dict:
    """ Get allowed platforms. """
    async with uow:
        result = await tournament_platform_service.get_platforms(
            uow,
            tournament_id=tournament_id,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            user=user,
        )
    return result


@router.post(
    "/{tournament_id}/allowed-platforms",
    response_model=TournamentAllowedPlatformReadSchema,
)
async def add_allowed_platform(
    tournament_id: int,
    schema: TournamentAllowedPlatformWriteSchema,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_user),
) -> TournamentAllowedPlatformReadSchema:
    """ Add allowed platform. """
    async with uow:
        result = await tournament_platform_service.add_platform(uow, tournament_id, schema, user)
    return result


@router.delete("/{tournament_id}/allowed-platforms")
async def remove_allowed_platform(
    tournament_id: int,
    schema: TournamentAllowedPlatformWriteSchema,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_user),
):
    """ Remove allowed platform. """
    async with uow:
        await tournament_platform_service.remove_platform(uow, tournament_id, schema, user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/{tournament_id}/roles/{user_role_id}",
    response_model=TournamentUserRoleReadSchema,
)
async def get_tournament_user_role(
    tournament_id: int,
    user_role_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_user),
) -> TournamentUserRoleReadSchema:
    async with uow:
        result = await tournament_role_service.get_user_role(uow, tournament_id, user_role_id, user)
    return result


@router.get("/{tournament_id}/roles")
async def get_tournament_user_roles(
    tournament_id: int,
    uow: UOWDepAsync,
    filter_instance: TournamentUserRoleFilter = FilterDepends(TournamentUserRoleFilter),
    page: int = Query(1, ge=0),
    per_page: int = Query(100, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
    user: UserModel = Depends(current_user),
) -> dict:
    async with uow:
        result = await tournament_role_service.get_user_roles(
            uow,
            tournament_id=tournament_id,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            filter_instance=filter_instance,
            user=user,
        )
    return result


@router.post(
    "/{tournament_id}/roles",
    response_model=TournamentUserRoleReadSchema,
)
async def create_tournament_user_role(
    tournament_id: int,
    schema: TournamentUserRoleCreateSchema,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_user),
) -> TournamentUserRoleReadSchema:
    async with uow:
        result = await tournament_role_service.create_user_role(uow, tournament_id, schema, user)
    return result


@router.delete("/{tournament_id}/roles/{user_role_id}")
async def delete_tournament_user_role(
    tournament_id: int,
    uow: UOWDepAsync,
    user_role_id: UUID,
    user: UserModel = Depends(current_user),
):
    try:
        async with uow:
            await tournament_role_service.delete_user_role(uow, tournament_id, user_role_id, user)
    except UserCannotDeleteOwnTournamentRolesException:
        err_type, err_msg = 'Пользователь не может удалять собственные роли', 'user_cannot_delete_own_tournament_roles'
        return JSONResponse(
            content={"detail": {"type": err_type, "msg": err_msg}},
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    return Response(status_code=status.HTTP_204_NO_CONTENT)



@router.get("/{tournament_id}/forecast-bets-rating")
async def get_forecast_bets_rating(
    tournament_id: int,
    uow: UOWDepAsync,
    page: int = Query(1, ge=0),
    per_page: int = Query(100, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
    _: UserModel = Depends(current_user),
):
    try:
        async with uow:
            result = await forecast_bets_service.get_rating_in_tournament_paginated(
                uow=uow,
                tournament_id=tournament_id,
                page=page,
                per_page=per_page,
                order_by=order_by,
                search=search,
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


@router.get("/{tournament_id}/forecast-bets")
async def get_all_forecast_bets_in_tournament(
    tournament_id: int,
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
            result = await forecast_bets_service.get_forecast_bets_for_tournament_paginated(
                uow=uow,
                page=page,
                per_page=per_page,
                order_by=order_by,
                search=search,
                tournament_id=tournament_id,
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
