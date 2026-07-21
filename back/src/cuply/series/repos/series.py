from sqlalchemy import select, or_, and_
from sqlalchemy.orm import joinedload, selectinload

from backlib.repos import BaseSyncRepo, BaseAsyncRepo
from cuply.accounts.models import AccountModel
from cuply.games.models import GameModel
from cuply.matches.models import MatchModel
from cuply.series.models import SeriesModel, SeriesStatus
from cuply.teams.models import TeamModel
from cuply.tournaments.models import TournamentRegisteredUserModel


class SeriesModelSyncRepo(BaseSyncRepo):
    model = SeriesModel


class SeriesModelAsyncRepo(BaseAsyncRepo):
    model = SeriesModel

    def get_full_series_query(self, *filters):
        return select(SeriesModel).filter(*filters).options(
            selectinload(SeriesModel.matches).options(
                selectinload(MatchModel.result)
            ),
            joinedload(SeriesModel.gamer1).options(
                joinedload(AccountModel.user),
                joinedload(AccountModel.game).options(
                    joinedload(GameModel.image)
                ),
                joinedload(AccountModel.platform),
            ),
            joinedload(SeriesModel.gamer2).options(
                joinedload(AccountModel.user),
                joinedload(AccountModel.game).options(
                    joinedload(GameModel.image)
                ),
                joinedload(AccountModel.platform),
            ),
            joinedload(SeriesModel.tournament),
            joinedload(SeriesModel.stage),
            joinedload(SeriesModel.de_series),
            joinedload(SeriesModel.swiss_series),

            joinedload(SeriesModel.participant1).options(
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
            joinedload(SeriesModel.participant2).options(
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
            )
        )

    async def get_full_series(self, *filters):
        result = await self.session.execute(self.get_full_series_query(*filters))
        return result.scalar_one_or_none()

    async def get_all_full_series(self, *filters):
        result = await self.session.execute(self.get_full_series_query(*filters))
        return result.scalars().all()

    def get_all_full_series_query(self, *filters):
        return self.get_full_series_query(*filters).order_by(SeriesModel.updated_at.desc()).distinct()

    def get_all_full_series_for_user_query(self, user_id, *filters):
        return self.get_full_series_query(*filters).filter(
            or_(
                SeriesModel.gamer1.has(AccountModel.user_id == user_id),
                SeriesModel.gamer2.has(AccountModel.user_id == user_id),
            )
        ).order_by(SeriesModel.updated_at.desc())

    def get_all_full_series_for_users_query(self, user1_id, user2_id, *filters):
        return self.get_full_series_query(*filters).filter(
            and_(
                SeriesModel.gamer1.has(AccountModel.user_id.in_([user1_id, user2_id])),
                SeriesModel.gamer2.has(AccountModel.user_id.in_([user1_id, user2_id])),
            )
        ).order_by(SeriesModel.updated_at.desc())

    def get_full_series_with_stages_query(self, *filters):
        return select(SeriesModel).filter(*filters).options(
            selectinload(SeriesModel.matches),
            joinedload(SeriesModel.gamer1).options(
                joinedload(AccountModel.user),
                joinedload(AccountModel.game).options(
                    joinedload(GameModel.image)
                ),
                joinedload(AccountModel.platform),
            ),
            joinedload(SeriesModel.gamer2).options(
                joinedload(AccountModel.user),
                joinedload(AccountModel.game).options(
                    joinedload(GameModel.image)
                ),
                joinedload(AccountModel.platform),
            ),
            joinedload(SeriesModel.tournament),
            joinedload(SeriesModel.stage),
            joinedload(SeriesModel.de_series),
            joinedload(SeriesModel.swiss_series),

            joinedload(SeriesModel.participant1).options(
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
            joinedload(SeriesModel.participant2).options(
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
            )
        )

    async def get_playing_series_for_user(self, user_id: int):
        """Возвращает все серии пользователя со статусом PLAYING."""
        query = self.get_full_series_query(
            or_(
                SeriesModel.gamer1.has(AccountModel.user_id == user_id),
                SeriesModel.gamer2.has(AccountModel.user_id == user_id),
            ),
            SeriesModel.status == SeriesStatus.PLAYING
        )
        result = await self.session.execute(query)
        return result.scalars().all()

    async def get_full_series_with_stages(self, *filters):
        result = await self.session.execute(self.get_full_series_with_stages_query(*filters))
        return result.scalar_one_or_none()

    async def get_all_full_series_with_stages(self, *filters):
        result = await self.session.execute(self.get_full_series_with_stages_query(*filters))
        return result.scalars().all()


