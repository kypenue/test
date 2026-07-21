import { useParams } from "next/navigation";
import { useIsCurrentUser } from "@/shared/hooks/useIsCurrentUser";
import {
    useGetCurrentUserGamerAccountsQuery,
    useGetGamerAccountsQuery,
} from "@/services/Games/games";
import { GamerModel } from "@/shared/types/models/Games";

interface ReturnProps {
    gamesData: Array<GamerModel> | undefined;
    isLoading: boolean;
}
export const useGetProfileGames = (): ReturnProps => {
    const params = useParams<{ userId: string }>();
    const isCurrentUser = useIsCurrentUser(params?.userId);
    const {
        currentData: currentUserAccounts,
        isLoading: isCurrentUserAccountsLoading,
    } = useGetCurrentUserGamerAccountsQuery({}, { skip: !isCurrentUser });
    const { currentData: userAccounts, isLoading: isUserAccountsLoading } =
        useGetGamerAccountsQuery(
            {
                user_id: params?.userId,
            },
            { skip: isCurrentUser },
        );

    const isLoading = isCurrentUserAccountsLoading || isUserAccountsLoading;

    const gamesData = (currentUserAccounts || userAccounts)?.payload;

    return { gamesData, isLoading };
};
