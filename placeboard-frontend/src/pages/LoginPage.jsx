import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Loader2, Briefcase, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, name, email: userEmail, branch, cgpa } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ name, email: userEmail, branch, cgpa }));

      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050510] flex text-white">
      {/* Left Side - Brand / Graphic */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#050510] flex-col justify-between p-12 relative overflow-hidden border-r border-white/10">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-600 blur-3xl"></div>
          <div className="absolute top-1/2 -left-20 w-72 h-72 rounded-full bg-indigo-600 blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center space-x-2">
            <Briefcase size={32} className="text-violet-500" />
            <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">PlaceBoard</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold leading-tight mb-6"
          >
            Manage your placement journey.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-blue-100 text-xl"
          >
            Track applications, schedule interview rounds, and leverage AI to find your dream job all in one place.
          </motion.p>
        </div>

        <div className="relative z-10 text-sm text-slate-400">
          &copy; {new Date().getFullYear()} PlaceBoard. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl">
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center justify-center space-x-2 mb-10 hover:opacity-80 transition-opacity">
            <Briefcase size={32} className="text-violet-500" />
            <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">PlaceBoard</span>
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center lg:text-left"
          >
            <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-slate-300 transition-colors mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-slate-400">Please enter your details to sign in.</p>
          </motion.div>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleLogin} 
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-400 focus:ring-red-500 focus:border-red-500' : 'border-white/20 focus:ring-violet-500 focus:border-violet-500'} rounded-xl shadow-sm placeholder-slate-500 text-white focus:outline-none transition-colors bg-white/10`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  className={`block w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-400 focus:ring-red-500 focus:border-red-500' : 'border-white/20 focus:ring-violet-500 focus:border-violet-500'} rounded-xl shadow-sm placeholder-slate-500 text-white focus:outline-none transition-colors bg-white/10`}
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
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-violet-600 focus:ring-violet-500 bg-white/10 border-white/20 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300 cursor-pointer">
                  Remember me
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </motion.form>

          <div className="mt-8 text-center text-sm">
            <span className="text-slate-400">Don't have an account? </span>
            <Link to="/register" className="font-bold text-violet-400 hover:text-violet-300 transition-colors">
              Sign up for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;