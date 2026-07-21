import uuid
from enum import StrEnum

from sqlalchemy import Column, ForeignKey, Enum, UUID, Integer, Boolean
from sqlalchemy.orm import relationship

from backlib.databases import BaseOrmModel


class TournamentStageTypes(StrEnum):
    """ Tournament stage types."""
    SINGLE_ELIMINATION = "SINGLE_ELIMINATION"
    DOUBLE_ELIMINATION = "DOUBLE_ELIMINATION"
    SWISS = "SWISS"
    LEAGUE = "LEAGUE"
    WILDCARD = "WILDCARD"


class TournamentStageStatus(StrEnum):
    """ Tournament stage statuses."""
    STAGE_NOT_STARTED = "STAGE_NOT_STARTED"
    STAGE_STARTED = "STAGE_STARTED"
    STAGE_ENDED = "STAGE_ENDED"


class StageModel(BaseOrmModel):
    """ Model representing tournament stage."""
    __tablename__ = "tournament_stages"

    id = Column(
        UUID,
        primary_key=True,
        default=uuid.uuid4,
        doc="ID",
    )

    tournament_id = Column(
        Integer,
        ForeignKey("tournaments.id"),
        nullable=False,
        doc="Tournament ID",
    )
    tournament = relationship(
        argument="TournamentModel",
        back_populates="stages",
    )

    order_number = Column(
        Integer,
        nullable=False,
        doc="Order Number",
    )

    status = Column(
        Enum(TournamentStageStatus),
        nullable=False,
        server_default=TournamentStageStatus.STAGE_NOT_STARTED,
        doc="Stage Status",
    )

    stage_type = Column(
        Enum(TournamentStageTypes),
        nullable=False,
        doc="Stage Type",
    )

    se_stage = relationship(
        argument="SingleEliminationStageModel",
        back_populates="stage",
        uselist=False,
    )
    de_stage = relationship(
        argument="DoubleEliminationStageModel",
        back_populates="stage",
        uselist=False,
    )
    swiss_stage = relationship(
        argument="SwissStageModel",
        back_populates="stage",
        uselist=False,
    )
    league_stage = relationship(
        argument="LeagueStageModel",
        back_populates="stage",
        uselist=False,
    )
    wildcard_stage = relationship(
        argument="WildcardStageModel",
        back_populates="stage",
        uselist=False,
    )

    series = relationship(
        argument="SeriesModel",
        back_populates="stage",
    )

    participants = relationship(
        argument="StageParticipantModel",
        back_populates="stage",
    )


class SingleEliminationStageModel(BaseOrmModel):
    """ Model representing single elimination stage."""
    __tablename__ = "single_elimination_stages"

    id = Column(
        UUID,
        primary_key=True,
        default=uuid.uuid4,
        doc="ID",
    )

    stage_id = Column(
        UUID,
        ForeignKey("tournament_stages.id"),
        nullable=True,
        doc="Stage ID",
    )
    stage = relationship(
        argument="StageModel",
        back_populates="se_stage",
    )

    game_number = Column(
        Integer,
        nullable=False,
        doc="Game Number",
    )
    final_game_number = Column(
        Integer,
        nullable=False,
        doc="Final Game Number",
    )

    rounds = relationship(
        argument="SingleEliminationStageRoundModel",
        back_populates="se_stage",
        order_by="SingleEliminationStageRoundModel.round_number",
    )


class SingleEliminationStageRoundStatuses(StrEnum):
    """ Single elimination stage round statuses. """
    ROUND_NOT_STARTED = "ROUND_NOT_STARTED"
    WAITING_FOR_START = "WAITING_FOR_START"
    ROUND_STARTED = "ROUND_STARTED"
    ROUND_ENDED = "ROUND_ENDED"
    WAITING_FOR_DRAW = "WAITING_FOR_DRAW"
    DRAW_STARTED = "DRAW_STARTED"


class SingleEliminationStageRoundModel(BaseOrmModel):
    """ Model representing single elimination stage round."""
    __tablename__ = "se_rounds"

    id = Column(
        UUID,
        primary_key=True,
        default=uuid.uuid4,
        doc="ID",
    )

    round_number = Column(
        Integer,
        nullable=False,
        doc="Round Number",
    )

    status = Column(
        Enum(SingleEliminationStageRoundStatuses),
        default=SingleEliminationStageRoundStatuses.ROUND_NOT_STARTED,
        doc="Round Status",
    )

    se_stage_id = Column(
        UUID,
        ForeignKey('single_elimination_stages.id'),
        doc="Single Elimination Stage ID",
    )
    se_stage = relationship(
        argument="SingleEliminationStageModel",
        back_populates="rounds",
    )

    series = relationship(
        argument="SESeriesModel",
        order_by="desc(SESeriesModel.created_at)",
        back_populates="round",
    )


