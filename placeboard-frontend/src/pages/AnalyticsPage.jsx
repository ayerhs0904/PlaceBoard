import React from 'react';
import Navbar from '../components/Navbar';

const AnalyticsPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Analytics</h1>
                <p className="text-gray-600">Analytics charts and data go here.</p>
            </main>
        </div>
    );
};

export default AnalyticsPage;
