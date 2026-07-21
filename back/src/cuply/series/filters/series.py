""" Filter tournaments series models. """
from typing import Optional

from fastapi_filter.contrib.sqlalchemy import Filter

from cuply.series.models import SeriesModel, SeriesStatus


class SeriesModelFilter(Filter):
    status: Optional[SeriesStatus] = None

    class Constants(Filter.Constants):
        model = SeriesModel

    class Config:
        populate_by_name = True
