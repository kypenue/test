""" Endpoints for game management. """
from typing import Optional, List

from fastapi import APIRouter, Depends, Query
from fastapi_filter import FilterDepends
from starlette import status
from starlette.responses import Response

from cuply.dependencies import UOWDepAsync
from cuply.auth.base_config import (
    current_superuser,
    current_active_user_optional,
)
from cuply.auth.models import UserModel
from cuply.games.filters import GameFilter
from cuply.games.schemas import (
    GameReadSchema,
    GameCreateSchema,
    GameUpdateSchema,
)
from cuply.games.services import GameService


router = APIRouter(
    prefix="/games",
    tags=["Games"],
)


game_service = GameService()


@router.get("/")
async def get_games(
    uow: UOWDepAsync,
    filter_instance: GameFilter = FilterDepends(GameFilter),
    page: int = Query(1, ge=0),
    per_page: int = Query(100, ge=0),
    order_by: Optional[List[str]] = Query(None),
    search: str = Query(None),
    _: Optional[UserModel] = Depends(current_active_user_optional),
) -> dict:
    """ Get all games paginated. """
    async with uow:
        result = await game_service.get_all_paginated(
            uow,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            filter_instance=filter_instance,
        )
    return result


@router.get("/{game_id}", response_model=GameReadSchema)
async def get_game(
    game_id: int,
    uow: UOWDepAsync,
    _: Optional[UserModel] = Depends(current_active_user_optional),
) -> GameReadSchema:
    """ Get one game by id. """
    async with uow:
        result = await game_service.get(uow, game_id)
    return result


@router.post("/", response_model=GameReadSchema)
async def create_game(
    schema: GameCreateSchema,
    uow: UOWDepAsync,
    _: UserModel = Depends(current_superuser),
) -> GameReadSchema:
    """ Create game. """
    async with uow:
        result = await game_service.create(uow, schema)
    return result


@router.put("/{game_id}", response_model=GameReadSchema)
async def update_game(
    game_id: int,
    schema: GameUpdateSchema,
    uow: UOWDepAsync,
    _: UserModel = Depends(current_superuser),
) -> GameReadSchema:
    """ Update game by id. """
    async with uow:
        result = await game_service.update(uow, game_id, schema)
    return result


@router.delete("/{game_id}")
async def delete_game(
    game_id: int,
    uow: UOWDepAsync,
    _: UserModel = Depends(current_superuser),
):
    """ Delete game by id. """
    async with uow:
        await game_service.delete(uow, game_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
