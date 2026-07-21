import uuid
from typing import Optional

from fastapi_filter.contrib.sqlalchemy import Filter

from cuply.communities.models import (
    CommunityModel,
    CommunityRoleTypes,
    CommunityUserRoleModel,
)


class CommunityFilter(Filter):
    """ Filter for CommunityModel. """
    creator_id: Optional[int] = None

    class Constants(Filter.Constants):
        model = CommunityModel

    class Config:
        populate_by_name = True


class CommunityUserRoleFilter(Filter):
    """ Filter for CommunityUserRoleModel. """
    community_id: Optional[uuid.UUID] = None
    user_id: Optional[int] = None
    role_type: Optional[CommunityRoleTypes] = None

    class Constants(Filter.Constants):
        model = CommunityUserRoleModel

    class Config:
        populate_by_name = True
