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
        return location.pathname === path 
            ? "text-white font-semibold pb-1" 
            : "text-slate-300 hover:text-white transition-colors pb-1";
    };

    return (
        <nav className="bg-[#050510]/80 backdrop-blur border-b border-white/10 sticky top-0 z-50 p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="font-extrabold text-2xl tracking-tight">
                    <Link to="/dashboard" className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">
                        PlaceBoard
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-8 items-center">
                    <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
                    <Link to="/analytics" className={isActive('/analytics')}>Analytics</Link>
                    <Link to="/ai" className={isActive('/ai')}>AI Picks</Link>
                    <Link to="/companies" className={isActive('/companies')}>Companies</Link>
                    <Link to="/resume" className={isActive('/resume')}>Resume</Link>
                    
                    <div className="flex items-center gap-4 ml-4 border-l border-white/10 pl-4 relative">
                        <button 
                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold hover:opacity-90 transition-opacity shadow-sm focus:outline-none"
                        >
                            {getInitials(userName)}
                        </button>
                        
                        {isProfileDropdownOpen && (
                            <div className="absolute top-12 right-0 mt-2 w-48 bg-[#050510] border border-white/10 rounded-xl shadow-lg py-1 z-50">
                                <div className="px-4 py-2 border-b border-white/10">
                                    <p className="text-sm text-slate-400">Signed in as</p>
                                    <p className="text-sm font-medium text-white truncate">{userName}</p>
                                </div>

                                <Link 
                                    to="/profile"
                                    onClick={() => setIsProfileDropdownOpen(false)}
                                    className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    Profile
                                </Link>
                                <button 
                                    onClick={() => {
                                        setIsProfileDropdownOpen(false);
                                        handleLogout();
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
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
                <div className="md:hidden mt-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-inner">
                    {userName && <span className="text-slate-300 font-medium pb-2 border-b border-white/10">Welcome, {userName}</span>}
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={isActive('/dashboard')}>Dashboard</Link>
                    <Link to="/analytics" onClick={() => setIsMobileMenuOpen(false)} className={isActive('/analytics')}>Analytics</Link>
                    <Link to="/ai" onClick={() => setIsMobileMenuOpen(false)} className={isActive('/ai')}>AI Picks</Link>
                    <Link to="/companies" onClick={() => setIsMobileMenuOpen(false)} className={isActive('/companies')}>Companies</Link>
                    <Link to="/resume" onClick={() => setIsMobileMenuOpen(false)} className={isActive('/resume')}>Resume</Link>
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className={isActive('/profile')}>Profile</Link>

                    <button 
                        onClick={handleLogout}
                        className="bg-white/10 border border-white/20 text-red-400 px-4 py-2 mt-2 rounded-xl font-bold hover:bg-white/20 w-full text-center"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
