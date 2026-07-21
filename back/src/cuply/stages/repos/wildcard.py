from sqlalchemy import select
from sqlalchemy.orm import selectinload, joinedload

from backlib.repos import BaseAsyncRepo
from cuply.accounts.models import AccountModel
from cuply.games.models import GameModel
from cuply.matches.models import MatchModel
from cuply.series.models import SeriesModel, WildcardSeriesModel
from cuply.stages.models import (
    WildcardStageModel,
    WildcardStageRoundModel,
)
from cuply.teams.models import TeamModel
from cuply.tournaments.models import TournamentRegisteredUserModel


class WildcardStageAsyncRepo(BaseAsyncRepo):
    """ Async repository for WildcardStageModel. """
    model = WildcardStageModel

    def get_full_stage_query(self, *filters):
        return select(WildcardStageModel).filter(*filters).options(
            selectinload(WildcardStageModel.rounds).options(
                selectinload(WildcardStageRoundModel.series).options(
                    selectinload(WildcardSeriesModel.series).options(
                        joinedload(SeriesModel.gamer1).options(
                            joinedload(AccountModel.game).options(
                                joinedload(GameModel.image)
                            ),
                            joinedload(AccountModel.platform),
                            joinedload(AccountModel.user),
                        ),
                        joinedload(SeriesModel.gamer2).options(
                            joinedload(AccountModel.game).options(
                                joinedload(GameModel.image)
                            ),
                            joinedload(AccountModel.platform),
                            joinedload(AccountModel.user),
                        ),
                        joinedload(SeriesModel.participant1).options(
                            joinedload(TournamentRegisteredUserModel.account).options(
                                joinedload(AccountModel.user),
                                joinedload(AccountModel.platform),
                                joinedload(AccountModel.game).options(
                                    joinedload(GameModel.image)
                                ),
                            ),
                            joinedload(TournamentRegisteredUserModel.team).options(
                                joinedload(TeamModel.game),
                                joinedload(TeamModel.image),
                                joinedload(TeamModel.creator),
                            ),
                            joinedload(TournamentRegisteredUserModel.tournament),
                        ),
                        joinedload(SeriesModel.participant2).options(
                            joinedload(TournamentRegisteredUserModel.account).options(
                                joinedload(AccountModel.user),
                                joinedload(AccountModel.platform),
                                joinedload(AccountModel.game).options(
                                    joinedload(GameModel.image)
                                ),
                            ),
                            joinedload(TournamentRegisteredUserModel.team).options(
                                joinedload(TeamModel.game),
                                joinedload(TeamModel.image),
                                joinedload(TeamModel.creator),
                            ),
                            joinedload(TournamentRegisteredUserModel.tournament),
                        ),
                        selectinload(SeriesModel.series_forecast_competition_bets),
                        selectinload(SeriesModel.matches).options(
                            selectinload(MatchModel.result),
                            joinedload(MatchModel.home_player_account),
                            joinedload(MatchModel.guest_player_account),
                            joinedload(MatchModel.home_participant).options(
                                joinedload(TournamentRegisteredUserModel.account).options(
                                    joinedload(AccountModel.user),
                                    joinedload(AccountModel.platform),
                                    joinedload(AccountModel.game).options(
                                        joinedload(GameModel.image)
                                    ),
                                ),
                                joinedload(TournamentRegisteredUserModel.team).options(
                                    joinedload(TeamModel.game),
                                    joinedload(TeamModel.image),
                                    joinedload(TeamModel.creator),
                                ),
                                joinedload(TournamentRegisteredUserModel.tournament),
                            ),
                            joinedload(MatchModel.guest_participant).options(
                                joinedload(TournamentRegisteredUserModel.account).options(
                                    joinedload(AccountModel.user),
                                    joinedload(AccountModel.platform),
                                    joinedload(AccountModel.game).options(
                                        joinedload(GameModel.image)
                                    ),
                                ),
                                joinedload(TournamentRegisteredUserModel.team).options(
                                    joinedload(TeamModel.game),
                                    joinedload(TeamModel.image),
                                    joinedload(TeamModel.creator),
                                ),
                                joinedload(TournamentRegisteredUserModel.tournament),
                            ),
                        ),
                    ),
                ),
            ),
        )

    async def get_full_stage(self, *filters):
        result = await self.session.execute(self.get_full_stage_query(*filters))
        return result.scalar_one_or_none()

    async def get_full_stages(self, *filters):
        result = await self.session.execute(self.get_full_stage_query(*filters))
        return result.scalars().all()


