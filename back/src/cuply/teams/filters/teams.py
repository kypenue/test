import uuid
from typing import Optional

from fastapi_filter.contrib.sqlalchemy import Filter

from cuply.teams.models import TeamModel, TeamAccessTypes


class TeamFilter(Filter):
    access_type: Optional[TeamAccessTypes] = None
    creator_id: Optional[int] = None
    tournament_id: Optional[int] = None
    source_team_id: Optional[uuid.UUID] = None
    game_id: Optional[int] = None

    class Constants(Filter.Constants):
        model = TeamModel

    class Config:
        populate_by_name = True
