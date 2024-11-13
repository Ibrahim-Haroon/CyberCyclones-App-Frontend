import { motion } from 'framer-motion';
import { Waves, Camera } from 'lucide-react';
import { Button } from "@/components/ui/button.tsx";

interface CameraPermissionViewProps {
    onRetry: () => void;
}

export function CameraPermissionView({ onRetry }: CameraPermissionViewProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-[100dvh] bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6"
        >
            <div className="relative w-24 h-24 mb-6">
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Waves className="w-24 h-24 text-blue-500" />
                </motion.div>
            </div>

            <h2 className="text-2xl font-bold text-blue-900 mb-3 text-center">
                Let's Discover Together!
            </h2>

            <p className="text-blue-600 text-center mb-8 max-w-xs">
                Hey Ocean Guardian! I need your camera to help identify items and learn how they affect our ocean friends! 🌊
            </p>

            <Button
                onClick={onRetry}
                size="lg"
                className="rounded-full px-8 gap-2 shadow-lg"
            >
                <Camera className="w-5 h-5" />
                Enable Camera
            </Button>
        </motion.div>
    );
}