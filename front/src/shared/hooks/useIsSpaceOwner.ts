import { useGetCommunityByIdQuery } from "@/services/Communities/community";
import { useGetCurrentUserQuery } from "@/services/User/user";

export const useIsSpaceOwner = (slug: string) => {
    const { currentData: community, isLoading: isCommunityLoading } =
        useGetCommunityByIdQuery({
            communityId: slug,
        });
    const { currentData: user, isLoading: isUserLoading } =
        useGetCurrentUserQuery();

    const isOwner = community?.creator.id === user?.id || false;

    const isLoading = isCommunityLoading || isUserLoading;

    return { isOwner, isLoading };
};
