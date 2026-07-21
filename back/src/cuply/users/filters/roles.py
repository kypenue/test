""" Filter system role models. """
from typing import Optional

from fastapi_filter.contrib.sqlalchemy import Filter

from cuply.users.models import SystemUserRoleModel, SystemRoleTypes


class SystemUserRoleFilter(Filter):
    """ Filter for SystemUserRoleModel. """
    user_id: Optional[int] = None
    role_type: Optional[SystemRoleTypes] = None

    class Constants(Filter.Constants):
        model = SystemUserRoleModel

    class Config:
        populate_by_name = True
