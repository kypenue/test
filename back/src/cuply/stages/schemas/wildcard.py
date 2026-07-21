from typing import List, Optional
from uuid import UUID

from pydantic import ConfigDict, BaseModel, Field

from cuply.series.schemas.series import SeriesReadSchema
from cuply.stages.models import WildcardStageRoundStatuses


class WildCardsSeriesReadSchema(BaseModel):
    id: UUID

    series: SeriesReadSchema

    model_config = ConfigDict(from_attributes=True)


class WildcardStageReadSchema(BaseModel):
    """ Wildcard stage read schema. """
    id: UUID

    game_number: int

    model_config = ConfigDict(from_attributes=True)


class WildcardStageCreateSchema(BaseModel):
    """ Wildcard stage create schema. """
    game_number: int = Field(default=3, ge=0)


class WildcardStageRoundReadSchema(BaseModel):
    """ Wildcard stage group read schema. """
    id: UUID
    round_number: int
    status: Optional[WildcardStageRoundStatuses]

    model_config = ConfigDict(from_attributes=True)


class WildcardStageRoundFullReadSchema(WildcardStageRoundReadSchema):
    """ Wildcard stage round with groups read schema. """
    series: List[WildCardsSeriesReadSchema]


class WildcardStageFullReadSchema(WildcardStageReadSchema):
    """ Wildcard stage with rounds read schema. """
    rounds: List[WildcardStageRoundReadSchema]
