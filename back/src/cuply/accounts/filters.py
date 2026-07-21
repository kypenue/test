""" Filter accounts models. """
from typing import Optional

from fastapi_filter.contrib.sqlalchemy import Filter

from cuply.accounts.models import AccountModel


class AccountFilter(Filter):
    """ Filter for AccountModel. """
    user_id: Optional[int] = None
    game_id: Optional[int] = None
    platform_id: Optional[int] = None

    class Constants(Filter.Constants):
        model = AccountModel

    class Config:
        populate_by_name = True
