from sqlalchemy import select
from sqlalchemy.orm import joinedload

from backlib.repos import BaseAsyncRepo
from cuply.accounts.models import AccountModel
from cuply.games.models import GameModel
from cuply.stages.models import StageParticipantModel


class StageParticipantAsyncRepo(BaseAsyncRepo):
    """ Async repository for StageParticipantModel. """
    model = StageParticipantModel

    async def get_full_participant(self, *filters):
        query = select(StageParticipantModel).filter(*filters).options(
            joinedload(StageParticipantModel.account).options(
                joinedload(AccountModel.user),
                joinedload(AccountModel.platform),
                joinedload(AccountModel.game).options(
                    joinedload(GameModel.image)
                ),
            ),
        ).order_by(StageParticipantModel.order_number)
        result = await self.session.execute(query)
        return result.scalars().all()
