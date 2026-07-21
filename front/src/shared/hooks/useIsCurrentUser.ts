import { useGetCurrentUserQuery } from "@/services/User/user";

export const useIsCurrentUser = (id: number | string) => {
    const { currentData } = useGetCurrentUserQuery();
    return (
        +id === currentData?.id || ["current", "me"].includes(id?.toString())
    );
};