class DoubleEliminationStageModel(BaseOrmModel):
    """ Model representing double elimination stage."""
    __tablename__ = "double_elimination_stages"

    id = Column(
        UUID,
        primary_key=True,
        default=uuid.uuid4,
        doc="ID",
    )

    stage_id = Column(
        UUID,
        ForeignKey("tournament_stages.id"),
        nullable=True,
        doc="Stage ID",
    )
    stage = relationship(
        argument="StageModel",
        back_populates="de_stage",
    )

    game_number = Column(
        Integer,
        nullable=False,
        doc="Game Number",
    )
    final_game_number = Column(
        Integer,
        nullable=False,
        doc="Final Game Number",
    )

    winner_bracket_advantage = Column(
        Boolean,
        nullable=False,
        doc="Should Winner Have Advantage?",
    )

    rounds = relationship(
        argument="DoubleEliminationStageRoundModel",
        back_populates="de_stage",
        order_by="DoubleEliminationStageRoundModel.round_number",
    )


class DoubleEliminationStageRoundStatuses(StrEnum):
    """ Double elimination stage round statuses. """
    ROUND_NOT_STARTED = "ROUND_NOT_STARTED"
    WAITING_FOR_START = "WAITING_FOR_START"
    ROUND_STARTED = "ROUND_STARTED"
    ROUND_ENDED = "ROUND_ENDED"
    WAITING_FOR_DRAW = "WAITING_FOR_DRAW"
    DRAW_STARTED = "DRAW_STARTED"


class DoubleEliminationStageRoundModel(BaseOrmModel):
    """ Model representing double elimination stage round."""
    __tablename__ = "de_rounds"

    id = Column(
        UUID,
        primary_key=True,
        default=uuid.uuid4,
        doc="ID",
    )

    round_number = Column(
        Integer,
        nullable=False,
        doc="Round Number",
    )

    status = Column(
        Enum(DoubleEliminationStageRoundStatuses),
        default=DoubleEliminationStageRoundStatuses.ROUND_NOT_STARTED,
        doc="Round Status",
    )

    de_stage_id = Column(
        UUID,
        ForeignKey('double_elimination_stages.id'),
        doc="Double Elimination Stage ID",
    )
    de_stage = relationship(
        argument="DoubleEliminationStageModel",
        back_populates="rounds",
    )

    series = relationship(
        argument="DESeriesModel",
        order_by="desc(DESeriesModel.created_at)",
        back_populates="round",
    )


class WildcardStageModel(BaseOrmModel):
    """ Model representing wildcard stage."""
    __tablename__ = "wildcard_stages"

    id = Column(
        UUID,
        primary_key=True,
        default=uuid.uuid4,
        doc="ID",
    )

    stage_id = Column(
        UUID,
        ForeignKey("tournament_stages.id"),
        nullable=True,
        doc="Stage ID",
    )
    stage = relationship(
        argument="StageModel",
        back_populates="wildcard_stage",
    )

    game_number = Column(
        Integer,
        default=3,
        nullable=False,
        doc="Game Number",
    )

    rounds = relationship(
        argument="WildcardStageRoundModel",
        back_populates="wildcard_stage",
        order_by="WildcardStageRoundModel.round_number",
    )


class WildcardStageRoundStatuses(StrEnum):
    """ Wildcard stage round statuses. """
    ROUND_NOT_STARTED = "ROUND_NOT_STARTED"
    WAITING_FOR_START = "WAITING_FOR_START"
    ROUND_STARTED = "ROUND_STARTED"
    ROUND_ENDED = "ROUND_ENDED"


class WildcardStageRoundModel(BaseOrmModel):
    """ Model representing wildcard stage round."""
    __tablename__ = "wildcard_rounds"

    id = Column(
        UUID,
        primary_key=True,
        default=uuid.uuid4,
        doc="ID",
    )

    round_number = Column(
        Integer,
        nullable=False,
        doc="Round Number",
    )

    status = Column(
        Enum(WildcardStageRoundStatuses),
        default=WildcardStageRoundStatuses.ROUND_NOT_STARTED,
        doc="Round Status",
    )

    wildcard_stage_id = Column(
        UUID,
        ForeignKey('wildcard_stages.id'),
        doc="Wildcard Stage ID",
    )
    wildcard_stage = relationship(
        argument="WildcardStageModel",
        back_populates="rounds",
    )

    series = relationship(
        argument="WildcardSeriesModel",
        order_by="desc(WildcardSeriesModel.created_at)",
        back_populates="wildcard_round",
    )


class SwissStageTypes(StrEnum):
    """ Swiss stage types. """
    SWISS_CLASSIC = "SWISS_CLASSIC"
    SWISS_50_50 = "SWISS_50_50"
    SWISS_MANUAL = "SWISS_MANUAL"


