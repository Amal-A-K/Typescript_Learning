import React,{ createContext, useCallback, useEffect, useState,useContext, ReactNode } from "react";
import { postRequest } from "../utils/services";
import { baseUrl } from "../utils/services";

// Define types for your user and error responses
 export interface User {
  _id: string;
  name: string;
  email: string;
  token?: string;
  // Add other user properties as needed
}

export interface ErrorResponse {
  error: boolean;
  message: string;
  // Add other error properties as needed
}

export interface RegisterInfo {
  name: string;
  email: string;
  password: string;
}

export interface LoginInfo {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  registerInfo: RegisterInfo;
  updateRegisterInfo: (info: Partial<RegisterInfo>) => void;
  registerUser: (e: React.FormEvent) => Promise<void>;
  registerError: ErrorResponse | null;
  isRegisterLoading: boolean;
  logoutUser: () => void;
  loginUser: (e: React.FormEvent) => Promise<void>;
  loginError: ErrorResponse | null;
  isLoginLoading: boolean;
  updateLoginInfo: (info: Partial<LoginInfo>) => void;
  loginInfo: LoginInfo;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: AuthProviderProps) => { 
    const [user, setUser] = useState<User | null>(null);
    const [registerError, setRegisterError] = useState<ErrorResponse | null>(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState<RegisterInfo>({
        name: "",
        email: "",
        password: "",
    });

    const [loginError, setLoginError] = useState<ErrorResponse | null>(null);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [loginInfo, setLoginInfo] = useState<LoginInfo>({
        email: "",
        password: "",
    });

    useEffect(() => {
        const user = localStorage.getItem("User");
        if (user) {
            setUser(JSON.parse(user));
        }
    }, []);    const updateRegisterInfo = useCallback((info: Partial<RegisterInfo>) => {
        setRegisterInfo(prev => ({
            ...prev,
            ...info
        }));
    }, []);    const updateLoginInfo = useCallback((info: Partial<LoginInfo>) => {
        setLoginInfo(prev => ({
            ...prev,
            ...info
        }));
    }, []);

    const registerUser = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        setIsRegisterLoading(true);
        setRegisterError(null);
        
        try {
            const response = await postRequest<User | ErrorResponse>(
                `${baseUrl}/users/register`, 
                JSON.stringify(registerInfo)
            );
            
            setIsRegisterLoading(false);
            
            if ('error' in response) {
                setRegisterError({
                    error: true,
                    message: typeof response.message === 'string' 
                        ? response.message 
                        : 'Registration failed'
                });
                return;
            }
            
            localStorage.setItem("User", JSON.stringify(response));
            setUser(response as User);
        } catch (error) {
            setIsRegisterLoading(false);
            setRegisterError({ 
                error: true, 
                message: error instanceof Error ? error.message : "An unexpected error occurred" 
            });
        }
    }, [registerInfo]);

    const loginUser = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoginLoading(true);
        setLoginError(null);
        
        try {
            const response = await postRequest<User | ErrorResponse>(
                `${baseUrl}/users/login`, 
                JSON.stringify(loginInfo)
            );
            
            setIsLoginLoading(false);
            
            if ('error' in response) {
                setLoginError({
                    error: true,
                    message: typeof response.message === 'string' 
                        ? response.message 
                        : 'Login failed'
                });
                return;
            }
            
            localStorage.setItem("User", JSON.stringify(response));
            setUser(response as User);
        } catch (error) {
            setIsLoginLoading(false);
            setLoginError({ 
                error: true, 
                message: error instanceof Error ? error.message : "An unexpected error occurred" 
            });
        }
    }, [loginInfo]);

    const logoutUser = useCallback(() => {
        localStorage.removeItem("User");
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                registerInfo, 
                updateRegisterInfo, 
                registerUser, 
                registerError, 
                isRegisterLoading, 
                logoutUser, 
                loginUser, 
                loginError, 
                isLoginLoading, 
                updateLoginInfo, 
                loginInfo 
            }}
        > 
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};