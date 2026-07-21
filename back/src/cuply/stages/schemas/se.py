from typing import List
from uuid import UUID

from pydantic import BaseModel, ConfigDict, field_validator
from pydantic_core.core_schema import ValidationInfo

from cuply.series.schemas.se import SingleEliminationSeriesReadSchema
from cuply.stages.models import SingleEliminationStageRoundStatuses


class SingleEliminationStageRoundReadSchema(BaseModel):
    id: UUID
    round_number: int
    status: SingleEliminationStageRoundStatuses

    model_config = ConfigDict(from_attributes=True)


class SingleEliminationStageRoundFullReadSchema(SingleEliminationStageRoundReadSchema):
    series: List[SingleEliminationSeriesReadSchema]


class SingleEliminationStageReadSchema(BaseModel):
    """ Single elimination stage read schema. """
    id: UUID

    game_number: int
    final_game_number: int

    model_config = ConfigDict(from_attributes=True)


class SingleEliminationStageFullReadSchema(SingleEliminationStageReadSchema):
    """ Single elimination stage read schema. """
    rounds: List[SingleEliminationStageRoundReadSchema]


class SingleEliminationStageCreateSchema(BaseModel):
    """ Single elimination stage create schema. """
    game_number: int
    final_game_number: int

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
