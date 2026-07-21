import { useGetCurrentUserQuery } from "@/services/User/user";
import { useIsAdmin } from "@/shared/hooks/useIsAdmin";
import { useParams } from "next/navigation";
import { useTournamentRole } from "@/shared/hooks/useTournamentRole";

interface useRoleInMatchProps {
    homePlayerId?: number;
    guestPlayerId?: number;
}

export const useRoleInMatch = ({
    homePlayerId,
    guestPlayerId,
}: useRoleInMatchProps) => {
    const params = useParams<{ tournamentId: string }>();
    const { currentData: user } = useGetCurrentUserQuery();
    const { isAdmin } = useIsAdmin();
    const { isSystemAdmin, isTournamentOrganizer, isTournamentModerator } =
        useTournamentRole(params?.tournamentId ?? "");
    const isGuestPlayer = user?.id === guestPlayerId;
    const isHomePlayer = user?.id === homePlayerId;

    return {
        isTournamentManagementAvailable:
            !!isSystemAdmin ||
            !!isTournamentOrganizer ||
            !!isTournamentModerator,
        isAdmin: !!isSystemAdmin,
        isTournamentOrganizer,
        isTournamentModerator,
        isGuestPlayer,
        isHomePlayer,
        isViewer: !isAdmin && !isGuestPlayer && !isHomePlayer,
    };
};
