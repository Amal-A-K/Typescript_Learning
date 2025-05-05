import React, { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Label from './ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { useForm } from 'react-hook-form'; // Import Controller

// Define a basic type for form values
interface AuthFormValues {
    email: string;
    password: string;
    name?: string; // Make name optional for login
}

interface AuthFormProps {
    onAuth: (data: { email: string; name?: string }) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuth }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<AuthFormValues>({ // Use the interface
        //  resolver: zodResolver(formSchema), // Remove Zod resolver
        defaultValues: {
            email: '',
            password: '',
            name: '', // Add name to default values
        },
    });

    const onSubmit = async (data: AuthFormValues) => { // Use the interface
        setIsLoading(true);
        setError(null);

        // Basic validation
        if (!data.email) {
            setError('Email is required');
            setIsLoading(false);
            return;
        }
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
            setError('Invalid email address');
            setIsLoading(false);
            return;
        }
        if (!data.password) {
            setError('Password is required');
            setIsLoading(false);
            return;
        }
        if (data.password.length < 8) {
            setError('Password must be at least 8 characters long');
            setIsLoading(false);
            return;
        }
        if (!isLogin && !data.name) {
            setError('Name is required for sign up');
            setIsLoading(false);
            return;
        }

        try {
            // Simulate an API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // In a real app, you'd validate credentials against a server
            if (isLogin) {
                // Simulate login
                if (data.email === 'test@example.com' && data.password === 'password') {
                    onAuth({ email: data.email, name: 'Test User' }); // Simulate a logged-in user
                } else {
                    setError('Invalid credentials.');
                }
            } else {
                // Simulate signup
                onAuth({ email: data.email, name: data.name });
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>{isLogin ? 'Login' : 'Sign Up'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {!isLogin && (
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Name"
                                {...form.register('name')}
                                className="mb-2"
                            />
                            {form.formState.errors.name && (
                                <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
                            )}
                        </div>
                    )}
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            placeholder="Email"
                            {...form.register('email')}
                            className="mb-2"

                        />
                         {form.formState.errors.email && (
                            <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Password"
                            {...form.register('password')}
                            className="mb-2"
                        />
                        {form.formState.errors.password && (
                            <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
                        )}
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button type="submit" variant='outline' className="w-full" disabled={isLoading}>
                        {isLoading ? <>Loading...</> : isLogin ? 'Login' : 'Sign Up'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsLogin((prev) => !prev)}
                        disabled={isLoading}
                    >
                        {isLogin ? 'Create an account' : 'Login to your account'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default AuthForm;
