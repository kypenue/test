""" Services to interact with accounts. """
from fastapi import HTTPException
from sqlalchemy import desc, asc
from sqlalchemy.orm import joinedload
from starlette import status

import constants
from backlib.pagination import AsyncPaginator
from backlib.repo_helpers import raise_not_found_if_none
from cuply.accounts.exceptions import AccountInTournamentCannotBeChanged
from cuply.accounts.filters import AccountFilter
from cuply.accounts.models import AccountModel
from cuply.accounts.schemas import AccountRatingReadSchema
from cuply.accounts.schemas import (
    AccountReadSchema,
    AccountCreateSchema,
    AccountUpdateSchema,
)
from cuply.auth.models import UserModel
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.games.models import GameModel
from cuply.stages.models import StageParticipantStatus


class AccountPermissionService:
    """ Service to check user account permissions. """

    def check_ownership(self, account: AccountModel, user: UserModel) -> bool:
        """ Check if user is owner of account. """
        return account.user_id == user.id

    def check_update(self, account: AccountModel, user: UserModel):
        """ Check if user can update account. """
        if not self.check_ownership(account, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=constants.NOT_ENOUGH_PERMISSIONS_MSG,
            )

    def check_delete(self, account: AccountModel, user: UserModel):
        """ Check if user can delete account. """
        if not self.check_ownership(account, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=constants.NOT_ENOUGH_PERMISSIONS_MSG,
            )


class AccountService:
    """ Service to interact with accounts. """

    async def get(self, uow: AsyncUnitOfWork, account_id: int) -> AccountReadSchema:
        """ Get account by id. """
        account = await uow.account_repo.get_full_account(AccountModel.id == account_id)
        raise_not_found_if_none(account, account_id)
        return AccountReadSchema.model_validate(account)

    async def get_all_paginated(
            self,
            uow: AsyncUnitOfWork,
            page: int,
            per_page: int,
            order_by: list[str] | None,
            search: str,
            filter_instance: AccountFilter,
    ) -> dict:
        """ Get all accounts paginated. """
        paginator = AsyncPaginator(
            session=uow.session,
            model_class=AccountModel,
            schema_class=AccountReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            search_by=["login"],
            filter_instance=filter_instance,
            query=uow.account_repo.get_full_account_query(),
        )
        return await paginator.get_result()

    async def get_my_paginated(
            self,
            uow: AsyncUnitOfWork,
            user: UserModel,
            page: int,
            per_page: int,
            order_by: list[str] | None,
            search: str,
            filter_instance: AccountFilter,
    ) -> dict:
        """ Get all accounts paginated. """
        paginator = AsyncPaginator(
            session=uow.session,
            model_class=AccountModel,
            schema_class=AccountReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            search_by=["login"],
            filter_instance=filter_instance,
            query=uow.account_repo.get_full_account_query(AccountModel.user_id == user.id),
        )
        return await paginator.get_result()

    async def create(
            self,
            uow: AsyncUnitOfWork,
            schema: AccountCreateSchema,
            user: UserModel,
    ) -> AccountReadSchema:
        """ Create new account. """
        data = schema.model_dump()
        data["user_id"] = user.id

        game = await uow.game_repo.find_one(id=data["game_id"])
        raise_not_found_if_none(game, data["game_id"])

        platform = await uow.platform_repo.find_one(id=data["platform_id"])
        raise_not_found_if_none(platform, data["platform_id"])

        account_id = await uow.account_repo.add_one(data)
        account = await uow.account_repo.get_full_account(AccountModel.id == account_id)

        await uow.commit()

        return AccountReadSchema.model_validate(account)

    async def update(
            self,
            uow: AsyncUnitOfWork,
            account_id: int,
            schema: AccountUpdateSchema,
            user: UserModel,
    ) -> AccountReadSchema:
        """ Update account by id. """
        data = schema.model_dump()

        account = await uow.account_repo.find_one(id=account_id)

        AccountPermissionService().check_update(account, user)
        raise_not_found_if_none(account, account_id)

        stage_participants = await uow.stage_participant.find_all(
            account_id=account_id,
            status=StageParticipantStatus.PLAYING,
        )
        if len(stage_participants) > 0:
            raise AccountInTournamentCannotBeChanged("Account playing in tournament cannot be changed.")

        await uow.account_repo.edit_one(account_id, data)
        account = await uow.account_repo.get_full_account(AccountModel.id == account_id)

        await uow.commit()

        return AccountReadSchema.model_validate(account)

    async def delete(
            self,
            uow: AsyncUnitOfWork,
            account_id: int,
            user: UserModel,
    ):
        """ Delete account by id. """
        account = await uow.account_repo.find_one(id=account_id)

        AccountPermissionService().check_delete(account, user)
        raise_not_found_if_none(account, account_id)

        stage_participants = await uow.stage_participant.find_all(
            account_id=account_id,
            status=StageParticipantStatus.PLAYING,
        )
        if len(stage_participants) > 0:
            raise AccountInTournamentCannotBeChanged("Account playing in tournament cannot be deleted.")

        await uow.account_repo.delete_one(account_id)
        await uow.commit()

    async def get_rating_leaderboard(
            self,
            uow,
            filter_instance: AccountFilter,
            page: int,
            per_page: int,
            order_by: list[str] | None,
            search: str,
    ) -> dict:

        base_query = uow.account_repo.get_leaderboard_query().options(
            joinedload(AccountModel.game)
        )

        if filter_instance.game_id:
            base_query = base_query.order_by(
                desc(AccountModel.rating),
                asc(AccountModel.login)
            )
        else:
            base_query = base_query.join(GameModel, AccountModel.game).order_by(
                asc(GameModel.name),
                desc(AccountModel.rating),
                asc(AccountModel.login)
            )

        paginator = AsyncPaginator(
            session=uow.session,
            model_class=AccountModel,
            schema_class=None,  # отключаем автоконвертацию
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            search_by=[],
            filter_instance=filter_instance,
            query=base_query,
        )

        await paginator.filter()
        await paginator.search()
        await paginator.order()

        total_count = await paginator.get_total_count()
        await paginator.paginate()

        raw_rows = (await uow.session.execute(paginator.query)).unique()

        new_items = []
        position_start = (page - 1) * per_page + 1

        for idx, row in enumerate(raw_rows):
            account = row[0]
            games_count = row[1]

            item_schema = AccountRatingReadSchema(
                position=position_start + idx,
                rating=round(account.rating, 2),
                login=account.login,
                games_count=games_count,
                game_name=account.game.name if account.game else None
            )
            new_items.append(item_schema)

        return {
            "page": page,
            "per_page": per_page,
            "total_pages": total_count // per_page + 1,
            "total_count": total_count,
            "payload": [item.model_dump() for item in new_items],
        }
