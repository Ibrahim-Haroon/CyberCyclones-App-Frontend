import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth} from "../contexts/auth-context.tsx";
import { Button} from "../components/ui/button.tsx";
import { Input} from "../components/ui/input.tsx";
import { Waves } from 'lucide-react';

export default function RegisterPage() {
    const navigate = useNavigate();
    const auth = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const username = formData.get('username') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const displayName = formData.get('displayName') as string;

        try {
            await auth.register(username, email, password, displayName || undefined);
            navigate('/');
        } catch (error: unknown) {
            setError(error.response?.data?.error || 'Failed to register');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
        <Waves className="w-16 h-16 text-blue-500" />
        <h2 className="mt-6 text-3xl font-bold text-blue-900">Join Ocean Guardian</h2>
    <p className="mt-2 text-blue-600">Start your journey as an ocean protector</p>
    </div>

    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                {error}
                </div>
        )}

    <div className="space-y-4">
    <div>
        <label htmlFor="username" className="block text-sm font-medium text-blue-700">
        Username
        </label>
        <Input
    id="username"
    name="username"
    type="text"
    required
    className="mt-1"
    disabled={isLoading}
    />
    </div>

    <div>
    <label htmlFor="email" className="block text-sm font-medium text-blue-700">
        Email
        </label>
        <Input
    id="email"
    name="email"
    type="email"
    required
    className="mt-1"
    disabled={isLoading}
    />
    </div>

    <div>
    <label htmlFor="displayName" className="block text-sm font-medium text-blue-700">
        Display Name (optional)
    </label>
    <Input
    id="displayName"
    name="displayName"
    type="text"
    className="mt-1"
    disabled={isLoading}
    />
    </div>

    <div>
    <label htmlFor="password" className="block text-sm font-medium text-blue-700">
        Password
        </label>
        <Input
    id="password"
    name="password"
    type="password"
    required
    className="mt-1"
    disabled={isLoading}
    />
    </div>
    </div>

    <Button
    type="submit"
    className="w-full"
    disabled={isLoading}
        >
        {isLoading ? "Creating account..." : "Create account"}
        </Button>

        <div className="text-center text-sm">
    <span className="text-blue-600">Already have an account? </span>
        <Link to="/login" className="font-semibold text-blue-700 hover:text-blue-500">
        Log in
        </Link>
        </div>
        </form>
        </div>
        </div>
);
}