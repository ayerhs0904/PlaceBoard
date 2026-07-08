import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Loader2, Briefcase, GraduationCap, Code } from 'lucide-react';

const AIRecommendPage = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [userProfile, setUserProfile] = useState({ branch: '', cgpa: '', skills: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUserProfile({
                    branch: parsedUser.branch || 'Not specified',
                    cgpa: parsedUser.cgpa || 'N/A',
                    skills: parsedUser.skills || 'Not specified'
                });
            } catch (e) {
                console.error("Error parsing user from localStorage", e);
            }
        }
    }, []);

    const fetchRecommendations = async () => {
        setLoading(true);
        setError(false);
        try {
            const response = await api.get('/api/ai/recommendations');
            setRecommendations(response.data);
        } catch (err) {
            console.error("Failed to fetch recommendations:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const getProgressColor = (percentage) => {
        if (percentage > 75) return 'bg-green-500';
        if (percentage >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Profile Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Profile Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center space-x-3 text-gray-600">
                            <GraduationCap className="h-5 w-5 text-blue-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Branch</p>
                                <p className="font-semibold text-gray-900">{userProfile.branch}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-600">
                            <Briefcase className="h-5 w-5 text-purple-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">CGPA</p>
                                <p className="font-semibold text-gray-900">{userProfile.cgpa}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-600">
                            <Code className="h-5 w-5 text-indigo-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Skills</p>
                                <p className="font-semibold text-gray-900">{userProfile.skills}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">AI Recommendations</h1>
                        <p className="text-gray-600 mt-2">Get personalized company recommendations based on your profile.</p>
                    </div>
                    <button 
                        onClick={fetchRecommendations}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70 flex items-center space-x-2"
                    >
                        {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                        <span>{loading ? 'Analyzing...' : 'Generate Recommendations'}</span>
                    </button>
                </div>

                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-[280px] animate-pulse">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-6 bg-gray-200 rounded w-1/4 rounded-full"></div>
                                </div>
                                <div className="mb-4">
                                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                </div>
                                <div className="space-y-2 mb-6">
                                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                                    <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                                </div>
                                <div className="h-10 bg-gray-100 rounded-lg w-full mt-auto"></div>
                            </div>
                        ))}
                    </div>
                )}

                {error && !loading && (
                    <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center border border-red-100">
                        <p className="mb-4 font-medium text-lg">Could not load recommendations. Try again.</p>
                        <button 
                            onClick={fetchRecommendations}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && recommendations.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendations.map((rec, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-gray-900">{rec.companyName}</h3>
                                    <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium border border-blue-100">
                                        {rec.sector || 'Technology'}
                                    </span>
                                </div>
                                
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-1 font-medium">
                                        <span className="text-gray-600">Match</span>
                                        <span className="text-gray-900">{rec.matchPercentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div 
                                            className={`h-2.5 rounded-full ${getProgressColor(rec.matchPercentage)}`} 
                                            style={{ width: `${rec.matchPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">
                                    {rec.reason}
                                </p>

                                <button 
                                    onClick={() => navigate('/companies')}
                                    className="w-full mt-auto bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-2.5 rounded-lg border border-gray-200 transition-colors"
                                >
                                    Apply Now
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}

                {!loading && !error && recommendations.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <div className="text-6xl mb-4">✨</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No recommendations yet</h3>
                        <p className="text-gray-500 text-lg">Add more companies to get recommendations</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AIRecommendPage;
