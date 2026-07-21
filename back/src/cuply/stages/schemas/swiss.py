from datetime import datetime
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel, ConfigDict, field_validator, Field, NonNegativeInt
from pydantic_core.core_schema import FieldValidationInfo

from cuply.accounts.schemas import AccountReadSchema
from cuply.series.schemas.series import SeriesReadSchema, TeamShortReadSchema
from cuply.series.schemas.swiss import SwissSeriesFullReadSchema
from cuply.stages.models import (
    SwissStageTypes,
    SwissStageRoundStatuses,
)


class SwissStageSeriesGroupFullReadSchema(BaseModel):
    """ Swiss stage group with series read schema. """
    id: UUID
    wins_number: int
    loses_number: int
    participants_number: int

    series: List[SwissSeriesFullReadSchema]

    model_config = ConfigDict(from_attributes=True)


class SwissStageRoundReadSchema(BaseModel):
    """ Swiss stage group read schema. """
    id: UUID
    round_number: int
    status: Optional[SwissStageRoundStatuses]

    model_config = ConfigDict(from_attributes=True)


class SwissStageRoundFullReadSchema(SwissStageRoundReadSchema):
    """ Swiss stage round with groups read schema. """
    series_groups: List[SwissStageSeriesGroupFullReadSchema]


class SwissStageReadSchema(BaseModel):
    """ Swiss stage read schema. """
    id: UUID

    stage_type: SwissStageTypes

    wins_needed: Optional[int]
    loses_needed: Optional[int]

    model_config = ConfigDict(from_attributes=True)


class SwissStageFullReadSchema(SwissStageReadSchema):
    """ Swiss stage with rounds read schema. """
    rounds: List[SwissStageRoundReadSchema]


class SwissStageCreateSchema(BaseModel):
    """ Swiss stage create schema. """
    stage_type: SwissStageTypes


class SwissStageUpdateSchema(BaseModel):
    """ Swiss stage update schema. """
    wins_needed: int
    loses_needed: int


class SeriesReadWithResultStatusSchema(SeriesReadSchema):
    created_at: datetime

    result_status: str = Field(default=None, validate_default=True)

    model_config = ConfigDict(from_attributes=True)

    @field_validator("result_status", mode="before")
    def generate_result_status(cls, value, info: FieldValidationInfo):
        if value:
            return value
        return info.context.get("result_status")

    def __hash__(self):
        return hash(str(self.id))


class SwissRatingReadSchema(BaseModel):
    """ Swiss rating read schema. """
    number: int
    account: AccountReadSchema

    team: TeamShortReadSchema | None

    status: str

    wins_number: int
    loses_number: int

    opponent_win_matches: int
    opponent_matches_number: int
    opponent_win_average: float

    opponent_matches_win_score: int
    opponent_matches_lose_score: int
    opponent_goals_difference_average: float

    series: List[SeriesReadWithResultStatusSchema]

    model_config = ConfigDict(from_attributes=True)


class SwissCalculatorDto(BaseModel):
    wins_count: NonNegativeInt
    losses_count: NonNegativeInt
    players_count: NonNegativeInt
