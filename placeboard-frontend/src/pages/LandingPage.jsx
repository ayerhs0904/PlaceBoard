import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardList, BarChart2, Cpu, Bell } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 bg-white shadow-sm sticky top-0 z-50">
        <div className="text-2xl font-bold text-indigo-600 tracking-tight">PlaceBoard</div>
        <div className="space-x-2 md:space-x-4 flex items-center">
          <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition px-3 py-2">Login</Link>
          <Link to="/register" className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-indigo-700 transition shadow-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-grow">
        <section className="text-center px-4 py-24 md:py-32 bg-gradient-to-b from-indigo-50 via-white to-white">
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6 tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Track Smarter. Place Faster.
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The ultimate tool to organize your campus placements. Manage applications, get AI-powered insights, and land your dream job.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/register" className="bg-indigo-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl text-lg w-full sm:w-auto">Start for Free</Link>
            <Link to="/login" className="bg-white text-indigo-600 border border-indigo-200 px-8 py-3.5 rounded-full font-semibold hover:bg-indigo-50 transition shadow-sm text-lg w-full sm:w-auto">Login to Account</Link>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-6 md:gap-12 text-gray-500 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center"><span className="text-indigo-600 font-bold text-2xl mr-2">500+</span> Students</div>
            <div className="flex items-center"><span className="text-indigo-600 font-bold text-2xl mr-2">50+</span> Companies</div>
            <div className="flex items-center"><span className="text-indigo-600 font-bold text-2xl mr-2">AI</span> Powered</div>
            <div className="flex items-center"><span className="text-indigo-600 font-bold text-2xl mr-2">Free</span> Forever</div>
          </motion.div>
        </section>

        {/* Scrolling Ticker */}
        <div className="bg-indigo-950 text-indigo-100 py-4 overflow-hidden whitespace-nowrap border-y border-indigo-800">
          <motion.div 
            className="inline-block text-lg md:text-xl font-medium tracking-widest"
            animate={{ x: [0, -1035] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
          >
             Applied ✦ Shortlisted ✦ Interview ✦ Offer ✦ Applied ✦ Shortlisted ✦ Interview ✦ Offer ✦ Applied ✦ Shortlisted ✦ Interview ✦ Offer ✦ Applied ✦ Shortlisted ✦ Interview ✦ Offer ✦
          </motion.div>
        </div>

        {/* Features */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16 tracking-tight">Everything you need to succeed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-indigo-100 w-14 h-14 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                <ClipboardList size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Kanban Board</h3>
              <p className="text-gray-600 leading-relaxed">Visual drag-and-drop board to track all your applications seamlessly across different stages.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                <BarChart2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Analytics</h3>
              <p className="text-gray-600 leading-relaxed">Deep insights into your placement performance and application conversion rates.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <Cpu size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Powered</h3>
              <p className="text-gray-600 leading-relaxed">Get personalized company recommendations based on your unique profile and skills.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center text-green-600 mb-6">
                <Bell size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Reminders</h3>
              <p className="text-gray-600 leading-relaxed">Never miss a deadline. Automated alerts for your upcoming tests and interviews.</p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-6 md:px-12 bg-gray-50 border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-20 tracking-tight">How It Works</h2>
            <div className="space-y-16 relative">
              {/* Vertical line connecting steps */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-indigo-100 transform -translate-x-1/2 z-0"></div>
              
              <div className="flex flex-col md:flex-row items-center relative z-10">
                <div className="md:w-1/2 md:pr-12 text-center md:text-right mb-6 md:mb-0">
                  <h3 className="text-2xl font-bold text-gray-900">1. Create your profile</h3>
                  <p className="text-gray-600 mt-3 text-lg">Sign up in seconds and input your skills, CGPA, and preferences.</p>
                </div>
                <div className="flex justify-center items-center w-16 h-16 rounded-full bg-indigo-600 text-white font-bold text-2xl shadow-lg ring-4 ring-white">1</div>
                <div className="md:w-1/2 md:pl-12 mt-6 md:mt-0 text-center md:text-left">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 inline-block text-gray-500 font-medium">📝 Quick Registration</div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row-reverse items-center relative z-10">
                <div className="md:w-1/2 md:pl-12 text-center md:text-left mb-6 md:mb-0">
                  <h3 className="text-2xl font-bold text-gray-900">2. Track Applications</h3>
                  <p className="text-gray-600 mt-3 text-lg">Move companies across Kanban stages as you progress through rounds.</p>
                </div>
                <div className="flex justify-center items-center w-16 h-16 rounded-full bg-indigo-600 text-white font-bold text-2xl shadow-lg ring-4 ring-white">2</div>
                <div className="md:w-1/2 md:pr-12 mt-6 md:mt-0 text-center md:text-right">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 inline-block text-gray-500 font-medium">📋 Intuitive Kanban Board</div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center relative z-10">
                <div className="md:w-1/2 md:pr-12 text-center md:text-right mb-6 md:mb-0">
                  <h3 className="text-2xl font-bold text-gray-900">3. Land Offers</h3>
                  <p className="text-gray-600 mt-3 text-lg">Use AI insights and analytics to focus on the right opportunities.</p>
                </div>
                <div className="flex justify-center items-center w-16 h-16 rounded-full bg-indigo-600 text-white font-bold text-2xl shadow-lg ring-4 ring-white">3</div>
                <div className="md:w-1/2 md:pl-12 mt-6 md:mt-0 text-center md:text-left">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 inline-block text-gray-500 font-medium">🎉 Celebration Time</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12 text-center">
        <div className="text-3xl font-bold text-white mb-6 tracking-tight">PlaceBoard</div>
        <p className="text-lg">Built for students, by a student 💙</p>
      </footer>
    </div>
  );
};

export default LandingPage;
