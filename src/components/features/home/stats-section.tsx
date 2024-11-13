import { Search, Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getApiUrl, API_ROUTES} from "../../../lib/api.ts";
import axios from 'axios';

interface StatsResponse {
    total_discoveries: number;
    discoveries_last_7_days: number;
    categories: { [key: string]: number };
    rarities: { [key: string]: number };
    total_decomposition_years: number;
    total_points_from_discoveries: number;
}

export function StatsSection() {
    const { data: stats, isLoading, error } = useQuery<StatsResponse>({
        queryKey: ['home-stats'],
        queryFn: async () => {
            const response = await axios.get(getApiUrl(API_ROUTES.discoveries.stats));
            return response.data as StatsResponse; // Explicit type assertion
        }
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-4 px-6 mb-8">
                {[0, 1].map((i) => (
                    <div key={i} className="bg-white/50 animate-pulse p-4 rounded-2xl h-32" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-6 mb-8">
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center">
                    Failed to load statistics
                </div>
            </div>
        );
    }

    // Calculate total discoveries from categories if stats exist
    const totalDiscoveries = stats ?
        Object.values(stats.categories).reduce((sum, count) => sum + count, 0) :
        0;

    return (
        <div className="grid grid-cols-2 gap-4 px-6 mb-8">
            <div className="bg-white p-4 rounded-2xl shadow-md">
                <div className="flex items-center justify-center mb-2">
                    <Search className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-blue-900 text-center">
                    {stats && stats.discoveries_last_7_days != null ? stats.discoveries_last_7_days : 0}
                </p>
                <p className="text-sm text-blue-600 text-center">Items Discovered This Week</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-md">
                <div className="flex items-center justify-center mb-2">
                    <Award className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-blue-900 text-center">
                    {totalDiscoveries}
                </p>
                <p className="text-sm text-blue-600 text-center">Total Discoveries</p>
            </div>
        </div>
    );
}