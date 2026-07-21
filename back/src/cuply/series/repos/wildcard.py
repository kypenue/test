from typing import List

from sqlalchemy import select

from backlib.repos import BaseSyncRepo, BaseAsyncRepo
from cuply.series.models import SwissSeriesModel, WildcardSeriesModel
from cuply.stages.models import (
    SwissStageSeriesGroupModel,
    SwissStageRoundModel,
)


class WildcardSeriesModelAsyncRepo(BaseAsyncRepo):
    model = WildcardSeriesModel
