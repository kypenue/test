""" Schemas for accounts models. """
import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from cuply.auth.schemas import UserShortReadWithAddressesSchema, UserWithTgReadSchema, UserShortReadSchema
from cuply.games.schemas import GameShortReadSchema
from cuply.platforms.schemas import PlatformShortReadSchema


class AccountReadSchema(BaseModel):
    """ Read schema for AccountModel. """
    id: int
    game: GameShortReadSchema
    platform: PlatformShortReadSchema
    login: str
    user: UserShortReadWithAddressesSchema
    created_at: datetime.datetime
    updated_at: datetime.datetime
    rating: Optional[float]

    model_config = ConfigDict(from_attributes=True)


class AccountReadWithUserShortSchema(BaseModel):
    """ Read schema for AccountModel. """
    id: int
    game: GameShortReadSchema
    platform: PlatformShortReadSchema
    login: str
    user: UserShortReadSchema
    created_at: datetime.datetime
    updated_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


class AccountWithTgReadSchema(BaseModel):
    """ Read schema for AccountModel with tg login. """
    id: int
    game: GameShortReadSchema
    platform: PlatformShortReadSchema
    login: str
    user: UserWithTgReadSchema
    created_at: datetime.datetime
    updated_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


class AccountCreateSchema(BaseModel):
    """ Create schema for AccountModel. """
    game_id: int
    platform_id: int
    login: str


class AccountUpdateSchema(BaseModel):
    """ Update schema for AccountModel. """
    login: str


class AccountRatingReadSchema(BaseModel):
    """ Схема для отображения строки рейтинга аккаунта. """
    position: int
    rating: float
    login: str
    games_count: int
    game_name: Optional[str]

