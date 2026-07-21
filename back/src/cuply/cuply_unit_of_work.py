from backlib.unit_of_work import (
    AbstractUnitOfWork,
    AbstractAsyncUnitOfWork,
)
from cuply.base.repos.storage import (
    KeyValueStorageModelAsyncRepo,
    KeyValueStorageModelSyncRepo,
)
from cuply.communities.repos import (
    CommunityAsyncRepo,
    CommunitySyncRepo,
    CommunityGameAsyncRepo,
    CommunityGameSyncRepo,
    CommunityUserRoleRepo,
)
from cuply.feedback.repos import FeedbackAsyncRepo
from cuply.games.repos import (
    GameSyncRepo,
    GameAsyncRepo,
)
from cuply.accounts.repos import (
    AccountSyncRepo,
    AccountAsyncRepo,
)
from cuply.platforms.repos import (
    PlatformSyncRepo,
    PlatformAsyncRepo,
)
from cuply.series.repos.de import DESeriesModelAsyncRepo
from cuply.series.repos.forecast_competition import ForecastCompetitionBetModelAsyncRepo
from cuply.series.repos.se import SESeriesModelAsyncRepo
from cuply.series.repos.series import SeriesModelAsyncRepo
from cuply.series.repos.swiss import SwissSeriesModelAsyncRepo
from cuply.matches.repos.complaints import MatchComplaintSyncRepo, MatchComplaintAsyncRepo
from cuply.matches.repos.results import MatchResultSyncRepo, MatchResultAsyncRepo
from cuply.matches.repos.matches import SeriesMatchSyncRepo, SeriesMatchAsyncRepo
from cuply.series.repos.feedback import SeriesFeedbackSyncRepo, SeriesFeedbackAsyncRepo
from cuply.series.repos.wildcard import WildcardSeriesModelAsyncRepo
from cuply.stages.repos.de import (
    DoubleEliminationStageRoundModelAsyncRepo,
    DEStageAsyncRepo,
)
from cuply.stages.repos.participants import StageParticipantAsyncRepo
from cuply.stages.repos.se import (
    SingleEliminationStageRoundModelAsyncRepo,
    SEStageAsyncRepo,
)
from cuply.stages.repos.stages import (
    TournamentStageAsyncRepo,
    TournamentStageSyncRepo,
    LeagueStageAsyncRepo,
    LeagueStageSyncRepo,
)
from cuply.stages.repos.swiss import (
    SwissStageAsyncRepo,
    SwissStageRoundModelAsyncRepo,
    SwissStageSeriesGroupModelAsyncRepo,
)
from cuply.stages.repos.wildcard import (
    WildcardStageAsyncRepo,
    WildcardStageRoundModelAsyncRepo,
)
from cuply.teams.repos.auction_bets import AuctionBetAsyncRepo
from cuply.teams.repos.teams import TeamAsyncRepo
from cuply.teams.repos.websocket_messages import (
    WebSocketTeamMessageAsyncRepo,
    WebSocketTeamMessageDeliveryAsyncRepo,
)
from cuply.tournaments.repos.tournaments import (
    TournamentSyncRepo,
    TournamentAsyncRepo, )
from cuply.tournaments.repos.roles import TournamentUserRoleRepo
from cuply.tournaments.repos.registration import (
    TournamentRegisteredUserSyncRepo,
    TournamentRegisteredUserAsyncRepo,
)
from cuply.tournaments.repos.user_block import (
    UserBlockSyncRepo,
    UserBlockAsyncRepo,
)
from cuply.tournaments.repos.platforms import (
    TournamentAllowedPlatformSyncRepo,
    TournamentAllowedPlatformAsyncRepo,
)
from cuply.telegram.repos import (
    TelegramTokenVerifierSyncRepo,
    TelegramTokenVerifierAsyncRepo,
)
from cuply.users.repos.roles import SystemUserRoleAsyncRepo
from cuply.users.repos.users import (
    UserSyncRepo,
    UserAsyncRepo,
)
from cuply.upload.repo import UploadSyncRepo, UploadAsyncRepo


