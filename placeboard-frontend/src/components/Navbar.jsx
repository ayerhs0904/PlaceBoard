import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-md">
            <div className="font-bold text-xl">
                <Link to="/dashboard">PlaceBoard</Link>
            </div>
            <div className="flex gap-6 items-center">
                <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
                <Link to="/analytics" className="hover:text-blue-200">Analytics</Link>
                <Link to="/ai" className="hover:text-blue-200">AI Picks</Link>
                <Link to="/companies" className="hover:text-blue-200">Companies</Link>
                <button 
                    onClick={handleLogout}
                    className="bg-white text-blue-600 px-4 py-1 rounded font-semibold hover:bg-gray-100 transition-colors"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
