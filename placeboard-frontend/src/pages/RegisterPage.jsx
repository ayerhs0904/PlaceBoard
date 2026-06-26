import React from 'react';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
                <h1 className="text-2xl font-bold mb-6 text-blue-600">Register</h1>
                <p className="mb-6 text-gray-600">Registration page implementation goes here.</p>
                <div className="text-sm">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
