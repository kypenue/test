from sqlalchemy import select
from sqlalchemy.orm import joinedload, selectinload

from backlib.repos import BaseSyncRepo, BaseAsyncRepo
from cuply.stages.models import (
    StageModel,
    SingleEliminationStageModel,
    DoubleEliminationStageModel,
    LeagueStageModel,
    SwissStageModel,
    WildcardStageModel,
)


class TournamentStageSyncRepo(BaseSyncRepo):
    """ Sync repository for StageModel. """
    model = StageModel


class TournamentStageAsyncRepo(BaseAsyncRepo):
    """ Async repository for StageModel. """
    model = StageModel

    def get_tournament_stage_with_rounds_query(self, *filters):
        return select(StageModel).filter(*filters).options(
            joinedload(StageModel.se_stage).options(
                selectinload(SingleEliminationStageModel.rounds),
            ),
            joinedload(StageModel.de_stage).options(
                selectinload(DoubleEliminationStageModel.rounds),
            ),
            joinedload(StageModel.swiss_stage).options(
                selectinload(SwissStageModel.rounds)
            ),
            joinedload(StageModel.league_stage),
            joinedload(StageModel.wildcard_stage).options(
                selectinload(WildcardStageModel.rounds),
            ),
        ).order_by(StageModel.order_number)

    async def get_tournament_stage_with_rounds(self, *filters):
        result = await self.session.execute(self.get_tournament_stage_with_rounds_query(*filters))
        return result.scalar_one_or_none()

    async def get_tournament_stages_with_rounds(self, *filters):
        result = await self.session.execute(self.get_tournament_stage_with_rounds_query(*filters))
        return result.scalars().all()

    def get_full_tournament_stage_query(self, *filters):
        return select(StageModel).filter(*filters).options(
            joinedload(StageModel.se_stage).options(
                selectinload(SingleEliminationStageModel.rounds),
            ),
            joinedload(StageModel.de_stage).options(
                selectinload(DoubleEliminationStageModel.rounds),
            ),
            joinedload(StageModel.swiss_stage).options(
                selectinload(SwissStageModel.rounds),
            ),
            joinedload(StageModel.league_stage),
            joinedload(StageModel.wildcard_stage).options(
                selectinload(WildcardStageModel.rounds),
            ),
        ).order_by(StageModel.order_number)

    async def get_full_tournament_stage(self, *filters):
        result = await self.session.execute(self.get_tournament_stage_with_rounds_query(*filters))
        return result.scalar_one_or_none()

    async def get_full_tournament_stages(self, *filters):
        result = await self.session.execute(self.get_tournament_stage_with_rounds_query(*filters))
        return result.scalars().all()


class LeagueStageSyncRepo(BaseSyncRepo):
    """ Sync repository for LeagueStageModel. """
    model = LeagueStageModel


class LeagueStageAsyncRepo(BaseAsyncRepo):
    """ Async repository for LeagueStageModel. """
    model = LeagueStageModel
