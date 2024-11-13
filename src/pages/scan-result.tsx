import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Award,
    Clock,
    AlertTriangle,
    Camera,
    Share2,
    ChevronLeft,
    Droplets
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState } from 'react';

interface ScanResult {
    item_name: string;
    category: string;
    points_awarded: number;
    new_total_points: number;
    environmental_impact: string;
    decomposition_time: number;
    threat_level: number;
}

export default function EnhancedScanResultPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state as ScanResult;
    const [showShareToast, setShowShareToast] = useState(false);

    if (!result) {
        navigate('/camera');
        return null;
    }

    const handleShare = () => {
        // In a real app, this would trigger native share
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-400 relative">
            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-safe pt-2 left-4 text-white z-10"
                onClick={() => navigate('/')}
            >
                <ChevronLeft className="w-6 h-6" />
            </motion.button>

            {/* Points Award Section */}
            <motion.div
                className="pt-safe px-6 pb-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        delay: 0.2,
                        bounce: 0.5
                    }}
                    className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
                >
                    <Award className="w-12 h-12 text-blue-500" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-4xl font-bold text-white mb-2">
                        +{result.points_awarded}
                    </h2>
                    <p className="text-blue-50 text-lg">
                        Points Earned!
                    </p>
                </motion.div>
            </motion.div>

            {/* Main Content Card */}
            <motion.div
                className="bg-gray-50 rounded-t-3xl min-h-screen relative -mt-4"
                initial={{ y: 1000 }}
                animate={{ y: 0 }}
                transition={{
                    type: "spring",
                    damping: 30,
                    stiffness: 100
                }}
            >
                <div className="p-6 space-y-6">
                    {/* Item Title */}
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {result.item_name}
                        </h3>
                        <div className="inline-flex items-center px-3 py-1 bg-blue-100 rounded-full">
                            <Droplets className="w-4 h-4 text-blue-500 mr-1" />
                            <span className="text-blue-700">{result.category}</span>
                        </div>
                    </div>

                    {/* Impact Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <motion.div
                            className="bg-white p-4 rounded-2xl shadow-sm"
                            whileHover={{ scale: 1.02 }}
                        >
                            <Clock className="w-6 h-6 text-blue-500 mb-2" />
                            <p className="text-sm text-gray-600">Decomposition Time</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {result.decomposition_time > 365
                                    ? `${Math.round(result.decomposition_time / 365)} years`
                                    : `${result.decomposition_time} days`}
                            </p>
                        </motion.div>

                        <motion.div
                            className="bg-white p-4 rounded-2xl shadow-sm"
                            whileHover={{ scale: 1.02 }}
                        >
                            <AlertTriangle className="w-6 h-6 text-orange-500 mb-2" />
                            <p className="text-sm text-gray-600">Ocean Threat</p>
                            <div className="flex gap-1 mt-1">
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.8 + (i * 0.1) }}
                                        className={`h-2 w-6 rounded-full ${
                                            i < result.threat_level
                                                ? 'bg-orange-500'
                                                : 'bg-gray-200'
                                        }`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Environmental Impact */}
                    <motion.div
                        className="bg-blue-50 rounded-2xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <h4 className="font-semibold text-blue-900 mb-2">
                            Environmental Impact
                        </h4>
                        <p className="text-blue-700 leading-relaxed">
                            {result.environmental_impact}
                        </p>
                    </motion.div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4">
                        <Button
                            className="w-full rounded-xl h-12 text-base font-medium"
                            onClick={() => navigate('/camera')}
                        >
                            <Camera className="w-5 h-5 mr-2" />
                            Scan Another Item
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full rounded-xl h-12 text-base font-medium"
                            onClick={handleShare}
                        >
                            <Share2 className="w-5 h-5 mr-2" />
                            Share Discovery
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Share Toast */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{
                    opacity: showShareToast ? 1 : 0,
                    y: showShareToast ? 0 : 50
                }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm"
            >
                Coming soon!
            </motion.div>
        </div>
    );
}