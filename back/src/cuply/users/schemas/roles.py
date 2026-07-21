import uuid

from pydantic import BaseModel, ConfigDict

from cuply.auth.schemas import UserReadSchema
from cuply.users.models import SystemRoleTypes


class SystemUserRoleReadSchema(BaseModel):
    id: uuid.UUID

    user: UserReadSchema

    role_type: SystemRoleTypes

    model_config = ConfigDict(from_attributes=True)


class SystemUserRoleCreateSchema(BaseModel):
    user_id: int

    role_type: SystemRoleTypes
