""" Filter tournament registration models. """
import uuid
from typing import Optional

from fastapi_filter.contrib.sqlalchemy import Filter

from cuply.tournaments.models import TournamentRegisteredUserModel, RegistrationStatus


class TournamentRegisteredUserFilter(Filter):
    """ Filter for TournamentRegisteredUserModel. """
    tournament_id: Optional[int] = None
    account_id: Optional[int] = None
    team_id: Optional[uuid.UUID] = None
    status: Optional[RegistrationStatus] = None
    team_id__isnull: Optional[bool] = None

    class Constants(Filter.Constants):
        model = TournamentRegisteredUserModel

    class Config:
        populate_by_name = True
