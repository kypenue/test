import datetime as dt
import logging
from typing import AsyncGenerator

from sqlalchemy import Column, DateTime
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy import text

from backlib.db_helpers import create_pg_db_url, create_pg_replica_db_url


cuply_logger = logging.getLogger("cuply")


class BaseOrmModel(DeclarativeBase):
    created_at = Column(DateTime(timezone=True), default=dt.datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=dt.datetime.utcnow, onupdate=dt.datetime.utcnow)

    repr_attrs = ["id"]

    def __repr__(self):
        values = []
        for num, attribute in enumerate(self.__table__.columns.keys()):
            if attribute in self.repr_attrs:
                values.append(f"{attribute}={getattr(self, attribute)!r}")
        return f"<{self.__class__.__name__} {" | ".join(values)}>"


PG_DATABASE_URL = create_pg_db_url()
PG_REPLICA_DATABASE_URL = create_pg_replica_db_url()

engine = create_engine(PG_DATABASE_URL)
replica_engine = create_engine(PG_REPLICA_DATABASE_URL)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

PG_DATABASE_URL_ASYNC = create_pg_db_url(is_async=True)
PG_REPLICA_DATABASE_URL_ASYNC = create_pg_replica_db_url(is_async=True)

engine_async = create_async_engine(PG_DATABASE_URL_ASYNC, future=True)
replica_engine_async = create_async_engine(PG_REPLICA_DATABASE_URL_ASYNC, future=True)

SessionLocalAsync = async_sessionmaker(bind=engine_async, class_=AsyncSession, expire_on_commit=False)


def check_and_switch(is_async: bool = False):
    global engine, replica_engine, SessionLocal

    should_switch = False

    try:
        with engine.connect() as conn:
            is_recovery = conn.execute(text("SELECT pg_is_in_recovery()")).scalar()
            if is_recovery:
                should_switch = True
    except Exception as ex:
        cuply_logger.error(f'Произошла ошибка при подключении к базе данных: {ex}')
        should_switch = True

    if should_switch:
        cuply_logger.warning(f'Смена плеч базы данных с {engine.url} на {replica_engine.url}')
        engine, replica_engine = replica_engine, engine
        SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

    return SessionLocal()


async def async_check_and_switch():
    global engine_async, replica_engine_async, SessionLocalAsync

    should_switch = False

    try:
        async with engine_async.connect() as conn:
            is_recovery = (await conn.execute(text("SELECT pg_is_in_recovery()"))).scalar()
            if is_recovery:
                should_switch = True
    except Exception as ex:
        cuply_logger.error(f'Произошла ошибка при подключении к базе данных: {ex}')
        should_switch = True

    if should_switch:
        cuply_logger.warning(f'Смена плеч базы данных с {engine_async.url} на {replica_engine_async.url}')
        engine_async, replica_engine_async = replica_engine_async, engine_async
        SessionLocalAsync = async_sessionmaker(bind=engine_async, class_=AsyncSession, expire_on_commit=False)

    return SessionLocalAsync()


def get_db():
    session = check_and_switch()
    try:
        yield session
    finally:
        session.close()


async def get_async_db() -> AsyncGenerator:
    session = await async_check_and_switch()
    try:
        yield session
    finally:
        await session.close()
