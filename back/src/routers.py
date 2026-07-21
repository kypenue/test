from cuply.addresses.routers import router as router_address
from cuply.auth.routers import router as router_auth
from cuply.games.routers import router as router_game
from cuply.accounts.routers import router as router_gamer
from cuply.platforms.routers import router as router_platform
from cuply.tournaments.routers import router as router_tournament
from cuply.stages.routers import router as router_stages
from cuply.series.routers import router as router_series
from cuply.matches.routers import router as router_matches
from cuply.users.routers import router as router_user
from cuply.telegram.routers import router as router_telegram
from cuply.upload.routers import router as router_upload
from cuply.base.routers import router as router_base
from cuply.communities.routers import router as router_communities
from cuply.feedback.routers import router as router_feedbacks
from cuply.teams.routers import router as router_teams

all_routers = [
    router_address,
    router_auth,
    router_game,
    router_gamer,
    router_platform,
    router_tournament,
    router_stages,
    router_series,
    router_matches,
    router_user,
    router_telegram,
    router_upload,
    router_base,
    router_communities,
    router_feedbacks,
    router_teams,
]
