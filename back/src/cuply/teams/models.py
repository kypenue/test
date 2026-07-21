import uuid
from enum import StrEnum

from sqlalchemy import Column, ForeignKey, Enum, UUID, Integer, Text, DateTime, JSON
from sqlalchemy.orm import relationship

from backlib.databases import BaseOrmModel


class TeamAccessTypes(StrEnum):
    PUBLIC = "PUBLIC"
    PRIVATE = "PRIVATE"
    TOURNAMENT = "TOURNAMENT"
    TOURNAMENT_INTERNAL = "TOURNAMENT_INTERNAL"


class TeamModel(BaseOrmModel):
    __tablename__ = "teams"

    id = Column(
        UUID,
        primary_key=True,
        default=uuid.uuid4,
        doc="ID",
    )

    name = Column(
        Text,
        doc="Name",
    )
    access_type = Column(
        Enum(TeamAccessTypes),
        doc="Team access type",
    )

    image_id = Column(
        Integer,
        ForeignKey("uploads.id"),
        nullable=True,
        doc="Image",
    )
    image = relationship(
        "UploadModel",
        foreign_keys="TeamModel.image_id",
    )

    creator_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
        doc="Creator ID",
    )
    creator = relationship(
        "UserModel",
        backref="created_teams",
        foreign_keys="TeamModel.creator_id",
    )

    tournament_id = Column(
        Integer,
        ForeignKey("tournaments.id"),
        nullable=True,
        doc="Tournament ID",
    )
    tournament = relationship(
        argument="TournamentModel",
        backref="teams",
    )

    source_team_id = Column(
        UUID,
        ForeignKey("teams.id", ondelete="SET NULL"),
        nullable=True,
        doc="Source Team ID",
    )
    source_team = relationship(
        "TeamModel",
        remote_side=[id],
    )

    game_id = Column(
        Integer,
        ForeignKey("games.id"),
        nullable=False,
        doc="Game ID",
    )
    game = relationship(
        "GameModel",
        backref="teams",
    )

    auction_deadline = Column(
        DateTime,
        nullable=True,
        doc="Auction Deadline",
    )

    auction_bets = relationship(
        "AuctionBetModel",
        back_populates="team",
    )


class AuctionBetModel(BaseOrmModel):
    __tablename__ = "auction_bets"

    id = Column(
        UUID,
        primary_key=True,
        default=uuid.uuid4,
        doc="ID",
    )

    bet = Column(
        Integer,
        doc="Bet",
    )

    team_id = Column(
        UUID,
        ForeignKey("teams.id"),
        nullable=True,
        doc="Source Team ID",
    )
    team = relationship(
        "TeamModel",
        back_populates="auction_bets",
    )

    participant_id = Column(
        Integer,
        ForeignKey("tournament_registered_users.id"),
        nullable=True,
        doc="Creator ID",
    )
    participant = relationship(
        "TournamentRegisteredUserModel",
        backref="auction_bets",
    )


class WebSocketTeamMessageModel(BaseOrmModel):
    __tablename__ = "websocket_team_messages"

    id = Column(
        UUID,
        primary_key=True,
        default=uuid.uuid4,
        doc="ID",
    )

    tournament_id = Column(
        Integer,
        ForeignKey("tournaments.id"),
        index=True,
        doc="Tournament ID",
    )

    value = Column(
        JSON,
        nullable=True,
        doc="Value",
    )

    deliveries = relationship(
        "WebSocketTeamMessageDeliveryModel",
        back_populates="message",
    )


class WebSocketTeamMessageDeliveryModel(BaseOrmModel):
    __tablename__ = "websocket_team_message_deliveries"

    id = Column(
        UUID,
        primary_key=True,
        default=uuid.uuid4,
        doc="ID",
    )

    worker_id = Column(
        UUID,
        index=True,
        doc="Worker ID",
    )

    message_id = Column(
        UUID,
        ForeignKey("websocket_team_messages.id"),
        index=True,
        doc="Message ID",
    )
    message = relationship(
        "WebSocketTeamMessageModel",
        back_populates="deliveries",
    )
