from uuid import UUID
from typing import List

from fastapi import APIRouter, Depends, Query
from starlette import status
from starlette.responses import Response, JSONResponse
from typing_extensions import Optional

from cuply.auth.base_config import current_active_user, current_user, current_active_user_optional
from cuply.stages.exceptions.de import (
    NotAllSeriesPlayedDEException,
    DERoundCannotBeStartedException,
    DERoundCannotBeDrawnException,
)
from cuply.stages.exceptions.se import SERoundCannotBeStartedException, NotAllSeriesPlayedSEException, \
    SERoundCannotBeDrawnException
from cuply.stages.exceptions.stages import (
    StageNotEndedException,
    MissingFieldsStageException,
)
from cuply.stages.exceptions.swiss import (
    SwissStageAlreadyStartedException,
    SwissRoundCannotBeDrawnException,
    SwissRoundCannotBeStartedException,
    NotAllSwissSeriesPlayedException,
    SwissRoundCannotBeEndedException,
)
from cuply.auth.models import UserModel
from cuply.dependencies import UOWDepAsync
from cuply.stages.exceptions.wildcard import (
    WildcardRoundCannotBeStartedException,
    NotAllWildcardSeriesPlayedException,
    WildcardRoundCannotBeEndedException,
)
from cuply.stages.schemas.de import DoubleEliminationStageRoundFullReadSchema
from cuply.stages.schemas.se import SingleEliminationStageRoundFullReadSchema
from cuply.stages.schemas.stages import TournamentStageFullReadSchema
from cuply.stages.schemas.swiss import (
    SwissStageRoundFullReadSchema,
    SwissStageUpdateSchema,
    SwissCalculatorDto,
)
from cuply.stages.schemas.wildcard import WildcardStageRoundFullReadSchema
from cuply.stages.services.de.draw import DEDrawService
from cuply.stages.services.de.stage import DEStageService
from cuply.stages.services.de.round import DERoundService
from cuply.stages.services.se.draw import SEDrawService
from cuply.stages.services.se.round import SERoundService
from cuply.stages.services.se.stage import SEStageService
from cuply.stages.services.stages import TournamentStageService
from cuply.stages.services.swiss.calculator import SwissCalculatorService
from cuply.stages.services.swiss.stage import SwissStageService
from cuply.stages.services.swiss.round import SwissRoundService
from cuply.stages.services.swiss.rating import SwissRatingService
from cuply.stages.services.swiss.draw import SwissDrawService
from cuply.stages.services.wildcard.round import WildcardRoundService
from cuply.tournaments.exceptions.tournaments import TournamentNotStartedYetException
from cuply.tournaments.services.tournaments import TournamentService


router = APIRouter(
    prefix="/tournaments",
    tags=["Stages"],
)


tournament_service = TournamentService()
stage_service = TournamentStageService()

swiss_stage_service = SwissStageService()
swiss_round_service = SwissRoundService()
swiss_draw_service = SwissDrawService()
swiss_rating_service = SwissRatingService()
swiss_calculator_service = SwissCalculatorService()

de_stage_service = DEStageService()
de_round_service = DERoundService()
de_draw_service_service = DEDrawService()

se_stage_service = SEStageService()
se_round_service = SERoundService()
se_draw_service_service = SEDrawService()

wildcard_round_service = WildcardRoundService()


@router.get(
    path="/{tournament_id}/stages/{stage_id}",
    response_model=TournamentStageFullReadSchema,
)
async def get_stage(
    tournament_id: int,
    stage_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user_optional),
) -> TournamentStageFullReadSchema:
    """ Get tournament stage details. """
    async with uow:
        result = await stage_service.get_stage(
            uow=uow,
            tournament_id=tournament_id,
            stage_id=stage_id,
            user=user,
        )
    return result


@router.get(
    path="/{tournament_id}/stages",
    response_model=List[TournamentStageFullReadSchema],
)
async def get_stages(
    tournament_id: int,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user_optional),
) -> List[TournamentStageFullReadSchema]:
    """ Get tournament stages. """
    async with uow:
        result = await stage_service.get_stages(
            uow=uow,
            tournament_id=tournament_id,
            user=user,
        )
    return result


