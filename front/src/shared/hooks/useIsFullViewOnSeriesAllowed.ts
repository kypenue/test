import { useGetCurrentUserQuery } from "@/services/User/user";
import { MatchPlayerModel } from "@/shared/types/models/Series";
import { useIsAdmin } from "@/shared/hooks/useIsAdmin";

export const useIsFullViewOnSeriesAllowed = (
    homePlayerAccount?: MatchPlayerModel,
    guestPlayerAccount?: MatchPlayerModel,
) => {
    const { currentData } = useGetCurrentUserQuery();
    const { isAdmin } = useIsAdmin();

    return (
        isAdmin ||
        homePlayerAccount?.user.id === currentData?.id ||
        guestPlayerAccount?.user.id === currentData?.id
    );
};
