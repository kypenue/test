from typing import Optional, List

from sqlalchemy import select, desc

from backlib.repos import BaseSyncRepo, BaseAsyncRepo
from cuply.upload.models import UploadModel
from cuply.upload.schemas import UploadContentCategory


class UploadSyncRepo(BaseSyncRepo):
    model = UploadModel

    def find_profile_by_owner(self, owner_id: int) -> Optional[UploadModel]:
        stmt = select(self.model).filter_by(
            owner_id=owner_id, content_category=UploadContentCategory.PROFILE.value
        ).order_by(desc("created_at")).limit(1)
        res = self.session.execute(stmt)
        res = res.scalar_one_or_none()
        return res


class UploadAsyncRepo(BaseAsyncRepo):
    model = UploadModel

    async def find_profile_by_owner(self, owner_id: int) -> Optional[UploadModel]:
        stmt = select(self.model).filter_by(
            owner_id=owner_id, content_category=UploadContentCategory.PROFILE.value
        ).order_by(desc("created_at")).limit(1)
        res = await self.session.execute(stmt)
        res = res.scalar_one_or_none()
        return res
