import React from 'react';
import Navbar from '../components/Navbar';

const KanbanPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard (Kanban)</h1>
                <p className="text-gray-600">Kanban board implementation goes here.</p>
            </main>
        </div>
    );
};

export default KanbanPage;
