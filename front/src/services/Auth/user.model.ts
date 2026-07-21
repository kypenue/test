export interface UserRegistrationArg {
    email: string;
    password: string;
    name: string;
    surname: string;
    birth_date: string;
    username: string;
}

export interface UserRegistrationResponse {
    id: number;
    email: string;
    is_active?: boolean;
    is_superuser?: boolean;
    is_verified?: boolean;
    name: string;
    surname: string;
    patronymic: string | null;
    birth_date: string;
    username: string;
    tg_login: string | null;
    role_id: number | null;
    created_at: string;
    updated_at: string;
}

export type UserAuthArg = string;

export interface UserAuthResponse {
    access_token: string;
    token_type: string;
}

export type UserLogoutArg = void;

export type UserLogoutResponse = string;

export interface BadRequestResponse {
    data: {
        detail: string | Array<ValidationError> | ValidationErrorObj;
    };
}

export interface ValidationError {
    loc: Array<string>;
    msg: string;
    type: string;
}

export interface ValidationErrorObj {
    code: string;
    reason: string;
}

export interface UserTokenVerificationArg {
    token: string;
}

export interface ResetPasswordArg {
    token: string;
    password: string;
}

export type UserTokenVerificationResponse = UserRegistrationResponse;

export type ResetPasswordResponse = string;
export type ForgotPasswordResponse = string;


export interface UserEmailVerificationArg {
	email: string;
}
