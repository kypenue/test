import uuid
from enum import StrEnum

from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    Enum,
    UUID,
)
from sqlalchemy.orm import relationship

from backlib.databases import BaseOrmModel


class SystemRoleTypes(StrEnum):
    ADMIN = "ADMIN"
    TOURNAMENT_CREATOR = "TOURNAMENT_CREATOR"
    COMMUNITY_CREATOR = "COMMUNITY_CREATOR"


class SystemUserRoleModel(BaseOrmModel):
    __tablename__ = "system_user_roles"

    id = Column(
        UUID,
        primary_key=True,
        default=uuid.uuid4,
        doc="ID",
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        doc="User ID",
    )
    user = relationship(
        "UserModel",
        back_populates="system_roles",
    )

    role_type = Column(
        Enum(SystemRoleTypes),
        nullable=False,
        doc="Role Type",
    )
