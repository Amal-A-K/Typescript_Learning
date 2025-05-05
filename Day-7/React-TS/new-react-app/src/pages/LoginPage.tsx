import React from 'react';
import AuthForm from '../components/AuthForm';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const handleAuth = (userData: { email: string }) => {
    //  login logic (e.g., API call)
    console.log('Login data:', userData);
    onLogin(); //  Update the authentication state in App.tsx
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-100">
      <AuthForm onAuth={handleAuth} />
    </div>
  );
};

export default LoginPage;
