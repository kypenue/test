from sqlalchemy import Column, Integer, Text, TIMESTAMP, ForeignKey, Boolean

from backlib.databases import BaseOrmModel
from constants import TIME_FORMAT
from cuply.upload.schemas import UploadRead, UploadContentCategory


class UploadModel(BaseOrmModel):
    __tablename__ = "uploads"

    id = Column(
        Integer,
        primary_key=True,
    )
    name = Column(
        Text,
        nullable=False,
    )

    owner_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
    )

    bucket = Column(
        Text,
        nullable=False,
    )

    object_key = Column(
        Text,
        nullable=False,
    )
    content_category = Column(
        Text,
        nullable=True,
        default=UploadContentCategory.UNKNOWN.value,
    )

    is_removed = Column(
        Boolean,
        nullable=False,
        default=False,
    )

    def to_read_model(self) -> UploadRead:
        return UploadRead(
            id=self.id,
            name=self.name,
            owner_id=self.owner_id,
            bucket=self.bucket,
            object_key=self.object_key,
            content_category=self.content_category,
            is_removed=self.is_removed,
            created_at=self.created_at.strftime(TIME_FORMAT),
            updated_at=self.updated_at.strftime(TIME_FORMAT)
        )
