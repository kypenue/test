import {
    BaseQueryFn,
    FetchArgs,
    fetchBaseQuery,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";

import { redirect } from "next/navigation";

import { STORAGE } from "./Storage";
import { API } from "@/shared/constants/api";
import { BadRequestResponse } from "@/services/Auth/user.model";

const mutex = new Mutex();

export const prepareHeaders = (headers: Headers) => {
    const token = STORAGE.getToken();

    if (token && !headers.has("refresh_token")) {
        headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
};

export const baseRequestOptions = {
    baseUrl: API.baseUrl,
    prepareHeaders: prepareHeaders,
};

export const baseQuery = fetchBaseQuery(baseRequestOptions);

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError | BadRequestResponse
> = async (args, api, extraOptions) => {
    await mutex.waitForUnlock();
    let result = await baseQuery(args, api, extraOptions);
    if (result?.error) {
        if (result?.error.status === 401 && STORAGE.getToken()) {
            STORAGE.deleteToken();
            window.location.reload();
        }

        if (result?.error.status === 468) {
            if (!mutex.isLocked()) {
                const release = await mutex.acquire();
                try {
                    const refresh = await baseQuery(
                        {
                            url: "/iam/auth/refresh-token/",
                            method: "POST",
                            body: {
                                refresh_token: STORAGE.getToken(),
                            },
                            redirect: "follow",
                        },
                        api,
                        extraOptions,
                    );

                    if (refresh.data) {
                        // STORAGE.setToken(refresh.data.accessToken);
                        // STORAGE.setRefreshToken(refresh.data.refreshToken);
                        // result = await baseQuery(args, api, extraOptions);
                    }

                    release();

                    if (refresh.error) {
                        STORAGE.deleteToken();
                        throw Error("Пользователь не авторизован");
                    }
                } catch {
                    await redirect("/error401");
                }
            } else {
                await mutex.waitForUnlock();
                result = await baseQuery(args, api, extraOptions);
            }
        } else if (result.error.status === 403) {
            await redirect("/error403");
        }
    }

    return result;
};
