from datetime import datetime
from typing import Any, Optional

from cuply.base.services.caching.backends.database import DatabaseCacheBackend


class Cache:
    backend = DatabaseCacheBackend

    @classmethod
    async def get(cls, key: str) -> Any:
        return await cls.backend.get(key)

    @classmethod
    async def set(cls, key: str, value: Any, expires_at: Optional[datetime] = None):
        return await cls.backend.set(key, value, expires_at)

    @classmethod
    async def delete(cls, key: str):
        return await cls.backend.delete(key)
