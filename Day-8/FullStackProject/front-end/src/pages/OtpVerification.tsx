// src/pages/OtpVerification.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from '../utils/axios';
import api from '../services/api';

const OtpVerification: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const sessionId = sessionStorage.getItem('sessionId');
    const formData = JSON.parse(sessionStorage.getItem('formData') || '{}');

    if (!otp || !sessionId) {
      setError('OTP or session expired');
      return;
    }

    try {
      await api.post('/verify-otp', {
        ...formData,
        otp,
        sessionId,
      });

      // Clear session and redirect to login
      sessionStorage.removeItem('sessionId');
      sessionStorage.removeItem('formData');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form onSubmit={handleVerify} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">OTP Verification</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default OtpVerification;
