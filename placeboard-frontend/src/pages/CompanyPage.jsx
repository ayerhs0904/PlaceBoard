import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const CompanyPage = () => {
    const [companies, setCompanies] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        jobUrl: '',
        jobRole: '',
        deadline: '',
        sector: 'IT',
        packageRange: '',
        location: ''
    });

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await api.get('/api/companies');
            setCompanies(response.data);
        } catch (error) {
            toast.error('Failed to fetch companies');
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/companies', formData);
            toast.success('Company added successfully');
            setIsModalOpen(false);
            setFormData({
                name: '', jobUrl: '', jobRole: '', deadline: '', 
                sector: 'IT', packageRange: '', location: ''
            });
            fetchCompanies();
        } catch (error) {
            toast.error('Failed to add company');
        }
    };

    const getDeadlineColor = (dateString) => {
        if (!dateString) return 'text-gray-500';
        const deadline = new Date(dateString);
        const today = new Date();
        const diffTime = deadline - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'text-red-600 font-bold';
        if (diffDays <= 7) return 'text-yellow-600 font-bold';
        return 'text-green-600 font-bold';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">My Companies</h1>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
                    >
                        + Add Company
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map((company) => (
                        <div key={company.id} className="bg-white p-6 rounded-lg shadow border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">{company.name}</h2>
                            {company.jobRole && (
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3">
                                    {company.jobRole}
                                </span>
                            )}
                            <div className="text-sm text-gray-600 space-y-1 mb-4">
                                {company.deadline && (
                                    <p>Deadline: <span className={getDeadlineColor(company.deadline)}>{company.deadline}</span></p>
                                )}
                                {company.sector && <p>Sector: {company.sector}</p>}
                                {company.packageRange && <p>Package: {company.packageRange}</p>}
                                {company.location && <p>Location: {company.location}</p>}
                            </div>
                            {company.jobUrl && (
                                <a 
                                    href={company.jobUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                                >
                                    View Job 🔗
                                </a>
                            )}
                        </div>
                    ))}
                    {companies.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            No companies added yet. Click "Add Company" to start!
                        </div>
                    )}
                </div>

                {/* Add Company Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h2 className="text-2xl font-bold mb-4">Add New Company</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Company Name *</label>
                                    <input 
                                        type="text" name="name" required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                        value={formData.name} onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Job URL (Optional)</label>
                                    <input 
                                        type="url" name="jobUrl" placeholder="LinkedIn/Internshala URL"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                        value={formData.jobUrl} onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Job Role (Optional)</label>
                                    <input 
                                        type="text" name="jobRole" placeholder="SDE, Data Analyst"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                        value={formData.jobRole} onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Deadline (Optional)</label>
                                    <input 
                                        type="date" name="deadline"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                        value={formData.deadline} onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Sector (Optional)</label>
                                    <select 
                                        name="sector"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                        value={formData.sector} onChange={handleInputChange}
                                    >
                                        <option value="IT">IT</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Core">Core</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Package Range (Optional)</label>
                                    <input 
                                        type="text" name="packageRange" placeholder="e.g., 10-15 LPA"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                        value={formData.packageRange} onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Location (Optional)</label>
                                    <input 
                                        type="text" name="location" placeholder="e.g., Bangalore, Remote"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                        value={formData.location} onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyPage;
