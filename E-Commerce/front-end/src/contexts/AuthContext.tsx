import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AuthService from '../services/auth.service';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isAdmin: boolean;
    image?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string, isAdmin?: boolean) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
    updateUser: (user: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);    useEffect(() => {
        const user = AuthService.getCurrentUser();
        const token = localStorage.getItem('token');
        if (user && token) {
            setUser({
                ...user,
                isAdmin: user.role === 'admin'
            });
            setIsAuthenticated(true);
            setIsAdmin(user.role === 'admin');
        } else {
            // Clean up any inconsistent state
            AuthService.logout();
            setUser(null);
            setIsAuthenticated(false);
            setIsAdmin(false);
        }
    }, []);    const login = async (email: string, password: string, isAdmin: boolean = false) => {
        try {
            const response = await AuthService.login({ email, password }, isAdmin);
            if (response.token && response.user) {
                const userData = {
                    ...response.user,
                    isAdmin: response.user.role === 'admin'
                };
                setUser(userData);
                setIsAuthenticated(true);
                setIsAdmin(userData.isAdmin);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            // Clean up any inconsistent state
            logout();
            const errorMessage = error.response?.data?.errors?.role 
                || error.response?.data?.message 
                || error.message 
                || 'Login failed';
            throw new Error(errorMessage);
        }
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
    };    const updateUser = async (userData: Partial<User>) => {
        try {
            if (!user) return;
            // Convert the data to match the AuthService expectations
            const serviceData: Partial<{
                name: string;
                email: string;
                password: string;
                role: string;
                image?: File[];
            }> = {
                ...userData,
                image: userData.image ? undefined : undefined // Remove image if it's a string
            };
            const updatedUser = await AuthService.updateUser(user.id, serviceData);
            setUser({
                ...updatedUser,
                isAdmin: updatedUser.role === 'admin'
            });
            setIsAdmin(updatedUser.role === 'admin');
        } catch (error) {
            console.error('Update user error:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