class SwissStageModel(BaseOrmModel):
    """ Model representing swiss stage."""
    __tablename__ = "swiss_stages"

    id = Column(
        UUID,
        primary_key=True,
        default=uuid.uuid4,
        doc="ID",
    )

    stage_id = Column(
        UUID,
        ForeignKey("tournament_stages.id"),
        nullable=True,
        doc="Stage ID",
    )
    stage = relationship(
        argument="StageModel",
        back_populates="swiss_stage",
    )

    stage_type = Column(
        Enum(SwissStageTypes),
        nullable=False,
        doc="Stage Type",
    )

    wins_needed = Column(
        Integer,
        nullable=True,
        doc="Wins Needed",
    )
    loses_needed = Column(
        Integer,
        nullable=True,
        doc="Loses Needed",
    )

    rounds = relationship(
        argument="SwissStageRoundModel",
        back_populates="swiss_stage",
        order_by="SwissStageRoundModel.round_number",
    )


class SwissStageRoundStatuses(StrEnum):
    """ Swiss stage round statuses. """
    ROUND_NOT_STARTED = "ROUND_NOT_STARTED"
    WAITING_FOR_DRAW = "WAITING_FOR_DRAW"
    DRAW_STARTED = "DRAW_STARTED"
    WAITING_FOR_START = "WAITING_FOR_START"
    ROUND_STARTED = "ROUND_STARTED"
    ROUND_ENDED = "ROUND_ENDED"


class SwissStageRoundModel(BaseOrmModel):
    """ Model representing swiss stage round."""
    __tablename__ = "swiss_rounds"

    id = Column(
        UUID,
        primary_key=True,
        default=uuid.uuid4,
        doc="ID",
    )

    round_number = Column(
        Integer,
        nullable=False,
        doc="Round Number",
    )

    status = Column(
        Enum(SwissStageRoundStatuses),
        default=SwissStageRoundStatuses.ROUND_NOT_STARTED,
        doc="Round Status",
    )

    swiss_stage_id = Column(
        UUID,
        ForeignKey('swiss_stages.id'),
        doc="Swiss Stage ID",
    )
    swiss_stage = relationship(
        argument="SwissStageModel",
        back_populates="rounds",
    )

    series_groups = relationship(
        argument="SwissStageSeriesGroupModel",
        back_populates="round",
    )


class SwissStageSeriesGroupModel(BaseOrmModel):
    """ Model representing swiss stage series."""
    __tablename__ = "swiss_series_groups"

    id = Column(
        UUID,
        primary_key=True,
        default=uuid.uuid4,
        doc="ID",
    )

    round_id = Column(
        UUID,
        ForeignKey('swiss_rounds.id'),
        doc="Round ID",
    )
    round = relationship(
        argument="SwissStageRoundModel",
        back_populates="series_groups",
    )

    wins_number = Column(
        Integer,
        nullable=False,
        doc="Wins Number",
    )
    loses_number = Column(
        Integer,
        nullable=False,
        doc="Loses Number",
    )

    participants_number = Column(
        Integer,
        nullable=False,
        doc="Participants Number",
    )

    series = relationship(
        argument="SwissSeriesModel",
        order_by="desc(SwissSeriesModel.created_at)",
        back_populates="swiss_series_group",
    )


class LeagueStageModel(BaseOrmModel):
    """ Model representing league stage."""
    __tablename__ = "league_stages"

    id = Column(
        UUID,
        primary_key=True,
        default=uuid.uuid4,
        doc="ID",
    )

    stage_id = Column(
        UUID,
        ForeignKey("tournament_stages.id"),
        nullable=True,
        doc="Stage ID",
    )
    stage = relationship(
        argument="StageModel",
        back_populates="league_stage",
    )


class StageParticipantStatus(StrEnum):
    PLAYING = "PLAYING"
    WINNER = "WINNER"
    LOSER = "LOSER"


class StageParticipantModel(BaseOrmModel):
    __tablename__ = "stage_participants"

    id = Column(
        UUID,
        primary_key=True,
        default=uuid.uuid4,
        doc="ID",
    )

    order_number = Column(
        Integer,
        nullable=False,
        doc="Order Number",
    )

    status = Column(
        Enum(StageParticipantStatus),
        default=StageParticipantStatus.PLAYING,
        doc="Round Status",
    )

    account_id = Column(
        Integer,
        ForeignKey("gamers.id"),
        doc="Account ID",
    )
    account = relationship(
        argument="AccountModel",
    )

    stage_id = Column(
        UUID,
        ForeignKey("tournament_stages.id"),
        nullable=True,
        doc="Stage ID",
    )
    stage = relationship(
        argument="StageModel",
        back_populates="participants",
    )
