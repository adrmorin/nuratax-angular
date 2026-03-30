export interface User {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    password: string;
    enabled?: boolean;
    identityVerified?: boolean;
    identityVerifiedAt?: string | null;
    filingStatus?: string | null;
    income?: number | null;
    deductions?: number | null;
    credits?: number | null;
    roles?: string[];
    authorities?: Authority[];
    username?: string;
    accountNonExpired?: boolean;
    credentialsNonExpired?: boolean;
    accountNonLocked?: boolean;
    isValidated?: boolean;
}

export interface Authority {
    authority?: string;
}

export interface UserRegister {
    firstName: string;
    lastName: string;
    email: string;
    //phone: string;
    password: string;
    username?: string;
}

export interface RegisterResponse {
    message?: string;
    success?: boolean;
}
