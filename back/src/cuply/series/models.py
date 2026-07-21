import uuid
from enum import StrEnum

from sqlalchemy import Column, Integer, Enum, ForeignKey, UUID, String, Text
from sqlalchemy.orm import relationship

from backlib.databases import BaseOrmModel


class SeriesStatus(StrEnum):
    NOT_ASSIGNED = "NOT_ASSIGNED"
    PLAYING = "PLAYING"
    PLAYED = "PLAYED"
    WALK_OVER = "WALK_OVER"


class SeriesModel(BaseOrmModel):
    __tablename__ = "series"

    id = Column(
        UUID,
        primary_key=True,
        default=uuid.uuid4,
        doc="ID",
    )

    gamer1_id = Column(
        Integer,
        ForeignKey("gamers.id"),
        nullable=True,
        doc="Gamer1 ID",
    )
    gamer1 = relationship(
        argument="AccountModel",
        backref="gamer1_series",
        foreign_keys="SeriesModel.gamer1_id",
    )

    participant1_id = Column(
        Integer,
        ForeignKey("tournament_registered_users.id"),
        nullable=True,
    )
    participant1 = relationship(
        argument="TournamentRegisteredUserModel",
        backref="participant1_series",
        foreign_keys="SeriesModel.participant1_id",
    )

    gamer2_id = Column(
        Integer, ForeignKey("gamers.id"),
        nullable=True,
        doc="Gamer2 ID",
    )
    gamer2 = relationship(
        argument="AccountModel",
        backref="gamer2_series",
        foreign_keys="SeriesModel.gamer2_id",
    )

    participant2_id = Column(
        Integer,
        ForeignKey("tournament_registered_users.id"),
        nullable=True,
    )
    participant2 = relationship(
        argument="TournamentRegisteredUserModel",
        backref="participant2_series",
        foreign_keys="SeriesModel.participant2_id",
    )

    gamer1_score = Column(
        Integer,
        nullable=True,
        default=0,
        doc="Gamer1 Score",
    )
    gamer2_score = Column(
        Integer,
        nullable=True,
        default=0,
        doc="Gamer2 Score",
    )

    tournament_id = Column(
        Integer,
        ForeignKey("tournaments.id"),
        index=True,
        nullable=False,
        doc="Tournament ID",
    )
    tournament = relationship(
        argument="TournamentModel",
        backref="series",
    )

    status = Column(
        Enum(SeriesStatus),
        nullable=False,
        server_default=SeriesStatus.NOT_ASSIGNED,
        doc="Status",
    )

    stage_id = Column(
        UUID,
        ForeignKey("tournament_stages.id"),
        index=True,
        nullable=False,
        doc="Stage ID",
    )
    stage = relationship(
        argument="StageModel",
        back_populates="series",
        uselist=False,
    )

    se_series = relationship(
        "SESeriesModel",
        back_populates="series",
        uselist=False,
    )
    de_series = relationship(
        "DESeriesModel",
        back_populates="series",
        uselist=False,
    )
    swiss_series = relationship(
        "SwissSeriesModel",
        back_populates="series",
        uselist=False,
    )
    wildcard_series = relationship(
        "WildcardSeriesModel",
        back_populates="series",
        uselist=False,
    )

    matches = relationship(
        "MatchModel",
        back_populates="series",
        order_by="MatchModel.match_number",
    )

    series_forecast_competition_bets = relationship(
        "ForecastCompetitionBetModel",
        back_populates="series",
    )


class SESeriesModel(BaseOrmModel):
    """ Model representing tournament series for single elimination. """
    __tablename__ = "se_series"

    id = Column(
        UUID,
        primary_key=True,
        default=uuid.uuid4,
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
        back_populates="se_series",
    )

    short_id = Column(
        String,
        nullable=False,
        doc="Short ID",
    )

    round_id = Column(
        UUID,
        ForeignKey("se_rounds.id"),
        doc="Single Elimination Round ID",
    )
    round = relationship(
        argument="SingleEliminationStageRoundModel",
        back_populates="series",
    )

    next_winner_id = Column(
        UUID,
        ForeignKey("se_series.id"),
        nullable=True,
        doc="Next Winner Series ID",
    )
    next_winner = relationship(
        argument="SESeriesModel",
        backref="winners_series",
        remote_side="SESeriesModel.id",
        foreign_keys=[next_winner_id],
    )


