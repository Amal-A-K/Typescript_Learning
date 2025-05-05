import React from 'react';
import Button from './ui/Button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from './ui/Card';
import { LogOut, User } from 'lucide-react';

interface UserData {
    id: string;
    name: string;
    email: string;
}

const Dashboard: React.FC<{ user: UserData; onLogout: () => void }> = ({ user, onLogout }) => {

    return (
        <div className="p-6">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Welcome, {user.name}!
                    </CardTitle>
                    <CardDescription>
                        Email: {user.email}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={onLogout} variant="destructive" className="w-full">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
