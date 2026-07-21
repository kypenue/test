from uuid import UUID

from pydantic import BaseModel, ConfigDict

from cuply.series.schemas.series import SeriesReadSchema


class SwissSeriesFullReadSchema(BaseModel):
    id: UUID

    series: SeriesReadSchema

    model_config = ConfigDict(from_attributes=True)
