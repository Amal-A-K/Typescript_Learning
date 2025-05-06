import React, { useState, useEffect } from 'react';
import { UserData } from '../types/user';
import Button from './ui/Button';
import Input from './ui/Input';
import Label from './ui/Label';
import Dashboard from './Dashboard';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from './ui/Card';
import { Loader2} from 'lucide-react';


// Define the type for the form
type FormType = 'login' | 'signup';

const AuthForm: React.FC<{ onAuth: (user: UserData) => void }> = ({ onAuth }) => {
    const [formType, setFormType] = useState<FormType>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Function to handle login/signup
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Basic validation
        if (formType === 'signup' && !name) {
            setError('Name is required for signup.');
            setLoading(false);
            return;
        }
        if (!email) {
            setError('Email is required.');
            setLoading(false);
            return;
        }
        if (!password) {
            setError('Password is required.');
            setLoading(false);
            return;
        }

        // Simulate API call (replace with actual API call)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate 1s delay

            if (formType === 'login') {
                // Simulate successful login
                if (email === 'test@example.com' && password === 'password') {
                    const user: UserData = { id: '1', name: 'Test User', email: 'test@example.com' };
                    onAuth(user); // Call the onAuth callback
                } else {
                    setError('Invalid credentials. Please check your email and password.');
                }
            } else {
                // Simulate successful signup
                const newUser: UserData = { id: '2', name: name, email: email }; // Simulate new user
                onAuth(newUser); // Call the onAuth callback
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle className="text-center">
                    {formType === 'login' ? 'Login' : 'Sign Up'}
                </CardTitle>
                <CardDescription className="text-center">
                    {formType === 'login'
                        ? 'Login to your account'
                        : 'Create a new account'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {formType === 'signup' && (
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                disabled={loading}
                            />
                        </div>
                    )}
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            disabled={loading}
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            formType === 'login' ? 'Login' : 'Sign Up'
                        )}
                    </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                    {formType === 'login' ? (
                        <p>
                            Don't have an account?{' '}
                            <button
                                onClick={() => setFormType('signup')}
                                className="text-blue-500 hover:underline"
                                disabled={loading}
                            >
                                Sign Up
                            </button>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{' '}
                            <button
                                onClick={() => setFormType('login')}
                                className="text-blue-500 hover:underline"
                                disabled={loading}
                            >
                                Login
                            </button>
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};



const LoginPage = () => {
    const [user, setUser] = useState<UserData | null>(null);

    // Check for existing session on initial load
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing user data from localStorage:", error);
                localStorage.removeItem('user'); // Clear invalid data
            }
        }
    }, []);

    // Function to handle authentication (login or signup)
    const handleAuth = (userData: UserData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // Persist user data
    };

    // Function to handle logout
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user'); // Remove user data on logout
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            {user ? (
                <Dashboard user={user} onLogout={handleLogout} />
            ) : (
                <AuthForm onAuth={handleAuth} />
            )}
        </div>
    );
};

export default LoginPage;
