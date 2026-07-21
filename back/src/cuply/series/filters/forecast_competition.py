""" Filter forecast competition bets. """
import uuid
from typing import Optional

from fastapi_filter.contrib.sqlalchemy import Filter

from cuply.series.models import ForecastCompetitionBetModel


class ForecastCompetitionBetFilter(Filter):
    creator_id: Optional[int] = None
    winner_id: Optional[int] = None
    series_id: Optional[uuid.UUID] = None

    class Constants(Filter.Constants):
        model = ForecastCompetitionBetModel

    class Config:
        populate_by_name = True
