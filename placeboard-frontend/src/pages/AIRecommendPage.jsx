import React from 'react';
import Navbar from '../components/Navbar';

const AIRecommendPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">AI Picks</h1>
                <p className="text-gray-600">AI recommendations interface goes here.</p>
            </main>
        </div>
    );
};

export default AIRecommendPage;
