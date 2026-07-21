import { Api as api } from "../api";
import {
    ForgotPasswordResponse,
    ResetPasswordArg,
    ResetPasswordResponse,
    UserAuthArg,
    UserAuthResponse,
    UserEmailVerificationArg,
    UserLogoutArg,
    UserLogoutResponse,
    UserRegistrationArg,
    UserRegistrationResponse,
    UserTokenVerificationArg,
    UserTokenVerificationResponse,
} from "@/services/Auth/user.model";

export const addTagTypes = ["TOKEN", "CURRENT_USER"] as const;
const authApi = api
    .enhanceEndpoints({
        addTagTypes,
    })
    .injectEndpoints({
        endpoints: (build) => ({
            authUser: build.mutation<UserAuthResponse, UserAuthArg>({
                query: (queryArg) => ({
                    url: `/auth/jwt/login`,
                    method: "POST",
                    body: queryArg,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }),
            }),
            registerUser: build.mutation<
                UserRegistrationResponse,
                UserRegistrationArg
            >({
                query: (queryArg) => ({
                    url: `/auth/register`,
                    method: "POST",
                    body: queryArg,
                }),
            }),
            verifyToken: build.mutation<
                UserTokenVerificationResponse,
                UserTokenVerificationArg
            >({
                query: (queryArg) => ({
                    url: `/auth/verify`,
                    method: "POST",
                    body: queryArg,
                }),
            }),
            verifyEmail: build.mutation<void, UserEmailVerificationArg>({
                query: (queryArg) => ({
                    url: `/auth/request-verify-token`,
                    method: "POST",
                    body: queryArg,
                }),
            }),
            forgotPassword: build.mutation<
                ForgotPasswordResponse,
                UserEmailVerificationArg
            >({
                query: (queryArg) => ({
                    url: `/auth/forgot-password`,
                    method: "POST",
                    body: queryArg,
                }),
            }),
            resetPassword: build.mutation<
                ResetPasswordResponse,
                ResetPasswordArg
            >({
                query: (queryArg) => ({
                    url: `/auth/reset-password`,
                    method: "POST",
                    body: queryArg,
                }),
            }),
            logoutUser: build.mutation<UserLogoutResponse, UserLogoutArg>({
                query: () => ({
                    url: `/auth/jwt/logout`,
                    method: "POST",
                }),
            }),
            changeEmail: build.mutation<string, UserEmailVerificationArg>({
                query: (body) => ({
                    url: `/auth/change-email`,
                    method: "POST",
                    body,
                }),
            }),
        }),
        overrideExisting: false,
    });
export { authApi };
export const {
    useAuthUserMutation,
    useRegisterUserMutation,
    useVerifyTokenMutation,
    useVerifyEmailMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
} = authApi;
