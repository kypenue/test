import { Api as api } from "../api";
import { PolicyModel } from "@/shared/types/models/Base";

export const addTagTypes = [
    "PERSONAL_POLICY",
    "COOKIE_POLICY",
] as const;
const baseApi = api
    .enhanceEndpoints({
        addTagTypes,
    })
    .injectEndpoints({
        endpoints: (build) => ({
            getPersonalPolicy: build.query<PolicyModel, void>({
                query: () => ({ url: '/base/personal-data-policy' }),
                providesTags: ["PERSONAL_POLICY"],
            }),
            getCookiesPolicy: build.query<PolicyModel, void>({
                query: () => ({ url: '/base/cookie-policy' }),
                providesTags: ["COOKIE_POLICY"],
            }),
        }),
        overrideExisting: false,
    });
export { baseApi };

export const {
    useGetCookiesPolicyQuery,
    useGetPersonalPolicyQuery,
} = baseApi;
