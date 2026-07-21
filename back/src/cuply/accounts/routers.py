""" Endpoints to interact with gamer accounts. """
from typing import Optional, List

from fastapi import APIRouter, Depends
from fastapi.params import Query
from fastapi_filter import FilterDepends
from starlette import status
from starlette.responses import Response, JSONResponse

from cuply.accounts.exceptions import AccountInTournamentCannotBeChanged
from cuply.accounts.filters import AccountFilter
from cuply.accounts.schemas import (
    AccountCreateSchema,
    AccountUpdateSchema,
    AccountReadSchema,
)
from cuply.accounts.services.accounts import AccountService
from cuply.accounts.services.statistics import StatsService
from cuply.auth.base_config import (
    current_active_user,
    current_active_user_optional,
)
from cuply.auth.models import UserModel
from cuply.dependencies import UOWDepAsync
from cuply.tournaments.schemas.tournaments import TournamentStatsByAccountReadSchema

router = APIRouter(
    prefix="/accounts",
    tags=["Accounts"],
)

account_service = AccountService()
statistics_service = StatsService()


@router.get("/leaderboard", response_model=dict)
async def get_accounts_rating(
        uow: UOWDepAsync,
        filter_instance: AccountFilter = FilterDepends(AccountFilter),
        page: int = Query(1, ge=1),
        per_page: int = Query(100, ge=1),
        order_by: Optional[List[str]] = Query(None),
        search: str = Query(None),
        _: UserModel = Depends(current_active_user_optional),
):
    async with uow:
        result = await account_service.get_rating_leaderboard(
            uow=uow,
            filter_instance=filter_instance,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search
        )
    return result


@router.get("/")
async def get_accounts(
        uow: UOWDepAsync,
        filter_instance: AccountFilter = FilterDepends(AccountFilter),
        page: int = Query(1, ge=0),
        per_page: int = Query(100, ge=0),
        order_by: Optional[List[str]] = Query(None),
        search: str = Query(None),
        _: UserModel = Depends(current_active_user_optional),
) -> dict:
    """ Get all accounts paginated. """
    async with uow:
        result = await account_service.get_all_paginated(
            uow,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            filter_instance=filter_instance,
        )
    return result


@router.get("/me")
async def get_account(
        uow: UOWDepAsync,
        filter_instance: AccountFilter = FilterDepends(AccountFilter),
        page: int = Query(1, ge=0),
        per_page: int = Query(100, ge=0),
        order_by: Optional[List[str]] = Query(None),
        search: str = Query(None),
        user: UserModel = Depends(current_active_user),
) -> dict:
    """ Get only my accounts paginated. """
    async with uow:
        result = await account_service.get_my_paginated(
            uow,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            filter_instance=filter_instance,
            user=user,
        )
    return result


@router.get("/{account_id}", response_model=AccountReadSchema)
async def get_account(
        account_id: int,
        uow: UOWDepAsync,
        _: UserModel = Depends(current_active_user_optional),
) -> AccountReadSchema:
    """ Get one account by id. """
    async with uow:
        result = await account_service.get(uow, account_id)
    return result


@router.post("/")
async def create_account(
        schema: AccountCreateSchema,
        uow: UOWDepAsync,
        user: UserModel = Depends(current_active_user),
) -> AccountReadSchema:
    """ Create account. """
    async with uow:
        result = await account_service.create(uow, schema, user)
    return result


@router.put("/{account_id}", response_model=AccountReadSchema)
async def update_account(
        account_id: int,
        gamer: AccountUpdateSchema,
        uow: UOWDepAsync,
        user: UserModel = Depends(current_active_user),
) -> AccountReadSchema | JSONResponse:
    """ Update own account by id. """
    try:
        async with uow:
            result = await account_service.update(uow, account_id, gamer, user)
        return result
    except AccountInTournamentCannotBeChanged:
        err_type = "account_in_tournament_cannot_be_changed"
        err_msg = "Аккаунт, участвующий в турнире, не может быть изменен"

    return JSONResponse(
        content={"detail": {"type": err_type, "msg": err_msg}},
        status_code=status.HTTP_400_BAD_REQUEST,
    )


@router.delete("/{account_id}")
async def delete_account(
        account_id: int,
        uow: UOWDepAsync,
        user: UserModel = Depends(current_active_user),
):
    """ Delete own account by id. """
    try:
        async with uow:
            await account_service.delete(uow, account_id, user)
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except AccountInTournamentCannotBeChanged:
        err_type = "account_in_tournament_cannot_be_changed"
        err_msg = "Аккаунт, участвующий в турнире, не может быть изменен"

    return JSONResponse(
        content={"detail": {"type": err_type, "msg": err_msg}},
        status_code=status.HTTP_400_BAD_REQUEST,
    )


@router.get("/{account_id}/stats")
async def get_account_stats(
        account_id: int,
        uow: UOWDepAsync,
        _: UserModel = Depends(current_active_user_optional),
) -> dict:
    """
    Возвращает общую статистику по аккаунту.
    Рейтинг = None, пока не реализовали.
    """
    async with uow:
        stats_dict = await statistics_service.get_account_overall_stats(uow, account_id)
    return stats_dict


@router.get("/{account_id}/stats/by-tournaments", response_model=List[TournamentStatsByAccountReadSchema])
async def get_account_stats_by_tournaments(
        account_id: int,
        uow: UOWDepAsync,
        _: UserModel = Depends(current_active_user_optional),
) -> List[TournamentStatsByAccountReadSchema]:
    """
    Статистика по турнирам (уже со схемой TournamentStatsByAccountReadSchema).
    """
    async with uow:
        result = await statistics_service.get_account_tournaments_stats(uow, account_id)
    return result


@router.get("/{account_id}/rating", response_model=float)
async def get_account_rating(
        account_id: int,
        uow: UOWDepAsync,
        _: UserModel = Depends(current_active_user_optional),
):
    """
    Возвращает числовое значение рейтинга для конкретного аккаунта.
    """
    async with uow:
        account = await account_service.get(uow, account_id)
    return account.rating
