from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from cuply.accounts.schemas import AccountReadSchema
from cuply.auth.schemas import UserShortReadSchema
from cuply.series.schemas.series import SeriesReadSchema


class ForecastCompetitionBetWriteSchema(BaseModel):
    """ Write schema for ForecastCompetitionBetModel. """
    winner_id: int


class ForecastCompetitionBetReadSchema(BaseModel):
    """ Read schema for ForecastCompetitionBetModel. """
    id: UUID

    series: SeriesReadSchema
    winner: AccountReadSchema

    points: int

    creator: UserShortReadSchema

    model_config = ConfigDict(from_attributes=True)


class UserForecastCompetitionRatingReadSchema(BaseModel):
    """ Read schema for forecast competition rating. """
    user: UserShortReadSchema
    rating: int

    model_config = ConfigDict(from_attributes=True)


class ForecastCompetitionShortReadSchema(BaseModel):
    """ Read schema for ForecastCompetitionBetModel. """
    id: UUID
    winner: AccountReadSchema
    points: int

    model_config = ConfigDict(from_attributes=True)


class CurrentUserForecastCompetitionBetReadSchema(BaseModel):
    """ Read schema for current user bet in series. """
    status: str
    bet: Optional[ForecastCompetitionShortReadSchema]
