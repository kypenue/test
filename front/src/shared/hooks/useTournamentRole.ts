import { useGetCurrentUserQuery } from "@/services/User/user";
import { useGetTournamentByIdQuery } from "@/services/Tournament/tournament";
import { SYSTEM_ROLES_MAP } from "@/shared/types/models/User";
import { TOURNAMENT_ROLES_MAP } from "@/shared/types/models/Tournament";

export const useTournamentRole = (tournamentId?: string) => {
    const { currentData } = useGetCurrentUserQuery();
    const { currentData: tournament } = useGetTournamentByIdQuery(
        {
            id: tournamentId ?? "",
        },
        { skip: !tournamentId },
    );
    const isSystemAdmin = currentData?.system_roles.includes(
        SYSTEM_ROLES_MAP.ADMIN,
    );
    const isTournamentOrganizer =
        tournament?.tournament_roles.includes(TOURNAMENT_ROLES_MAP.ORGANIZER) ||
        isSystemAdmin;
    const isTournamentModerator = tournament?.tournament_roles.includes(
        TOURNAMENT_ROLES_MAP.MODERATOR,
    );

    return { isSystemAdmin, isTournamentOrganizer, isTournamentModerator };
};
