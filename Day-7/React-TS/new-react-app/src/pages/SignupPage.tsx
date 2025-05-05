import React from 'react';
import AuthForm from '../components/AuthForm';

interface SignupPageProps {
  onSignup: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup }) => {
  const handleAuth = (userData: { email: string; name?: string }) => {
    //  signup logic (e.g., API call)
    console.log('Signup data:', userData);
    onSignup(); // Update the authentication state in App.tsx
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <AuthForm onAuth={handleAuth} />
    </div>
  );
};

export default SignupPage;
