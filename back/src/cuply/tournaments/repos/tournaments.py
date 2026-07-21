""" Repositories for tournaments models. """
from datetime import datetime
from operator import and_
from typing import Optional

import sqlalchemy
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload, joinedload

from backlib.repos import BaseSyncRepo, BaseAsyncRepo
from cuply.accounts.models import AccountModel
from cuply.auth.models import UserModel
from cuply.communities.models import CommunityModel, CommunityUserRoleModel, CommunityRoleTypes
from cuply.games.models import GameModel
from cuply.stages.models import StageModel
from cuply.tournaments.models import TournamentModel, LifecycleTournamentStatus, TournamentUserRoleModel, \
    TournamentRoleTypes, TournamentRegisteredUserModel, TournamentPaymentType


class TournamentSyncRepo(BaseSyncRepo):
    """ Sync repository for TournamentModel. """
    model = TournamentModel


class TournamentAsyncRepo(BaseAsyncRepo):
    """ Async repository for TournamentModel. """
    model = TournamentModel

    def get_full_filter_by_query(self, **filter_by):
        """
        Тот же фильтр, но с EAGER loading нужных relationship,
        чтобы мы могли спокойно делать Pydantic-схемы.
        """
        base_query = self.get_filter_by_query(**filter_by)
        return base_query.options(
            # Пример: подгружаем stages, creator, game, cover_image, header_image и т.д.
            selectinload(TournamentModel.stages).options(
                joinedload(StageModel.se_stage),
                joinedload(StageModel.de_stage),
                joinedload(StageModel.swiss_stage),
                joinedload(StageModel.league_stage),
                joinedload(StageModel.wildcard_stage),
            ),
            joinedload(TournamentModel.game).options(
                joinedload(GameModel.image)
            ),
            joinedload(TournamentModel.creator),
            joinedload(TournamentModel.cover_image),
            joinedload(TournamentModel.header_image),
        )

    async def find_all(self, **filter_by):
        """
        Старый метод, который продолжит работать как раньше,
        но теперь и 'id__in=[...], any_field__in=[...]' тоже поддерживается.
        """
        stmt = self.get_filter_by_query(**filter_by)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def find_full_all(self, **filter_by):
        """
        Аналог find_all, но с полной подзагрузкой (чтобы не было MissingGreenlet).
        """
        stmt = self.get_full_filter_by_query(**filter_by)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    def get_tournament_query(self, *filters):
        """
        Старые методы тоже пусть остаются, чтобы ничего не ломать.
        """
        return select(TournamentModel).filter(*filters)

    async def get_tournament(self, *filters):
        result = await self.session.execute(self.get_tournament_query(*filters))
        return result.scalar_one_or_none()

    async def get_tournaments(self, *filters):
        result = await self.session.execute(self.get_tournament_query(*filters))
        return result.scalars().all()

    def get_full_tournament_query(self, *filters):
        """
        Старый вариант 'full' — пусть остаётся, чтобы не ломать код,
        который уже его использует.
        """
        return (
            select(TournamentModel)
            .filter(*filters)
            .options(
                selectinload(TournamentModel.stages).options(
                    joinedload(StageModel.se_stage),
                    joinedload(StageModel.de_stage),
                    joinedload(StageModel.swiss_stage),
                    joinedload(StageModel.league_stage),
                    joinedload(StageModel.wildcard_stage),
                ),
                selectinload(TournamentModel.platforms),
                joinedload(TournamentModel.game).options(
                    joinedload(GameModel.image)
                ),
                joinedload(TournamentModel.creator),
                joinedload(TournamentModel.cover_image),
                joinedload(TournamentModel.header_image),
                joinedload(TournamentModel.community).options(
                    selectinload(CommunityModel.games).options(
                        joinedload(GameModel.image)
                    ),
                    selectinload(CommunityModel.roles),
                    joinedload(CommunityModel.creator),
                ),
                selectinload(TournamentModel.roles),
            )
        )

    async def get_full_tournament(self, *filters):
        """
        Старый метод 'get_full_tournament'.
        """
        result = await self.session.execute(self.get_full_tournament_query(*filters))
        return result.scalar_one_or_none()

    async def get_full_tournaments(self, *filters):
        """
        Старый метод 'get_full_tournaments'.
        """
        result = await self.session.execute(self.get_full_tournament_query(*filters))
        return result.scalars().all()

    def get_my_tournaments_query(self, *filters, user: Optional[UserModel]):
        if not user:
            return self.get_full_tournament_query(*filters).filter(sqlalchemy.false())
        return (
            self.get_full_tournament_query(*filters)
            .join(TournamentRegisteredUserModel, TournamentModel.registrations, isouter=True)
            .join(AccountModel, TournamentRegisteredUserModel.account, isouter=True)
            .join(TournamentUserRoleModel, TournamentModel.roles, isouter=True)
            .join(CommunityModel, TournamentModel.community, isouter=True)
            .join(CommunityUserRoleModel, CommunityModel.roles, isouter=True)
            .filter(
                or_(
                    and_(
                        TournamentUserRoleModel.user_id == user.id,
                        TournamentUserRoleModel.role_type.in_([
                            TournamentRoleTypes.MODERATOR,
                            TournamentRoleTypes.ORGANIZER
                        ]),
                    ),
                    and_(
                        CommunityUserRoleModel.user_id == user.id,
                        CommunityUserRoleModel.role_type.in_([
                            CommunityRoleTypes.MODERATOR,
                            CommunityRoleTypes.ORGANIZER,
                        ])
                    ),
                    AccountModel.user_id == user.id,
                ),
            )
        )

    def get_can_manage_query(self, *filters, user: Optional[UserModel]):
        if not user:
            return self.get_full_tournament_query(*filters).filter(sqlalchemy.false())
        return (
            self.get_full_tournament_query(*filters)
            .join(TournamentRegisteredUserModel, TournamentModel.registrations, isouter=True)
            .join(AccountModel, TournamentRegisteredUserModel.account, isouter=True)
            .join(TournamentUserRoleModel, TournamentModel.roles, isouter=True)
            .join(CommunityModel, TournamentModel.community, isouter=True)
            .join(CommunityUserRoleModel, CommunityModel.roles, isouter=True)
            .filter(
                or_(
                    and_(
                        TournamentUserRoleModel.user_id == user.id,
                        TournamentUserRoleModel.role_type.in_([
                            TournamentRoleTypes.MODERATOR,
                            TournamentRoleTypes.ORGANIZER
                        ]),
                    ),
                    and_(
                        CommunityUserRoleModel.user_id == user.id,
                        CommunityUserRoleModel.role_type.in_([
                            CommunityRoleTypes.MODERATOR,
                            CommunityRoleTypes.ORGANIZER,
                        ])
                    ),
                ),
            )
        )

    def get_recommended_tournaments_query(self, *filters):
        return (
            self.get_full_tournament_query(*filters)
            .filter(
                and_(
                    TournamentModel.payment_type.in_([
                        TournamentPaymentType.PAYED,
                        TournamentPaymentType.PAYED_COMMUNITY,
                    ]),
                    TournamentModel.lifecycle_status.notin_([
                        LifecycleTournamentStatus.TOURNAMENT_ENDED,
                        LifecycleTournamentStatus.TOURNAMENT_ARCHIVED,
                    ]),
                ),
            ).order_by(
                TournamentModel.is_primary, TournamentModel.created_at,
            )
        )

    async def find_all_in_ids(self, ids: list[int]):
        """
        Новый удобный метод, где сразу подгружаем все связи.
        Если ids пустой — вернём [].
        """
        if not ids:
            return []

        stmt = self.get_full_tournament_query(TournamentModel.id.in_(ids))
        res = await self.session.execute(stmt)
        return res.scalars().unique().all()

    async def count_unfinished_by_community(self, community_id) -> int:
        stmt = select(func.count(TournamentModel.id)).where(
            TournamentModel.community_id == community_id,
            TournamentModel.lifecycle_status.notin_(
                [LifecycleTournamentStatus.TOURNAMENT_ENDED, LifecycleTournamentStatus.TOURNAMENT_ARCHIVED]
            )
        )
        result = await self.session.execute(stmt)
        return result.scalar() or 0

    async def count_unfinished_by_creator(self, creator_id, payment_type: TournamentPaymentType = None) -> int:
        if payment_type:
            stmt = select(func.count(TournamentModel.id)).where(
                TournamentModel.creator_id == creator_id,
                TournamentModel.payment_type == payment_type,
                TournamentModel.lifecycle_status.notin_(
                    [LifecycleTournamentStatus.TOURNAMENT_ENDED, LifecycleTournamentStatus.TOURNAMENT_ARCHIVED]
                )
            )
        else:
            stmt = select(func.count(TournamentModel.id)).where(
                TournamentModel.creator_id == creator_id,
                TournamentModel.lifecycle_status.notin_(
                    [LifecycleTournamentStatus.TOURNAMENT_ENDED, LifecycleTournamentStatus.TOURNAMENT_ARCHIVED]
                )
            )
        result = await self.session.execute(stmt)
        return result.scalar() or 0

