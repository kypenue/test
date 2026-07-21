""" Models for tournaments. """
import uuid
from enum import IntEnum, StrEnum

from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    Text,
    DateTime,
    Boolean,
    Enum,
    UUID, false,
)
from sqlalchemy.orm import relationship

from backlib.databases import BaseOrmModel


class LifecycleTournamentStatus(IntEnum):
    """ Enum representing manual tournament statuses. """
    REGISTRATION_NOT_STARTED = 1
    REGISTRATION_OPENED = 2
    REGISTRATION_CLOSED = 3
    TOURNAMENT_STARTED = 4
    TOURNAMENT_ENDED = 5
    TOURNAMENT_ARCHIVED = 6
    TEAM_DRAW_STARTED = 7
    TEAM_DRAW_ENDED = 8


class RegistrationTypes(StrEnum):
    MANUAL = "MANUAL"
    REGISTRATION = "REGISTRATION"


class TournamentPaymentType(StrEnum):
    FREE = "FREE"
    PAYED = "PAYED"
    PAYED_COMMUNITY = "PAYED_COMMUNITY"


class TournamentModel(BaseOrmModel):
    """ Model representing tournament. """
    __tablename__ = "tournaments"

    id = Column(
        Integer,
        primary_key=True,
    )

    name = Column(
        Text,
        nullable=False,
        doc="Name",
    )
    description = Column(
        Text,
        nullable=True,
        doc="Description",
    )

    lifecycle_status = Column(
        Enum(LifecycleTournamentStatus),
        nullable=True,
        doc="Lifecycle Status",
    )

    tournament_format = Column(
        Text,
        nullable=True,
        doc="Tournament Format",
    )
    rules_info = Column(
        Text,
        nullable=True,
        doc="Rules Info",
    )
    regulation = Column(
        Text,
        nullable=True,
        doc="Regulation",
    )
    contacts_info = Column(
        Text,
        nullable=True,
        doc="Contacts Info",
    )

    creator_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        doc="Creator ID",
    )
    creator = relationship(
        "UserModel",
        backref="tournaments",
    )

    game_id = Column(
        Integer,
        ForeignKey("games.id"),
        nullable=False,
        doc="Game ID",
    )
    game = relationship(
        "GameModel",
        backref="tournaments",
    )

    registration_type = Column(
        Enum(RegistrationTypes),
        default=RegistrationTypes.REGISTRATION,
        nullable=True,
        doc="Registration Type",
    )
    registration_start = Column(
        DateTime(timezone=True),
        nullable=True,
        doc="Registration Start",
    )
    registration_end = Column(
        DateTime(timezone=True),
        nullable=True,
        doc="Registration End",
    )

    min_age = Column(
        Integer,
        nullable=False,
        doc="Minimum Age",
    )

    tournament_start = Column(
        DateTime(timezone=True),
        nullable=False,
        doc="Tournament Start",
    )
    tournament_end = Column(
        DateTime(timezone=True),
        nullable=False,
        doc="Tournament End",
    )

    participants_number = Column(
        Integer,
        nullable=True,
        doc="Participants Number",
    )
    should_limit_participants = Column(
        Boolean,
        nullable=True,
        doc="Should limit participants?",
    )

    is_auto_approval = Column(
        Boolean,
        nullable=False,
        default=False,
        doc="Is Auto Approval?",
    )

    teams_used = Column(
        Boolean,
        nullable=False,
        default=False,
        server_default=false(),
        doc="Are Teams Used?",
    )

    cover_image_id = Column(
        Integer,
        ForeignKey("uploads.id"),
        nullable=True,
        doc="Cover Image ID",
    )
    header_image_id = Column(
        Integer,
        ForeignKey("uploads.id"),
        nullable=True,
        doc="Header Image ID",
    )

    stages = relationship(
        "StageModel",
        back_populates="tournament",
        order_by="StageModel.order_number",
    )

    platforms = relationship(
        "PlatformModel",
        secondary="tournament_allowed_platforms",
        back_populates="tournaments",
    )

    cover_image = relationship(
        "UploadModel",
        foreign_keys="TournamentModel.cover_image_id",
        uselist=False,
    )
    header_image = relationship(
        "UploadModel",
        foreign_keys="TournamentModel.header_image_id",
        uselist=False,
    )

    community_id = Column(
        UUID,
        ForeignKey("communities.id"),
        nullable=True,
        doc="Community ID",
    )
    community = relationship(
        "CommunityModel",
        viewonly=True,
        backref="tournaments")
    is_primary = Column(
        Boolean,
        default=False,
        nullable=True,
        doc="Is primary tournament in community?",
    )

    payment_type = Column(
        Enum(TournamentPaymentType),
        default=TournamentPaymentType.PAYED,
        doc="Payment Type",
    )

    is_forecast_competition_allowed = Column(
        Boolean,
        server_default="false",
        default=False,
        nullable=False,
        doc="Is Forecast Competition Allowed?",
    )

    bet_step = Column(
        Integer,
        nullable=True,
        doc="Bet Step",
    )
    min_bet = Column(
        Integer,
        nullable=True,
        doc="Bet Step",
    )
    max_bet = Column(
        Integer,
        nullable=True,
        doc="Bet Step",
    )
    bet_duration_seconds = Column(
        Integer,
        nullable=True,
        doc="Bet Duration Seconds",
    )
    bet_extension_seconds = Column(
        Integer,
        nullable=True,
        doc="Bet Extension Seconds",
    )

    roles = relationship(
        "TournamentUserRoleModel",
        back_populates="tournament",
    )


