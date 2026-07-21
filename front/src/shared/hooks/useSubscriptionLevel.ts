import { useGetCurrentUserQuery } from "@/services/User/user";
import { SYSTEM_ROLES_MAP } from "@/shared/types/models/User";
import _ from "lodash";

export const useSubscriptionLevel = () => {
    const { currentData } = useGetCurrentUserQuery();

    const isFullTournamentCreator =
        !!_.intersection(currentData?.system_roles, [
            SYSTEM_ROLES_MAP.ADMIN,
            SYSTEM_ROLES_MAP.TOURNAMENT_CREATOR,
        ])?.length || false;

    return { isFullTournamentCreator };
};
