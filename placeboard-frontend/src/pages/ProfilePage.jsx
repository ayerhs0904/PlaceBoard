import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { User, Mail, BookOpen, Award, Link as LinkIcon, Code, Briefcase, FileText, Globe, Phone, FileSignature, Edit2, Save, X, Copy } from 'lucide-react';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/profile');
            setProfile(response.data);
            setEditForm(response.data);
        } catch (error) {
            toast.error('Failed to fetch profile');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text, fieldName) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success(`Copied ${fieldName}!`);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put('/api/profile', editForm);
            setProfile(response.data);
            setIsEditing(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const getCompletionPercentage = () => {
        if (!profile) return 0;
        const fields = ['name', 'email', 'branch', 'cgpa', 'skills', 'college', 'linkedinUrl', 'githubUrl', 'portfolioUrl', 'resumeUrl', 'projectUrls', 'phone', 'bio'];
        const filledFields = fields.filter(field => profile[field] && profile[field].toString().trim() !== '');
        return Math.round((filledFields.length / fields.length) * 100);
    };

    const getMissingFields = () => {
        if (!profile) return [];
        const fieldMap = {
            'branch': 'Branch',
            'cgpa': 'CGPA',
            'skills': 'Skills',
            'college': 'College',
            'linkedinUrl': 'LinkedIn URL',
            'githubUrl': 'GitHub URL',
            'portfolioUrl': 'Portfolio URL',
            'resumeUrl': 'Resume URL',
            'projectUrls': 'Project URLs',
            'phone': 'Phone Number',
            'bio': 'Bio'
        };
        const missing = [];
        Object.keys(fieldMap).forEach(key => {
            if (!profile[key] || profile[key].toString().trim() === '') {
                missing.push(fieldMap[key]);
            }
        });
        return missing;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050510] flex flex-col text-white">
                <Navbar />
                <div className="flex-1 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                </div>
            </div>
        );
    }

    if (!profile) return null;

    const completion = getCompletionPercentage();
    const missingFields = getMissingFields();

    const ProfileField = ({ icon: Icon, label, value, fieldKey }) => (
        <div className="flex items-start p-3 hover:bg-white/5 rounded-xl transition-colors group">
            <div className="bg-violet-900/30 p-2 rounded-xl mr-4 border border-violet-500/20">
                <Icon size={20} className="text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-400">{label}</p>
                {isEditing ? (
                    <input
                        type={fieldKey === 'cgpa' ? 'number' : 'text'}
                        step={fieldKey === 'cgpa' ? '0.1' : undefined}
                        value={editForm[fieldKey] || ''}
                        onChange={(e) => setEditForm({ ...editForm, [fieldKey]: e.target.value })}
                        className="mt-1 w-full px-3 py-1.5 bg-white/10 border border-white/20 rounded-xl focus:ring-violet-500 focus:border-violet-500 text-white placeholder-slate-500"
                        placeholder={`Enter ${label}`}
                        disabled={fieldKey === 'email'} // Usually don't want to edit email
                    />
                ) : (
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-base font-semibold text-white truncate">
                            {value || <span className="text-slate-500 font-normal italic">Not provided</span>}
                        </p>
                        {value && (
                            <button
                                onClick={() => handleCopy(value, label)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-500 hover:text-violet-400 bg-white/5 rounded-lg"
                                title="Copy"
                            >
                                <Copy size={14} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050510] text-white">
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-sm border border-white/10 overflow-hidden">
                    {/* Header Banner */}
                    <div className="h-32 bg-gradient-to-r from-violet-600/50 to-indigo-700/50 relative border-b border-white/10">
                        <div className="absolute -bottom-12 left-8">
                            <div className="h-24 w-24 rounded-full bg-[#050510] p-1 shadow-lg">
                                <div className="h-full w-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                                    {getInitials(profile.name)}
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-4 right-4">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl backdrop-blur-sm transition-colors font-medium text-sm border border-white/10"
                                >
                                    <Edit2 size={16} className="mr-2" /> Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditForm(profile);
                                        }}
                                        className="flex items-center bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl backdrop-blur-sm transition-colors font-medium text-sm border border-white/10"
                                    >
                                        <X size={16} className="mr-1" /> Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl shadow-sm transition-colors font-bold text-sm"
                                    >
                                        <Save size={16} className="mr-2" /> Save
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-16 px-8 pb-8">
                        {/* Name and Basic Info */}
                        <div className="mb-8">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editForm.name || ''}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="text-2xl font-bold text-white bg-white/5 border border-white/20 rounded-xl focus:border-violet-500 focus:outline-none mb-2 px-3 py-2 w-full max-w-md"
                                    placeholder="Your Name"
                                />
                            ) : (
                                <h1 className="text-3xl font-bold text-white mb-1">{profile.name}</h1>
                            )}
                            <div className="flex items-center text-slate-400">
                                <Mail size={16} className="mr-2" /> {profile.email}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-10 bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-slate-300">Profile Completion</h3>
                                <span className="font-bold text-violet-400">{completion}%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2.5 mb-4 overflow-hidden">
                                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${completion}%` }}></div>
                            </div>
                            {missingFields.length > 0 && (
                                <div>
                                    <p className="text-sm text-red-400 font-medium mb-1 flex items-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-2"></span>
                                        Missing Fields ({missingFields.length})
                                    </p>
                                    <p className="text-xs text-red-500/80">{missingFields.join(', ')}</p>
                                </div>
                            )}
                        </div>

                        {/* Main Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Academic section */}
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-sm p-4">
                                <h2 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Academic Details</h2>
                                <div className="space-y-2">
                                    <ProfileField icon={BookOpen} label="College" value={profile.college} fieldKey="college" />
                                    <ProfileField icon={Briefcase} label="Branch" value={profile.branch} fieldKey="branch" />
                                    <ProfileField icon={Award} label="CGPA" value={profile.cgpa} fieldKey="cgpa" />
                                </div>
                            </div>

                            {/* Links Section */}
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-sm p-4">
                                <h2 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Important Links</h2>
                                <div className="space-y-2">
                                    <ProfileField icon={LinkIcon} label="LinkedIn" value={profile.linkedinUrl} fieldKey="linkedinUrl" />
                                    <ProfileField icon={Code} label="GitHub" value={profile.githubUrl} fieldKey="githubUrl" />
                                    <ProfileField icon={Globe} label="Portfolio" value={profile.portfolioUrl} fieldKey="portfolioUrl" />
                                    <ProfileField icon={FileText} label="Resume Link" value={profile.resumeUrl} fieldKey="resumeUrl" />
                                </div>
                            </div>

                            {/* Personal & Other */}
                            <div className="md:col-span-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-sm p-4">
                                <h2 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Additional Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                    <ProfileField icon={Phone} label="Phone Number" value={profile.phone} fieldKey="phone" />
                                    <ProfileField icon={Briefcase} label="Skills" value={profile.skills} fieldKey="skills" />
                                    <ProfileField icon={Globe} label="Project URLs" value={profile.projectUrls} fieldKey="projectUrls" />
                                    <div className="md:col-span-2">
                                        <ProfileField icon={FileSignature} label="Bio" value={profile.bio} fieldKey="bio" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
