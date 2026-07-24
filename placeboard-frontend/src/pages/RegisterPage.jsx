import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Loader2, Briefcase, User, Building, GraduationCap, Code, X } from 'lucide-react';
import { motion } from 'framer-motion';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    branch: 'CSE',
    cgpa: 7.5,
    skills: [], // Array of skills for tag input
    college: ''
  });
  
  const [currentSkill, setCurrentSkill] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleCgpaChange = (e) => {
    setFormData({ ...formData, cgpa: parseFloat(e.target.value) });
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const skill = currentSkill.trim();
      if (skill && !formData.skills.includes(skill)) {
        setFormData({ ...formData, skills: [...formData.skills, skill] });
        setCurrentSkill('');
        if (errors.skills) setErrors({ ...errors, skills: null });
      }
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.college.trim()) newErrors.college = 'College name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Prepare payload (convert skills array back to comma-separated string if API expects it)
      const payload = {
        ...formData,
        skills: formData.skills.join(', ')
      };

      const response = await api.post('/api/auth/register', payload);
      const { token, name, email: userEmail, branch, cgpa } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ name, email: userEmail, branch, cgpa }));

      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050510] flex text-white">
      {/* Left Side - Brand / Graphic */}
      <div className="hidden lg:flex lg:w-1/3 xl:w-2/5 bg-[#050510] border-r border-white/10 flex-col justify-between p-12 relative overflow-hidden fixed h-screen">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet-600 blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-20 w-72 h-72 rounded-full bg-indigo-600 blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center space-x-2">
            <Briefcase size={32} className="text-violet-500" />
            <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">PlaceBoard</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl xl:text-5xl font-bold leading-tight mb-6"
          >
            Start your journey today.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-blue-100 text-lg xl:text-xl"
          >
            Join thousands of students managing their placements efficiently and landing their dream offers.
          </motion.p>
        </div>

        <div className="relative z-10 text-sm text-slate-400">
          &copy; {new Date().getFullYear()} PlaceBoard. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className="w-full lg:w-2/3 xl:w-3/5 lg:ml-auto flex flex-col justify-center min-h-screen p-6 sm:p-10 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
            <Briefcase size={32} className="text-violet-500" />
            <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">PlaceBoard</span>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center lg:text-left"
          >
            <h2 className="text-3xl font-bold text-white mb-2">Create an account</h2>
            <p className="text-slate-400">Let's get you set up so you can start tracking applications.</p>
          </motion.div>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleRegister} 
            className="space-y-5"
            autoComplete="off"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="new-name"
                    className={`block w-full pl-10 pr-3 py-2.5 border ${errors.name ? 'border-red-400 focus:ring-red-500' : 'border-white/20 focus:ring-violet-500'} rounded-xl shadow-sm placeholder-slate-500 text-white focus:outline-none transition-colors bg-white/10`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="new-email"
                    className={`block w-full pl-10 pr-3 py-2.5 border ${errors.email ? 'border-red-400 focus:ring-red-500' : 'border-white/20 focus:ring-violet-500'} rounded-xl shadow-sm placeholder-slate-500 text-white focus:outline-none transition-colors bg-white/10`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className={`block w-full pl-10 pr-10 py-2.5 border ${errors.password ? 'border-red-400 focus:ring-red-500' : 'border-white/20 focus:ring-violet-500'} rounded-xl shadow-sm placeholder-slate-500 text-white focus:outline-none transition-colors bg-white/10`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* College */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">College / University</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    autoComplete="off"
                    className={`block w-full pl-10 pr-3 py-2.5 border ${errors.college ? 'border-red-400 focus:ring-red-500' : 'border-white/20 focus:ring-violet-500'} rounded-xl shadow-sm placeholder-slate-500 text-white focus:outline-none transition-colors bg-white/10`}
                    placeholder="XYZ Institute"
                  />
                </div>
                {errors.college && <p className="mt-1 text-xs text-red-400">{errors.college}</p>}
              </div>

              {/* Branch */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Branch</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <GraduationCap className="h-5 w-5 text-slate-400" />
                  </div>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-2.5 text-base border border-white/20 focus:outline-none focus:ring-violet-500 focus:border-violet-500 rounded-xl shadow-sm bg-white/10 text-white [&>option]:text-black"
                  >
                    <option value="CSE">Computer Science</option>
                    <option value="IT">Information Tech</option>
                    <option value="ECE">Electronics</option>
                    <option value="MECH">Mechanical</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* CGPA Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-300">Cumulative GPA</label>
                <span className="text-lg font-bold text-violet-400 bg-violet-900/30 px-3 py-0.5 rounded-full border border-violet-500/30">{formData.cgpa.toFixed(2)}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="10" 
                step="0.01" 
                value={formData.cgpa} 
                onChange={handleCgpaChange} 
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500" 
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0.0</span>
                <span>10.0</span>
              </div>
            </div>

            {/* Skills Tag Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Skills</label>
              <div className="relative border border-white/20 rounded-xl shadow-sm bg-white/10 focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500 transition-colors p-2 flex flex-wrap gap-2 items-center">
                <Code className="h-5 w-5 text-slate-400 ml-1 flex-shrink-0" />
                
                {formData.skills.map((skill, index) => (
                  <span key={index} className="flex items-center text-sm font-medium bg-violet-900/50 text-violet-300 px-2.5 py-1 rounded-full border border-violet-500/30">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="ml-1.5 text-violet-400 hover:text-violet-200 focus:outline-none">
                      <X size={14} />
                    </button>
                  </span>
                ))}
                
                <input
                  type="text"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder={formData.skills.length === 0 ? "Type a skill and press Enter" : "Add another..."}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1 min-w-[150px] focus:outline-none text-white placeholder-slate-500"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">Press Enter to add tags.</p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </motion.form>

          <div className="mt-8 text-center text-sm">
            <span className="text-slate-400">Already have an account? </span>
            <Link to="/login" className="font-bold text-violet-400 hover:text-violet-300 transition-colors">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;