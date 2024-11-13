import { motion } from 'framer-motion';

export function ScannerFrame() {
    return (
        <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-sm aspect-square relative"
            >
                {/* Scanning Animation Line */}
                <motion.div
                    animate={{
                        y: [0, 300, 0],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                />

                {/* Frame with Glowing Corners */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-white rounded-tl-3xl shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-white rounded-tr-3xl shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-white rounded-bl-3xl shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-white rounded-br-3xl shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                </div>
            </motion.div>
        </div>
    );
}
