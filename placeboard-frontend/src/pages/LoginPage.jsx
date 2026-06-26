import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();

    const handleMockLogin = () => {
        localStorage.setItem('token', 'mock-jwt-token');
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
                <h1 className="text-2xl font-bold mb-6 text-blue-600">PlaceBoard Login</h1>
                <p className="mb-6 text-gray-600">Login page implementation goes here.</p>
                <button 
                    onClick={handleMockLogin}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-4"
                >
                    Mock Login
                </button>
                <div className="text-sm">
                    Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
