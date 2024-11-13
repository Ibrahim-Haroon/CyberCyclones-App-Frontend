import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_BACKEND_ENDPOINT;

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const API_ROUTES = {
    auth: {
        login: '/api/v1/auth/login/',
        register: '/api/v1/auth/register/',
    },
    discoveries: {
        scan: '/api/v1/discoveries/scan/',
        history: '/api/v1/discoveries/history/',
        stats: '/api/v1/discoveries/stats/',
    },
    leaderboard: {
        global: '/api/v1/leaderboard/global/',
        weekly: '/api/v1/leaderboard/weekly/',
        nearby: '/api/v1/leaderboard/nearby/',
        my_ranking: '/api/v1/leaderboard/my_ranking/',
        category: (category: string) => `/api/v1/leaderboard/category/${category}/`,
    },
    points: {
        summary: '/api/v1/points/summary/',
        history: '/api/v1/points/history/',
        breakdown: '/api/v1/points/breakdown/',
        deduct: '/api/v1/points/deduct/'
    }
} as const;

export const getApiUrl = (path: string) => `${API_BASE_URL}${path}`;