from abc import ABC, abstractmethod
from typing import Any, List, Optional, Tuple
from uuid import UUID

from sqlalchemy import insert, select, update, delete, Select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session


class AbstractRepo(ABC):
    model = None

    @abstractmethod
    def add_one(self, data: dict) -> Optional[Any]:
        raise NotImplementedError()

    @abstractmethod
    def edit_one(self, object_id: int, data: dict) -> Optional[Any]:
        raise NotImplementedError()

    @abstractmethod
    def find_all(self, offset: Optional[int] = None, limit: Optional[int] = None, **filter_by) -> List[Any]:
        raise NotImplementedError()

    @abstractmethod
    def find_one(self) -> Optional[Any]:
        raise NotImplementedError()

    @abstractmethod
    def delete_one(self, object_id: int):
        raise NotImplementedError()

    def get_filter_by_query(self, **filter_by) -> Select:
        return select(self.model).filter_by(**filter_by)

    def get_filter_query(self, *filters) -> Select:
        return select(self.model).filter(*filters)


class BaseSyncRepo(AbstractRepo):
    def __init__(self, session: Session):
        self.session = session

    def add_one(self, data: dict) -> int | UUID:
        stmt = insert(self.model).values(**data).returning(self.model.id)
        res = self.session.execute(stmt)
        return res.scalar_one()

    def edit_one(self, object_id: int | UUID, data: dict) -> Optional[int | UUID]:
        stmt = update(self.model).values(**data).filter_by(id=object_id).returning(self.model.id)
        res = self.session.execute(stmt)
        return res.scalar_one_or_none()

    def find_all(self, **filter_by) -> List[Any]:
        res = self.session.execute(self.get_filter_by_query(**filter_by))
        return [row[0] for row in res.all()]

    def find_one(self, **filter_by) -> Optional[Any]:
        res = self.session.execute(self.get_filter_by_query(**filter_by))
        res = res.scalar_one_or_none()
        return res

    def delete_one(self, object_id: int | UUID) -> Optional[int | UUID]:
        stmt = delete(self.model).where(self.model.id == object_id).returning(self.model.id)
        res = self.session.execute(stmt)
        return res.scalar_one_or_none()


class BaseAsyncRepo(AbstractRepo):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def add_one(self, data: dict) -> int | UUID:
        stmt = insert(self.model).values(**data).returning(self.model.id)
        res = await self.session.execute(stmt)
        return res.scalar_one()

    async def add_bulk(self, list_data: List[dict]) -> List[int] | List[UUID]:
        res = await self.session.scalars(
            insert(self.model).returning(self.model.id), list_data,
        )
        return [row for row in res.unique().all()]

    async def edit_bulk(self, list_data: List[dict]) -> None:
        res = await self.session.execute(
            update(self.model), list_data,
        )

    async def edit_one(self, object_id: int | UUID, data: dict) -> Optional[int | UUID]:
        stmt = update(self.model).values(**data).filter_by(id=object_id).returning(self.model.id)
        res = await self.session.execute(stmt)
        return res.scalar_one_or_none()

    async def find_all(self, **filter_by) -> List[Any]:
        res = await self.session.execute(self.get_filter_by_query(**filter_by))
        return [row[0] for row in res.unique().all()]

    async def find_one(self, **filter_by) -> Optional[Any]:
        res = await self.session.execute(self.get_filter_by_query(**filter_by))
        res = res.unique().scalar_one_or_none()
        return res

    async def delete_one(self, object_id: int | UUID) -> Optional[int | UUID]:
        stmt = delete(self.model).where(self.model.id == object_id).returning(self.model.id)
        res = await self.session.execute(stmt)
        return res.scalar_one_or_none()

    async def delete_by(self, *filter_by):
        stmt = delete(self.model).where(*filter_by).returning(self.model.id)
        res = await self.session.execute(stmt)
        return res.scalar_one_or_none()
