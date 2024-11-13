import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Trophy,
    Search,
    Flame,
    TrendingUp
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { getApiUrl } from "@/lib/api";
import axios from 'axios';
import {PageHeader} from "@/pages/page-header.tsx";

interface PointsBreakdown {
    total_discoveries: number;
    total_points: number;
    category_breakdown: {
        [key: string]: {
            points: number;
            count: number;
            average_points: number;
        }
    };
    rarity_breakdown: {
        [key: string]: {
            points: number;
            count: number;
            average_points: number;
        }
    };
    time_patterns: {
        [hour: string]: {
            points: number;
            discoveries: number;
        }
    };
    engagement_stats: {
        current_streak: number;
        longest_streak: number;
        daily_average_points: number;
        most_productive_hour: number;
    }
}

export default function StatisticsPage() {
    const navigate = useNavigate();

    const { data: breakdown, isLoading } = useQuery<PointsBreakdown>({
        queryKey: ['points-breakdown'],
        queryFn: async () => {
            const response = await axios.get(getApiUrl('/api/v1/points/breakdown/'));
            return response.data;
        }
    });

    const formatHour = (hour: number) => {
        return new Date(2024, 0, 1, hour).toLocaleString('en-US', {
            hour: 'numeric',
            hour12: true
        });
    };

    const stats = [
        {
            title: 'Total Points',
            value: breakdown?.total_points ?? 0,
            icon: Trophy,
            color: 'bg-blue-500',
            lightColor: 'bg-blue-100',
            textColor: 'text-blue-500'
        },
        {
            title: 'Discoveries',
            value: breakdown?.total_discoveries ?? 0,
            icon: Search,
            color: 'bg-green-500',
            lightColor: 'bg-green-100',
            textColor: 'text-green-500'
        },
        {
            title: 'Current Streak',
            value: breakdown?.engagement_stats.current_streak ?? 0,
            icon: Flame,
            color: 'bg-orange-500',
            lightColor: 'bg-orange-100',
            textColor: 'text-orange-500'
        },
        {
            title: 'Daily Average',
            value: Math.round(breakdown?.engagement_stats.daily_average_points ?? 0),
            icon: TrendingUp,
            color: 'bg-purple-500',
            lightColor: 'bg-purple-100',
            textColor: 'text-purple-500'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <PageHeader
                title="Statistics"
                subtitle="Your Ocean Impact"
                showBack
                showHome
            />
            {/* Header */}
            <div className="pt-safe px-6 pb-6 bg-white shadow-sm">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={() => navigate('/profile')}
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-blue-900">Statistics</h1>
                        <p className="text-blue-600">Your ocean impact journey</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="px-6 py-6">
                <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl p-4 shadow-sm"
                        >
                            <div className={`${stat.lightColor} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
                                <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                            </div>
                            <p className="text-sm text-gray-600">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stat.value.toLocaleString()}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Category Breakdown */}
            {breakdown?.category_breakdown && (
                <div className="px-6 py-4">
                    <h2 className="text-lg font-semibold text-blue-900 mb-4">Categories</h2>
                    <div className="space-y-4">
                        {Object.entries(breakdown.category_breakdown).map(([category, data], index) => (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl p-4 shadow-sm"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-medium text-gray-900">{category.toLowerCase()}</p>
                                    <p className="text-blue-600">{data.points} points</p>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>{data.count} discoveries</span>
                                    <span>~{Math.round(data.average_points)} pts/discovery</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Engagement Stats */}
            {breakdown?.engagement_stats && (
                <div className="px-6 py-4">
                    <h2 className="text-lg font-semibold text-blue-900 mb-4">Engagement</h2>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <p className="text-gray-600">Longest Streak</p>
                                <p className="font-medium text-gray-900">
                                    {breakdown.engagement_stats.longest_streak} days
                                </p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-gray-600">Most Active Time</p>
                                <p className="font-medium text-gray-900">
                                    {formatHour(breakdown.engagement_stats.most_productive_hour)}
                                </p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-gray-600">Daily Average</p>
                                <p className="font-medium text-gray-900">
                                    {Math.round(breakdown.engagement_stats.daily_average_points)} points
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}