export const SYSTEM_ROLES_MAP = {
    ADMIN: "ADMIN",
    TOURNAMENT_CREATOR: "TOURNAMENT_CREATOR",
    COMMUNITY_CREATOR: "COMMUNITY_CREATOR",
} as const;

export type SYSTEM_ROLES = keyof typeof SYSTEM_ROLES_MAP;

export interface UserModel {
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
    country: string;
    city: string;
    rating: number;
    role: number;
    system_roles: Array<SYSTEM_ROLES>;
}

export interface Token {
    access_token: string;
    token_type: string;
}

export interface AuthenticationData {
    username: string;
    password: string;
}

export interface UserRegistration {
    username: string;
    email?: string | null;
    full_name?: string | null;
    disabled?: boolean | null;
}

export interface CountrySuggest {
    countries: Array<string>;
    cities: Array<string>;
}

export interface CitySuggest {
    countries: Array<string>;
    cities: Array<string>;
}
