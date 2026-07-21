import { Api as api } from "../api";
import { getBase64 } from "@/shared/lib/getBase64";
import {
    AuthenticateArg,
    AuthenticateResponse,
    GetAllUserArg,
    GetCityArg,
    GetCityResponse,
    GetCountryArg,
    GetCountryResponse,
    GetCurrentUserArg,
    GetUserByIdArg,
    GetUserByIdResponse,
} from "@/services/User/user.model";
import { PaginatedResponse } from "@/shared/types/models/common";
import { UserModel } from "@/shared/types/models/User";

export const addTagTypes = [
    "USER",
    "TOKEN",
    "CURRENT_USER",
    "DICTIONARY",
    "CURRENT_USER_INFO",
    "ALL_USERS",
] as const;
const userApi = api
    .enhanceEndpoints({
        addTagTypes,
    })
    .injectEndpoints({
        endpoints: (build) => ({
            getUserById: build.query<GetUserByIdResponse, GetUserByIdArg>({
                query: (queryArg) => ({ url: `/users/${queryArg}` }),
                providesTags: ["USER"],
                transformResponse: (data: GetUserByIdResponse) => {
                    return {
                        ...data,
                        birth_date: data.birth_date
                            .split("-")
                            .reverse()
                            .join("."),
                    };
                },
            }),
            getProfilePhoto: build.query<string, void>({
                query: () => ({
                    url: `/uploads/files/profile-photo`,
                    responseType: "blob",
                    responseHandler: async (res) => {
                        if (!res.ok) {
                            return null;
                        }
                        return await res.blob();
                    },
                }),
                transformResponse: async (response: Blob | string) => {
                    if (response instanceof Blob) {
                        return await getBase64(response);
                    }
                    return "";
                },
                providesTags: ["CURRENT_USER"],
            }),
            deletePhoto: build.mutation<any, void>({
                query: () => ({
                    url: `/uploads/files/profile-photo`,
                    method: "DELETE",
                }),
                invalidatesTags: ["CURRENT_USER"],
            }),
            getProfilePhotoById: build.query<string, { id: string }>({
                query: ({ id }) => ({
                    url: `/uploads/files/profile-photo${id === "current" ? "" : `/${id}`}`,
                    responseType: "blob",
                    responseHandler: async (res) => {
                        if (!res.ok) {
                            return null;
                        }
                        return await res.blob();
                    },
                }),
                transformResponse: async (response: Blob | string) => {
                    if (response instanceof Blob) {
                        return await getBase64(response);
                    }
                    return "";
                },
                providesTags: ["USER"],
            }),
            authenticate: build.query<AuthenticateResponse, AuthenticateArg>({
                query: (queryArg) => ({
                    url: `/token`,
                    method: "POST",
                    body: queryArg,
                }),
                providesTags: ["CURRENT_USER"],
            }),
            updateUser: build.mutation<
                GetUserByIdResponse,
                Partial<GetUserByIdResponse>
            >({
                query: ({ id, ...body }) => ({
                    url: `/users/${id}`,
                    method: "PATCH",
                    body,
                }),
                invalidatesTags: ["CURRENT_USER_INFO"],
            }),
            getAllUsers: build.query<
                PaginatedResponse<Array<UserModel>>,
                GetAllUserArg
            >({
                query: (params) => ({ url: `/users/`, params }),
                providesTags: ["ALL_USERS"],
            }),
            getCurrentUser: build.query<GetUserByIdResponse, GetCurrentUserArg>(
                {
                    query: () => ({ url: `/users/current` }),
                    providesTags: ["CURRENT_USER_INFO"],
                    transformResponse: (data: GetUserByIdResponse) => {
                        return {
                            ...data,
                            birth_date: data.birth_date
                                .split("-")
                                .reverse()
                                .join("."),
                        };
                    },
                },
            ),
            verifyTelegram: build.mutation<
                VerifyTelegramResponse,
                VerifyTelegramRequest
            >({
                query: (body) => ({
                    url: `/telegram/create-verification-code`,
                    method: "POST",
                    body,
                }),
                invalidatesTags: ["CURRENT_USER_INFO"],
            }),
            getCountry: build.query<GetCountryResponse, GetCountryArg>({
                query: (queryArg) => ({
                    url: `/addresses/country-suggestions`,
                    method: "POST",
                    body: queryArg,
                }),
                providesTags: ["DICTIONARY"],
            }),
            getCity: build.query<GetCityResponse, GetCityArg>({
                query: (queryArg) => ({
                    url: `/addresses/city-suggestions`,
                    method: "POST",
                    body: queryArg,
                }),
                providesTags: ["DICTIONARY"],
            }),
        }),
        overrideExisting: false,
    });
export { userApi };

export const {
    useGetCurrentUserQuery,
    useLazyGetCurrentUserQuery,
    useGetUserByIdQuery,
    useUpdateUserMutation,
    useVerifyTelegramMutation,
    useGetCountryQuery,
    useGetCityQuery,
    useGetProfilePhotoQuery,
    useGetProfilePhotoByIdQuery,
    useDeletePhotoMutation,
    useGetAllUsersQuery,
} = userApi;
