from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, model_validator, Field, field_validator
from pydantic_core.core_schema import FieldValidationInfo

from cuply.stages.models import (
    TournamentStageTypes,
    TournamentStageStatus,
)
from cuply.stages.schemas.swiss import (
    SwissStageReadSchema,
    SwissStageCreateSchema,
    SwissStageFullReadSchema,
)
from cuply.stages.schemas.de import (
    DoubleEliminationStageReadSchema,
    DoubleEliminationStageCreateSchema,
    DoubleEliminationStageFullReadSchema,
)
from cuply.stages.schemas.se import (
    SingleEliminationStageReadSchema,
    SingleEliminationStageCreateSchema,
    SingleEliminationStageFullReadSchema,
)
from cuply.stages.schemas.league import (
    LeagueStageReadSchema,
    LeagueStageCreateSchema,
)
from cuply.stages.schemas.wildcard import (
    WildcardStageReadSchema,
    WildcardStageCreateSchema, WildcardStageFullReadSchema,
)


class TournamentStageReadSchema(BaseModel):
    """ Tournament stage read schema. """
    id: UUID

    order_number: int

    status: TournamentStageStatus

    stage_type: TournamentStageTypes

    se_stage: Optional[SingleEliminationStageReadSchema]
    de_stage: Optional[DoubleEliminationStageReadSchema]
    swiss_stage: Optional[SwissStageReadSchema]
    league_stage: Optional[LeagueStageReadSchema]
    wildcard_stage: Optional[WildcardStageReadSchema]

    model_config = ConfigDict(from_attributes=True)


class TournamentStageFullReadSchema(TournamentStageReadSchema):
    """ Tournament stage with rounds and series read schema. """
    has_enough_data: Optional[bool] = Field(default=None, validate_default=True)

    se_stage: Optional[SingleEliminationStageFullReadSchema]
    de_stage: Optional[DoubleEliminationStageFullReadSchema]
    swiss_stage: Optional[SwissStageFullReadSchema]
    league_stage: Optional[LeagueStageReadSchema]
    wildcard_stage: Optional[WildcardStageFullReadSchema]

    @field_validator("has_enough_data", mode="before")
    def generate_has_enough_data(cls, value, info: FieldValidationInfo):
        return info.context.get('has_enough_data')


class TournamentStageCreateSchema(BaseModel):
    """ Tournament stage create schema. """
    order_number: int

    stage_type: TournamentStageTypes

    se_stage: Optional[SingleEliminationStageCreateSchema]
    de_stage: Optional[DoubleEliminationStageCreateSchema]
    swiss_stage: Optional[SwissStageCreateSchema]
    league_stage: Optional[LeagueStageCreateSchema]
    wildcard_stage: Optional[WildcardStageCreateSchema]

    @model_validator(mode="before")
    def check_stage_type(cls, values):
        type_to_field_mapping = {
            TournamentStageTypes.SINGLE_ELIMINATION: "se_stage",
            TournamentStageTypes.DOUBLE_ELIMINATION: "de_stage",
            TournamentStageTypes.SWISS: "swiss_stage",
            TournamentStageTypes.LEAGUE: "league_stage",
            TournamentStageTypes.WILDCARD: "wildcard_stage",
        }

        stage_type = values.get("stage_type")

        # clear other stages data
        stage_field = type_to_field_mapping[stage_type]
        other_stage_fields = set(type_to_field_mapping.values()) - {stage_field}
        for field in other_stage_fields:
            values[field] = None

        if values.get(stage_field) is None:
            raise ValueError(f"{stage_field} field is required when using {stage_type} stage type")

        return values
