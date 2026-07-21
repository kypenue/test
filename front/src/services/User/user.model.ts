import {
    AuthenticationData,
    CitySuggest,
    CountrySuggest,
    Token,
    UserModel,
    UserRegistration,
} from "@/shared/types/models/User";
import { PaginatedRequest } from "@/shared/types/models/common";

export type GetUserByIdResponse =
    /** status 200 Successful Response */ UserModel;
export type GetUserByIdArg = string;
export type AuthenticateResponse = /** status 200 Successful Response */ Token;
export type AuthenticateArg = AuthenticationData;
export type GetCurrentUserResponse =
    /** status 200 Successful Response */ UserRegistration;
export type GetCurrentUserArg = void | null;
export type GetAllUserArg = PaginatedRequest<{}>;

export interface GetCountryArg {
    country_prefix: string;
}

export type GetCountryResponse =
    /** status 200 Successful Response */ CountrySuggest;

export interface GetCityArg {
    country: string;
    city_prefix: string;
}

export type GetCityResponse = /** status 200 Successful Response */ CitySuggest;
