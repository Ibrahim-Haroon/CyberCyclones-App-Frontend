import { motion, AnimatePresence } from 'framer-motion';
import { Camera } from 'lucide-react';

interface GuidanceTextProps {
    show: boolean;
}

export function GuidanceText({ show }: GuidanceTextProps) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                >
                    <motion.div
                        animate={{
                            scale: [1, 1.05, 1],
                            opacity: [1, 0.8, 1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="text-white text-lg font-medium px-6 py-3 bg-black/30 rounded-full backdrop-blur-lg flex items-center gap-2"
                    >
                        <Camera className="w-5 h-5" />
                        <span>Point at any item to scan!</span>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}