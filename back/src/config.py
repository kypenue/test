import datetime
import os
import uuid


class ConfigEnv:
    ENV = os.environ["ENV"]

    PG_USER = os.environ["POSTGRES_USER"]
    PG_PASSWORD = os.environ["POSTGRES_PASSWORD"]
    PG_HOST = os.environ["POSTGRES_HOST"]
    PG_PORT = int(os.environ["POSTGRES_PORT"])
    PG_DB = os.environ["POSTGRES_DB"]
    PG_SQLALCHEMY_DRIVER_NAME = "postgresql"

    PG_REPLICA_USER = os.environ["POSTGRES_REPLICA_USER"]
    PG_REPLICA_PASSWORD = os.environ["POSTGRES_REPLICA_PASSWORD"]
    PG_REPLICA_HOST = os.environ["POSTGRES_REPLICA_HOST"]
    PG_REPLICA_PORT = int(os.environ["POSTGRES_REPLICA_PORT"])
    PG_REPLICA_DB = os.environ["POSTGRES_REPLICA_DB"]
    PG_REPLICA_SQLALCHEMY_DRIVER_NAME = "postgresql"

    AUTH_SECRET_KEY = os.environ["AUTH_SECRET_KEY"]

    EMAIL_HOST = os.environ["EMAIL_HOST"]
    EMAIL_USERNAME = os.environ["EMAIL_USERNAME"]
    EMAIL_FROM = os.environ["EMAIL_FROM"]
    EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
    EMAIL_PASSWORD = os.environ["EMAIL_PASSWORD"]
    EMAIL_PORT = os.environ["EMAIL_PORT"]

    DADATA_API_KEY = os.environ["DADATA_API_KEY"]
    DADATA_SECRET_KEY = os.environ["DADATA_SECRET_KEY"]

    S3_ACCESS = os.environ["S3_ACCESS"]
    S3_SECRET = os.environ["S3_SECRET"]
    S3_BUCKET = os.environ["S3_BUCKET"]
    S3_ENDPOINT_URL = os.environ["S3_ENDPOINT_URL"]

    APP_URL = os.environ["APP_URL"]

    LOG_FILE = os.environ["LOG_FILE"]

    TELEGRAM_SERVER_URL = os.environ["TELEGRAM_SERVER_URL"]
    TELEGRAM_BOT_NAME = os.environ["TELEGRAM_BOT_NAME"]
    TELEGRAM_BOT_TOKEN = os.environ["TELEGRAM_BOT_TOKEN"]
    TELEGRAM_AUTH_TOKEN = os.environ["TELEGRAM_AUTH_TOKEN"]

    TELEGRAM_TOKEN_EXPIRATION_TIME_SECONDS = 60 * 60

    SENTRY_DSN = os.environ["SENTRY_DSN"]

    FEEDBACK_APPLICATIONS_TELEGRAM_CHAT_ID = os.environ["FEEDBACK_APPLICATIONS_TELEGRAM_CHAT_ID"]
    FEEDBACK_APPLICATIONS_TELEGRAM_CHAT_THREAD_ID = os.environ["FEEDBACK_APPLICATIONS_TELEGRAM_CHAT_THREAD_ID"]
    FEEDBACK_APPLICATIONS_EMAIL = os.environ["FEEDBACK_APPLICATIONS_EMAIL"]

    WORKER_ID = uuid.uuid4()
    WORKER_START_DATETIME = datetime.datetime.utcnow()
