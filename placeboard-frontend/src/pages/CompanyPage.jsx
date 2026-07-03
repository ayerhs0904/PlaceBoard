import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Building, Search, Filter, Plus, X, Briefcase, MapPin, DollarSign, Award, FileText } from 'lucide-react';

const CompanyPage = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [search, setSearch] = useState('');
    const [sectorFilter, setSectorFilter] = useState('All');
    const [cgpaFilter, setCgpaFilter] = useState('');

    // Add Company Form State
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCompany, setNewCompany] = useState({
        name: '',
        sector: 'IT',
        minCgpa: '',
        packageRange: '',
        bond: '',
        location: ''
    });

    // Application Modal State
    const [isAppModalOpen, setIsAppModalOpen] = useState(false);
    const [appForm, setAppForm] = useState({
        companyId: '',
        roleApplied: '',
        appliedDate: new Date().toISOString().split('T')[0],
        notes: '',
        status: 'APPLIED'
    });
    const [selectedCompanyName, setSelectedCompanyName] = useState('');

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/companies');
            setCompanies(response.data);
        } catch (error) {
            toast.error('Failed to fetch companies');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCompany = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...newCompany,
                minCgpa: parseFloat(newCompany.minCgpa)
            };
            await api.post('/api/companies', payload);
            toast.success('Company added successfully');
            setNewCompany({
                name: '',
                sector: 'IT',
                minCgpa: '',
                packageRange: '',
                bond: '',
                location: ''
            });
            setShowAddForm(false);
            fetchCompanies();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add company');
        }
    };

    const openAppModal = (company) => {
        setAppForm({
            ...appForm,
            companyId: company.id
        });
        setSelectedCompanyName(company.name);
        setIsAppModalOpen(true);
    };

    const handleAddApplication = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                company: { id: parseInt(appForm.companyId) },
                roleApplied: appForm.roleApplied,
                appliedDate: appForm.appliedDate,
                notes: appForm.notes,
                status: appForm.status
            };
            await api.post('/api/applications', payload);
            toast.success('Application added successfully');
            setIsAppModalOpen(false);
            setAppForm({
                ...appForm,
                roleApplied: '',
                notes: ''
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add application');
        }
    };

    const filteredCompanies = companies.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
        const matchesSector = sectorFilter === 'All' || c.sector === sectorFilter;
        const matchesCgpa = cgpaFilter === '' || c.minCgpa <= parseFloat(cgpaFilter);
        return matchesSearch && matchesSector && matchesCgpa;
    });

    const getSectorColor = (sector) => {
        switch(sector) {
            case 'IT': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Finance': return 'bg-green-100 text-green-800 border-green-200';
            case 'Core': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Consulting': return 'bg-purple-100 text-purple-800 border-purple-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <Building className="mr-3 text-blue-600" size={32} />
                        Companies
                    </h1>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
                    >
                        {showAddForm ? <X size={20} className="mr-2" /> : <Plus size={20} className="mr-2" />}
                        {showAddForm ? 'Close Form' : 'Add Company'}
                    </button>
                </div>

                {/* Add Company Form */}
                {showAddForm && (
                    <div className="bg-white p-6 rounded-xl shadow-md mb-8 animate-in fade-in slide-in-from-top-4 duration-300 border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Company</h2>
                        <form onSubmit={handleAddCompany} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                <input required type="text" value={newCompany.name} onChange={e => setNewCompany({...newCompany, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Google" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                                <select value={newCompany.sector} onChange={e => setNewCompany({...newCompany, sector: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                                    <option value="IT">IT</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Core">Core</option>
                                    <option value="Consulting">Consulting</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Min CGPA</label>
                                <input required type="number" step="0.1" min="0" max="10" value={newCompany.minCgpa} onChange={e => setNewCompany({...newCompany, minCgpa: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 7.5" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Package Range</label>
                                <input required type="text" value={newCompany.packageRange} onChange={e => setNewCompany({...newCompany, packageRange: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 12-15 LPA" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bond Details</label>
                                <input required type="text" value={newCompany.bond} onChange={e => setNewCompany({...newCompany, bond: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 1 Year / None" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input required type="text" value={newCompany.location} onChange={e => setNewCompany({...newCompany, location: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Bangalore" />
                            </div>
                            <div className="md:col-span-2 lg:col-span-3 flex justify-end mt-2">
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                                    Save Company
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl shadow-sm mb-8 border border-gray-100 flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><Search size={16} className="mr-1"/> Search</label>
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Search companies..." />
                    </div>
                    <div className="w-full md:w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><Filter size={16} className="mr-1"/> Sector</label>
                        <select value={sectorFilter} onChange={e => setSectorFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                            <option value="All">All Sectors</option>
                            <option value="IT">IT</option>
                            <option value="Finance">Finance</option>
                            <option value="Core">Core</option>
                            <option value="Consulting">Consulting</option>
                        </select>
                    </div>
                    <div className="w-full md:w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><Award size={16} className="mr-1"/> Min CGPA</label>
                        <input type="number" step="0.1" min="0" max="10" value={cgpaFilter} onChange={e => setCgpaFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Any" />
                    </div>
                </div>

                {/* Company Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : companies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
                        <div className="text-6xl mb-4">🏢</div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">No companies added yet</h3>
                        <p className="text-gray-500 max-w-md mb-6">Start building your company database to track applications effectively.</p>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform hover:scale-105"
                        >
                            <Plus size={20} className="mr-2" />
                            Add First Company
                        </button>
                    </div>
                ) : filteredCompanies.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                        <Search className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <h3 className="text-xl font-bold text-gray-700">No companies found</h3>
                        <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCompanies.map(company => (
                            <div key={company.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                <div className="p-5 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{company.name}</h3>
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getSectorColor(company.sector)}`}>
                                            {company.sector}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-3 mt-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <DollarSign size={16} className="mr-2 text-gray-400" />
                                            <span className="font-medium text-gray-900 mr-1">Package:</span> {company.packageRange}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Award size={16} className="mr-2 text-gray-400" />
                                            <span className="font-medium text-gray-900 mr-1">Min CGPA:</span> {company.minCgpa}+
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <FileText size={16} className="mr-2 text-gray-400" />
                                            <span className="font-medium text-gray-900 mr-1">Bond:</span> {company.bond}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <MapPin size={16} className="mr-2 text-gray-400" />
                                            <span className="font-medium text-gray-900 mr-1">Location:</span> {company.location}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 border-t border-gray-100">
                                    <button
                                        onClick={() => openAppModal(company)}
                                        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                        <Briefcase size={16} className="mr-2" />
                                        Apply Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Application Modal */}
            {isAppModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">Apply to {selectedCompanyName}</h2>
                            <button onClick={() => setIsAppModalOpen(false)} className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 p-1 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddApplication} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                                <input type="text" disabled value={selectedCompanyName} className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-500" />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role Applied For</label>
                                <input
                                    type="text"
                                    required
                                    value={appForm.roleApplied}
                                    onChange={(e) => setAppForm({...appForm, roleApplied: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g. Software Engineer"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date Applied</label>
                                <input
                                    type="date"
                                    required
                                    value={appForm.appliedDate}
                                    onChange={(e) => setAppForm({...appForm, appliedDate: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                                <textarea
                                    rows="3"
                                    value={appForm.notes}
                                    onChange={(e) => setAppForm({...appForm, notes: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Any additional details..."
                                ></textarea>
                            </div>
                            
                            <div className="pt-4 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAppModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 font-medium shadow-sm transition-colors"
                                >
                                    Save Application
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyPage;
