""" Filter tournaments series models. """
from typing import Optional

from fastapi_filter.contrib.sqlalchemy import Filter

from cuply.matches.models import MatchComplaintStatus, MatchComplaintCreation, MatchComplaintModel


class MathComplaintModelFilter(Filter):
    status: Optional[MatchComplaintStatus] = None
    creation_way: Optional[MatchComplaintCreation] = None

    class Constants(Filter.Constants):
        model = MatchComplaintModel

    class Config:
        populate_by_name = True
