from typing import List

from sqlalchemy import select

from backlib.repos import BaseAsyncRepo
from cuply.series.models import SESeriesModel
from cuply.stages.models import (
    SingleEliminationStageRoundModel,
)


class SESeriesModelAsyncRepo(BaseAsyncRepo):
    model = SESeriesModel

    async def find_all_in_round(self, round_id) -> List[SESeriesModel]:
        query = select(self.model).join(
            SingleEliminationStageRoundModel, SingleEliminationStageRoundModel.id == SESeriesModel.round_id
        ).filter(SingleEliminationStageRoundModel.id==round_id)
        res = await self.session.execute(query)
        return [row for row in res.unique().scalars()]
