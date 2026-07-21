from fastapi_users import FastAPIUsers
from fastapi_users.authentication import (
    AuthenticationBackend,
    JWTStrategy,
    BearerTransport,
)

from constants import ACCESS_TOKEN_EXPIRE_SECONDS
from config import ConfigEnv
from cuply.auth.managers import get_user_manager
from cuply.auth.models import UserModel


bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(
        secret=ConfigEnv.AUTH_SECRET_KEY,
        lifetime_seconds=ACCESS_TOKEN_EXPIRE_SECONDS,
    )


auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[UserModel, int](
    get_user_manager,
    [auth_backend],
)


current_user_not_checked = fastapi_users.current_user()
current_active_user = fastapi_users.current_user(active=True)
current_verified_user = fastapi_users.current_user(verified=True)
current_user = fastapi_users.current_user(active=True, verified=True)
current_active_user_optional = fastapi_users.current_user(optional=True, active=True)
current_superuser = fastapi_users.current_user(active=True, superuser=True)
