""" Services for tournament registration user block management. """
from backlib.pagination import AsyncPaginator
from cuply.auth.models import UserModel
from backlib.repo_helpers import raise_not_found_if_none
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.tournaments.schemas.user_block import (
    UserBlockReadSchema,
    UserBlockWriteSchema,
)
from cuply.models import UserBlockModel
from cuply.tournaments.services.permissions import TournamentPermissionService


class UserBlockService:
    """ Service for tournament registration user block management. """
    def __init__(self):
        self.permission_service = TournamentPermissionService()

    async def get_block_users(
        self,
        uow: AsyncUnitOfWork,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        user: UserModel,
    ) -> dict:
        """ Get blocked users for current user. """
        paginator = AsyncPaginator(
            session=uow.session,
            model_class=UserBlockModel,
            schema_class=UserBlockReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            search_by=[],
            query=uow.user_block_repo.get_full_user_block_query(UserBlockModel.creator_id == user.id),
        )
        return await paginator.get_result()

    async def get_block_user(
        self,
        uow: AsyncUnitOfWork,
        block_id: int,
        user: UserModel,
    ) -> UserBlockReadSchema:
        """ Get blocked users for current user. """
        user_block = await uow.user_block_repo.get_full_user_blocks(
            UserBlockModel.id == block_id,
            UserBlockModel.creator_id == user.id,
        )
        raise_not_found_if_none(user_block, block_id)
        return UserBlockReadSchema.model_validate(user_block)

    async def set_block_user(
        self,
        uow: AsyncUnitOfWork,
        to_block_user_id: int,
        schema: UserBlockWriteSchema,
        user: UserModel,
    ) -> UserBlockReadSchema:
        """ Set user block. """
        await self.permission_service.check_block_user(uow, user)

        to_block_user = await uow.user_repo.find_one(id=to_block_user_id)
        raise_not_found_if_none(to_block_user, to_block_user_id)

        data = schema.model_dump()
        data["creator_id"] = user.id
        data["user_id"] = to_block_user_id

        user_block_id = await uow.user_block_repo.set_user_block(**data)
        user_block = await uow.user_block_repo.get_full_user_block(
            UserBlockModel.id == user_block_id, UserBlockModel.creator_id == user.id
        )
        await uow.commit()

        return UserBlockReadSchema.model_validate(user_block)

    async def delete_block_user(
        self,
        uow: AsyncUnitOfWork,
        to_block_user_id: int,
        user: UserModel,
    ):
        """ Delete user block. """
        await self.permission_service.check_unblock_user(uow, user)

        to_block_user = await uow.user_repo.find_one(id=to_block_user_id)
        raise_not_found_if_none(to_block_user, to_block_user_id)

        data = {
            "creator_id": user.id,
            "user_id": to_block_user_id,
        }

        await uow.user_block_repo.delete_user_block(**data)
        await uow.commit()
