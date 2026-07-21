from uuid import UUID

from sqlalchemy import select, asc, or_
from sqlalchemy.orm import joinedload, selectinload

from backlib.repos import BaseAsyncRepo, BaseSyncRepo
from cuply.accounts.models import AccountModel
from cuply.games.models import GameModel
from cuply.matches.models import MatchModel, MatchStatus
from cuply.teams.models import TeamModel
from cuply.tournaments.models import TournamentRegisteredUserModel


class SeriesMatchSyncRepo(BaseSyncRepo):
    model = MatchModel


class SeriesMatchAsyncRepo(BaseAsyncRepo):
    model = MatchModel

    async def find_matches_by_series(self, series_id: UUID) -> list[MatchModel]:
        query =  self.get_full_match_query(MatchModel.series_id == series_id).order_by(asc("match_number"))
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def find_waiting_matches(self) -> list[MatchModel]:
        query = self.get_full_match_query(
            or_(
                MatchModel.status == MatchStatus.WAITING_CONFIRMATION_FROM_GUEST_PLAYER,
                MatchModel.status == MatchStatus.WAITING_CONFIRMATION_FROM_HOME_PLAYER,
            ),
        )
        result = await self.session.execute(query)
        return list(result.scalars().all())

    def get_full_match_query(self, *filters):
        return select(MatchModel).filter(*filters).options(
            selectinload(MatchModel.result),
            joinedload(MatchModel.home_player_account).options(
                joinedload(AccountModel.user),
                joinedload(AccountModel.game).options(
                    joinedload(GameModel.image)
                ),
                joinedload(AccountModel.platform),
            ),
            joinedload(MatchModel.guest_player_account).options(
                joinedload(AccountModel.user),
                joinedload(AccountModel.game).options(
                    joinedload(GameModel.image)
                ),
                joinedload(AccountModel.platform),
            ),
            joinedload(MatchModel.home_participant).options(
                joinedload(TournamentRegisteredUserModel.account).options(
                    joinedload(AccountModel.user),
                    joinedload(AccountModel.platform),
                    joinedload(AccountModel.game).options(
                        joinedload(GameModel.image)
                    ),
                ),
                joinedload(TournamentRegisteredUserModel.team).options(
                    joinedload(TeamModel.game),
                    joinedload(TeamModel.image),
                    joinedload(TeamModel.creator),
                ),
                joinedload(TournamentRegisteredUserModel.tournament),
            ),
            joinedload(MatchModel.guest_participant).options(
                joinedload(TournamentRegisteredUserModel.account).options(
                    joinedload(AccountModel.user),
                    joinedload(AccountModel.platform),
                    joinedload(AccountModel.game).options(
                        joinedload(GameModel.image)
                    ),
                ),
                joinedload(TournamentRegisteredUserModel.team).options(
                    joinedload(TeamModel.game),
                    joinedload(TeamModel.image),
                    joinedload(TeamModel.creator),
                ),
                joinedload(TournamentRegisteredUserModel.tournament),
            ),
        )

    async def get_full_match(self, *filters):
        result = await self.session.execute(self.get_full_match_query(*filters))
        return result.scalar_one_or_none()

    async def get_full_matches(self, *filters):
        result = await self.session.execute(self.get_full_match_query(*filters))
        return result.scalars().all()
