import React from 'react';
import Navbar from '../components/Navbar';

const CompanyPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Companies</h1>
                <p className="text-gray-600">Company list and management goes here.</p>
            </main>
        </div>
    );
};

export default CompanyPage;
