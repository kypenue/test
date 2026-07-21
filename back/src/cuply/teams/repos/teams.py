from sqlalchemy import select, func
from sqlalchemy.orm import joinedload

from backlib.repos import BaseAsyncRepo
from cuply.games.models import GameModel
from cuply.teams.models import TeamModel
from cuply.tournaments.models import TournamentModel, TournamentRegisteredUserModel


class TeamAsyncRepo(BaseAsyncRepo):
    """ Async repository for TeamModel. """
    model = TeamModel

    def get_full_team_query(self, *filters):
        return select(TeamModel).filter(*filters).options(
            joinedload(TeamModel.game).options(
                joinedload(GameModel.image)
            ),
            joinedload(TeamModel.source_team),
            joinedload(TeamModel.creator),
            joinedload(TeamModel.image),
            joinedload(TeamModel.tournament).options(
                joinedload(TournamentModel.creator),
            ),
        )

    async def get_full_team(self, *filters):
        result = await self.session.execute(self.get_full_team_query(*filters))
        return result.scalar_one_or_none()

    async def get_full_teams(self, *filters):
        result = await self.session.execute(self.get_full_team_query(*filters))
        return result.scalars().all()

    async def get_teams_number(self, tournament_id, *filters):
        query = select(func.count()).select_from(TeamModel).filter(TeamModel.tournament_id == tournament_id, *filters)
        result = await self.session.execute(query)
        return result.unique().scalar()

    async def get_tournament_teams_distribution(self, tournament_id, *filters):
        query = select(
            TournamentRegisteredUserModel.team_id,
            func.count(TournamentRegisteredUserModel.team_id),
        ).filter(
            TournamentRegisteredUserModel.tournament_id == tournament_id,
        ).group_by(TournamentRegisteredUserModel.team_id)
        result = await self.session.execute(query)
        return {str(item[0]): item[1] for item in result if item[0] is not None}
