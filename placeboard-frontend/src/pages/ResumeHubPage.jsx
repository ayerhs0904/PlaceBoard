import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { 
    FileText, 
    UploadCloud, 
    Link as LinkIcon, 
    Target, 
    CheckCircle2, 
    XCircle, 
    AlertCircle, 
    Lightbulb, 
    RefreshCw 
} from 'lucide-react';

const ResumeHubPage = () => {
    const [profile, setProfile] = useState(null);
    const [resumeUrl, setResumeUrl] = useState('');
    const [resumeInput, setResumeInput] = useState('');
    const [isUpdatingResume, setIsUpdatingResume] = useState(false);
    const [activeTab, setActiveTab] = useState('link'); // 'upload' or 'link'

    const [jobRole, setJobRole] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/api/profile');
            setProfile(res.data);
            if (res.data.resumeUrl) {
                setResumeUrl(res.data.resumeUrl);
                setResumeInput(res.data.resumeUrl);
            }
        } catch (err) {
            toast.error('Failed to load profile');
        }
    };

    const saveResumeUrl = async () => {
        if (!resumeInput.trim()) {
            toast.error('Please enter a URL');
            return;
        }
        try {
            const res = await api.put('/api/profile', { ...profile, resumeUrl: resumeInput });
            setProfile(res.data);
            setResumeUrl(res.data.resumeUrl);
            setIsUpdatingResume(false);
            toast.success('Resume updated!');
        } catch (err) {
            toast.error('Failed to save resume URL');
        }
    };

    const analyzeResume = async () => {
        if (!jobRole.trim()) {
            toast.error('Please enter a job role');
            return;
        }
        setIsAnalyzing(true);
        setAnalysisResult(null);
        try {
            const res = await api.post('/api/ai/resume-analysis', {
                jobRole,
                resumeUrl
            });
            setAnalysisResult(res.data);
            toast.success('Analysis complete!');
        } catch (err) {
            toast.error('Failed to analyze resume');
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 70) return 'text-green-400 border-green-500/50';
        if (score >= 50) return 'text-yellow-400 border-yellow-500/50';
        return 'text-red-400 border-red-500/50';
    };

    const getPriorityColor = (priority) => {
        if (priority === 'HIGH') return 'bg-red-500/20 text-red-400 border-red-500/30';
        if (priority === 'MEDIUM') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        return 'bg-green-500/20 text-green-400 border-green-500/30';
    };

    return (
        <div className="min-h-screen bg-[#050510] text-white">
            <Navbar />
            
            <div className="max-w-6xl mx-auto p-6 space-y-8 mt-6">
                
                {/* Section 1: My Resume */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
                        <FileText className="text-violet-400" /> My Resume
                    </h2>

                    <div className="flex gap-4 mb-6 border-b border-white/10 pb-2">
                        <button 
                            onClick={() => setActiveTab('upload')}
                            className={`flex items-center gap-2 pb-2 px-2 font-medium transition-colors ${activeTab === 'upload' ? 'text-violet-400 border-b-2 border-violet-400' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            <UploadCloud size={18} /> Upload PDF
                        </button>
                        <button 
                            onClick={() => setActiveTab('link')}
                            className={`flex items-center gap-2 pb-2 px-2 font-medium transition-colors ${activeTab === 'link' ? 'text-violet-400 border-b-2 border-violet-400' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            <LinkIcon size={18} /> Resume Link
                        </button>
                    </div>
                    
                    {activeTab === 'upload' && (
                        <div className="flex flex-col items-center justify-center py-10 bg-white/5 rounded-xl border border-white/10 border-dashed">
                            <UploadCloud className="text-slate-500 mb-3" size={40} />
                            <p className="text-slate-400 font-medium">PDF upload coming soon, use link for now</p>
                        </div>
                    )}

                    {activeTab === 'link' && (
                        <div>
                            {!resumeUrl || isUpdatingResume ? (
                                <div className="flex flex-col sm:flex-row gap-4 items-center">
                                    <input 
                                        type="text" 
                                        placeholder="Paste Google Drive or Dropbox PDF link" 
                                        className="flex-1 bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                                        value={resumeInput}
                                        onChange={e => setResumeInput(e.target.value)}
                                    />
                                    <button 
                                        onClick={saveResumeUrl}
                                        className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:from-violet-700 hover:to-indigo-700 transition-all whitespace-nowrap"
                                    >
                                        Save Link
                                    </button>
                                    {isUpdatingResume && resumeUrl && (
                                        <button 
                                            onClick={() => {
                                                setIsUpdatingResume(false);
                                                setResumeInput(resumeUrl);
                                            }}
                                            className="bg-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-all border border-white/10"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10 gap-4">
                                    <div className="flex items-center gap-3 overflow-hidden w-full">
                                        <LinkIcon className="text-violet-400 shrink-0" />
                                        <span className="text-slate-300 truncate font-medium">📎 {resumeUrl}</span>
                                    </div>
                                    <div className="flex gap-3 shrink-0">
                                        <a 
                                            href={resumeUrl.startsWith('http') ? resumeUrl : `https://${resumeUrl}`}
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="bg-violet-600/20 text-violet-400 border border-violet-500/30 px-4 py-2 rounded-xl font-medium hover:bg-violet-600/30 transition-colors flex items-center gap-2"
                                        >
                                            Open Resume 🔗
                                        </a>
                                        <button 
                                            onClick={() => setIsUpdatingResume(true)}
                                            className="bg-white/10 text-white px-4 py-2 rounded-xl font-medium hover:bg-white/20 transition-colors border border-white/10"
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Section 2: Job Role Analysis */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
                        <Target className="text-blue-400" /> Analyze for Job Role
                    </h2>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="flex-1 flex flex-col gap-1">
                            <label className="text-sm text-slate-400 font-medium ml-1">Enter Job Role</label>
                            <input 
                                type="text"
                                placeholder="e.g. Data Analyst, SDE, DevOps..."
                                className="bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                value={jobRole}
                                onChange={e => setJobRole(e.target.value)}
                            />
                        </div>
                        <div className="flex items-end">
                            <button 
                                onClick={analyzeResume}
                                disabled={isAnalyzing}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow w-full sm:w-auto h-[50px]"
                            >
                                {isAnalyzing ? <RefreshCw className="animate-spin" size={20}/> : <Target size={20}/>}
                                {isAnalyzing ? 'Analyzing...' : 'Analyze Now'}
                            </button>
                        </div>
                    </div>

                    {isAnalyzing && (
                        <div className="flex justify-center items-center py-12">
                            <div className="flex flex-col items-center gap-4">
                                <RefreshCw className="animate-spin text-blue-400" size={32} />
                                <p className="text-blue-200 animate-pulse font-medium">Analyzing your profile for {jobRole}...</p>
                            </div>
                        </div>
                    )}

                    {analysisResult && !isAnalyzing && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                            {/* Score Card */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center">
                                <h3 className="text-slate-300 font-medium mb-4 text-lg">Match Score</h3>
                                <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center ${getScoreColor(analysisResult.matchScore)} bg-black/20 shadow-inner`}>
                                    <span className="text-4xl font-black">{analysisResult.matchScore}%</span>
                                </div>
                            </div>
                            
                            {/* Skills Card */}
                            <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col gap-6">
                                <div>
                                    <h3 className="text-slate-300 font-medium mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="text-green-400" size={18} /> Present Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {analysisResult.presentSkills?.length > 0 ? (
                                            analysisResult.presentSkills.map((s, i) => (
                                                <span key={i} className="bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1 rounded-lg text-sm font-medium">
                                                    ✅ {s}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-slate-500 text-sm">No specific matching skills found</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-slate-300 font-medium mb-3 flex items-center gap-2">
                                        <XCircle className="text-red-400" size={18} /> Missing Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {analysisResult.missingSkills?.length > 0 ? (
                                            analysisResult.missingSkills.map((s, i) => (
                                                <span key={i} className="bg-red-500/20 text-red-300 border border-red-500/30 px-3 py-1 rounded-lg text-sm font-medium">
                                                    ❌ {s}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-slate-500 text-sm">No missing skills detected!</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Suggestions */}
                            <div className="lg:col-span-3">
                                <h3 className="text-slate-300 font-medium mb-4 text-lg flex items-center gap-2">
                                    <Lightbulb className="text-yellow-400" size={20} /> Recommendations for {jobRole}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {analysisResult.suggestions?.length > 0 ? (
                                        analysisResult.suggestions.map((t, i) => (
                                            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors flex flex-col justify-between">
                                                <p className="text-slate-200 text-sm leading-relaxed mb-3">{t.tip}</p>
                                                <span className={`self-start text-xs font-bold px-2 py-1 rounded border ${getPriorityColor(t.priority)}`}>
                                                    {t.priority}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full p-4 bg-white/5 rounded-xl border border-white/10">
                                            <p className="text-slate-400">No specific suggestions available at this time.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Section 3: Quick Tips */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
                        <Lightbulb className="text-yellow-400" /> Quick Tips
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            "Update your GitHub profile with recent work",
                            "Add measurable achievements (e.g. improved speed by 20%)",
                            "Keep your resume strictly to 1 page",
                            "Add live links to all your projects"
                        ].map((tip, i) => (
                            <div key={i} className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all flex items-start gap-3">
                                <AlertCircle className="text-yellow-400 shrink-0 mt-0.5" size={16} />
                                <p className="text-sm text-slate-300 leading-relaxed font-medium">{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ResumeHubPage;
