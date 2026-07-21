from uuid import UUID

from sqlalchemy import insert

from backlib.repos import BaseSyncRepo, BaseAsyncRepo
from cuply.base.models import KeyValueStorageModel


class KeyValueStorageModelSyncRepo(BaseSyncRepo):
    model = KeyValueStorageModel


class KeyValueStorageModelAsyncRepo(BaseAsyncRepo):
    model = KeyValueStorageModel

    async def add_one(self, data: dict) -> UUID:
        stmt = insert(self.model).values(**data).returning(self.model.id)
        res = await self.session.execute(stmt)
        return res.scalar_one()
