from enum import IntEnum

from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable
from sqlalchemy import (
    Column,
    Enum,
    Boolean,
    BigInteger,
    String,
    Text,
    Date, Integer,
)
from sqlalchemy.orm import relationship

from backlib.databases import BaseOrmModel


class UserRoles(IntEnum):
    """ Enumeration of all users roles. """
    PLAYER = 1
    ORGANIZER = 2
    ADMIN = 3


class UserModel(SQLAlchemyBaseUserTable[int], BaseOrmModel):
    """ Model representing user in the system. """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(Text, nullable=False, doc="User Name")
    surname = Column(Text, nullable=False, doc="User Surname")

    birth_date = Column(Date, nullable=False, doc="Birth Date")

    username = Column(Text, nullable=False, unique=True, doc="Username")
    email = Column(Text, nullable=False, index=True, unique=True, doc="Email")

    country = Column(Text, nullable=True, doc="Country")
    city = Column(Text, nullable=True, doc="City")

    tg_login = Column(Text, nullable=True, unique=True, doc="Telegram Login")
    chat_id = Column(BigInteger, nullable=True, unique=True, doc="Telegram Chat ID")

    role = Column(Enum(UserRoles), default=UserRoles.PLAYER, nullable=False, doc="User Role")

    hashed_password: str = Column(String(length=1024), nullable=False, doc="Password Hash")

    is_active: bool = Column(Boolean, default=True, nullable=False, doc="Is User Active?")
    is_verified: bool = Column(Boolean, default=False, nullable=False, doc="Is User Verified?")
    is_superuser: bool = Column(Boolean, default=False, nullable=False, doc="Is Super User?")

    system_roles = relationship(
        "SystemUserRoleModel",
        back_populates="user",
    )
    tournament_roles = relationship(
        "TournamentUserRoleModel",
        back_populates="user",
    )
    community_roles = relationship(
        "CommunityUserRoleModel",
        back_populates="user",
    )
