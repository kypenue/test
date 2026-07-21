""" Repositories for account models. """

from sqlalchemy import select, func, or_
from sqlalchemy.orm import joinedload

from backlib.repos import BaseSyncRepo, BaseAsyncRepo
from cuply.accounts.models import AccountModel
from cuply.games.models import GameModel
from cuply.matches.models import MatchModel, MatchStatus
from cuply.tournaments.models import TournamentRegisteredUserModel


class AccountSyncRepo(BaseSyncRepo):
    """ Sync repository for AccountModel. """
    model = AccountModel


class AccountAsyncRepo(BaseAsyncRepo):
    """ Async repository for AccountModel. """
    model = AccountModel

    async def get_from_registrations(self, tournament_id, status):
        query = select(self.model).join(TournamentRegisteredUserModel.account).filter(
            TournamentRegisteredUserModel.tournament_id==tournament_id,
            TournamentRegisteredUserModel.status==status,
        )
        res = await self.session.execute(query)
        return [row for row in res.scalars()]

    def get_full_account_query(self, *filters):
        return select(AccountModel).filter(*filters).options(
            joinedload(AccountModel.game).options(
                joinedload(GameModel.image)
            ),
            joinedload(AccountModel.platform),
            joinedload(AccountModel.user),
        )

    def get_leaderboard_query(self, *filters):
        """
        Строит запрос, который возвращает аккаунты вместе с количеством завершённых матчей.
        Завершёнными считаются матчи, у которых статус входит в:
          CONFIRMED, CONFIRMED_BY_CRON, CONFIRMED_BY_ORGANIZER, NOT_NECESSARY.
        Выбираются только те аккаунты, у которых это количество больше 0.
        """
        finished_statuses = (
            MatchStatus.CONFIRMED,
            MatchStatus.CONFIRMED_BY_CRON,
            MatchStatus.CONFIRMED_BY_ORGANIZER,
            MatchStatus.NOT_NECESSARY,
        )
        # Подзапрос, который для каждого аккаунта считает количество завершённых матчей:
        subq = (
            select(func.count(MatchModel.id))
            .where(
                MatchModel.status.in_(finished_statuses),
                or_(
                    MatchModel.home_player_id == AccountModel.id,
                    MatchModel.guest_player_id == AccountModel.id,
                )
            )
            .scalar_subquery()
        )
        query = (
            select(AccountModel, subq.label("matches_count"))
            .filter(*filters)
            .options(
                joinedload(AccountModel.game).options(
                    joinedload(GameModel.image)
                ),
                joinedload(AccountModel.platform),
                joinedload(AccountModel.user),
            )
            .filter(subq > 0)  # исключаем аккаунты с 0 матчей
        )
        return query

    async def get_full_account(self, *filters):
        result = await self.session.execute(self.get_full_account_query(*filters))
        return result.scalar_one_or_none()

    async def get_full_accounts(self, *filters):
        result = await self.session.execute(self.get_full_account_query(*filters))
        return result.scalars().all()
