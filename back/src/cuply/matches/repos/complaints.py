from uuid import UUID

from sqlalchemy import select, or_

from backlib.repos import BaseAsyncRepo, BaseSyncRepo
from cuply.matches.models import MatchComplaintModel


class MatchComplaintSyncRepo(BaseSyncRepo):
    model = MatchComplaintModel


class MatchComplaintAsyncRepo(BaseAsyncRepo):
    model = MatchComplaintModel

    async def find_matches_complaints(self, match_ids: set[UUID]) -> list[MatchComplaintModel]:
        query = select(MatchComplaintModel).filter(
            MatchComplaintModel.match_id.in_(match_ids)
        )
        res = await self.session.execute(query)
        res = [row[0] for row in res.all()]
        return res
