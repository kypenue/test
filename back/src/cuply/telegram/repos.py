""" Repositories for Telegram models."""
from sqlalchemy import select
from sqlalchemy.orm import joinedload, selectinload

from backlib.repos import BaseAsyncRepo, BaseSyncRepo
from cuply.accounts.models import AccountModel
from cuply.matches.models import MatchModel
from cuply.telegram.models import TelegramTokenVerifierModel


class TelegramTokenVerifierSyncRepo(BaseSyncRepo):
    """ Sync repository for TelegramTokenVerifierModel. """
    model = TelegramTokenVerifierModel


class TelegramTokenVerifierAsyncRepo(BaseAsyncRepo):
    """ Async repository for TelegramTokenVerifierModel. """
    model = TelegramTokenVerifierModel

    def get_full_telegram_token_verifier_query(self, **filters):
        return select(TelegramTokenVerifierModel).filter_by(**filters).options(
            joinedload(TelegramTokenVerifierModel.user)
        )

    async def find_one(self, **filters):
        result = await self.session.execute(self.get_full_telegram_token_verifier_query(**filters))
        return result.unique().scalar_one_or_none()