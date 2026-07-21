import json
import logging
import uuid
from uuid import UUID
from typing import Optional, List

from fastapi import APIRouter, Depends, status, Query, WebSocket, HTTPException
from fastapi_filter import FilterDepends
from starlette.responses import Response
from starlette.websockets import WebSocketDisconnect

from cuply.auth.base_config import current_active_user, current_active_user_optional, auth_backend
from cuply.auth.managers import UserManager
from cuply.auth.models import UserModel
from cuply.auth.utils import get_user_db
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.teams.filters.teams import TeamFilter
from cuply.teams.schemas.auction_bets import AuctionBetWriteSchema
from cuply.teams.schemas.teams import (
    TeamReadSchema,
    UserTeamCreateSchema,
    TeamUpdateSchema,
    CopyToTournamentWriteSchema,
    TournamentTeamReadSchema,
)
from cuply.dependencies import UOWDepAsync
from cuply.teams.services.assignment import TournamentTeamAssignmentService
from cuply.teams.services.auction_bets import AuctionService
from cuply.teams.services.draw import TournamentTeamDrawService
from cuply.teams.services.teams import UserTeamService, TournamentTeamService
from cuply.teams.ws import manager
from cuply.tournaments.schemas.registration import TournamentRegisteredUserReadSchema


cuply_logger = logging.getLogger("cuply")


router = APIRouter(prefix="/teams", tags=["Teams"])


user_team_service = UserTeamService()
tournament_team_service = TournamentTeamService()
assignment_team_service = TournamentTeamAssignmentService()
draw_team_service = TournamentTeamDrawService()
auction_service = AuctionService()


@router.get("/")
async def get_user_teams(
    uow: UOWDepAsync,
    filter_instance: TeamFilter = FilterDepends(TeamFilter),
    page: int = Query(1, ge=0),
    per_page: int = Query(20, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
    user: UserModel = Depends(current_active_user_optional),
):
    async with uow:
        result = await user_team_service.get_all_paginated(
            uow=uow,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            filter_instance=filter_instance,
            user=user,
        )
    return result


@router.get("/{team_id}")
async def get_user_team(
    team_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user_optional),
) -> TeamReadSchema:
    async with uow:
        result = await user_team_service.get(uow, team_id, user=user)
    return result


@router.post("/")
async def create_user_team(
    schema: UserTeamCreateSchema,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
) -> TeamReadSchema:
    async with uow:
        result = await user_team_service.create(uow, schema, user=user)
    return result


