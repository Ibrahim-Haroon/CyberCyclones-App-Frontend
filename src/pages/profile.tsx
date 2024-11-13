import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy,
    ChevronRight,
    BarChart3,
    History,
    LogOut,
    Settings,
    User
} from 'lucide-react';
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { getApiUrl } from "@/lib/api";
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {PageHeader} from "@/pages/page-header.tsx";

interface PointsSummary {
    current_balance: number;
    total_earned: number;
    current_rank: string;
    next_rank: string;
    points_to_next_rank: number;
    rank_progress_percentage: number;
}

interface PointsHistory {
    date: string;
    points: number;
    action: string;
    description: string;
}

interface PointsBreakdown {
    discoveries: number;
    streaks: number;
    achievements: number;
    bonus_points: number;
}

type TimeFrame = 'week' | 'month' | 'year';

export default function ProfilePage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame>('week');

    const menuItems = [
        {
            icon: BarChart3,
            label: 'Statistics',
            onClick: () => navigate('/profile/statistics')
        },
        {
            icon: History,
            label: 'Points History',
            onClick: () => navigate('/profile/history')
        },
        {
            icon: Settings,
            label: 'Settings',
            onClick: () => navigate('/profile/settings')
        }
    ];

    // Fetch points summary
    const { data: summary, isLoading: isSummaryLoading } = useQuery<PointsSummary>({
        queryKey: ['points-summary'],
        queryFn: async () => {
            const response = await axios.get(getApiUrl('/api/v1/points/summary/'));
            return response.data;
        }
    });

    // Fetch points history
    const { data: history } = useQuery<PointsHistory[]>({
        queryKey: ['points-history', selectedTimeframe],
        queryFn: async () => {
            const response = await axios.get(
                getApiUrl(`/api/v1/points/history/?timeframe=${selectedTimeframe}`)
            );
            return response.data;
        }
    });

    // Fetch points breakdown
    const { data: breakdown } = useQuery<PointsBreakdown>({
        queryKey: ['points-breakdown'],
        queryFn: async () => {
            const response = await axios.get(getApiUrl('/api/v1/points/breakdown/'));
            return response.data;
        }
    });

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-safe">
            <PageHeader
                title="Profile"
                subtitle="Your Ocean Impact"
                showBack
                showHome
            />
            {/* Header */}
            <div className="pt-safe px-6 pb-6 bg-blue-500">
                <motion.div
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <User className="w-10 h-10 text-blue-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">
                        {user?.display_name || user?.username}
                    </h1>
                    <p className="text-blue-100 font-medium">
                        {summary?.current_rank || 'Ocean Guardian'}
                    </p>
                </motion.div>
            </div>

            {/* Points Summary Card */}
            <div className="px-6 -mt-6">
                <motion.div
                    className="bg-white rounded-2xl p-6 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <p className="text-sm text-blue-600">Current Balance</p>
                            <p className="text-3xl font-bold text-blue-900">
                                {summary?.current_balance?.toLocaleString() ?? 0}
                            </p>
                        </div>
                        <Trophy className="w-8 h-8 text-blue-500" />
                    </div>

                    {/* Rank Progress */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-blue-600">Progress to {summary?.next_rank}</span>
                            <span className="text-blue-900 font-medium">
                                {summary?.rank_progress_percentage}%
                            </span>
                        </div>
                        <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-blue-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${summary?.rank_progress_percentage ?? 0}%` }}
                                transition={{ delay: 0.5, duration: 1 }}
                            />
                        </div>
                        <p className="text-sm text-blue-600">
                            {summary?.points_to_next_rank?.toLocaleString() ?? 0} points to next rank
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Points History */}
            <div className="px-6 mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-blue-900">Points History</h2>
                    <div className="flex gap-2 bg-blue-50 p-1 rounded-lg">
                        {(['week', 'month', 'year'] as TimeFrame[]).map((tf) => (
                            <Button
                                key={tf}
                                variant={selectedTimeframe === tf ? 'default' : 'ghost'}
                                size="sm"
                                className={`rounded-md text-xs ${
                                    selectedTimeframe === tf ? '' : 'text-blue-600'
                                }`}
                                onClick={() => setSelectedTimeframe(tf)}
                            >
                                {tf.charAt(0).toUpperCase() + tf.slice(1)}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {history?.map((entry, index) => (
                            <motion.div
                                key={entry.date}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-4 rounded-xl shadow-sm"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-blue-900">{entry.action}</p>
                                        <p className="text-sm text-blue-600">{entry.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className={`font-bold ${
                                            entry.points >= 0 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {entry.points >= 0 ? '+' : ''}{entry.points}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Menu Options */}
            <div className="px-6 mt-6">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                    {menuItems.map((item) => (
                        <button
                            key={item.label}
                            className="w-full px-4 py-3 flex items-center justify-between border-b border-gray-100 last:border-b-0"
                            onClick={item.onClick}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                                    <item.icon className="w-4 h-4 text-blue-500"/>
                                </div>
                                <span className="text-gray-900">{item.label}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400"/>
                        </button>
                    ))}
                </div>


                <Button
                    variant="ghost"
                    className="w-full mt-6 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4 mr-2"/>
                    Log Out
                </Button>
            </div>
        </div>
    );
}