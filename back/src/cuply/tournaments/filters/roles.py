""" Filter tournament role models. """
from typing import Optional

from fastapi_filter.contrib.sqlalchemy import Filter

from cuply.tournaments.models import TournamentRoleTypes, TournamentUserRoleModel


class TournamentUserRoleFilter(Filter):
    """ Filter for TournamentUserRoleModel. """
    tournament_id: Optional[int] = None
    user_id: Optional[int] = None
    role_type: Optional[TournamentRoleTypes] = None

    class Constants(Filter.Constants):
        model = TournamentUserRoleModel

    class Config:
        populate_by_name = True
