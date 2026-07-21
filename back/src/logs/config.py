import os

from pygments.lexers import q

log_config = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "[{asctime}] {message}",
            "style": "{",
        },
        "detailed": {
            "format": "[{asctime}] {levelname} {pathname}@{lineno} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "level": "DEBUG",
            "formatter": "default",
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stderr",
        },
        "file": {
            "level": "INFO",
            "formatter": "detailed",
            "class": "logging.handlers.RotatingFileHandler",
            "filename": os.environ["LOG_FILE"],
            "maxBytes": 1024 * 1024 * 500,  # 500 Mb
            "backupCount": 10,
        },
    },
    "loggers": {
        "cuply": {
            "level": "INFO",
            "handlers": ["console", "file"],
        },
    },
}
