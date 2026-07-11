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

        if (diffDays < 0) return 'text-red-400 font-bold bg-red-900/30 px-2 py-0.5 rounded border border-red-500/30';
        if (diffDays <= 7) return 'text-yellow-400 font-bold bg-yellow-900/30 px-2 py-0.5 rounded border border-yellow-500/30';
        return 'text-green-400 font-bold bg-green-900/30 px-2 py-0.5 rounded border border-green-500/30';
    };

    return (
        <div className="min-h-screen bg-[#050510] text-white">
            <Navbar />
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">My Companies</h1>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow transition-colors"
                    >
                        + Add Company
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map((company) => (
                        <div key={company.id} className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow border border-white/10 hover:bg-white/10 transition-colors">
                            <h2 className="text-xl font-bold text-white mb-2">{company.name}</h2>
                            {company.jobRole && (
                                <span className="inline-block bg-violet-900/50 text-violet-300 border border-violet-500/30 text-xs px-2 py-1 rounded-full mb-3">
                                    {company.jobRole}
                                </span>
                            )}
                            <div className="text-sm text-slate-400 space-y-2 mb-4">
                                {company.deadline && (
                                    <p className="flex items-center gap-2">Deadline: <span className={getDeadlineColor(company.deadline)}>{company.deadline}</span></p>
                                )}
                                {company.sector && <p>Sector: <span className="text-white">{company.sector}</span></p>}
                                {company.packageRange && <p>Package: <span className="text-white">{company.packageRange}</span></p>}
                                {company.location && <p>Location: <span className="text-white">{company.location}</span></p>}
                            </div>
                            {company.jobUrl && (
                                <a 
                                    href={company.jobUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-violet-400 hover:text-violet-300 font-medium inline-flex items-center transition-colors"
                                >
                                    View Job 🔗
                                </a>
                            )}
                        </div>
                    ))}
                    {companies.length === 0 && (
                        <div className="col-span-full text-center py-10 text-slate-500">
                            No companies added yet. Click "Add Company" to start!
                        </div>
                    )}
                </div>

                {/* Add Company Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-[#0f0f1a] border border-white/10 rounded-2xl shadow-xl max-w-md w-full p-6 text-white">
                            <h2 className="text-2xl font-bold mb-4">Add New Company</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300">Company Name *</label>
                                    <input 
                                        type="text" name="name" required
                                        className="mt-1 block w-full rounded-xl bg-white/5 border-white/10 shadow-sm focus:border-violet-500 focus:ring-violet-500 border p-2 text-white placeholder-slate-500"
                                        value={formData.name} onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300">Job URL (Optional)</label>
                                    <input 
                                        type="url" name="jobUrl" placeholder="LinkedIn/Internshala URL"
                                        className="mt-1 block w-full rounded-xl bg-white/5 border-white/10 shadow-sm focus:border-violet-500 focus:ring-violet-500 border p-2 text-white placeholder-slate-500"
                                        value={formData.jobUrl} onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300">Job Role (Optional)</label>
                                    <input 
                                        type="text" name="jobRole" placeholder="SDE, Data Analyst"
                                        className="mt-1 block w-full rounded-xl bg-white/5 border-white/10 shadow-sm focus:border-violet-500 focus:ring-violet-500 border p-2 text-white placeholder-slate-500"
                                        value={formData.jobRole} onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300">Deadline (Optional)</label>
                                    <input 
                                        type="date" name="deadline"
                                        className="mt-1 block w-full rounded-xl bg-white/5 border-white/10 shadow-sm focus:border-violet-500 focus:ring-violet-500 border p-2 text-white [&::-webkit-calendar-picker-indicator]:invert"
                                        value={formData.deadline} onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300">Sector (Optional)</label>
                                    <select 
                                        name="sector"
                                        className="mt-1 block w-full rounded-xl bg-white/5 border-white/10 shadow-sm focus:border-violet-500 focus:ring-violet-500 border p-2 text-white [&>option]:text-black"
                                        value={formData.sector} onChange={handleInputChange}
                                    >
                                        <option value="IT">IT</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Core">Core</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300">Package Range (Optional)</label>
                                    <input 
                                        type="text" name="packageRange" placeholder="e.g., 10-15 LPA"
                                        className="mt-1 block w-full rounded-xl bg-white/5 border-white/10 shadow-sm focus:border-violet-500 focus:ring-violet-500 border p-2 text-white placeholder-slate-500"
                                        value={formData.packageRange} onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300">Location (Optional)</label>
                                    <input 
                                        type="text" name="location" placeholder="e.g., Bangalore, Remote"
                                        className="mt-1 block w-full rounded-xl bg-white/5 border-white/10 shadow-sm focus:border-violet-500 focus:ring-violet-500 border p-2 text-white placeholder-slate-500"
                                        value={formData.location} onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors border border-white/10"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-colors shadow"
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
