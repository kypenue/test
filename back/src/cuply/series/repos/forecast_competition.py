from sqlalchemy import select, func
from sqlalchemy.orm import joinedload, selectinload

from backlib.repos import BaseAsyncRepo
from cuply.accounts.models import AccountModel
from cuply.auth.models import UserModel
from cuply.games.models import GameModel
from cuply.matches.models import MatchModel
from cuply.series.models import ForecastCompetitionBetModel, SeriesModel


class ForecastCompetitionBetModelAsyncRepo(BaseAsyncRepo):
    model = ForecastCompetitionBetModel

    def get_full_bet_query(self, *filters):
        return select(ForecastCompetitionBetModel).filter(*filters).options(
            joinedload(ForecastCompetitionBetModel.winner).options(
                joinedload(AccountModel.user),
                joinedload(AccountModel.game).options(
                    joinedload(GameModel.image)
                ),
                joinedload(AccountModel.platform),
            ),
            joinedload(ForecastCompetitionBetModel.creator),
            selectinload(ForecastCompetitionBetModel.series).options(
                joinedload(SeriesModel.gamer1).options(
                    joinedload(AccountModel.game).options(
                        joinedload(GameModel.image)
                    ),
                    joinedload(AccountModel.platform),
                    joinedload(AccountModel.user),
                ),
                joinedload(SeriesModel.gamer2).options(
                    joinedload(AccountModel.game).options(
                        joinedload(GameModel.image)
                    ),
                    joinedload(AccountModel.platform),
                    joinedload(AccountModel.user),
                ),
                selectinload(SeriesModel.matches).options(
                    selectinload(MatchModel.result),
                    joinedload(MatchModel.home_player_account),
                    joinedload(MatchModel.guest_player_account),
                ),
            ),
        ).join(
            ForecastCompetitionBetModel.series,
        ).order_by(
            ForecastCompetitionBetModel.created_at.desc(),
        )

    async def get_full_bet(self, *filters):
        result = await self.session.execute(self.get_full_bet_query(*filters))
        return result.scalar_one_or_none()

    async def get_all_full_bets(self, *filters):
        result = await self.session.execute(self.get_full_bet_query(*filters))
        return result.scalars().all()

    def get_tournament_rating_query(self, tournament_id):
        query = select(
            UserModel,
            func.sum(ForecastCompetitionBetModel.points).label('rating'),
        ).join(
            ForecastCompetitionBetModel.series,
        ).join(
            ForecastCompetitionBetModel.creator,
        ).filter(
            SeriesModel.tournament_id == tournament_id,
        ).group_by(
            UserModel.id,
        ).order_by(
            func.sum(ForecastCompetitionBetModel.points).desc(),
        )
        return query
