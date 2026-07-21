from typing import List

from sqlalchemy import select

from backlib.repos import BaseAsyncRepo
from cuply.series.models import DESeriesModel
from cuply.stages.models import (
    DoubleEliminationStageRoundModel,
)


class DESeriesModelAsyncRepo(BaseAsyncRepo):
    model = DESeriesModel

    async def find_all_in_round(self, round_id) -> List[DESeriesModel]:
        query = select(self.model).join(
            DoubleEliminationStageRoundModel, DoubleEliminationStageRoundModel.id == DESeriesModel.round_id
        ).filter(DoubleEliminationStageRoundModel.id==round_id)
        res = await self.session.execute(query)
        return [row for row in res.unique().scalars()]
