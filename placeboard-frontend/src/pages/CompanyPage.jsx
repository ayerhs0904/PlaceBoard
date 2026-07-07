import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Building, Search, Filter, Plus, X, Briefcase, MapPin, DollarSign, Award, FileText, ChevronDown, ChevronUp, Link as LinkIcon, CheckCircle2 } from 'lucide-react';

const CompanyPage = () => {
    const [notAppliedCompanies, setNotAppliedCompanies] = useState([]);
    const [appliedCompanies, setAppliedCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('NOT_APPLIED'); // 'NOT_APPLIED' | 'APPLIED'

    // Filters
    const [search, setSearch] = useState('');
    const [sectorFilter, setSectorFilter] = useState('All');
    const [cgpaFilter, setCgpaFilter] = useState('');

    // Add Company Form State
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCompany, setNewCompany] = useState({
        name: '',
        deadline: '',
        jobRole: '',
        jobUrl: '',
        sector: 'IT',
        minCgpa: '',
        packageRange: '',
        bond: '',
        location: ''
    });
    const [showMoreDetails, setShowMoreDetails] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Application Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        selectedCompany: null
    });

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const [notAppliedRes, appliedRes] = await Promise.all([
                api.get('/api/companies/not-applied'),
                api.get('/api/companies/applied')
            ]);
            setNotAppliedCompanies(notAppliedRes.data);
            setAppliedCompanies(appliedRes.data);
        } catch (error) {
            toast.error('Failed to fetch companies');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!newCompany.name.trim()) errors.name = 'Company Name is required';
        if (!newCompany.deadline) errors.deadline = 'Deadline is required';
        if (!newCompany.jobRole.trim()) errors.jobRole = 'Job Role is required';
        if (!newCompany.jobUrl.trim()) errors.jobUrl = 'Job URL is required';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddCompany = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        try {
            const payload = {
                ...newCompany,
                minCgpa: parseFloat(newCompany.minCgpa) || 0
            };
            await api.post('/api/companies', payload);
            toast.success('Company added successfully');
            setNewCompany({
                name: '',
                deadline: '',
                jobRole: '',
                jobUrl: '',
                sector: 'IT',
                minCgpa: '',
                packageRange: '',
                bond: '',
                location: ''
            });
            setShowAddForm(false);
            setShowMoreDetails(false);
            setFormErrors({});
            fetchCompanies();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add company');
        }
    };

    const handleApplyClick = (company) => {
        if (company.jobUrl) {
            window.open(company.jobUrl, '_blank');
        } else {
            toast.error('No Job URL provided for this company');
        }
        setConfirmModal({
            isOpen: true,
            selectedCompany: company
        });
    };

    const confirmApplication = async () => {
        const company = confirmModal.selectedCompany;
        if (!company) return;

        try {
            const payload = {
                companyId: parseInt(company.id),
                role: company.jobRole,
                jobUrl: company.jobUrl,
                notes: '',
                appliedDate: new Date().toISOString().split('T')[0]
            };
            await api.post('/api/applications', payload);
            toast.success('Added to your applications!');
            setConfirmModal({ isOpen: false, selectedCompany: null });
            fetchCompanies();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add application');
        }
    };

    const getSectorColor = (sector) => {
        switch (sector) {
            case 'IT': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Finance': return 'bg-green-100 text-green-800 border-green-200';
            case 'Core': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Consulting': return 'bg-purple-100 text-purple-800 border-purple-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPLIED': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'SHORTLISTED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'INTERVIEW': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'OFFER': return 'bg-green-100 text-green-800 border-green-200';
            case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getDeadlineWarning = (deadline) => {
        if (!deadline) return { color: 'bg-gray-100 text-gray-800', text: 'No Deadline' };
        const dlDate = new Date(deadline);
        const today = new Date();
        const diffTime = dlDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return { color: 'bg-red-100 text-red-800 border-red-200', text: 'Deadline passed' };
        if (diffDays <= 7) return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: `${diffDays} days left` };
        
        const options = { day: 'numeric', month: 'short' };
        return { color: 'bg-green-100 text-green-800 border-green-200', text: `Apply by ${dlDate.toLocaleDateString(undefined, options)}` };
    };

    const currentCompanies = activeTab === 'NOT_APPLIED' ? notAppliedCompanies : appliedCompanies;

    const filteredCompanies = currentCompanies.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
        const matchesSector = sectorFilter === 'All' || c.sector === sectorFilter;
        const matchesCgpa = cgpaFilter === '' || c.minCgpa <= parseFloat(cgpaFilter);
        return matchesSearch && matchesSector && matchesCgpa;
    });

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
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold"
                    >
                        {showAddForm ? <X size={20} className="mr-2" /> : <Plus size={20} className="mr-2" />}
                        {showAddForm ? 'Close Form' : 'Add Company'}
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('NOT_APPLIED')}
                        className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'NOT_APPLIED' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Not Applied ({notAppliedCompanies.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('APPLIED')}
                        className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'APPLIED' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Applied ({appliedCompanies.length})
                    </button>
                </div>

                {/* Add Company Form */}
                {showAddForm && (
                    <div className="bg-white p-6 rounded-xl shadow-md mb-8 animate-in fade-in slide-in-from-top-4 duration-300 border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Company</h2>
                        <form onSubmit={handleAddCompany} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" noValidate>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                                <input type="text" value={newCompany.name} onChange={e => setNewCompany({ ...newCompany, name: e.target.value })} className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g. Google" />
                                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline *</label>
                                <input type="date" value={newCompany.deadline} onChange={e => setNewCompany({ ...newCompany, deadline: e.target.value })} className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${formErrors.deadline ? 'border-red-500' : 'border-gray-300'}`} />
                                {formErrors.deadline && <p className="text-red-500 text-xs mt-1">{formErrors.deadline}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Role *</label>
                                <input type="text" value={newCompany.jobRole} onChange={e => setNewCompany({ ...newCompany, jobRole: e.target.value })} className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${formErrors.jobRole ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g. SDE" />
                                {formErrors.jobRole && <p className="text-red-500 text-xs mt-1">{formErrors.jobRole}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job URL *</label>
                                <input type="url" value={newCompany.jobUrl} onChange={e => setNewCompany({ ...newCompany, jobUrl: e.target.value })} className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${formErrors.jobUrl ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g. https://linkedin.com/..." />
                                {formErrors.jobUrl && <p className="text-red-500 text-xs mt-1">{formErrors.jobUrl}</p>}
                            </div>

                            <div className="md:col-span-2 lg:col-span-3">
                                <button
                                    type="button"
                                    onClick={() => setShowMoreDetails(!showMoreDetails)}
                                    className="flex items-center text-blue-600 font-medium text-sm hover:text-blue-800 transition-colors"
                                >
                                    {showMoreDetails ? <ChevronUp size={16} className="mr-1" /> : <ChevronDown size={16} className="mr-1" />}
                                    {showMoreDetails ? 'Hide Optional Details' : 'Show Optional Details'}
                                </button>
                            </div>

                            {showMoreDetails && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                                        <select value={newCompany.sector} onChange={e => setNewCompany({ ...newCompany, sector: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                                            <option value="IT">IT</option>
                                            <option value="Finance">Finance</option>
                                            <option value="Core">Core</option>
                                            <option value="Consulting">Consulting</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Min CGPA</label>
                                        <input type="number" step="0.1" min="0" max="10" value={newCompany.minCgpa} onChange={e => setNewCompany({ ...newCompany, minCgpa: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 7.5" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Package Range</label>
                                        <input type="text" value={newCompany.packageRange} onChange={e => setNewCompany({ ...newCompany, packageRange: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 12-15 LPA" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bond Details</label>
                                        <input type="text" value={newCompany.bond} onChange={e => setNewCompany({ ...newCompany, bond: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 1 Year / None" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <input type="text" value={newCompany.location} onChange={e => setNewCompany({ ...newCompany, location: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Bangalore" />
                                    </div>
                                </>
                            )}
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
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><Search size={16} className="mr-1" /> Search</label>
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Search companies..." />
                    </div>
                    <div className="w-full md:w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><Filter size={16} className="mr-1" /> Sector</label>
                        <select value={sectorFilter} onChange={e => setSectorFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                            <option value="All">All Sectors</option>
                            <option value="IT">IT</option>
                            <option value="Finance">Finance</option>
                            <option value="Core">Core</option>
                            <option value="Consulting">Consulting</option>
                        </select>
                    </div>
                    <div className="w-full md:w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><Award size={16} className="mr-1" /> Min CGPA</label>
                        <input type="number" step="0.1" min="0" max="10" value={cgpaFilter} onChange={e => setCgpaFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Any" />
                    </div>
                </div>

                {/* Company Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex flex-col">
                                            <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{company.name}</h3>
                                            {company.jobRole && <span className="text-sm font-medium text-purple-600 mt-1 bg-purple-50 px-2 py-0.5 rounded border border-purple-100 self-start">{company.jobRole}</span>}
                                        </div>
                                        {activeTab === 'APPLIED' && company.currentStatus ? (
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(company.currentStatus)}`}>
                                                {company.currentStatus}
                                            </span>
                                        ) : (
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getSectorColor(company.sector)}`}>
                                                {company.sector}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {company.deadline && (
                                        <div className="mb-4 mt-2 inline-block">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-md border ${getDeadlineWarning(company.deadline).color}`}>
                                                {getDeadlineWarning(company.deadline).text}
                                            </span>
                                        </div>
                                    )}

                                    <div className="space-y-3 mt-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <DollarSign size={16} className="mr-2 text-gray-400" />
                                            <span className="font-medium text-gray-900 mr-1">Package:</span> {company.packageRange || 'N/A'}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Award size={16} className="mr-2 text-gray-400" />
                                            <span className="font-medium text-gray-900 mr-1">Min CGPA:</span> {company.minCgpa || 0}+
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <FileText size={16} className="mr-2 text-gray-400" />
                                            <span className="font-medium text-gray-900 mr-1">Bond:</span> {company.bond || 'N/A'}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <MapPin size={16} className="mr-2 text-gray-400" />
                                            <span className="font-medium text-gray-900 mr-1">Location:</span> {company.location || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                                    {activeTab === 'NOT_APPLIED' ? (
                                        <button
                                            onClick={() => handleApplyClick(company)}
                                            className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <Briefcase size={16} className="mr-2" />
                                            Apply 🚀
                                        </button>
                                    ) : (
                                        company.jobUrl && (
                                            <a
                                                href={company.jobUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                                            >
                                                <LinkIcon size={16} className="mr-2" />
                                                View Job 🔗
                                            </a>
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Confirmation Modal */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                                <CheckCircle2 className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg leading-6 font-bold text-gray-900 mb-2">
                                Applied to {confirmModal.selectedCompany?.name}?
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Click confirm if you have successfully submitted your application.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={confirmApplication}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                                >
                                    Confirm Applied ✅
                                </button>
                                <button
                                    onClick={() => setConfirmModal({ isOpen: false, selectedCompany: null })}
                                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                                >
                                    Cancel ❌
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyPage;
