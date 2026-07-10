import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FileText, Sparkles, AlertCircle, Link as LinkIcon, RefreshCw } from 'lucide-react';

const ResumeHubPage = () => {
  const [profile, setProfile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [isUpdatingResume, setIsUpdatingResume] = useState(false);
  const [resumeInput, setResumeInput] = useState('');

  const [tips, setTips] = useState([]);
  const [loadingTips, setLoadingTips] = useState(false);
  const [tipsError, setTipsError] = useState(false);

  const [roles, setRoles] = useState([]);
  const [skillsGap, setSkillsGap] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchApplications();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/profile');
      setProfile(res.data);
      if (res.data.resumeUrl) setResumeUrl(res.data.resumeUrl);
    } catch (err) {
      toast.error('Failed to load profile');
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await api.get('/api/applications');
      const uniqueRoles = [...new Set(res.data.map(a => a.role).filter(Boolean))];
      setRoles(uniqueRoles);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (profile && roles.length > 0) {
      analyzeSkillsGap(profile.skills || '', roles);
    }
  }, [profile, roles]);

  const analyzeSkillsGap = (userSkillsStr, rolesList) => {
    const userSkills = userSkillsStr.toLowerCase().split(',').map(s => s.trim());
    
    const roleRequirements = {
      'SDE': ['java', 'dsa', 'spring boot', 'c++', 'python', 'sql'],
      'Software Engineer': ['java', 'dsa', 'spring boot', 'c++', 'python', 'sql'],
      'Data Analyst': ['sql', 'python', 'excel', 'tableau', 'powerbi'],
      'Frontend': ['react', 'js', 'css', 'html', 'javascript'],
      'Backend': ['java', 'node.js', 'sql', 'spring boot', 'python']
    };

    const gaps = rolesList.map(role => {
      let required = ['communication', 'problem solving']; // default
      for (const [key, reqs] of Object.entries(roleRequirements)) {
        if (role.toLowerCase().includes(key.toLowerCase())) {
          required = reqs;
          break;
        }
      }
      
      const matched = required.filter(r => userSkills.some(us => us.includes(r)));
      const missing = required.filter(r => !userSkills.some(us => us.includes(r)));
      
      return { role, matched, missing };
    });

    setSkillsGap(gaps);
  };

  const saveResumeUrl = async () => {
    if (!resumeInput.trim()) {
      toast.error('Please enter a URL');
      return;
    }
    try {
      await api.put('/api/profile', { ...profile, resumeUrl: resumeInput });
      setResumeUrl(resumeInput);
      setIsUpdatingResume(false);
      toast.success('Resume URL updated!');
    } catch (err) {
      toast.error('Failed to save resume URL');
    }
  };

  const generateTips = async () => {
    setLoadingTips(true);
    setTipsError(false);
    try {
      const res = await api.get('/api/ai/resume-tips');
      setTips(res.data);
    } catch (err) {
      setTipsError(true);
      toast.error('Failed to generate tips');
    } finally {
      setLoadingTips(false);
    }
  };

  const getPriorityColor = (priority) => {
    if (priority === 'HIGH') return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (priority === 'MEDIUM') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-green-500/20 text-green-400 border-green-500/30';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-6 space-y-8 mt-6">
        
        {/* Section 1: My Resume */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <FileText className="text-blue-400" /> My Resume
          </h2>
          
          {!resumeUrl || isUpdatingResume ? (
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <input 
                type="text" 
                placeholder="Paste Google Drive or any resume URL" 
                className="flex-1 bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                value={resumeInput}
                onChange={e => setResumeInput(e.target.value)}
              />
              <button 
                onClick={saveResumeUrl}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:from-blue-500 hover:to-purple-500 transition-all whitespace-nowrap"
              >
                Save URL
              </button>
              {isUpdatingResume && resumeUrl && (
                <button 
                  onClick={() => setIsUpdatingResume(false)}
                  className="bg-white/10 text-white px-6 py-3 rounded-lg font-bold hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-3 overflow-hidden">
                <LinkIcon className="text-gray-400 shrink-0" />
                <span className="text-gray-300 truncate">{resumeUrl}</span>
              </div>
              <div className="flex gap-3 shrink-0 ml-4">
                <a 
                  href={resumeUrl.startsWith('http') ? resumeUrl : `https://${resumeUrl}`}
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-lg font-medium hover:bg-blue-600/30 transition-colors flex items-center gap-2"
                >
                  Open 🔗
                </a>
                <button 
                  onClick={() => {
                    setResumeInput(resumeUrl);
                    setIsUpdatingResume(true);
                  }}
                  className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors"
                >
                  Update
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: AI Resume Tips */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="text-purple-400" /> AI Resume Tips
            </h2>
            <button 
              onClick={generateTips}
              disabled={loadingTips}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-bold hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loadingTips ? <RefreshCw className="animate-spin" size={18}/> : <Sparkles size={18}/>}
              {loadingTips ? 'Analyzing...' : 'Generate Tips'}
            </button>
          </div>

          {tipsError ? (
            <div className="text-center py-10 bg-red-500/10 rounded-xl border border-red-500/20">
              <AlertCircle className="mx-auto text-red-400 mb-2" size={32} />
              <p className="text-red-300">Failed to generate tips. Please try again.</p>
            </div>
          ) : tips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tips.map((t, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded border ${getPriorityColor(t.priority)}`}>
                      {t.priority}
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                      {t.category}
                    </span>
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed">{t.tip}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10 border-dashed">
              <Sparkles className="mx-auto text-purple-400/50 mb-3" size={40} />
              <p className="text-gray-400">Click Generate to get personalized AI tips for your resume based on your applications.</p>
            </div>
          )}
        </div>

        {/* Section 3: Skills Gap */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <AlertCircle className="text-orange-400" /> Skills Gap Analysis
          </h2>
          
          {skillsGap.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Apply to more roles to see skills gap analysis.</p>
          ) : (
            <div className="space-y-4">
              {skillsGap.map((gap, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <h3 className="font-bold text-lg mb-3 text-blue-300">{gap.role}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                      <h4 className="text-green-400 font-semibold mb-2 text-sm">Matching Skills</h4>
                      {gap.matched.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {gap.matched.map((s, j) => <span key={j} className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">{s}</span>)}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-xs">No direct matches found.</p>
                      )}
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                      <h4 className="text-red-400 font-semibold mb-2 text-sm">Missing Skills (Recommended)</h4>
                      {gap.missing.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {gap.missing.map((s, j) => <span key={j} className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs">{s}</span>)}
                        </div>
                      ) : (
                        <p className="text-green-500 text-xs">You have all core skills!</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ResumeHubPage;
