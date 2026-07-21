import uuid

from sqlalchemy import select, func
from sqlalchemy.orm import joinedload

from backlib.repos import BaseAsyncRepo
from cuply.accounts.models import AccountModel
from cuply.games.models import GameModel
from cuply.teams.models import AuctionBetModel, TeamModel
from cuply.tournaments.models import TournamentRegisteredUserModel


class AuctionBetAsyncRepo(BaseAsyncRepo):
    model = AuctionBetModel

    def get_full_bet_query(self, *filters):
        return select(AuctionBetModel).filter(*filters).options(
            joinedload(AuctionBetModel.participant).options(
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
            joinedload(AuctionBetModel.team).options(
                joinedload(TeamModel.game),
                joinedload(TeamModel.image),
                joinedload(TeamModel.creator),
            ),
        )

    async def get_full_bet(self, *filters):
        result = await self.session.execute(self.get_full_bet_query(*filters))
        return result.scalar_one_or_none()

    async def get_full_bets(self, *filters):
        result = await self.session.execute(self.get_full_bet_query(*filters))
        return result.scalars().all()

    async def get_max_bet_for_team(self, team_id: uuid.UUID) -> AuctionBetModel:
        result = await self.session.execute(
            self.get_full_bet_query(AuctionBetModel.team_id == team_id).order_by(AuctionBetModel.bet.desc()).limit(1)
        )
        return result.scalar_one_or_none()

    async def get_max_bet_value_for_team(self, team_id: uuid.UUID) -> int:
        query = select(
            func.max(AuctionBetModel.bet)
        ).select_from(AuctionBetModel).where(AuctionBetModel.team_id == team_id)
        result = await self.session.execute(query)
        return result.scalar()
