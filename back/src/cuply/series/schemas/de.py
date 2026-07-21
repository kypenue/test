from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from cuply.series.models import DESeriesBranchType
from cuply.series.schemas.series import SeriesReadSchema


class DoubleEliminationSeriesShortReadSchema(BaseModel):
    id: UUID
    branch_type: DESeriesBranchType
    short_id: str

    model_config = ConfigDict(from_attributes=True)


class DoubleEliminationSeriesReadSchema(BaseModel):
    id: UUID

    series: SeriesReadSchema

    branch_type: DESeriesBranchType

    short_id: str

    next_winner: Optional[DoubleEliminationSeriesShortReadSchema]
    next_loser: Optional[DoubleEliminationSeriesShortReadSchema]

    model_config = ConfigDict(from_attributes=True)
