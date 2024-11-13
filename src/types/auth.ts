export interface LoginResponse {
    user_id: number;
    username: string;
    display_name: string | null;
    token: string;
    points_balance: number;
    rank_title: string;
}

export interface RegisterResponse {
    user_id: number;
    username: string;
    display_name: string | null;
    email: string;
    token: string;
    created_at: string;
}

export interface User {
    user_id: number;
    username: string;
    display_name: string | null;
    points_balance: number;
    rank_title: string;
}