class DESeriesBranchType(StrEnum):
    """ Enum representing branch type for double elimination series. """
    WINNER = "WINNER"
    LOSER = "LOSER"


class DESeriesModel(BaseOrmModel):
    """ Model representing tournament series for double elimination. """
    __tablename__ = "tournament_de_series"

    id = Column(
        UUID,
        primary_key=True,
        default=uuid.uuid4,
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
        back_populates="de_series",
    )

    short_id = Column(
        String,
        nullable=False,
        doc="Short ID",
    )

    branch_type = Column(
        Enum(DESeriesBranchType),
        doc="Branch Type",
    )

    round_id = Column(
        UUID,
        ForeignKey("de_rounds.id"),
        doc="Double Elimination Round ID",
    )
    round = relationship(
        argument="DoubleEliminationStageRoundModel",
        back_populates="series",
    )

    next_winner_id = Column(
        UUID,
        ForeignKey("tournament_de_series.id"),
        nullable=True,
        doc="Next Winner Series ID",
    )
    next_winner = relationship(
        argument="DESeriesModel",
        backref="winners_series",
        remote_side="DESeriesModel.id",
        foreign_keys=[next_winner_id],
    )

    next_loser_id = Column(
        UUID,
        ForeignKey("tournament_de_series.id"),
        nullable=True,
        doc="Next Loser Series ID",
    )
    next_loser = relationship(
        argument="DESeriesModel",
        backref="loosers_series",
        remote_side="DESeriesModel.id",
        foreign_keys=[next_loser_id],
    )


class SwissSeriesModel(BaseOrmModel):
    __tablename__ = "swiss_series"

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
        back_populates="swiss_series",
    )

    swiss_series_group_id = Column(
        UUID,
        ForeignKey("swiss_series_groups.id"),
        doc="Swiss Series Group ID",
    )
    swiss_series_group = relationship(
        argument="SwissStageSeriesGroupModel",
        back_populates="series",
    )


class WildcardSeriesModel(BaseOrmModel):
    __tablename__ = "wildcard_series"

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
        back_populates="wildcard_series",
    )

    wildcard_round_id = Column(
        UUID,
        ForeignKey("wildcard_rounds.id"),
        doc="Wildcard Round ID",
    )
    wildcard_round = relationship(
        argument="WildcardStageRoundModel",
        back_populates="series",
    )


class SeriesFeedbackModel(BaseOrmModel):
    __tablename__ = "series_feedbacks"

    id = Column(
        UUID,
        default=uuid.uuid4,
        primary_key=True,
        doc="ID",
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
        backref="series_feedbacks",
        foreign_keys="SeriesFeedbackModel.series_id",
    )

    author_id = Column(
        Integer,
        ForeignKey("users.id"),
        index=True,
        nullable=False,
        doc="User ID",
    )
    author = relationship(
        argument="UserModel",
        backref="sent_series_feedbacks",
        foreign_keys="SeriesFeedbackModel.author_id",
    )

    opponent_id = Column(
        Integer,
        ForeignKey("users.id"),
        index=True,
        nullable=False,
        doc="Opponent ID",
    )
    opponent = relationship(
        argument="UserModel",
        backref="received_series_feedbacks",
        foreign_keys="SeriesFeedbackModel.opponent_id",
    )

    comment = Column(
        Text,
        nullable=True,
        doc="Comment",
    )
    opponent_mark = Column(
        Integer,
        nullable=False,
        doc="Mark",
    )


class ForecastCompetitionBetModel(BaseOrmModel):
    __tablename__ = "forecast_competition_bets"

    id = Column(
        UUID,
        primary_key=True,
        default=uuid.uuid4,
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
        back_populates="series_forecast_competition_bets",
        foreign_keys="ForecastCompetitionBetModel.series_id",
    )
    winner_id = Column(
        Integer,
        ForeignKey("gamers.id"),
        nullable=True,
        doc="Winner ID",
    )
    winner = relationship(
        argument="AccountModel",
        backref="account_forecast_competition_bets",
        foreign_keys="ForecastCompetitionBetModel.winner_id",
    )

    points = Column(
        Integer,
        default=0,
        nullable=False,
        doc="Points",
    )

    creator_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        doc="Creator ID",
    )
    creator = relationship(
        "UserModel",
        backref="created_forecast_competition_bets",
        foreign_keys="ForecastCompetitionBetModel.creator_id",
    )
