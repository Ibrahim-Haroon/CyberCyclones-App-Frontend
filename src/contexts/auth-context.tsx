import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { getApiUrl, API_ROUTES} from "../lib/api.ts";
import { User, LoginResponse, RegisterResponse} from "../types/auth.ts";

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string, display_name?: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));

            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }

        setIsLoading(false);
    }, []);

    const updateUser = (userData: Partial<User>) => {
        setUser(prev => prev ? { ...prev, ...userData } : null);
    };

    const login = async (username: string, password: string) => {
        try {
            const response = await axios.post<LoginResponse>(
                getApiUrl(API_ROUTES.auth.login),
                { username, password }
            );

            const { token: newToken, ...userData } = response.data;

            const userObject: User = {
                user_id: userData.user_id,
                username: userData.username,
                display_name: userData.display_name,
                points_balance: userData.points_balance,
                rank_title: userData.rank_title,
            };

            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userObject));

            setToken(newToken);
            setUser(userObject);

            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (username: string, email: string, password: string, display_name?: string) => {
        try {
            const response = await axios.post<RegisterResponse>(
                getApiUrl(API_ROUTES.auth.register),
                { username, email, password, display_name }
            );

            const { token: newToken, ...userData } = response.data;

            const userObject: User = {
                user_id: userData.user_id,
                username: userData.username,
                display_name: userData.display_name,
                points_balance: 0, // New users start with 0 points
                rank_title: 'Beginner', // Default rank for new users
            };

            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userObject));

            setToken(newToken);
            setUser(userObject);

            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setToken(null);
        setUser(null);

        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}