@router.put("/{team_id}")
async def update_user_team(
    team_id: UUID,
    schema: TeamUpdateSchema,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    async with uow:
        await user_team_service.update(uow, team_id, schema, user=user)

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete("/{team_id}")
async def delete_user_team(
    team_id: UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    async with uow:
        await user_team_service.delete(uow, team_id, user=user)

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/tournaments/{tournament_id}/teams")
async def get_tournament_teams(
    uow: UOWDepAsync,
    tournament_id: int,
    filter_instance: TeamFilter = FilterDepends(TeamFilter),
    page: int = Query(1, ge=0),
    per_page: int = Query(20, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
    user: UserModel = Depends(current_active_user_optional),
):
    async with uow:
        result = await tournament_team_service.get_all_paginated(
            tournament_id=tournament_id,
            uow=uow,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            filter_instance=filter_instance,
            user=user,
        )
    return result


@router.get("/tournaments/{tournament_id}/teams/{team_id}")
async def get_tournament_team(
    team_id: UUID,
    tournament_id: int,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user_optional),
) -> TournamentTeamReadSchema:
    async with uow:
        result = await tournament_team_service.get(uow, tournament_id, team_id, user=user)
    return result


@router.post("/tournaments/{tournament_id}/copy-team")
async def copy_team_to_tournament(
    tournament_id: int,
    schema: CopyToTournamentWriteSchema,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
) -> TeamReadSchema:
    async with uow:
        result = await tournament_team_service.copy_team_to_tournament(uow, tournament_id, schema, user=user)
    return result


@router.get("/tournaments/{main_tournament_id}/available-teams")
async def get_available_teams(
    uow: UOWDepAsync,
    main_tournament_id: int,
    filter_instance: TeamFilter = FilterDepends(TeamFilter),
    page: int = Query(1, ge=0),
    per_page: int = Query(20, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
    user: UserModel = Depends(current_active_user_optional),
):
    async with uow:
        result = await tournament_team_service.get_available_teams_paginated(
            tournament_id=main_tournament_id,
            uow=uow,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            filter_instance=filter_instance,
            user=user,
        )
    return result


@router.put("/tournaments/{tournament_id}/teams/{team_id}")
async def update_tournament_team(
    team_id: UUID,
    tournament_id: int,
    schema: TeamUpdateSchema,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    async with uow:
        await tournament_team_service.update(uow, tournament_id, team_id, schema, user=user)

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete("/tournaments/{tournament_id}/teams/{team_id}")
async def delete_tournament_team(
    team_id: UUID,
    tournament_id: int,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    async with uow:
        await tournament_team_service.delete(uow, tournament_id, team_id, user=user)

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/tournaments/{tournament_id}/participants/{participant_id}/assign-team/{team_id}")
async def create_team_assignment(
    tournament_id: int,
    participant_id: int,
    team_id: uuid.UUID,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    async with uow:
        await assignment_team_service.create_assignment(uow, tournament_id, participant_id, team_id, user=user)

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/tournaments/{tournament_id}/participants/{participant_id}/remove-team")
async def delete_team_assignment(
    tournament_id: int,
    participant_id: int,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    async with uow:
        await assignment_team_service.remove_assignment(uow, tournament_id, participant_id, user=user)

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/tournaments/{tournament_id}/draw-one")
async def draw_one(
    tournament_id: int,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
) -> TournamentRegisteredUserReadSchema:
    async with uow:
        result = await draw_team_service.draw_one_participant(uow, tournament_id, user=user)
    return result


@router.post("/tournaments/{tournament_id}/auction/start-auction")
async def start_auction(
    tournament_id: int,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_active_user),
):
    async with uow:
        await auction_service.start_auction(uow, tournament_id, user=user)

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/tournaments/{tournament_id}/auction/teams/{team_id}/history")
async def get_history(
    uow: UOWDepAsync,
    tournament_id: int,
    team_id: uuid.UUID,
    page: int = Query(1, ge=0),
    per_page: int = Query(20, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
    user: UserModel = Depends(current_active_user),
):
    async with uow:
        result = await auction_service.get_history_paginated(
            uow,
            tournament_id,
            team_id,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            user=user,
        )

    return result


async def get_ws_user(
    websocket: WebSocket,
    auth: str,
    user_db=Depends(get_user_db)
):
    return await auth_backend.get_strategy().read_token(auth, UserManager(user_db))


@router.websocket("/tournaments/{tournament_id}/ws")
async def auction_websocket_endpoint(
    websocket: WebSocket,
    tournament_id: int,
    user: UserModel = Depends(get_ws_user),
):
    await manager.connect(tournament_id, websocket)

    action: str | None = None

    try:
        while True:
            data = await websocket.receive_json()
            try:
                uow = AsyncUnitOfWork()
                async with uow:
                    action = data.get("action")
                    data = data.get("data")
                    if action == "init":
                        result = await auction_service.get_init_data(uow, tournament_id)
                        await websocket.send_json({
                            "action": action,
                            "data": json.loads(result.model_dump_json()),
                        })
                    elif action == "make_bet":
                        schema = AuctionBetWriteSchema.model_validate(data)
                        await auction_service.make_bet(
                            uow,
                            tournament_id,
                            schema.team_id,
                            schema.bet,
                            creator=user,
                        )
                        await websocket.send_json({
                            "action": action,
                            "result": "success",
                        })
                    else:
                        raise HTTPException(detail="Данное действие не поддерживается", status_code=400)
            except HTTPException as ex:
                await websocket.send_json({
                    "action": action,
                    "result": "error",
                    "error_message": ex.detail,
                })
            except Exception as ex:
                cuply_logger.exception(ex)
                await websocket.send_json({
                    "action": action,
                    "result": "error",
                    "error_message": "Произошла непредвиденная ошибка",
                })
    except WebSocketDisconnect:
        manager.disconnect(tournament_id, websocket)
