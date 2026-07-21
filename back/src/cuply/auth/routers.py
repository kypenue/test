from fastapi import APIRouter, Depends
from starlette import status
from starlette.responses import JSONResponse, Response

from cuply.auth.base_config import auth_backend, fastapi_users, current_user_not_checked
from cuply.auth.exceptions import UserWithThatEmailAlreadyExists
from cuply.auth.models import UserModel
from cuply.auth.schemas import UserReadSchema, UserCreateSchema, UserUpdateEmailSchema
from cuply.dependencies import UOWDepAsync
from cuply.users.services.users import UserService

router = APIRouter(
    tags=["Auth"],
    prefix="/auth",
)

router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/jwt",
    tags=["Auth"],
)
router.include_router(
    fastapi_users.get_register_router(UserReadSchema, UserCreateSchema),
    tags=["Auth"],
)
router.include_router(
    fastapi_users.get_verify_router(UserReadSchema),
    tags=["Auth"],
)
router.include_router(
    fastapi_users.get_reset_password_router(),
    tags=["Auth"],
)


user_service = UserService()


@router.post("/change-email")
async def change_email(
    user_email_schema: UserUpdateEmailSchema,
    uow: UOWDepAsync,
    user: UserModel = Depends(current_user_not_checked),
):
    """ Change user email. """
    try:
        async with uow:
            await user_service.update_email(uow, user_email_schema, user)
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except UserWithThatEmailAlreadyExists:
        err_type = "user_with_that_email_already_exists"
        err_msg = "Пользователь с указанной почтой уже существует."
    except Exception:
        err_type, err_msg = None, None

    return JSONResponse(
        content={"detail": {"type": err_type, "msg": err_msg}},
        status_code=status.HTTP_400_BAD_REQUEST,
    )
