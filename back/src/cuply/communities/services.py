# communities/services.py
import uuid
from uuid import UUID

from sqlalchemy import or_

from backlib.pagination import AsyncPaginator
from backlib.repo_helpers import raise_not_found_if_none
from cuply.auth.models import UserModel
from cuply.communities.exceptions import UserCannotDeleteOwnCommunityRolesException
from cuply.communities.filters import CommunityUserRoleFilter
from cuply.communities.models import CommunityModel, CommunityUserRoleModel, CommunityRoleTypes
from cuply.communities.schemas import (
    CommunityCreateSchema,
    CommunityUpdateSchema,
    CommunityReadSchema,
    CommunityShortReadSchema,
    CommunityUserRoleReadSchema,
    CommunityUserRoleCreateSchema,
)
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.tournaments.services.permissions import TournamentPermissionService
from cuply.upload.service import UploadService


class CommunityService:
    def __init__(self):
        self.upload_service = UploadService()

    async def create(self, uow: AsyncUnitOfWork, schema: CommunityCreateSchema, user: UserModel):
        data = {
            "title": schema.title,
            "description": schema.description,
            "social_links": schema.social_links,
            "creator_id": user.id,
            "avatar_id": schema.avatar_id,
            "header_id": schema.header_id,
        }
        community_id = await uow.community_repo.add_one(data)
        await uow.commit()

        # Привязка игр
        if schema.game_ids:
            for game_id in schema.game_ids:
                # проверка, что игра есть?
                await uow.community_game_repo.add_one({
                    "community_id": community_id,
                    "game_id": game_id
                })

        await uow.community_roles_repo.add_one({
            'community_id': community_id,
            'user_id': user.id,
            'role_type': CommunityRoleTypes.ORGANIZER,
        })

        await uow.commit()

        community = await uow.community_repo.get_full_community(CommunityModel.id == community_id)
        return await self._to_read_schema(community, user)

    async def get(self, uow: AsyncUnitOfWork, community_id_or_slug: str, user: UserModel):
        try:
            community_id = UUID(community_id_or_slug)
            community = await uow.community_repo.get_full_community(
                CommunityModel.id == community_id,
            )
        except ValueError:
            community = await uow.community_repo.get_full_community(
                CommunityModel.slug == community_id_or_slug,
            )
        raise_not_found_if_none(community, community_id_or_slug)
        return await self._to_read_schema(community, user)

    async def update(self, uow: AsyncUnitOfWork, community_id: UUID, schema: CommunityUpdateSchema, user: UserModel):
        community = await uow.community_repo.find_one(id=community_id)
        raise_not_found_if_none(community, community_id)

        data_to_update = schema.model_dump()
        del data_to_update["game_ids"]

        old_header = None
        old_avatar = None
        # # M2M со списком игр
        if schema.game_ids is not None:
            # Удалить старые
            old_links = await uow.community_game_repo.find_all(community_id=community_id)
            for link in old_links:
                await uow.community_game_repo.delete_one(link.id)
            # Создать новые
            for g_id in schema.game_ids:
                await uow.community_game_repo.add_one({"community_id": community_id, "game_id": g_id})

        # Смена аватарки
        if schema.avatar_id is not None and schema.avatar_id != community.avatar_id:
            old_avatar = community.avatar_id

        if schema.header_id is not None and schema.header_id != community.header_id:
            old_header = community.header_id
        if data_to_update:
            await uow.community_repo.edit_one(community_id, data_to_update)

        await uow.commit()
        try:
            if old_avatar:
                await self.upload_service.async_delete_file(uow, old_avatar, check_owner=False, user=None)
            if old_header:
                await self.upload_service.async_delete_file(uow, old_header, check_owner=False, user=None)
        except Exception:
            pass
        updated_community = await uow.community_repo.get_full_community(CommunityModel.id == community_id)

        return await self._to_read_schema(updated_community, user)

    async def delete(self, uow: AsyncUnitOfWork, community_id: UUID, user: UserModel):
        community = await uow.community_repo.find_one(id=community_id)
        raise_not_found_if_none(community, community_id)

        community_games_links = await uow.community_game_repo.find_all(community_id=community_id)
        for link in community_games_links:
            await uow.community_game_repo.delete_one(link.id)

        avatar_id = community.avatar_id
        header_id = community.header_id

        await uow.community_repo.delete_one(community_id)

        await uow.commit()

        try:
            if avatar_id:
                await self.upload_service.async_delete_file(uow, avatar_id, check_owner=False, user=None)
            if header_id:
                await self.upload_service.async_delete_file(uow, header_id, check_owner=False, user=None)
            await uow.commit()
        except Exception:
            pass

    async def get_all(self, uow: AsyncUnitOfWork):
        communities = await uow.community_repo.get_full_communities()
        return [await self._to_short_schema(c) for c in communities]

    async def _to_read_schema(self, community: CommunityModel, user: UserModel) -> CommunityReadSchema:
        return CommunityReadSchema.model_validate(community, context={
            'community_roles': [
                role.role_type for role in community.roles if user and role.user_id == user.id
            ],
        })

    async def _to_short_schema(self, community: CommunityModel) -> CommunityShortReadSchema:
        return CommunityShortReadSchema.model_validate(community)

    async def get_all_paginated(
        self,
        uow: AsyncUnitOfWork,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        filter_instance,
        user: UserModel,
    ) -> dict:
        async def get_community_context(item: CommunityModel, context_data: dict):
            current_user = context_data["user"]
            if current_user is None:
                return None
            return {
                "community_roles": [
                    role.role_type for role in item.roles if current_user and role.user_id == current_user.id
                ],
            }

        base_stmt = uow.community_repo.get_full_query()

        paginator = AsyncPaginator(
            session=uow.session,
            model_class=CommunityModel,
            schema_class=CommunityShortReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            search_by=["title"],
            filter_instance=filter_instance,
            context_function=get_community_context,
            context_data={"user": user},
            query=base_stmt
        )
        return await paginator.get_result()


