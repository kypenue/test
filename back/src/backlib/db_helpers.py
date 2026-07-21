import urllib

from sqlalchemy import URL

from config import ConfigEnv


def get_alembic_view_password():
    return urllib.parse.quote_plus(ConfigEnv.PG_PASSWORD).replace("%", "%%")


def create_pg_db_url(is_async: bool = False):
    driver = ConfigEnv.PG_SQLALCHEMY_DRIVER_NAME
    if is_async:
        driver = f"{driver}+asyncpg"
    return URL.create(
        drivername=driver,
        username=ConfigEnv.PG_USER,
        password=ConfigEnv.PG_PASSWORD,
        host=ConfigEnv.PG_HOST,
        port=ConfigEnv.PG_PORT,
        database=ConfigEnv.PG_DB
    )


def create_pg_replica_db_url(is_async: bool = False):
    driver = ConfigEnv.PG_REPLICA_SQLALCHEMY_DRIVER_NAME
    if is_async:
        driver = f"{driver}+asyncpg"
    return URL.create(
        drivername=driver,
        username=ConfigEnv.PG_REPLICA_USER,
        password=ConfigEnv.PG_REPLICA_PASSWORD,
        host=ConfigEnv.PG_REPLICA_HOST,
        port=ConfigEnv.PG_REPLICA_PORT,
        database=ConfigEnv.PG_REPLICA_DB
    )
