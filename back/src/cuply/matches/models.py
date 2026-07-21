import uuid
from enum import IntEnum

from sqlalchemy import Column, UUID, ForeignKey, Integer, Enum, Text
from sqlalchemy.orm import relationship

from backlib.databases import BaseOrmModel


class MatchStatus(IntEnum):
    INITIAL_ACTIVE = 1
    INITIAL_DISABLED = 2
    WAITING_CONFIRMATION_FROM_HOME_PLAYER = 3
    WAITING_CONFIRMATION_FROM_GUEST_PLAYER = 4
    CONTRADICTION_IN_RESULT = 5
    CONFIRMED = 6
    NOT_NECESSARY = 7
    CONFIRMED_BY_CRON = 8
    CONFIRMED_BY_ORGANIZER = 9
    ADVANTAGE = 10


class MatchModel(BaseOrmModel):
    __tablename__ = "series_matches"

    id = Column(
        UUID,
        default=uuid.uuid4,
        primary_key=True,
        doc="ID",
    )

    series_id = Column(
        UUID,
        ForeignKey("series.id"),
        nullable=True,
        doc="Series ID",
    )
    series = relationship(
        argument="SeriesModel",
        back_populates="matches",
        foreign_keys="MatchModel.series_id",
    )

    tournament_id = Column(
        Integer,
        ForeignKey("tournaments.id"),
        index=True,
        nullable=True,
        doc="Tournament ID",
    )

    stage_id = Column(
        UUID,
        ForeignKey("tournament_stages.id"),
        nullable=True,
        doc="Stage ID",
    )

    match_number = Column(
        Integer,
        nullable=True,
        doc="Match Number",
    )
    status = Column(
        Enum(MatchStatus),
        nullable=False,
        doc="Status",
    )

    home_player_id = Column(
        Integer,
        ForeignKey("gamers.id"),
        nullable=True,
        doc="Home Player ID",
    )
    home_player_account = relationship(
        argument="AccountModel",
        backref="home_matches",
        foreign_keys="MatchModel.home_player_id",
    )

    home_participant_id = Column(
        Integer,
        ForeignKey("tournament_registered_users.id"),
        nullable=True,
    )
    home_participant = relationship(
        argument="TournamentRegisteredUserModel",
        backref="home_participant_matches",
        foreign_keys="MatchModel.home_participant_id",
    )

    guest_player_id = Column(
        Integer,
        ForeignKey("gamers.id"),
        nullable=True,
        doc="Guest Player ID",
    )
    guest_player_account = relationship(
        argument="AccountModel",
        backref="guest_matches",
        foreign_keys="MatchModel.guest_player_id",
    )

    guest_participant_id = Column(
        Integer,
        ForeignKey("tournament_registered_users.id"),
        nullable=True,
    )
    guest_participant = relationship(
        argument="TournamentRegisteredUserModel",
        backref="guest_participant_matches",
        foreign_keys="MatchModel.guest_participant_id",
    )

    result = relationship(
        "MatchResultModel",
        back_populates="match",
        uselist=False,
    )


class MatchResultModel(BaseOrmModel):
    __tablename__ = "match_results"

    id = Column(
        UUID,
        default=uuid.uuid4,
        primary_key=True,
        doc="ID",
    )

    match_id = Column(
        UUID,
        ForeignKey("series_matches.id"),
        nullable=False,
        doc="Match ID",
    )
    match = relationship(
        "MatchModel",
        back_populates="result",
    )

    player_id = Column(
        Integer,
        ForeignKey("users.id"),
        index=True,
        nullable=False,
        doc="Player ID",
    )
    player = relationship(
        "UserModel",
        backref="match_results",
        lazy="joined",
    )

    home_score = Column(
        Integer,
        nullable=False,
        doc="Home Score",
    )
    guest_score = Column(
        Integer,
        nullable=False,
        doc="Guest Score",
    )
    video_link = Column(
        Text,
        nullable=True,
        doc="Video Link",
    )


class MatchComplaintStatus(IntEnum):
    OPEN = 1
    IN_PROGRESS = 2
    REJECTED = 3
    CLOSED = 4


class MatchComplaintCreation(IntEnum):
    PLAYER_MANUAL = 1
    AUTO = 2


class MatchComplaintModel(BaseOrmModel):
    __tablename__ = "match_complaints"

    id = Column(
        UUID,
        default=uuid.uuid4,
        primary_key=True,
        doc="ID",
    )

    tournament_id = Column(
        Integer,
        ForeignKey("tournaments.id"),
        index=True,
        nullable=False,
        doc="Tournament ID",
    )
    tournament = relationship(
        "TournamentModel",
        backref="tournament_complaints",
    )

    match_id = Column(
        UUID,
        ForeignKey("series_matches.id"),
        index=True,
        nullable=False,
        doc="Match ID",
    )
    match = relationship(
        "MatchModel",
        backref="match_complaints",
    )

    series_id = Column(
        UUID,
        ForeignKey("series.id"),
        index=True,
        nullable=True,
        doc="Series ID",
    )
    series = relationship(
        argument="SeriesModel",
        backref="series_complaints",
        foreign_keys="MatchComplaintModel.series_id",
    )

    author_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        doc="Author ID",
    )
    author = relationship(
        argument="UserModel",
        backref="user_match_complaints",
        lazy="joined",
    )

    comment = Column(
        Text,
        nullable=False,
        doc="Comment",
    )
    resolution_text = Column(
        Text,
        nullable=True,
        doc="Resolution text",
    )

    status = Column(
        Enum(MatchComplaintStatus),
        nullable=False,
        doc="Status",
    )
    creation_way = Column(
        Enum(MatchComplaintCreation),
        nullable=False,
        doc="Creation Way",
    )
