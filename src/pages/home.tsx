import {Navbar} from "../components/layout/navbar.tsx";
import { HeroSection } from '../components/features/home/hero-section';
import { StatsSection } from '../components/features/home/stats-section';
import { RecentDiscoveries } from '../components/features/home/recent-discoveries';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <Navbar />
            <HeroSection />
            <StatsSection />
            <RecentDiscoveries />
        </div>
    );
}