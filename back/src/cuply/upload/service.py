# cuply/upload/service.py

import os
from tempfile import NamedTemporaryFile
from typing import List, Optional
from uuid import uuid4

import boto3
from fastapi import HTTPException, UploadFile
from starlette import status
from starlette.responses import StreamingResponse

from backlib.repo_helpers import raise_not_found_if_none
from config import ConfigEnv
from constants import NOT_ENOUGH_PERMISSIONS_MSG, UPLOAD_ERROR_MSG
from cuply.auth.models import UserModel
from cuply.cuply_unit_of_work import SyncUnitOfWork, AsyncUnitOfWork
from cuply.upload.schemas import UploadRead, UploadCreate, UploadResultRs
from logs import cuply_logger


class UploadService:
    def __init__(self):
        self.session = boto3.session.Session(
            aws_access_key_id=ConfigEnv.S3_ACCESS,
            aws_secret_access_key=ConfigEnv.S3_SECRET,
        )
        self.s3_client = self.session.client(
            service_name="s3",
            endpoint_url=ConfigEnv.S3_ENDPOINT_URL
        )
        self.bucket = ConfigEnv.S3_BUCKET

    # -----------------------------
    # Методы, которые работают c SyncUnitOfWork:
    # -----------------------------
    def get(self, uow: SyncUnitOfWork, upload_id: int) -> UploadRead:
        item = uow.upload_repo.find_one(id=upload_id)
        raise_not_found_if_none(item, upload_id)
        return item

    def get_all(self, uow: SyncUnitOfWork) -> List[UploadRead]:
        items = uow.upload_repo.find_all()
        return items

    def create(self, uow: SyncUnitOfWork, data_create: UploadCreate) -> UploadRead:
        data = data_create.model_dump(exclude_unset=True)
        item_id = uow.upload_repo.add_one(data)
        uow.commit()
        upload = uow.upload_repo.find_one(id=item_id)
        return UploadRead.model_validate(upload)

    def delete(self, uow: SyncUnitOfWork, upload_id: int, user: UserModel) -> Optional[int]:
        """
        Старый синхронный метод удаления, где обязательно проверяем владельца.
        """
        item = uow.upload_repo.find_one(id=upload_id)
        raise_not_found_if_none(item, upload_id)

        # Проверяем владельца
        if item.owner_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=NOT_ENOUGH_PERMISSIONS_MSG
            )

        # Удаляем из базы
        item_id = uow.upload_repo.delete_one(upload_id)
        uow.commit()

        # Удаляем файл в s3
        self.s3_client.delete_object(Bucket=self.bucket, Key=item.object_key)

        return item_id

    def upload_file(
            self,
            uow: SyncUnitOfWork,
            file: UploadFile,
            user: UserModel,
            content_category,
    ) -> UploadResultRs:
        temp = NamedTemporaryFile(delete=False)
        try:
            try:
                contents = file.file.read()
                with temp as f:
                    f.write(contents)
            except Exception as e:
                cuply_logger.error(e)
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=UPLOAD_ERROR_MSG)
            finally:
                file.file.close()

            saved_key = str(uuid4())
            saved_key = f"{user.id}-{saved_key}"
            cuply_logger.info(f"Uploading file '{temp.name}' from user '{user.id}'")
            self.s3_client.upload_file(temp.name, self.bucket, saved_key)
            upload_read: UploadRead = self.create(
                uow,
                data_create=UploadCreate(
                    name=temp.name,
                    owner_id=user.id,
                    bucket=self.bucket,
                    object_key=saved_key,
                    content_category=content_category
                )
            )
        except Exception as e:
            cuply_logger.error(e)
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=UPLOAD_ERROR_MSG)
        finally:
            os.remove(temp.name)

        return UploadResultRs(id=upload_read.id, s3_key=saved_key)

    # -----------------------------
    # Методы, которые работают c AsyncUnitOfWork:
    # -----------------------------
    async def download_profile_photo(self, uow: AsyncUnitOfWork, user_id: int):
        latest_profile_upload = await uow.upload_repo.find_profile_by_owner(owner_id=user_id)
        if latest_profile_upload is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Изображение не найдено"
            )
        try:
            result = self.s3_client.get_object(Bucket=self.bucket, Key=latest_profile_upload.object_key)
            return StreamingResponse(content=result["Body"].iter_chunks())
        except Exception as e:
            cuply_logger.error(e)
            if hasattr(e, "message"):
                raise HTTPException(
                    status_code=e.message["response"]["Error"]["Code"],
                    detail=e.message["response"]["Error"]["Message"],
                )
            else:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    async def delete_profile_photo(self, uow: AsyncUnitOfWork, user_id: int):
        """
        Удаление Профильного фото (асинхронное).
        """
        latest_profile_upload = await uow.upload_repo.find_profile_by_owner(owner_id=user_id)
        if latest_profile_upload is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Изображение не найдено"
            )
        await uow.upload_repo.delete_one(latest_profile_upload.id)
        self.s3_client.delete_object(Bucket=self.bucket, Key=latest_profile_upload.object_key)

    async def download_static_file(self, object_key: str):
        try:
            result = self.s3_client.get_object(Bucket=self.bucket, Key=object_key)
            return StreamingResponse(content=result["Body"].iter_chunks())
        except Exception as e:
            cuply_logger.error(e)
            if hasattr(e, "message"):
                raise HTTPException(
                    status_code=e.message["response"]["Error"]["Code"],
                    detail=e.message["response"]["Error"]["Message"],
                )
            else:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    async def async_delete_file(
            self,
            uow: AsyncUnitOfWork,
            upload_id: int,
            check_owner: bool = False,
            user: Optional[UserModel] = None,
    ) -> None:
        """
        Асинхронный метод удаления UploadModel + файла в s3.
        Если check_owner=True, тогда проверяем, что user.owner_id совпадает.
        Если user=None, то не проверяем владельца.
        """
        item = await uow.upload_repo.find_one(id=upload_id)
        if not item:
            return  # уже нет в БД

        if check_owner and user:
            if item.owner_id != user.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=NOT_ENOUGH_PERMISSIONS_MSG
                )

        # Удаляем запись из БД
        await uow.upload_repo.delete_one(upload_id)
        # Удаляем файл из s3
        self.s3_client.delete_object(Bucket=self.bucket, Key=item.object_key)

        # !!! не забыть commit() сделать снаружи, если нужно
