""" Repositories for user block models. """
import datetime
from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import joinedload

from backlib.repos import BaseSyncRepo, BaseAsyncRepo
from cuply.tournaments.models import UserBlockModel


class UserBlockSyncRepo(BaseSyncRepo):
    """ Sync repository for UserBlockModel. """
    model = UserBlockModel


class UserBlockAsyncRepo(BaseAsyncRepo):
    """ Async repository for UserBlockModel. """
    model = UserBlockModel

    def get_full_user_block_query(self, *filters):
        return select(UserBlockModel).filter(*filters).options(
            joinedload(UserBlockModel.user),
            joinedload(UserBlockModel.creator),
        )

    async def get_full_user_block(self, *filters):
        result = await self.session.execute(self.get_full_user_block_query(*filters))
        return result.scalar_one_or_none()

    async def get_full_user_blocks(self, *filters):
        result = await self.session.execute(self.get_full_user_block_query(*filters))
        return result.scalars().all()

    async def set_user_block(
        self,
        user_id: int,
        creator_id: int,
        blocked_until: Optional[datetime.datetime] = None,
    ):
        """ Set block for user. """
        user_block = await self.find_one(creator_id=creator_id, user_id=user_id)
        if user_block is None:
            user_block_id = await self.add_one({
                "user_id": user_id,
                "creator_id": creator_id,
                "blocked_until": blocked_until,
            })
        else:
            user_block_id = user_block.id
            await self.edit_one(user_block_id, {"blocked_until": blocked_until})

        return user_block_id

    async def delete_user_block(
        self,
        user_id: int,
        creator_id: int,
    ):
        """ Delete block for user. """
        user_block = await self.find_one(creator_id=creator_id, user_id=user_id)
        if user_block:
            await self.delete_one(user_block.id)
