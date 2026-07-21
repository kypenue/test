""" Services to work with pagination. """
import inspect
from typing import Type, Callable, Any, Coroutine, List, Optional

from pydantic import BaseModel
from sqlalchemy import Select, or_, select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi_filter.contrib.sqlalchemy import Filter

from backlib.databases import BaseOrmModel


class AsyncPaginator:
    """ Service to perform pagination, filtering, ordering and searching on query. """
    def __init__(
        self,
        session: AsyncSession,
        model_class: Type[BaseOrmModel],
        schema_class: Type[BaseModel],
        query: Select = None,
        page: int = 1,
        per_page: int = 10,
        order_by: list[str] = None,
        search: str = None,
        search_by: list[str] = None,
        filter_instance: Filter = None,
        context_function: Callable[[Any, dict], dict] | Callable[[Any, dict], Coroutine] = None,
        context_data: dict = None,
        check_fields: bool = True,
    ):
        self.session = session

        self.model_class = model_class
        self.schema_class = schema_class

        if query is None:
            self.query = select(self.model_class)
        else:
            self.query = query

        self.page = page
        self.per_page = per_page

        self.sort_asc = []
        self.order_by = []

        if order_by is not None:
            for order_by_item in order_by:
                if order_by_item.startswith("-"):
                    order_by_item = order_by_item[1:]
                    self.sort_asc.append(False)
                else:
                    self.sort_asc.append(True)
                self.order_by.append(order_by_item)
            self._check_fields(self.order_by)

        self.search_term = search

        if check_fields:
            self._check_fields(search_by)
        self.search_by = search_by

        self.filter_instance = filter_instance

        self.context_function = context_function
        self.context_data = context_data if context_data is not None else {}

    def _check_fields(self, fields: list[str] = None):
        """ Check if fields are defined in model. """
        if fields is None:
            return

        for field in fields:
            if field not in self.model_class.__dict__:
                raise KeyError(f"Field {field} is not defined in model {self.model_class.__name__}.")

    async def paginate(self):
        """ Perform pagination using page and per_page fields. """
        limit = self.per_page
        offset = (self.page - 1) * limit
        self.query = self.query.limit(limit).offset(offset)

    async def filter(self):
        """ Perform filtering using filter_instance field. """
        if self.filter_instance is None:
            return

        self.query = self.filter_instance.filter(self.query)

    async def search(self):
        """ Perform searching using search_by and search_term fields. """
        if not self.search_term:
            return
        if not self.search_by:
            self.query = self.query.filter(False)
            return

        filters = []
        for field in self.search_by:
            if isinstance(field, str):
                filters.append(getattr(self.model_class, field).ilike(f"%{self.search_term}%"))
            else:
                filters.append(field.ilike(f"%{self.search_term}%"))

        self.query = self.query.filter(or_(*filters))

    async def order(self):
        """ Perform ordering using order_by fields. """
        for order_by, sort_asc in zip(self.order_by, self.sort_asc):
            if sort_asc:
                self.query = self.query.order_by(getattr(self.model_class, order_by))
            else:
                self.query = self.query.order_by(desc(getattr(self.model_class, order_by)))

    async def get_total_count(self):
        """ Get total number of records using query in the current state. """
        total_count_query = select(func.count()).select_from(self.query)
        total_count = await self.session.execute(total_count_query)
        return total_count.unique().scalar()

    async def convert_to_schema(self, items) -> List[BaseModel]:
        if not self.context_function:
            items = [self.schema_class.model_validate(item[0]) for item in items]
        else:
            if not inspect.iscoroutinefunction(self.context_function):
                items = [
                    self.schema_class.model_validate(
                        obj=item[0],
                        context=self.context_function(item[0], self.context_data),
                    ) for item in items
                ]
            else:
                items = [
                    self.schema_class.model_validate(
                        obj=item[0],
                        context=await self.context_function(item[0], self.context_data),
                    ) for item in items
                ]

        return items

    async def get_result(self):
        """ Perform all actions at once. """
        await self.filter()
        await self.search()
        await self.order()

        total_count = await self.get_total_count()

        await self.paginate()

        items = (await self.session.execute(self.query)).unique()
        items = await self.convert_to_schema(items)

        return {
            "page": self.page,
            "per_page": self.per_page,
            "total_pages": total_count // self.per_page + 1,
            "total_count": total_count,
            "payload": items,
        }


class ListPaginator:
    """ Service to perform pagination, ordering and searching on list. """
    def __init__(
        self,
        session: AsyncSession,
        model_class: Optional[Type[BaseOrmModel]],
        schema_class: Type[BaseModel],
        items: List,
        page: int = 1,
        per_page: int = 10,
        order_by: list[str] = None,
        search: str = None,
        search_by: list[str] = None,
        context_function: Callable[[Any, dict], dict] | Callable[[Any, dict], Coroutine] = None,
        context_data: dict = None,
    ):
        self.session = session

        self.model_class = model_class
        self.schema_class = schema_class

        self.page = page
        self.per_page = per_page

        self.sort_asc = []
        self.order_by = []

        if order_by is not None:
            for order_by_item in order_by:
                if order_by_item.startswith("-"):
                    order_by_item = order_by_item[1:]
                    self.sort_asc.append(False)
                else:
                    self.sort_asc.append(True)
                self.order_by.append(order_by_item)
            self._check_fields(self.order_by)

        self.search_term = search

        self.items = items

        self._check_fields(search_by)
        self.search_by = search_by

        self.context_function = context_function
        self.context_data = context_data if context_data is not None else {}

    def _check_fields(self, fields: list[str] = None):
        """ Check if fields are defined in model. """
        if fields is None or self.model_class is None:
            return

        for field in fields:
            if field not in self.model_class.__dict__:
                raise KeyError(f"Field {field} is not defined in model {self.model_class.__name__}.")

    def paginate(self):
        """ Perform pagination using page and per_page fields. """
        limit = self.per_page
        offset = (self.page - 1) * limit
        self.items = self.items[offset:(offset + limit)]

    def search(self):
        """ Perform searching using search_by and search_term fields. """
        if not self.search_term:
            return

        filters = []
        for field in self.search_by:
            ...

    def order(self):
        """ Perform ordering using order_by fields. """
        for order_by, sort_asc in zip(self.order_by, self.sort_asc):
            ...

    def get_total_count(self):
        """ Get total number of records using query in the current state. """
        return len(self.items)

    async def convert_to_schema(self, items) -> List[BaseModel]:
        if not self.context_function:
            items = [self.schema_class.model_validate(item) for item in items]
        else:
            if not inspect.iscoroutinefunction(self.context_function):
                items = [
                    self.schema_class.model_validate(
                        obj=item,
                        context=self.context_function(item, self.context_data),
                    ) for item in items
                ]
            else:
                items = [
                    self.schema_class.model_validate(
                        obj=item,
                        context=await self.context_function(item, self.context_data),
                    ) for item in items
                ]

        return items

    async def get_result(self):
        """ Perform all actions at once. """
        self.search()
        self.order()

        total_count = self.get_total_count()

        self.paginate()

        items = await self.convert_to_schema(self.items)

        return {
            "page": self.page,
            "per_page": self.per_page,
            "total_pages": total_count // self.per_page + 1,
            "total_count": total_count,
            "payload": items,
        }
