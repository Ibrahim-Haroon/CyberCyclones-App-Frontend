import { useQuery } from '@tanstack/react-query';
import { getApiUrl, API_ROUTES} from "../../../lib/api.ts";
import axios from 'axios';

interface Discovery {
    item_name: string;
    category: string;
    points_awarded: number;
    discovered_at: string;
    rarity: string;
}

export function RecentDiscoveries() {
    const { data: discoveries = [], isLoading, error } = useQuery<Discovery[]>({
        queryKey: ['recent-discoveries'],
        queryFn: async () => {
            const response = await axios.get<Discovery[]>(
                getApiUrl(API_ROUTES.discoveries.history)
            );
            return response.data;
        }
    });

    if (isLoading) {
        return (
            <div className="px-6 mb-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Recent Discoveries</h3>
                <div className="space-y-3">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="bg-white/50 animate-pulse p-3 rounded-xl h-16" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-6 mb-8">
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
                    Failed to load recent discoveries
                </div>
            </div>
        );
    }

    if (discoveries.length === 0) {
        return (
            <div className="px-6 mb-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Recent Discoveries</h3>
                <div className="bg-white p-6 rounded-xl text-center">
                    <p className="text-blue-600">No discoveries yet. Start scanning to be the first!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Recent Discoveries</h3>
            <div className="space-y-3">
                {discoveries.slice(0, 3).map((discovery, index) => (
                    <div
                        key={index}
                        className="bg-white p-3 rounded-xl shadow-sm flex items-center justify-between"
                    >
                        <div>
                            <p className="text-blue-900 font-medium">{discovery.item_name}</p>
                            <p className="text-sm text-blue-600">{discovery.category}</p>
                        </div>
                        <div className="bg-blue-100 px-3 py-1 rounded-full">
                            <p className="text-blue-700">+{discovery.points_awarded}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}