import { Trophy, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useState, useRef, useEffect } from 'react';
import { useAuth} from "../../contexts/auth-context.tsx";

export function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!(event.target instanceof Node) || !dropdownRef.current?.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isDropdownOpen]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 flex justify-between items-center p-4 bg-white/70 backdrop-blur-md">
            <Link to="/" className="text-xl font-semibold text-blue-900">
                Ocean Guardian
            </Link>
            <div className="flex gap-4 items-center">
                <Button
                    variant="ghost"
                    size="icon"
                    asChild
                >
                    <Link to="/leaderboard">
                        <Trophy className="w-6 h-6 text-blue-600" />
                    </Link>
                </Button>

                <div className="relative" ref={dropdownRef}>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <User className="w-6 h-6 text-blue-600" />
                    </Button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-100">
                            {/* User Info */}
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="text-sm font-medium text-blue-900">{user?.username}</p>
                                <p className="text-xs text-blue-600">{user?.rank_title}</p>
                            </div>

                            {/* Menu Items */}
                            <Link
                                to="/profile"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                Profile
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}