import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from "./contexts/auth-context"
import { ProtectedRoute } from "./components/auth/protected-route"

// Pages
import HomePage from './pages/home'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import CameraPage from './pages/camera'
import ScanResultPage from './pages/scan-result'
import LeaderboardPage from './pages/leaderboard'
import ProfilePage from "@/pages/profile.tsx";
import StatisticsPage from "@/pages/statistics.tsx";
import HistoryPage from "@/pages/history.tsx";
import SettingsPage from "@/pages/settings.tsx";  // Add this import

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
})

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* Protected routes */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <HomePage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/camera"
                            element={
                                <ProtectedRoute>
                                    <CameraPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/scan-result"
                            element={
                                <ProtectedRoute>
                                    <ScanResultPage />
                                </ProtectedRoute>
                            }
                        />

                        {/* Add the new leaderboard route */}
                        <Route
                            path="/leaderboard"
                            element={
                                <ProtectedRoute>
                                    <LeaderboardPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/profile/statistics"
                            element={
                                <ProtectedRoute>
                                    <StatisticsPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/profile/history"
                            element={
                                <ProtectedRoute>
                                    <HistoryPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile/settings"
                            element={
                                <ProtectedRoute>
                                    <SettingsPage />
                                </ProtectedRoute>
                            }
                        />

                        {/* Catch all route - redirect to home */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </QueryClientProvider>
    )
}

export default App