from typing import List
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import joinedload

from backlib.repos import BaseAsyncRepo, BaseSyncRepo
from cuply.matches.models import MatchResultModel, MatchModel


class MatchResultSyncRepo(BaseSyncRepo):
    model = MatchResultModel


class MatchResultAsyncRepo(BaseAsyncRepo):
    model = MatchResultModel

    async def find_results_in_match(self, match_id: UUID) -> List[MatchResultModel]:
        return await self.find_all(match_id=match_id)

    def get_full_match_result_query(self, *filters):
        return select(MatchResultModel).filter(*filters).options(
            joinedload(MatchResultModel.match),
            joinedload(MatchResultModel.player),
        )

    async def get_full_match_result(self, *filters):
        result = await self.session.execute(self.get_full_match_result_query(*filters))
        return result.scalar_one_or_none()

    async def get_full_matches_results(self, *filters):
        result = await self.session.execute(self.get_full_match_result_query(*filters))
        return result.scalars().all()
