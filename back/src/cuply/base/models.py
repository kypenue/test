import uuid

from sqlalchemy import Column, UUID, DateTime, String, JSON

from backlib.databases import BaseOrmModel


class KeyValueStorageModel(BaseOrmModel):
    __tablename__ = "key_value_storage"

    id = Column(
        UUID,
        primary_key=True,
        default=uuid.uuid4,
        doc="ID",
    )

    key = Column(
        String(1024),
        unique=True,
        doc="Key",
    )
    value = Column(
        JSON,
        nullable=True,
        doc="Value",
    )

    expires_at = Column(
        DateTime,
        nullable=True,
        doc="Expires At",
    )
