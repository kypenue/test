from datetime import datetime
from typing import Any, Optional

from cuply.base.models import KeyValueStorageModel
from cuply.cuply_unit_of_work import AsyncUnitOfWork


class DatabaseCacheBackend:
    @classmethod
    async def get(cls, key: str):
        uow = AsyncUnitOfWork()
        async with uow:
            key_value: KeyValueStorageModel = await uow.key_value.find_one(key=key)
            if key_value and (not key_value.expires_at or key_value.expires_at <= datetime.now()):
                value = key_value.value
            else:
                value = None
        return value

    @classmethod
    async def set(cls, key: str, value: Any, expires_at: Optional[datetime] = None):
        uow = AsyncUnitOfWork()
        async with uow:
            key_value: KeyValueStorageModel = await uow.key_value.find_one(key=key)
            if not key_value:
                await uow.key_value.add_one({"key": key, "value": value})
            else:
                await uow.key_value.edit_one(
                    object_id=key_value.id,
                    data={"key": key, "value": value, "expires_at": expires_at},
                )
            await uow.commit()

    @classmethod
    async def delete(cls, key: str):
        uow = AsyncUnitOfWork()
        async with uow:
            await uow.key_value.delete_by(KeyValueStorageModel.key == key)
            await uow.commit()
