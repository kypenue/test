import { useGetCurrentUserQuery } from "@/services/User/user";
import { SYSTEM_ROLES_MAP } from "@/shared/types/models/User";

export const useIsVerifiedUser = () => {
    const { currentData } = useGetCurrentUserQuery();

    const isVerified = currentData?.is_verified || false;

    const isActive = currentData?.is_active || false;

    return { isVerified, isActive };
};
