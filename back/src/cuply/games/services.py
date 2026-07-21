""" Services to interact with games. """
from backlib.pagination import AsyncPaginator
from backlib.repo_helpers import raise_not_found_if_none
from cuply.cuply_unit_of_work import AsyncUnitOfWork
from cuply.games.schemas import (
    GameReadSchema,
    GameCreateSchema,
    GameUpdateSchema,
)
from cuply.games.filters import GameFilter
from cuply.games.models import GameModel


class GameService:
    """ Service to interact with games. """
    async def get(self, uow: AsyncUnitOfWork, game_id: int) -> GameReadSchema:
        """ Get game by game id. """
        game = await uow.game_repo.find_one(id=game_id)
        raise_not_found_if_none(game, game_id)
        return GameReadSchema.model_validate(game)

    async def get_all_paginated(
        self,
        uow: AsyncUnitOfWork,
        page: int,
        per_page: int,
        order_by: list[str] | None,
        search: str,
        filter_instance: GameFilter,
    ) -> dict:
        """ Get all accounts paginated. """
        paginator = AsyncPaginator(
            session=uow.session,
            model_class=GameModel,
            schema_class=GameReadSchema,
            page=page,
            per_page=per_page,
            order_by=order_by,
            search=search,
            search_by=["name"],
            filter_instance=filter_instance,
            query=uow.game_repo.get_filter_by_query(),
        )
        return await paginator.get_result()

    async def create(
        self,
        uow: AsyncUnitOfWork,
        schema: GameCreateSchema,
    ) -> GameReadSchema:
        """ Create new game. """
        data = schema.model_dump()

        game_id = await uow.game_repo.add_one(data)
        game = await uow.game_repo.find_one(id=game_id)

        await uow.commit()

        return GameReadSchema.model_validate(game)

    async def update(
        self,
        uow: AsyncUnitOfWork,
        game_id: int,
        schema: GameUpdateSchema,
    ) -> GameReadSchema:
        """ Update game by id. """
        data = schema.model_dump()

        game = await uow.game_repo.find_one(id=game_id)
        raise_not_found_if_none(game, game_id)

        await uow.game_repo.edit_one(game_id, data)
        game = await uow.game_repo.find_one(id=game_id)

        await uow.commit()

        return GameReadSchema.model_validate(game)

    async def delete(
        self,
        uow: AsyncUnitOfWork,
        game_id: int,
    ):
        """ Delete game by id. """
        game = await uow.game_repo.find_one(id=game_id)
        raise_not_found_if_none(game, game_id)

        await uow.game_repo.delete_one(game_id)
        await uow.commit()
