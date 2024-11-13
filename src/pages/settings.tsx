import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    User,
    Bell,
    Volume2,
    Lock,
    HelpCircle,
    Shield,
    Trash2,
    LogOut,
    ChevronRight,
    X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { getApiUrl } from "@/lib/api";
import axios from 'axios';
import {PageHeader} from "@/pages/page-header.tsx";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
}

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl w-full max-w-md p-6"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
                {children}
            </motion.div>
        </motion.div>
    );
};

export default function SettingsPage() {
    const navigate = useNavigate();
    const { user, logout, updateUser } = useAuth();
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    // Modal states
    const [isDisplayNameModalOpen, setIsDisplayNameModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

    // Form states
    const [displayName, setDisplayName] = useState(user?.display_name || '');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateDisplayName = async () => {
        setError(null);
        setIsLoading(true);
        try {
            const response = await axios.patch(
                getApiUrl('/api/v1/users/update_display_name/'),
                { display_name: displayName }
            );
            updateUser(response.data);
            setIsDisplayNameModalOpen(false);
        } catch (err) {
            // Show backend validation message
            setError(err.response?.data?.error || 'Failed to update display name');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async () => {
        setError(null);
        setIsLoading(true);
        try {
            await axios.post(
                getApiUrl('/api/v1/auth/change_password/'),
                {
                    old_password: oldPassword,
                    new_password: newPassword
                }
            );
            setIsPasswordModalOpen(false);
            setOldPassword('');
            setNewPassword('');
        } catch (err) {
            // Show backend validation message
            setError(err.response?.data?.error || 'Failed to change password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeactivateAccount = async () => {
        setError(null);
        setIsLoading(true);
        try {
            await axios.post(getApiUrl('/api/v1/users/deactivate/'));
            await logout();
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to deactivate account');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // Settings sections configuration
    const settingSections = [
        {
            title: 'Account',
            items: [
                {
                    icon: User,
                    label: 'Display Name',
                    value: user?.display_name || user?.username,
                    onClick: () => setIsDisplayNameModalOpen(true),
                },
                {
                    icon: Lock,
                    label: 'Change Password',
                    onClick: () => setIsPasswordModalOpen(true),
                },
            ]
        },
        {
            title: 'Preferences',
            items: [
                {
                    icon: Bell,
                    label: 'Push Notifications',
                    isToggle: true,
                    value: notificationsEnabled,
                    onChange: setNotificationsEnabled,
                },
                {
                    icon: Volume2,
                    label: 'Sound Effects',
                    isToggle: true,
                    value: soundEnabled,
                    onChange: setSoundEnabled,
                },
            ]
        },
        {
            title: 'Support',
            items: [
                {
                    icon: HelpCircle,
                    label: 'Help & FAQ',
                    onClick: () => {},
                },
                {
                    icon: Shield,
                    label: 'Privacy Policy',
                    onClick: () => {},
                },
            ]
        },
        {
            title: 'Danger Zone',
            items: [
                {
                    icon: Trash2,
                    label: 'Deactivate Account',
                    onClick: () => setIsDeactivateModalOpen(true),
                    isDanger: true,
                },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-safe">
            <PageHeader
                title="Settings"
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
                        <h1 className="text-2xl font-bold text-blue-900">Settings</h1>
                        <p className="text-blue-600">Customize your experience</p>
                    </div>
                </div>
            </div>

            {/* Settings List */}
            <div className="px-6 py-6 space-y-6">
                {settingSections.map((section, index) => (
                    <motion.div
                        key={section.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <h2 className="text-sm font-medium text-gray-600 mb-2 px-2">
                            {section.title}
                        </h2>
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                            {section.items.map((item, itemIndex) => (
                                <button
                                    key={item.label}
                                    onClick={item.onClick}
                                    className={`w-full px-4 py-3 flex items-center justify-between ${
                                        itemIndex !== section.items.length - 1
                                            ? 'border-b border-gray-100'
                                            : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            item.isDanger ? 'bg-red-50' : 'bg-blue-50'
                                        }`}>
                                            <item.icon className={`w-4 h-4 ${
                                                item.isDanger ? 'text-red-500' : 'text-blue-500'
                                            }`} />
                                        </div>
                                        <span className={item.isDanger ? 'text-red-600' : 'text-gray-900'}>
                                            {item.label}
                                        </span>
                                    </div>
                                    {item.isToggle ? (
                                        <div className={`w-11 h-6 rounded-full transition-colors ${
                                            item.value ? 'bg-blue-500' : 'bg-gray-200'
                                        }`}>
                                            <motion.div
                                                className="w-5 h-5 bg-white rounded-full shadow-sm mt-0.5 ml-0.5"
                                                animate={{ x: item.value ? 20 : 0 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-gray-500">
                                            {item.value && (
                                                <span className="text-sm">{item.value}</span>
                                            )}
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ))}

                <Button
                    variant="ghost"
                    className="w-full mt-6 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                </Button>
            </div>

            {/* Display Name Modal */}
            <Modal
                isOpen={isDisplayNameModalOpen}
                onClose={() => setIsDisplayNameModalOpen(false)}
                title="Change Display Name"
            >
                <div className="space-y-4">
                    <Input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="New display name"
                    />
                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsDisplayNameModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleUpdateDisplayName}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Change Password Modal */}
            <Modal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                title="Change Password"
            >
                <div className="space-y-4">
                    <Input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Current password"
                    />
                    <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password"
                    />
                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsPasswordModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleChangePassword}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Changing...' : 'Change Password'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Deactivate Account Modal */}
            <Modal
                isOpen={isDeactivateModalOpen}
                onClose={() => setIsDeactivateModalOpen(false)}
                title="Deactivate Account"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Are you sure you want to deactivate your account? This action cannot be undone.
                    </p>
                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsDeactivateModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={handleDeactivateAccount}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Deactivating...' : 'Deactivate'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}