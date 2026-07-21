from fastapi import APIRouter, Depends, UploadFile, File
from starlette import status
from starlette.responses import JSONResponse, Response

from backlib.rs_types import MultipartFormDataRs
from cuply.auth.base_config import current_active_user
from cuply.auth.models import UserModel
from cuply.dependencies import UOWDep, UOWDepAsync
from cuply.upload.schemas import UploadResultRs, UploadContentCategory
from cuply.upload.service import UploadService

router = APIRouter(
    prefix="/uploads",
    tags=["Uploads"],
)

upload_service = UploadService()


@router.post("/files", response_model=UploadResultRs)
def upload(
        uow: UOWDep,
        file: UploadFile = File(...),
        user: UserModel = Depends(current_active_user),
):
    with uow:
        res = upload_service.upload_file(uow, file, user, UploadContentCategory.PROFILE.value)
        result = res.model_dump(exclude_unset=True)
    return JSONResponse(content=result)


@router.post("/other-files", response_model=UploadResultRs)
def upload_other_files(
        uow: UOWDep,
        file: UploadFile = File(...),
        user: UserModel = Depends(current_active_user),
):
    with uow:
        res = upload_service.upload_file(uow, file, user, UploadContentCategory.UNKNOWN.value)
        result = res.model_dump(exclude_unset=True)
    return JSONResponse(content=result)


@router.get("/files/profile-photo", response_class=MultipartFormDataRs)
async def download_my_profile_photo(
        uow: UOWDepAsync,
        user: UserModel = Depends(current_active_user),
):
    async with uow:
        result = await upload_service.download_profile_photo(uow, user.id)
    return result


@router.delete("/files/profile-photo")
async def delete_my_profile_photo(
        uow: UOWDepAsync,
        user: UserModel = Depends(current_active_user),
):
    async with uow:
        await upload_service.delete_profile_photo(uow, user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/files/profile-photo/{user_id}", response_class=MultipartFormDataRs)
async def download_profile_photo(
        user_id: int,
        uow: UOWDepAsync,
):
    async with uow:
        result = await upload_service.download_profile_photo(uow, user_id)
    return result


@router.get("/files/static/{object_key}", response_class=MultipartFormDataRs)
async def get_static_object(
        object_key: str,
):
    return await upload_service.download_static_file(object_key)


# uploads/routers.py (пример)

@router.post("/avatar", response_model=UploadResultRs)
def upload_avatar_file(
        uow: UOWDep,
        file: UploadFile = File(...),
        user: UserModel = Depends(current_active_user),
):
    """
    Загрузить файл как 'AVATAR'.
    """
    with uow:
        res = upload_service.upload_file(uow, file, user, UploadContentCategory.AVATAR.value)
        return res


@router.post("/header", response_model=UploadResultRs)
def upload_header_file(
        uow: UOWDep,
        file: UploadFile = File(...),
        user: UserModel = Depends(current_active_user),
):
    """
    Загрузить файл как 'HEADER'.
    """
    with uow:
        res = upload_service.upload_file(uow, file, user, UploadContentCategory.HEADER.value)
        return res
