from abc import ABC, abstractmethod

from backlib.databases import get_db, get_async_db, async_check_and_switch


class AbstractUnitOfWork(ABC):
    session_factory = get_db

    def __enter__(self):
        self.session = next(AbstractUnitOfWork.session_factory())
        self.__init_repos__()

    @abstractmethod
    def __init_repos__(self):
        raise NotImplementedError()

    def __exit__(self, *args):
        self.rollback()
        self.session.close()

    def commit(self):
        self.session.commit()

    def rollback(self):
        self.session.rollback()


class AbstractAsyncUnitOfWork(ABC):
    async def __aenter__(self):
        self.session = await async_check_and_switch()
        self.__init_repos__()

    @abstractmethod
    def __init_repos__(self):
        raise NotImplementedError()

    async def __aexit__(self, *args):
        await self.rollback()
        await self.session.close()

    async def commit(self):
        await self.session.commit()

    async def rollback(self):
        await self.session.rollback()
