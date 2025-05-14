import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface User {
  fullName: string;
  phoneNumber: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      const phoneNumber = localStorage.getItem('phoneNumber');

      if (!token || !phoneNumber) {
        navigate('/login');
        return;
      }

      try {
        const response = await api.get(`/user/${phoneNumber}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        console.error(err);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('phoneNumber');
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 bg-gradient-to-r from-purple-500 to-purple-300">
      <div className=" shadow-md rounded-lg p-6 w-full max-w-lg text-center bg-gray-900">
        <h1 className="text-3xl text-white font-bold mb-4">Welcome to the Dashboard</h1>
        {user ? (
          <>
            <p className="mb-2 text-2xl text-white">
               {user.fullName}
            </p>
            <p className="mb-2 text-2xl text-white">
              Phone number : {user.phoneNumber}
            </p>
            
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white font-medium px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <p className="text-gray-600">Loading user details...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