class CommunityUserRoleService:
    """ Service for community user roles. """
    def __init__(self):
        self.permission_service = TournamentPermissionService()

    async def get_user_roles(
        self,
        uow: AsyncUnitOfWork,
        community_id: uuid.UUID,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        filter_instance: CommunityUserRoleFilter,
        user: UserModel,
    ) -> dict:
        community = await uow.community_repo.find_one(id=community_id)
        raise_not_found_if_none(community, community_id)

        await self.permission_service.check_get_community_user_roles(uow, user, community=community)

        paginator = AsyncPaginator(
            session=uow.session,
            model_class=CommunityUserRoleModel,
            schema_class=CommunityUserRoleReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            search_by=[],
            filter_instance=filter_instance,
            query=uow.community_roles_repo.get_full_user_role_query(
                CommunityUserRoleModel.community_id == community_id,
            ),
        )
        return await paginator.get_result()

    async def get_user_role(
        self,
        uow: AsyncUnitOfWork,
        community_id: uuid.UUID,
        user_role_id: uuid.UUID,
        user: UserModel,
    ) -> CommunityUserRoleReadSchema:
        community = await uow.community_repo.find_one(id=community_id)
        raise_not_found_if_none(community, community_id)

        await self.permission_service.check_get_community_user_roles(uow, user, community=community)

        user_role = await uow.community_roles_repo.get_full_user_role(
            CommunityUserRoleModel.id == user_role_id,
            CommunityUserRoleModel.community_id == community_id,
        )
        raise_not_found_if_none(user_role, user_role_id)

        return CommunityUserRoleReadSchema.model_validate(user_role)

    async def create_user_role(
        self,
        uow: AsyncUnitOfWork,
        community_id: uuid.UUID,
        schema: CommunityUserRoleCreateSchema,
        user: UserModel,
    ) -> CommunityUserRoleReadSchema:
        community = await uow.community_repo.find_one(id=community_id)
        raise_not_found_if_none(community, community_id)

        await self.permission_service.check_set_community_user_roles(uow, user, community=community)

        data = schema.model_dump()
        data["community_id"] = community_id

        user_role = await uow.community_roles_repo.get_full_user_role(
            CommunityUserRoleModel.community_id == data["community_id"],
            CommunityUserRoleModel.user_id == data["user_id"],
            CommunityUserRoleModel.role_type == data["role_type"],
        )

        if not user_role:
            user_role_id = await uow.community_roles_repo.add_one(data)
            user_role = await uow.community_roles_repo.get_full_user_role(
                CommunityUserRoleModel.id == user_role_id,
            )

        await uow.commit()

        return CommunityUserRoleReadSchema.model_validate(user_role)

    async def delete_user_role(
        self,
        uow: AsyncUnitOfWork,
        community_id: uuid.UUID,
        user_role_id: uuid.UUID,
        user: UserModel,
    ):
        community = await uow.community_repo.find_one(id=community_id)
        raise_not_found_if_none(community, community_id)

        await self.permission_service.check_delete_community_user_roles(uow, user, community=community)

        user_role = await uow.community_roles_repo.get_full_user_role(
            CommunityUserRoleModel.id == user_role_id,
            CommunityUserRoleModel.community_id == community_id,
        )
        raise_not_found_if_none(user_role, user_role_id)

        if user_role.user_id == user.id:
            raise UserCannotDeleteOwnCommunityRolesException('User cannot delete own role')

        await uow.community_roles_repo.delete_one(user_role.id)
        await uow.commit()
