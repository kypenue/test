import { useGetCurrentUserQuery } from "@/services/User/user";
import { SYSTEM_ROLES_MAP } from "@/shared/types/models/User";

export const useIsAdmin = () => {
    const { currentData } = useGetCurrentUserQuery();

    const isAdmin =
        currentData?.system_roles.includes(SYSTEM_ROLES_MAP.ADMIN) || false;

    return { isAdmin };
};
