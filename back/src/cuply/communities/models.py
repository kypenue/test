# communities/models.py
import uuid
from enum import StrEnum

from sqlalchemy import Column, Integer, Text, ForeignKey, JSON, UUID, Enum
from sqlalchemy.orm import relationship
from backlib.databases import BaseOrmModel


class CommunityModel(BaseOrmModel):
    """
    Модель сообщества/пространства.
    """
    __tablename__ = "communities"

    id = Column(
        UUID,
        primary_key=True,
        default=uuid.uuid4,
        doc="ID",
    )
    title = Column(Text, nullable=False, doc="Название")
    description = Column(Text, nullable=True, doc="Описание")

    avatar_id = Column(Integer, ForeignKey("uploads.id"), nullable=True, doc="Avatar FK")
    avatar = relationship(
        "UploadModel",
        foreign_keys="CommunityModel.avatar_id",
        uselist=False
    )

    header_id = Column(Integer, ForeignKey("uploads.id"), nullable=True, doc="Header FK")
    header = relationship(
        "UploadModel",
        foreign_keys="CommunityModel.header_id",
        uselist=False
    )

    social_links = Column(
        JSON,
        nullable=True,
        doc="Ссылки на соцсети (список строк в JSON)"
    )

    slug = Column(
        Text,
        nullable=True,
        unique=True,
        doc="Slug",
    )

    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False, doc="User ID")
    creator = relationship("UserModel", backref="communities")

    community_games = relationship("CommunityGameModel", back_populates="community")
    games = relationship(
        "GameModel",
        secondary="community_games",
        overlaps="community_games,game",
    )

    roles = relationship(
        "CommunityUserRoleModel",
        back_populates="community",
    )


class CommunityGameModel(BaseOrmModel):
    """
    Ассоциация между CommunityModel и GameModel (M2M).
    Каждая запись = одна привязка 'сообщество -> игра'.
    """
    __tablename__ = "community_games"

    id = Column(
        UUID,
        primary_key=True,
        default=uuid.uuid4,
        doc="ID",
    )

    community_id = Column(UUID, ForeignKey("communities.id"), nullable=False)
    game_id = Column(Integer, ForeignKey("games.id"), nullable=False)

    community = relationship(
        "CommunityModel",
        back_populates="community_games",
        overlaps="games"
    )
    game = relationship(
        "GameModel",
        back_populates="community_games",
        overlaps="games"
    )


class CommunityRoleTypes(StrEnum):
    ORGANIZER = "ORGANIZER"
    MODERATOR = "MODERATOR"


class CommunityUserRoleModel(BaseOrmModel):
    __tablename__ = "community_user_roles"

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
        back_populates="community_roles",
    )

    community_id = Column(
        UUID,
        ForeignKey("communities.id"),
        nullable=False,
        doc="Community ID",
    )
    community = relationship(
        "CommunityModel",
        back_populates="roles",
    )

    role_type = Column(
        Enum(CommunityRoleTypes),
        nullable=False,
        doc="Role Type",
    )
