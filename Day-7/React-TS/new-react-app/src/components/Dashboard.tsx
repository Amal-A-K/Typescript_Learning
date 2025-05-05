import React, { useState } from 'react';
import Button from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
//import { UserList } from '../components/UserList'; // Remove this import
//import { authService } from '../auth'; // Import the authService
interface User {
  id: string;
  name: string;
  email: string;
}
const authService = {
    logout: async (): Promise<void> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        // Simulate logout
    },
};

const Dashboard = ({ user }: { user: User }) => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await authService.logout();
            // In a real app, you'd redirect to the login page here
            window.location.href = '/'; // Simplest way to "redirect" for this example
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="p-6">
             <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <Button onClick={handleLogout} disabled={isLoggingOut}>
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Welcome, {user.name}!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Email: {user.email}</p>
                    {/* Add more dashboard content here */}
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