class WildcardStageRoundModelAsyncRepo(BaseAsyncRepo):
    """ Async repository for WildcardStageRoundModel. """
    model = WildcardStageRoundModel

    def get_full_round_query(self, *filters):
        return select(WildcardStageRoundModel).filter(*filters).options(
            selectinload(WildcardStageRoundModel.series).options(
                joinedload(WildcardSeriesModel.series).options(
                    joinedload(SeriesModel.gamer1).options(
                        joinedload(AccountModel.user),
                        joinedload(AccountModel.game).options(
                            joinedload(GameModel.image)
                        ),
                        joinedload(AccountModel.platform),
                    ),
                    joinedload(SeriesModel.gamer2).options(
                        joinedload(AccountModel.user),
                        joinedload(AccountModel.game).options(
                            joinedload(GameModel.image)
                        ),
                        joinedload(AccountModel.platform),
                    ),
                    joinedload(SeriesModel.participant1).options(
                        joinedload(TournamentRegisteredUserModel.account).options(
                            joinedload(AccountModel.user),
                            joinedload(AccountModel.platform),
                            joinedload(AccountModel.game).options(
                                joinedload(GameModel.image)
                            ),
                        ),
                        joinedload(TournamentRegisteredUserModel.team).options(
                            joinedload(TeamModel.game),
                            joinedload(TeamModel.image),
                            joinedload(TeamModel.creator),
                        ),
                        joinedload(TournamentRegisteredUserModel.tournament),
                    ),
                    joinedload(SeriesModel.participant2).options(
                        joinedload(TournamentRegisteredUserModel.account).options(
                            joinedload(AccountModel.user),
                            joinedload(AccountModel.platform),
                            joinedload(AccountModel.game).options(
                                joinedload(GameModel.image)
                            ),
                        ),
                        joinedload(TournamentRegisteredUserModel.team).options(
                            joinedload(TeamModel.game),
                            joinedload(TeamModel.image),
                            joinedload(TeamModel.creator),
                        ),
                        joinedload(TournamentRegisteredUserModel.tournament),
                    ),
                    selectinload(SeriesModel.series_forecast_competition_bets),
                    selectinload(SeriesModel.matches).options(
                        selectinload(MatchModel.result).options(),
                        joinedload(MatchModel.home_participant).options(
                            joinedload(TournamentRegisteredUserModel.account).options(
                                joinedload(AccountModel.user),
                                joinedload(AccountModel.platform),
                                joinedload(AccountModel.game).options(
                                    joinedload(GameModel.image)
                                ),
                            ),
                            joinedload(TournamentRegisteredUserModel.team).options(
                                joinedload(TeamModel.game),
                                joinedload(TeamModel.image),
                                joinedload(TeamModel.creator),
                            ),
                            joinedload(TournamentRegisteredUserModel.tournament),
                        ),
                        joinedload(MatchModel.guest_participant).options(
                            joinedload(TournamentRegisteredUserModel.account).options(
                                joinedload(AccountModel.user),
                                joinedload(AccountModel.platform),
                                joinedload(AccountModel.game).options(
                                    joinedload(GameModel.image)
                                ),
                            ),
                            joinedload(TournamentRegisteredUserModel.team).options(
                                joinedload(TeamModel.game),
                                joinedload(TeamModel.image),
                                joinedload(TeamModel.creator),
                            ),
                            joinedload(TournamentRegisteredUserModel.tournament),
                        ),
                    ),
                ),
            ),
        )

    async def get_full_round(self, *filters):
        result = await self.session.execute(self.get_full_round_query(*filters))
        return result.scalar_one_or_none()

    async def get_full_rounds(self, *filters):
        result = await self.session.execute(self.get_full_round_query(*filters))
        return result.scalars().all()
