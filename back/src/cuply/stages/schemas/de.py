from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel, ConfigDict, field_validator
from pydantic_core.core_schema import ValidationInfo

from cuply.series.schemas.de import DoubleEliminationSeriesReadSchema
from cuply.stages.models import DoubleEliminationStageRoundStatuses


class DoubleEliminationStageRoundReadSchema(BaseModel):
    id: UUID
    round_number: int
    status: DoubleEliminationStageRoundStatuses

    model_config = ConfigDict(from_attributes=True)


class DoubleEliminationStageRoundFullReadSchema(DoubleEliminationStageRoundReadSchema):
    series: List[DoubleEliminationSeriesReadSchema]


class DoubleEliminationStageReadSchema(BaseModel):
    """ Double elimination stage read schema. """
    id: UUID

    game_number: int
    final_game_number: int

    winner_bracket_advantage: bool

    model_config = ConfigDict(from_attributes=True)


class DoubleEliminationStageFullReadSchema(DoubleEliminationStageReadSchema):
    """ Double elimination stage read schema. """
    rounds: List[DoubleEliminationStageRoundReadSchema]


class DoubleEliminationStageCreateSchema(BaseModel):
    """ Double elimination stage create schema. """
    game_number: int
    final_game_number: int

    winner_bracket_advantage: bool

    @field_validator("game_number")
    def check_game_number(cls, value, info: ValidationInfo):
        if value % 2 == 0:
            raise ValueError("Game number must be an even number")
        if value <= 0:
            raise ValueError("Game number must be positive")
        return value

    @field_validator("final_game_number")
    def check_final_game_number(cls, value, info: ValidationInfo):
        if value % 2 == 0:
            raise ValueError("Game number must be an even number")
        if value <= 0:
            raise ValueError("Game number must be positive")
        return value