class SyncUnitOfWork(AbstractUnitOfWork):
    def __init_repos__(self):
        self.user_repo = UserSyncRepo(self.session)
        self.account_repo = AccountSyncRepo(self.session)
        self.game_repo = GameSyncRepo(self.session)
        self.platform_repo = PlatformSyncRepo(self.session)
        self.telegram_repo = TelegramTokenVerifierSyncRepo(self.session)
        self.tournament_repo = TournamentSyncRepo(self.session)
        self.registration_repo = TournamentRegisteredUserSyncRepo(self.session)
        self.tournament_platforms = TournamentAllowedPlatformSyncRepo(self.session)
        self.user_block_repo = UserBlockSyncRepo(self.session)
        self.upload_repo = UploadSyncRepo(self.session)
        self.match_repo = SeriesMatchSyncRepo(self.session)
        self.match_result_repo = MatchResultSyncRepo(self.session)
        self.match_complaint_repo = MatchComplaintSyncRepo(self.session)
        self.series_feedback_repo = SeriesFeedbackSyncRepo(self.session)
        self.tournament_stages_repo = TournamentStageSyncRepo(self.session)
        self.league_repo = LeagueStageSyncRepo(self.session)
        self.key_value = KeyValueStorageModelSyncRepo(self.session)
        self.community_repo = CommunitySyncRepo(self.session)
        self.community_game_repo = CommunityGameSyncRepo(self.session)


class AsyncUnitOfWork(AbstractAsyncUnitOfWork):

    async def flush(self):
        await self.session.flush()

    def __init_repos__(self):
        self.user_repo = UserAsyncRepo(self.session)
        self.system_role_repo = SystemUserRoleAsyncRepo(self.session)

        self.upload_repo = UploadAsyncRepo(self.session)
        self.telegram_repo = TelegramTokenVerifierAsyncRepo(self.session)

        self.game_repo = GameAsyncRepo(self.session)

        self.account_repo = AccountAsyncRepo(self.session)

        self.platform_repo = PlatformAsyncRepo(self.session)

        self.tournament_repo = TournamentAsyncRepo(self.session)
        self.user_block_repo = UserBlockAsyncRepo(self.session)
        self.tournament_platforms = TournamentAllowedPlatformAsyncRepo(self.session)
        self.registration_repo = TournamentRegisteredUserAsyncRepo(self.session)
        self.tournament_roles_repo = TournamentUserRoleRepo(self.session)
        self.stages_repo = TournamentStageAsyncRepo(self.session)
        self.series = SeriesModelAsyncRepo(self.session)
        self.series_feedback_repo = SeriesFeedbackAsyncRepo(self.session)
        self.match_repo = SeriesMatchAsyncRepo(self.session)
        self.match_result_repo = MatchResultAsyncRepo(self.session)
        self.match_complaint_repo = MatchComplaintAsyncRepo(self.session)

        self.stage_participant = StageParticipantAsyncRepo(self.session)

        self.swiss_stage_repo = SwissStageAsyncRepo(self.session)
        self.swiss_round_repo = SwissStageRoundModelAsyncRepo(self.session)
        self.swiss_series_group_repo = SwissStageSeriesGroupModelAsyncRepo(self.session)
        self.swiss_series = SwissSeriesModelAsyncRepo(self.session)

        self.de_stage = DEStageAsyncRepo(self.session)
        self.de_rounds = DoubleEliminationStageRoundModelAsyncRepo(self.session)
        self.de_series = DESeriesModelAsyncRepo(self.session)

        self.se_stage = SEStageAsyncRepo(self.session)
        self.se_series = SESeriesModelAsyncRepo(self.session)
        self.se_rounds = SingleEliminationStageRoundModelAsyncRepo(self.session)

        self.wildcard_stage_repo = WildcardStageAsyncRepo(self.session)
        self.wildcard_round_repo = WildcardStageRoundModelAsyncRepo(self.session)
        self.wildcard_series = WildcardSeriesModelAsyncRepo(self.session)

        self.league_repo = LeagueStageAsyncRepo(self.session)

        self.key_value = KeyValueStorageModelAsyncRepo(self.session)

        self.community_repo = CommunityAsyncRepo(self.session)
        self.community_game_repo = CommunityGameAsyncRepo(self.session)
        self.community_roles_repo = CommunityUserRoleRepo(self.session)

        self.feedback_repo = FeedbackAsyncRepo(self.session)

        self.forecast_bet_repo = ForecastCompetitionBetModelAsyncRepo(self.session)

        self.team = TeamAsyncRepo(self.session)
        self.auction_bet = AuctionBetAsyncRepo(self.session)
        self.websocket_team_message = WebSocketTeamMessageAsyncRepo(self.session)
        self.websocket_team_message_delivery = WebSocketTeamMessageDeliveryAsyncRepo(self.session)
