import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userName, setUserName] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user && user.name) {
                    setUserName(user.name);
                }
            } catch (e) {
                console.error("Error parsing user data", e);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? "text-white font-bold border-b-2 border-white pb-1" : "text-blue-100 hover:text-white transition-colors pb-1";
    };

    return (
        <nav className="bg-blue-600 p-4 shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="font-extrabold text-2xl tracking-tight">
                    <Link to="/dashboard" className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent drop-shadow-sm">
                        PlaceBoard
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-8 items-center">
                    <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
                    <Link to="/analytics" className={isActive('/analytics')}>Analytics</Link>
                    <Link to="/ai" className={isActive('/ai')}>AI Picks</Link>
                    <Link to="/companies" className={isActive('/companies')}>Companies</Link>
                    
                    <div className="flex items-center gap-4 ml-4 border-l border-blue-400 pl-4 relative">
                        <button 
                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-blue-700 font-bold hover:bg-blue-50 transition-colors shadow-sm focus:outline-none"
                        >
                            {getInitials(userName)}
                        </button>
                        
                        {isProfileDropdownOpen && (
                            <div className="absolute top-12 right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm text-gray-500">Signed in as</p>
                                    <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                                </div>
                                <Link 
                                    to="/profile" 
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                    onClick={() => setIsProfileDropdownOpen(false)}
                                >
                                    Profile
                                </Link>
                                <button 
                                    onClick={() => {
                                        setIsProfileDropdownOpen(false);
                                        handleLogout();
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden mt-4 bg-blue-700 rounded-lg p-4 flex flex-col gap-4 shadow-inner">
                    {userName && <span className="text-blue-100 font-medium pb-2 border-b border-blue-500">Welcome, {userName}</span>}
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={isActive('/dashboard')}>Dashboard</Link>
                    <Link to="/analytics" onClick={() => setIsMobileMenuOpen(false)} className={isActive('/analytics')}>Analytics</Link>
                    <Link to="/ai" onClick={() => setIsMobileMenuOpen(false)} className={isActive('/ai')}>AI Picks</Link>
                    <Link to="/companies" onClick={() => setIsMobileMenuOpen(false)} className={isActive('/companies')}>Companies</Link>
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className={isActive('/profile')}>Profile</Link>
                    <button 
                        onClick={handleLogout}
                        className="bg-white text-red-600 px-4 py-2 mt-2 rounded font-bold hover:bg-gray-100 w-full text-center"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
