import { Provider, Role } from "./enums";

export interface OAuthProfile {
    email: string;
    name: string;
    picture: string;
    id: string;
    role?: Role;
    provider: Provider;
    providerId: string;
    isEmailVerified?: boolean;
}