import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const AIRecommendPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#050510] text-white font-sans flex flex-col">
            <Navbar />
            <main className="flex-grow flex items-center justify-center p-4 sm:p-8">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="max-w-xl w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl"
                >
                    <div className="text-7xl mb-6 inline-block">🚀</div>
                    
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                        AI Recommendations Coming Soon
                    </h1>
                    
                    <p className="text-gray-400 mb-8 text-base md:text-lg leading-relaxed">
                        We're working on something amazing. Soon you'll get personalized company 
                        recommendations powered by AI based on your profile, skills and CGPA.
                    </p>

                    <div className="bg-black/20 rounded-2xl p-6 mb-8 text-left border border-white/5">
                        <ul className="space-y-4">
                            <motion.li 
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                                className="flex items-center text-gray-300 font-medium"
                            >
                                <span className="mr-3 text-xl">✨</span> Smart company matching
                            </motion.li>
                            <motion.li 
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                                className="flex items-center text-gray-300 font-medium"
                            >
                                <span className="mr-3 text-xl">✨</span> CGPA based filtering
                            </motion.li>
                            <motion.li 
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                                className="flex items-center text-gray-300 font-medium"
                            >
                                <span className="mr-3 text-xl">✨</span> Skills gap analysis
                            </motion.li>
                            <motion.li 
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                                className="flex items-center text-gray-300 font-medium"
                            >
                                <span className="mr-3 text-xl">✨</span> Placement probability score
                            </motion.li>
                        </ul>
                    </div>

                    <div className="space-y-5">
                        <p className="text-gray-500 text-sm">
                            Meanwhile, check out our Resume Hub for AI-powered resume analysis →
                        </p>

                        <button 
                            onClick={() => navigate('/resume')}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3.5 px-8 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transform hover:-translate-y-1 w-full sm:w-auto"
                        >
                            Go to Resume Hub
                        </button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default AIRecommendPage;
