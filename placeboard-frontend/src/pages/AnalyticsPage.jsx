import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { Briefcase, FileCheck, Users, Award, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  APPLIED: '#3b82f6',     // blue-500
  SHORTLISTED: '#eab308', // yellow-500
  INTERVIEW: '#a855f7',   // purple-500
  OFFER: '#22c55e',       // green-500
  REJECTED: '#ef4444',    // red-500
};

const AnimatedCounter = ({ to }) => {
  const spring = useSpring(0, { duration: 1500, bounce: 0 });
  const display = useTransform(spring, (current) => Math.round(current));
  
  useEffect(() => {
    spring.set(to);
  }, [spring, to]);

  return <motion.span>{display}</motion.span>;
};

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/analytics/summary');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050510] flex flex-col text-white">
        <Navbar />
        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 h-28 animate-pulse flex items-center justify-between">
                <div className="space-y-3 w-1/2">
                  <div className="h-4 bg-white/10 rounded w-full"></div>
                  <div className="h-8 bg-white/10 rounded w-3/4"></div>
                </div>
                <div className="h-12 w-12 bg-white/10 rounded-full"></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl h-96 animate-pulse">
              <div className="h-6 bg-white/10 rounded w-1/3 mb-6"></div>
              <div className="h-64 bg-white/5 rounded w-full"></div>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl h-96 animate-pulse">
              <div className="h-6 bg-white/10 rounded w-1/3 mb-6"></div>
              <div className="h-64 bg-white/5 rounded-full mx-auto w-64"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#050510] flex flex-col text-white">
      <Navbar />
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-white mb-8">Analytics Overview</h1>

        {/* Top Section: Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-sm p-6 border-l-4 border-l-blue-500 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Total Applied</p>
              <h3 className="text-3xl font-bold text-white"><AnimatedCounter to={data.totalApplied} /></h3>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-full text-blue-400">
              <Briefcase size={24} />
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-sm p-6 border-l-4 border-l-yellow-500 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Shortlisted</p>
              <h3 className="text-3xl font-bold text-white"><AnimatedCounter to={data.shortlisted} /></h3>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-full text-yellow-400">
              <FileCheck size={24} />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-sm p-6 border-l-4 border-l-purple-500 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Interviews</p>
              <h3 className="text-3xl font-bold text-white"><AnimatedCounter to={data.interviews} /></h3>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-full text-purple-400">
              <Users size={24} />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-sm p-6 border-l-4 border-l-green-500 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Offers</p>
              <h3 className="text-3xl font-bold text-white"><AnimatedCounter to={data.offers} /></h3>
            </div>
            <div className="p-3 bg-green-500/20 rounded-full text-green-400">
              <Award size={24} />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-sm p-6 border-l-4 border-l-red-500 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Rejected</p>
              <h3 className="text-3xl font-bold text-white"><AnimatedCounter to={data.rejected || 0} /></h3>
            </div>
            <div className="p-3 bg-red-500/20 rounded-full text-red-400">
              <AlertCircle size={24} />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Applications Over Time (Bar Chart) */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-white mb-6">Applications Trend (Last 8 Weeks)</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.applicationsByWeek} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <RechartsTooltip cursor={{ fill: '#ffffff10' }} contentStyle={{ backgroundColor: '#0f0f1a', borderRadius: '8px', border: '1px solid #333', color: '#fff' }} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Applications" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Distribution (Pie Chart) */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-white mb-6">Current Pipeline Distribution</h3>
            <div className="h-80 w-full">
              {data.statusDistribution && data.statusDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="status"
                    >
                      {data.statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#475569'} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: '#0f0f1a', borderRadius: '8px', border: '1px solid #333', color: '#fff' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <div className="text-center">
                    <AlertCircle className="mx-auto mb-2 text-slate-600" size={32} />
                    <p>No status data available yet</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;
