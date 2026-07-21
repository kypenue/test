""" Services to interact with platforms """
from backlib.pagination import AsyncPaginator
from backlib.repo_helpers import raise_not_found_if_none
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.platforms.schemas import (
    PlatformReadSchema,
    PlatformCreateSchema,
    PlatformUpdateSchema,
)
from cuply.platforms.filters import PlatformFilter
from cuply.platforms.models import PlatformModel


class PlatformService:
    """ Service to interact with platforms. """
    async def get(self, uow: AsyncUnitOfWork, platform_id: int) -> PlatformReadSchema:
        """ Get platform by id. """
        platform = await uow.platform_repo.find_one(id=platform_id)
        raise_not_found_if_none(platform, platform_id)
        return PlatformReadSchema.model_validate(platform)

    async def get_all_paginated(
        self,
        uow: AsyncUnitOfWork,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        filter_instance: PlatformFilter,
    ) -> dict:
        """ Get all platforms paginated. """
        paginator = AsyncPaginator(
            session=uow.session,
            model_class=PlatformModel,
            schema_class=PlatformReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            search_by=["name"],
            filter_instance=filter_instance,
        )
        return await paginator.get_result()

    async def create(
        self,
        uow: AsyncUnitOfWork,
        schema: PlatformCreateSchema,
    ) -> PlatformReadSchema:
        """ Create new platform. """
        data = schema.model_dump()

        platform_id = await uow.platform_repo.add_one(data)
        platform = await uow.platform_repo.find_one(id=platform_id)

        await uow.commit()

        return PlatformReadSchema.model_validate(platform)

    async def update(
        self,
        uow: AsyncUnitOfWork,
        platform_id: int,
        schema: PlatformUpdateSchema,
    ) -> PlatformReadSchema:
        """ Update platform by id. """
        data = schema.model_dump()

        platform = await uow.platform_repo.find_one(id=platform_id)
        raise_not_found_if_none(platform, platform_id)

        await uow.platform_repo.edit_one(platform_id, data)
        platform = await uow.platform_repo.find_one(id=platform_id)

        await uow.commit()

        return PlatformReadSchema.model_validate(platform)

    async def delete(
        self,
        uow: AsyncUnitOfWork,
        platform_id: int,
    ):
        """ Delete platform by id. """
        platform = await uow.platform_repo.find_one(id=platform_id)
        raise_not_found_if_none(platform, platform_id)

        await uow.platform_repo.delete_one(platform_id)
        await uow.commit()
