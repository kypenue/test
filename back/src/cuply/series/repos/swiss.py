from typing import List

from sqlalchemy import select

from backlib.repos import BaseSyncRepo, BaseAsyncRepo
from cuply.series.models import SwissSeriesModel
from cuply.stages.models import (
    SwissStageSeriesGroupModel,
    SwissStageRoundModel,
)


class SwissSeriesModelSyncRepo(BaseSyncRepo):
    model = SwissSeriesModel


class SwissSeriesModelAsyncRepo(BaseAsyncRepo):
    model = SwissSeriesModel

    async def find_all_in_round(self, round_id) -> List[SwissSeriesModel]:
        query = select(self.model).join(
            SwissStageSeriesGroupModel, SwissStageSeriesGroupModel.id == SwissSeriesModel.swiss_series_group_id
        ).join(
            SwissStageRoundModel, SwissStageRoundModel.id == SwissStageSeriesGroupModel.round_id
        ).filter(SwissStageRoundModel.id==round_id)
        res = await self.session.execute(query)
        return [row for row in res.unique().scalars()]
