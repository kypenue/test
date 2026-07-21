""" Filter tournaments models. """
import datetime
import uuid
from typing import Optional

from fastapi_filter.contrib.sqlalchemy import Filter

from cuply.tournaments.models import TournamentModel, LifecycleTournamentStatus


class TournamentFilter(Filter):
    """ Filter for TournamentModel. """
    creator_id: Optional[int] = None
    game_id: Optional[int] = None
    registration_start: Optional[datetime.datetime] = None
    registration_start__lt: Optional[datetime.datetime] = None
    registration_start__lte: Optional[datetime.datetime] = None
    registration_start__gt: Optional[datetime.datetime] = None
    registration_start__gte: Optional[datetime.datetime] = None
    registration_end: Optional[datetime.datetime] = None
    registration_end__lt: Optional[datetime.datetime] = None
    registration_end__lte: Optional[datetime.datetime] = None
    registration_end__gt: Optional[datetime.datetime] = None
    registration_end__gte: Optional[datetime.datetime] = None
    tournament_start: Optional[datetime.datetime] = None
    tournament_start__lt: Optional[datetime.datetime] = None
    tournament_start__lte: Optional[datetime.datetime] = None
    tournament_start__gt: Optional[datetime.datetime] = None
    tournament_start__gte: Optional[datetime.datetime] = None
    tournament_end: Optional[datetime.datetime] = None
    tournament_end__lt: Optional[datetime.datetime] = None
    tournament_end__lte: Optional[datetime.datetime] = None
    tournament_end__gt: Optional[datetime.datetime] = None
    tournament_end__gte: Optional[datetime.datetime] = None
    lifecycle_status: Optional[LifecycleTournamentStatus] = None
    lifecycle_status__in: list[LifecycleTournamentStatus] = None
    lifecycle_status__neq: Optional[LifecycleTournamentStatus] = None
    min_age: Optional[int] = None
    min_age__lt: Optional[int] = None
    min_age__lte: Optional[int] = None
    min_age__gt: Optional[int] = None
    min_age__gte: Optional[int] = None
    participants_number: Optional[int] = None
    participants_number__lt: Optional[int] = None
    participants_number__lte: Optional[int] = None
    participants_number__gt: Optional[int] = None
    participants_number__gte: Optional[int] = None
    is_auto_approval: Optional[bool] = None
    teams_used: Optional[bool] = None
    community_id: Optional[uuid.UUID] = None
    payment_type: Optional[str] = None
    payment_type__in: list[str] = None
    payment_type__neq: Optional[str] = None
    is_forecast_competition_allowed: Optional[bool] = None

    class Constants(Filter.Constants):
        model = TournamentModel

    class Config:
        populate_by_name = True
