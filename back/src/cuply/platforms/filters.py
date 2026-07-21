""" Filter platforms models. """
from fastapi_filter.contrib.sqlalchemy import Filter

from cuply.platforms.models import PlatformModel


class PlatformFilter(Filter):
    """ Filter for PlatformModel. """

    class Constants(Filter.Constants):
        model = PlatformModel

    class Config:
        populate_by_name = True
