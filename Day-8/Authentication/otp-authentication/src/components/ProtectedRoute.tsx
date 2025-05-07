import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useUserAuth();
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>; // Wrap children in a fragment to ensure ReactElement return
};

export default ProtectedRoute;