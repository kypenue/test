import datetime as dt
from typing import Optional

from fastapi_users import schemas
from pydantic import EmailStr, ConfigDict, BaseModel, Field, field_validator
from pydantic_core.core_schema import FieldValidationInfo

from cuply.users.models import SystemRoleTypes


class UserReadSchema(schemas.BaseUser[int]):
    """ Schema for getting full user information. """
    id: int
    name: str
    surname: str

    birth_date: dt.date

    email: EmailStr
    username: str

    country: Optional[str]
    city: Optional[str]

    tg_login: Optional[str]

    role: Optional[int]

    is_active: bool = True
    is_superuser: bool = False
    is_verified: bool = False

    created_at: dt.datetime
    updated_at: dt.datetime

    model_config = ConfigDict(from_attributes=True)


class UserWithRolesReadSchema(UserReadSchema):
    system_roles: list[SystemRoleTypes] = Field(default=None, validate_default=True)

    @field_validator("system_roles", mode="before")
    def generate_system_roles(cls, value, info: FieldValidationInfo):
        return info.context.get("system_roles")


class UserShortReadSchema(BaseModel):
    """ Schema for getting shortened user information. """
    id: int
    name: str
    surname: str
    username: str
    birth_date: dt.date

    model_config = ConfigDict(from_attributes=True)


class UserWithTgReadSchema(BaseModel):
    """ Schema for getting shortened user information. """
    id: int
    name: str
    surname: str
    username: str
    tg_login: Optional[str]

    model_config = ConfigDict(from_attributes=True)


class UserShortReadWithAddressesSchema(UserShortReadSchema):
    """ Schema for getting shortened user information with addresses. """
    city: Optional[str]
    country: Optional[str]
    tg_login: Optional[str]

    model_config = ConfigDict(from_attributes=True)


class UserCreateSchema(schemas.BaseUserCreate):
    """ Schema for user registration. """
    name: str
    surname: str
    birth_date: dt.date
    email: EmailStr
    username: str
    country: Optional[str] = None
    city: Optional[str] = None
    password: str


class UserUpdateSchema(BaseModel):
    """ Schema for updating user information. """
    name: Optional[str] = None
    surname: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    username: Optional[str] = None


class UserUpdateEmailSchema(BaseModel):
    """ Schema for updating user email. """
    email: EmailStr


class UserUpdatePasswordSchema(BaseModel):
    """ Schema for updating user password. """
    old_password: str
    new_password: str
