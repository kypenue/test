from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from cuply.series.schemas.series import SeriesReadSchema


class SingleEliminationSeriesShortReadSchema(BaseModel):
    id: UUID
    short_id: str

    model_config = ConfigDict(from_attributes=True)


class SingleEliminationSeriesReadSchema(BaseModel):
    id: UUID

    series: SeriesReadSchema

    short_id: str

    next_winner: Optional[SingleEliminationSeriesShortReadSchema]

    model_config = ConfigDict(from_attributes=True)
