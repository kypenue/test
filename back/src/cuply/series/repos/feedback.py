from typing import List
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import joinedload

from backlib.repos import BaseAsyncRepo, BaseSyncRepo
from cuply.series.models import SeriesFeedbackModel


class SeriesFeedbackSyncRepo(BaseSyncRepo):
    model = SeriesFeedbackModel


class SeriesFeedbackAsyncRepo(BaseAsyncRepo):
    model = SeriesFeedbackModel

    async def find_feedback_by_series(
        self,
        series_id: UUID,
    ) -> List[SeriesFeedbackModel]:
        return await self.find_all(series_id=series_id)

    async def find_feedback_by_user_in_series(
        self,
        series_id: UUID,
        user_id: int,
    ) -> List[SeriesFeedbackModel]:
        return await self.find_all(series_id=series_id, opponent_id=user_id)

    def get_full_series_feedback_query(self, *filters):
        return select(SeriesFeedbackModel).filter(*filters).options(
            joinedload(SeriesFeedbackModel.author),
            joinedload(SeriesFeedbackModel.opponent),
        )

    async def get_full_series_feedback(self, *filters):
        result = await self.session.execute(self.get_full_series_feedback_query(*filters))
        return result.scalar_one_or_none()

    async def get_all_full_series_feedbacks(self, *filters):
        result = await self.session.execute(self.get_full_series_feedback_query(*filters))
        return result.scalars().all()