@router.post("/{tournament_id}/stages/start-next-stage")
async def start_next_stage(
    tournament_id: int,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    """ Start next tournament stages. """
    try:
        async with uow:
            await tournament_service.start_next_stage(
                uow=uow,
                tournament_id=tournament_id,
                user=user,
            )
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except MissingFieldsStageException:
        err_type, err_msg = 'missing_stage_fields', 'Заполните отсутствующие поля в этапах турнира'
    except StageNotEndedException:
        err_type, err_msg = 'previous_round_not_ended', 'Предыдущий этап еще не завершен'
    except TournamentNotStartedYetException:
        err_type, err_msg = 'tournament_not_started_yet', 'Турнир еще не начат'
    return JSONResponse(
        content={"detail": {"type": err_type, "msg": err_msg}},
        status_code=status.HTTP_400_BAD_REQUEST,
    )


@router.post(
    "/{tournament_id}/stages/{stage_id}/swiss-stages/{swiss_stage_id}/rounds/{round_id}/draw-one"
)
async def swiss_stage_round_draw_one(
    tournament_id: int,
    stage_id: UUID,
    swiss_stage_id: UUID,
    round_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    """ Draw one series in swiss round. """
    try:
        async with uow:
            result = await swiss_draw_service.draw_one(
                uow=uow,
                tournament_id=tournament_id,
                stage_id=stage_id,
                swiss_stage_id=swiss_stage_id,
                round_id=round_id,
                user=user,
            )
    except SwissRoundCannotBeDrawnException:
        err_type, err_msg = 'round_cannot_be_drawn', 'Нельзя начать жеребьевку для данного раунда'
        return JSONResponse(
            content={"detail": {"type": err_type, "msg": err_msg}},
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    return result


@router.post(
    path="/{tournament_id}/stages/{stage_id}/swiss-stages/{swiss_stage_id}/rounds/{round_id}/draw-all"
)
async def swiss_stage_round_draw_all(
    tournament_id: int,
    stage_id: UUID,
    swiss_stage_id: UUID,
    round_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    """ Draw all series in swiss round. """
    async with uow:
        result = await swiss_draw_service.draw_all(
            uow=uow,
            tournament_id=tournament_id,
            stage_id=stage_id,
            swiss_stage_id=swiss_stage_id,
            round_id=round_id,
            user=user,
        )
    return result


@router.get(
    path="/{tournament_id}/stages/{stage_id}/swiss-stages/{swiss_stage_id}/rounds/{round_id}/draw-participants"
)
async def get_swiss_stage_accounts_to_draw(
    tournament_id: int,
    stage_id: UUID,
    swiss_stage_id: UUID,
    round_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    """ Get all accounts for current rounds to draw. """
    async with uow:
        result = await swiss_draw_service.get_accounts_to_draw_by_series_groups(
            uow=uow,
            tournament_id=tournament_id,
            stage_id=stage_id,
            swiss_stage_id=swiss_stage_id,
            round_id=round_id,
            user=user,
        )
    return result


@router.get(
    path="/{tournament_id}/stages/{stage_id}/swiss-stages/{swiss_stage_id}/rounds/{round_id}",
    response_model=SwissStageRoundFullReadSchema,
)
async def get_swiss_stage_round(
    tournament_id: int,
    stage_id: UUID,
    swiss_stage_id: UUID,
    round_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
) -> SwissStageRoundFullReadSchema:
    """ Get swiss stage round groups with stages. """
    async with uow:
        result = await swiss_round_service.get_round(
            uow=uow,
            tournament_id=tournament_id,
            stage_id=stage_id,
            swiss_stage_id=swiss_stage_id,
            round_id=round_id,
            user=user,
        )
    return result


@router.get(
    path="/{tournament_id}/stages/{stage_id}/wildcard-stages/{wildcard_stage_id}/rounds/{round_id}",
    response_model=WildcardStageRoundFullReadSchema,
)
async def get_wildcard_stage_round(
    tournament_id: int,
    stage_id: UUID,
    wildcard_stage_id: UUID,
    round_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
) -> WildcardStageRoundFullReadSchema:
    """ Get wildcard stage round groups with stages. """
    async with uow:
        result = await wildcard_round_service.get_round(
            uow=uow,
            tournament_id=tournament_id,
            stage_id=stage_id,
            wildcard_stage_id=wildcard_stage_id,
            round_id=round_id,
            user=user,
        )
    return result


@router.get(
    path="/{tournament_id}/stages/{stage_id}/swiss-stages/{swiss_stage_id}/rating",
)
async def get_swiss_stage_participants_rating(
    tournament_id: int,
    stage_id: UUID,
    swiss_stage_id: UUID,
    uow: UOWDepAsync,
    page: int = Query(1, ge=0),
    per_page: int = Query(100, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
    user: UserModel = Depends(current_active_user_optional),
):
    """ Get all participants rating in tournament. """
    async with uow:
        result = await swiss_rating_service.get_rating(
            uow=uow,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            tournament_id=tournament_id,
            stage_id=stage_id,
            swiss_stage_id=swiss_stage_id,
            user=user,
        )
    return result


@router.put(
    path="/{tournament_id}/stages/{stage_id}/swiss-stages/{swiss_stage_id}",
)
async def update_swiss_stage(
    tournament_id: int,
    stage_id: UUID,
    swiss_stage_id: UUID,
    uow: UOWDepAsync,
    schema: SwissStageUpdateSchema,
    user: UserModel = Depends(current_active_user),
):
    """ Set additional params for swiss tournament. """
    try:
        async with uow:
            await swiss_stage_service.update_stage(uow, tournament_id, stage_id, swiss_stage_id, schema, user)
    except SwissStageAlreadyStartedException:
        err_type, err_msg = 'stage_already_started', 'Нельзя менять параметры у уже начатого этапа турнира'
        return JSONResponse(
            content={"detail": {"type": err_type, "msg": err_msg}},
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{tournament_id}/swiss-calculator")
async def get_swiss_calculator(
    tournament_id: int,
    schema: SwissCalculatorDto,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_user),
) -> dict:
    return await swiss_calculator_service.get_swiss_calculator(
        uow,
        tournament_id=tournament_id,
        schema=schema,
        user=user,
    )


@router.post(
    "/{tournament_id}/stages/{stage_id}/swiss-stages/{swiss_stage_id}/rounds/{round_id}/start-round"
)
async def start_swiss_round(
    tournament_id: int,
    stage_id: UUID,
    swiss_stage_id: UUID,
    round_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    err_type, err_msg = None, None

    try:
        async with uow:
            await swiss_round_service.start_round(uow, tournament_id, stage_id, swiss_stage_id, round_id, user)
    except SwissRoundCannotBeStartedException:
        err_type, err_msg = 'round_cannot_be_started', 'Нельзя запустить данный раунд'

    if err_type and err_msg:
        return JSONResponse(
            content={"detail": {"type": err_type, "msg": err_msg}},
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/{tournament_id}/stages/{stage_id}/swiss-stages/{swiss_stage_id}/rounds/{round_id}/end-round"
)
async def end_swiss_round(
    tournament_id: int,
    stage_id: UUID,
    swiss_stage_id: UUID,
    round_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    err_type, err_msg = None, None

    try:
        async with uow:
            await swiss_round_service.end_round(uow, tournament_id, stage_id, swiss_stage_id, round_id, user)
    except NotAllSwissSeriesPlayedException:
        err_type, err_msg = 'not_all_series_played', 'Не все серии в раунде сыграны'
    except SwissRoundCannotBeEndedException:
        err_type, err_msg = 'round_cannot_be_ended', 'Нельзя завершить данный раунд'

    if err_type and err_msg:
        return JSONResponse(
            content={"detail": {"type": err_type, "msg": err_msg}},
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/{tournament_id}/stages/{stage_id}/wildcard-stages/{wildcard_stage_id}/rounds/{round_id}/start-round"
)
async def start_wildcard_round(
    tournament_id: int,
    stage_id: UUID,
    wildcard_stage_id: UUID,
    round_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    err_type, err_msg = None, None

    try:
        async with uow:
            await wildcard_round_service.start_round(uow, tournament_id, stage_id, wildcard_stage_id, round_id, user)
    except WildcardRoundCannotBeStartedException:
        err_type, err_msg = 'round_cannot_be_started', 'Нельзя запустить данный раунд'

    if err_type and err_msg:
        return JSONResponse(
            content={"detail": {"type": err_type, "msg": err_msg}},
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/{tournament_id}/stages/{stage_id}/wildcard-stages/{wildcard_stage_id}/rounds/{round_id}/end-round"
)
async def end_wildcard_round(
    tournament_id: int,
    stage_id: UUID,
    wildcard_stage_id: UUID,
    round_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    err_type, err_msg = None, None

    try:
        async with uow:
            await wildcard_round_service.end_round(uow, tournament_id, stage_id, wildcard_stage_id, round_id, user)
    except NotAllWildcardSeriesPlayedException:
        err_type, err_msg = 'not_all_series_played', 'Не все серии в раунде сыграны'
    except WildcardRoundCannotBeEndedException:
        err_type, err_msg = 'round_cannot_be_ended', 'Нельзя завершить данный раунд'

    if err_type and err_msg:
        return JSONResponse(
            content={"detail": {"type": err_type, "msg": err_msg}},
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    path="/{tournament_id}/stages/{stage_id}/de-stages/{de_stage_id}/bracket",
)
async def get_de_stage_round(
    tournament_id: int,
    stage_id: UUID,
    de_stage_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
    round_number__gte: Optional[int] = None,
):
    """ Get double elimination stage bracket. """
    async with uow:
        result = await de_stage_service.get_bracket(
            uow=uow,
            tournament_id=tournament_id,
            stage_id=stage_id,
            de_stage_id=de_stage_id,
            user=user,
            round_number__gte=round_number__gte,
        )
    return result


@router.post(
    path="/{tournament_id}/stages/{stage_id}/de-stages/{de_stage_id}/rounds/{round_id}/start-round",
)
async def start_de_round(
    tournament_id: int,
    stage_id: UUID,
    de_stage_id: UUID,
    round_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    """ Start double elimination round. """
    err_type, err_msg = None, None

    try:
        async with uow:
             await de_round_service.start_round(
                uow=uow,
                tournament_id=tournament_id,
                stage_id=stage_id,
                de_stage_id=de_stage_id,
                round_id=round_id,
                user=user,
            )
    except NotAllSeriesPlayedDEException:
        err_type, err_msg = 'not_all_series_played', 'Не все серии в раунде сыграны'
    except DERoundCannotBeStartedException:
        err_type, err_msg = 'round_cannot_be_started', 'Нельзя запустить данный раунд'

    if err_type and err_msg:
        return JSONResponse(
            content={"detail": {"type": err_type, "msg": err_msg}},
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    path="/{tournament_id}/stages/{stage_id}/de-stages/{de_stage_id}/rounds/{round_id}/end-round",
)
async def end_de_round(
    tournament_id: int,
    stage_id: UUID,
    de_stage_id: UUID,
    round_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    """ End double elimination round. """
    err_type, err_msg = None, None

    try:
        async with uow:
             await de_round_service.end_round(
                uow=uow,
                tournament_id=tournament_id,
                stage_id=stage_id,
                de_stage_id=de_stage_id,
                round_id=round_id,
                user=user,
            )
    except NotAllSeriesPlayedDEException:
        err_type, err_msg = 'not_all_series_played', 'Не все серии в раунде сыграны'

    if err_type and err_msg:
        return JSONResponse(
            content={"detail": {"type": err_type, "msg": err_msg}},
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    path="/{tournament_id}/stages/{stage_id}/de-stages/{de_stage_id}/rounds/{round_id}",
    response_model=DoubleEliminationStageRoundFullReadSchema,
)
async def get_de_stage_round(
    tournament_id: int,
    stage_id: UUID,
    de_stage_id: UUID,
    round_id: UUID,
    uow: UOWDepAsync,
    new_first: bool = None,
    user: UserModel = Depends(current_active_user),
) -> DoubleEliminationStageRoundFullReadSchema:
    """ Get double elimination stage with rounds. """
    async with uow:
        result = await de_round_service.get_round(
            uow=uow,
            tournament_id=tournament_id,
            stage_id=stage_id,
            de_stage_id=de_stage_id,
            round_id=round_id,
            new_first=new_first,
            user=user,
        )
    return result


@router.post(
    "/{tournament_id}/stages/{stage_id}/de-stages/{de_stage_id}/rounds/{round_id}/draw-one"
)
async def de_stage_round_draw_one(
    tournament_id: int,
    stage_id: UUID,
    de_stage_id: UUID,
    round_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    """ Draw one series in de round. """
    try:
        async with uow:
            result = await de_draw_service_service.draw_one(
                uow=uow,
                tournament_id=tournament_id,
                stage_id=stage_id,
                de_stage_id=de_stage_id,
                round_id=round_id,
                user=user,
            )
    except DERoundCannotBeDrawnException:
        err_type, err_msg = 'round_cannot_be_drawn', 'Для данного раунда недоступна жеребьевка'
        return JSONResponse(
            content={"detail": {"type": err_type, "msg": err_msg}},
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    return result


@router.post(
    path="/{tournament_id}/stages/{stage_id}/de-stages/{de_stage_id}/rounds/{round_id}/draw-all"
)
async def de_stage_round_draw_all(
    tournament_id: int,
    stage_id: UUID,
    de_stage_id: UUID,
    round_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    """ Draw all series in de round. """
    try:
        async with uow:
            result = await de_draw_service_service.draw_all(
                uow=uow,
                tournament_id=tournament_id,
                stage_id=stage_id,
                de_stage_id=de_stage_id,
                round_id=round_id,
                user=user,
            )
        return result
    except DERoundCannotBeDrawnException:
        err_type, err_msg = 'round_cannot_be_drawn', 'Для данного раунда недоступна жеребьевка'
    return JSONResponse(
        content={"detail": {"type": err_type, "msg": err_msg}},
        status_code=status.HTTP_400_BAD_REQUEST,
    )


@router.get(
    path="/{tournament_id}/stages/{stage_id}/de-stages/{de_stage_id}/rounds/{round_id}/draw-participants"
)
async def get_de_stage_accounts_to_draw(
    tournament_id: int,
    stage_id: UUID,
    de_stage_id: UUID,
    round_id: UUID,
    uow: UOWDepAsync,
    is_assigned: bool = True,
    user: UserModel = Depends(current_active_user),
):
    """ Get all accounts for current rounds to draw. """
    try:
        async with uow:
            result = await de_draw_service_service.get_accounts_to_draw(
                uow=uow,
                tournament_id=tournament_id,
                stage_id=stage_id,
                de_stage_id=de_stage_id,
                round_id=round_id,
                is_assigned=is_assigned,
                user=user,
            )
        return result
    except DERoundCannotBeDrawnException:
        err_type, err_msg = 'round_cannot_be_drawn', 'Для данного раунда недоступна жеребьевка'
    return JSONResponse(
        content={"detail": {"type": err_type, "msg": err_msg}},
        status_code=status.HTTP_400_BAD_REQUEST,
    )

@router.get(
    path="/{tournament_id}/stages/{stage_id}/se-stages/{se_stage_id}/bracket",
)
async def get_se_stage_round(
    tournament_id: int,
    stage_id: UUID,
    se_stage_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
    round_number__gte: Optional[int] = None,
):
    """ Get single elimination stage bracket. """
    async with uow:
        result = await se_stage_service.get_bracket(
            uow=uow,
            tournament_id=tournament_id,
            stage_id=stage_id,
            se_stage_id=se_stage_id,
            user=user,
            round_number__gte=round_number__gte,
        )
    return result


@router.post(
    path="/{tournament_id}/stages/{stage_id}/se-stages/{se_stage_id}/rounds/{round_id}/start-round",
)
async def start_se_round(
    tournament_id: int,
    stage_id: UUID,
    se_stage_id: UUID,
    round_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    """ Start single elimination round. """
    err_type, err_msg = None, None

    try:
        async with uow:
             await se_round_service.start_round(
                uow=uow,
                tournament_id=tournament_id,
                stage_id=stage_id,
                se_stage_id=se_stage_id,
                round_id=round_id,
                user=user,
            )
    except NotAllSeriesPlayedSEException:
        err_type, err_msg = 'not_all_series_played', 'Не все серии в раунде сыграны'
    except SERoundCannotBeStartedException:
        err_type, err_msg = 'round_cannot_be_started', 'Нельзя запустить данный раунд'

    if err_type and err_msg:
        return JSONResponse(
            content={"detail": {"type": err_type, "msg": err_msg}},
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    path="/{tournament_id}/stages/{stage_id}/se-stages/{se_stage_id}/rounds/{round_id}/end-round",
)
async def end_se_round(
    tournament_id: int,
    stage_id: UUID,
    se_stage_id: UUID,
    round_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    """ End single elimination round. """
    err_type, err_msg = None, None

    try:
        async with uow:
             await se_round_service.end_round(
                uow=uow,
                tournament_id=tournament_id,
                stage_id=stage_id,
                se_stage_id=se_stage_id,
                round_id=round_id,
                user=user,
            )
    except NotAllSeriesPlayedSEException:
        err_type, err_msg = 'not_all_series_played', 'Не все серии в раунде сыграны'

    if err_type and err_msg:
        return JSONResponse(
            content={"detail": {"type": err_type, "msg": err_msg}},
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    path="/{tournament_id}/stages/{stage_id}/se-stages/{se_stage_id}/rounds/{round_id}",
    response_model=SingleEliminationStageRoundFullReadSchema,
)
async def get_se_stage_round(
    tournament_id: int,
    stage_id: UUID,
    se_stage_id: UUID,
    round_id: UUID,
    uow: UOWDepAsync,
    new_first: bool = None,
    user: UserModel = Depends(current_active_user),
) -> SingleEliminationStageRoundFullReadSchema:
    """ Get single elimination stage with rounds. """
    async with uow:
        result = await se_round_service.get_round(
            uow=uow,
            tournament_id=tournament_id,
            stage_id=stage_id,
            se_stage_id=se_stage_id,
            round_id=round_id,
            new_first=new_first,
            user=user,
        )
    return result


@router.post(
    "/{tournament_id}/stages/{stage_id}/se-stages/{se_stage_id}/rounds/{round_id}/draw-one"
)
async def se_stage_round_draw_one(
    tournament_id: int,
    stage_id: UUID,
    se_stage_id: UUID,
    round_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    """ Draw one series in se round. """
    try:
        async with uow:
            result = await se_draw_service_service.draw_one(
                uow=uow,
                tournament_id=tournament_id,
                stage_id=stage_id,
                se_stage_id=se_stage_id,
                round_id=round_id,
                user=user,
            )
    except SERoundCannotBeDrawnException:
        err_type, err_msg = 'round_cannot_be_drawn', 'Для данного раунда недоступна жеребьевка'
        return JSONResponse(
            content={"detail": {"type": err_type, "msg": err_msg}},
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    return result


@router.post(
    path="/{tournament_id}/stages/{stage_id}/se-stages/{se_stage_id}/rounds/{round_id}/draw-all"
)
async def se_stage_round_draw_all(
    tournament_id: int,
    stage_id: UUID,
    se_stage_id: UUID,
    round_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    """ Draw all series in se round. """
    try:
        async with uow:
            result = await se_draw_service_service.draw_all(
                uow=uow,
                tournament_id=tournament_id,
                stage_id=stage_id,
                se_stage_id=se_stage_id,
                round_id=round_id,
                user=user,
            )
        return result
    except SERoundCannotBeDrawnException:
        err_type, err_msg = 'round_cannot_be_drawn', 'Для данного раунда недоступна жеребьевка'
    return JSONResponse(
        content={"detail": {"type": err_type, "msg": err_msg}},
        status_code=status.HTTP_400_BAD_REQUEST,
    )


@router.get(
    path="/{tournament_id}/stages/{stage_id}/se-stages/{se_stage_id}/rounds/{round_id}/draw-participants"
)
async def get_se_stage_accounts_to_draw(
    tournament_id: int,
    stage_id: UUID,
    se_stage_id: UUID,
    round_id: UUID,
    uow: UOWDepAsync,
    is_assigned: bool = True,
    user: UserModel = Depends(current_active_user),
):
    """ Get all accounts for current rounds to draw. """
    try:
        async with uow:
            result = await se_draw_service_service.get_accounts_to_draw(
                uow=uow,
                tournament_id=tournament_id,
                stage_id=stage_id,
                se_stage_id=se_stage_id,
                round_id=round_id,
                is_assigned=is_assigned,
                user=user,
            )
        return result
    except SERoundCannotBeDrawnException:
        err_type, err_msg = 'round_cannot_be_drawn', 'Для данного раунда недоступна жеребьевка'
    return JSONResponse(
        content={"detail": {"type": err_type, "msg": err_msg}},
        status_code=status.HTTP_400_BAD_REQUEST,
    )