class TournamentAllowedPlatformModel(BaseOrmModel):
    """ Model representing tournament allowed platforms. """
    __tablename__ = "tournament_allowed_platforms"

    id = Column(
        Integer,
        primary_key=True,
    )

    tournament_id = Column(
        Integer,
        ForeignKey("tournaments.id"),
        nullable=False,
        doc="Tournament ID",
    )
    tournament = relationship(
        "TournamentModel",
        backref="tournament_allowed_platforms",
        viewonly=True,
    )

    platform_id = Column(
        Integer,
        ForeignKey("platforms.id"),
        nullable=False,
        doc="Platform ID",
    )
    platform = relationship(
        "PlatformModel",
        backref="tournament_allowed_platforms",
        viewonly=True,
    )


class RegistrationStatus(IntEnum):
    """ Model representing registration status. """
    PENDING = 1
    DENIED = 2
    APPROVED = 3
    NOT_REGISTERED = 4


class TournamentRegisteredUserModel(BaseOrmModel):
    """ Model representing tournament registered user. """
    __tablename__ = "tournament_registered_users"

    id = Column(
        Integer,
        primary_key=True,
    )

    tournament_id = Column(
        Integer,
        ForeignKey("tournaments.id"),
        nullable=False,
        doc="Tournament ID",
    )
    tournament = relationship(
        "TournamentModel",
        backref="registrations",
    )

    account_id = Column(
        Integer, ForeignKey("gamers.id"),
        nullable=False,
        doc="Account ID",
    )
    account = relationship(
        "AccountModel",
        backref="registrations",
    )

    status = Column(
        Enum(RegistrationStatus),
        nullable=False,
        doc="Status",
    )

    team_id = Column(
        UUID,
        ForeignKey("teams.id"),
        nullable=True,
        doc="Team ID",
    )
    team = relationship(
        "TeamModel",
        backref="participants",
    )


class TournamentRoleTypes(StrEnum):
    ORGANIZER = "ORGANIZER"
    MODERATOR = "MODERATOR"


class TournamentUserRoleModel(BaseOrmModel):
    __tablename__ = "tournament_user_roles"

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
        back_populates="tournament_roles",
    )

    tournament_id = Column(
        Integer,
        ForeignKey("tournaments.id"),
        nullable=False,
        doc="Tournament ID",
    )
    tournament = relationship(
        "TournamentModel",
        back_populates="roles",
    )

    role_type = Column(
        Enum(TournamentRoleTypes),
        nullable=False,
        doc="Role Type",
    )


class UserBlockModel(BaseOrmModel):
    """ Model representing user block. """
    __tablename__ = "user_blocks"

    id = Column(
        Integer,
        primary_key=True,
    )

    blocked_until = Column(
        DateTime(timezone=True),
        nullable=True,
        doc="Blocked Until",
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        doc="User ID",
    )
    user = relationship(
        argument="UserModel",
        backref="blockers",
        foreign_keys="UserBlockModel.user_id",
    )

    creator_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        doc="Creator ID",
    )
    creator = relationship(
        argument="UserModel",
        backref="blocked_users",
        foreign_keys="UserBlockModel.creator_id",
    )
