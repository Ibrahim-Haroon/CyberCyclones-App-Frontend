import { Camera, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/button';

export function HeroSection() {
    return (
        <div className="px-6 pt-8 pb-12 text-center">
            <div className="mb-6">
                <Waves className="w-16 h-16 mx-auto text-blue-500 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
                Become an Ocean Guardian!
            </h2>
            <p className="text-blue-700 mb-8 max-w-md mx-auto">
                Discover how everyday items affect our oceans. Scan, learn, and earn points while helping protect marine life!
            </p>
            <Button
                size="lg"
                className="gap-2 rounded-full"
                asChild
            >
                <Link to="/camera">
                    <Camera className="w-5 h-5" />
                    Start Scanning
                </Link>
            </Button>
        </div>
    );
}