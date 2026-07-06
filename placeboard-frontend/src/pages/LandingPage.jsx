import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, BarChart2, Cpu, Bell } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#050510] text-white font-sans selection:bg-purple-500/30">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-[#050510]/80 backdrop-blur-md border-b border-white/10">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] tracking-tight">
          PlaceBoard
        </div>
        <div className="hidden md:flex items-center space-x-8 text-gray-300 font-medium">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-gray-300 hover:text-white font-medium px-4 py-2 border border-white/10 rounded-full hover:bg-white/5 transition">
            Login
          </Link>
          <Link to="/register" className="bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] text-white px-5 py-2.5 rounded-full font-medium hover:opacity-90 transition shadow-[0_0_15px_rgba(124,58,237,0.5)]">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative px-6 md:px-12 py-20 md:py-32 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
          
          {/* Left side */}
          <div className="md:w-1/2 z-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-purple-300 mb-6 backdrop-blur-sm">
              <span className="mr-2">✨</span> AI-Powered • Free for Students
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
              Smart Placement <br />
              Tracking for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#4F46E5]">Every Student</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
              Manage applications, track rounds, get AI company recommendations — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
              <Link to="/register" className="w-full sm:w-auto text-center bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition shadow-[0_0_20px_rgba(124,58,237,0.4)] text-lg">
                Get Started Free
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto text-center bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition text-lg backdrop-blur-sm">
                See How It Works
              </a>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                500+ Students
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                50+ Companies
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                AI Powered
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                Free
              </div>
            </div>
          </div>

          {/* Right side - dashboard mockup */}
          <div className="md:w-1/2 relative w-full aspect-square md:aspect-auto md:h-[500px] z-10 flex items-center justify-center">
            {/* Main glass panel */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col p-6 gap-4 transform rotate-1 hover:rotate-0 transition duration-500">
              
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div className="font-semibold text-lg">Applications</div>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#4F46E5]">24</div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
                <div className="text-sm text-gray-400">Status Overview</div>
                <div className="flex justify-between items-center bg-[#050510]/50 rounded-xl p-3">
                  <span className="text-gray-300">Google</span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/20">Offer</span>
                </div>
                <div className="flex justify-between items-center bg-[#050510]/50 rounded-xl p-3">
                  <span className="text-gray-300">Microsoft</span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/20">Shortlisted</span>
                </div>
                <div className="flex justify-between items-center bg-[#050510]/50 rounded-xl p-3">
                  <span className="text-gray-300">Amazon</span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/20">Applied</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#7C3AED]/20 to-[#4F46E5]/20 border border-purple-500/30 rounded-2xl p-5 mt-auto relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <Cpu size={48} />
                </div>
                <div className="text-sm text-purple-300 mb-1">AI Recommendation</div>
                <div className="font-bold text-xl mb-3">Stripe</div>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>Match Score</span>
                  <span className="text-purple-300 font-bold">85%</span>
                </div>
                <div className="w-full bg-[#050510]/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SCROLLING TICKER */}
        <div className="w-full bg-[#050510] border-y border-white/5 py-4 overflow-hidden flex items-center relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050510] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050510] to-transparent z-10 pointer-events-none"></div>
          
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              display: flex;
              width: max-content;
              animation: marquee 20s linear infinite;
            }
          `}} />
          
          <div className="animate-marquee text-xl font-medium text-gray-400 tracking-wider">
            <span className="mx-4">📋 Kanban Board</span> <span className="text-purple-500 mx-4">✦</span> 
            <span className="mx-4">📊 Analytics</span> <span className="text-purple-500 mx-4">✦</span> 
            <span className="mx-4">🤖 AI Picks</span> <span className="text-purple-500 mx-4">✦</span> 
            <span className="mx-4">🔔 Reminders</span> <span className="text-purple-500 mx-4">✦</span> 
            <span className="mx-4">🎯 Track Everything</span> <span className="text-purple-500 mx-4">✦</span>
            {/* Duplicate for seamless loop */}
            <span className="mx-4">📋 Kanban Board</span> <span className="text-purple-500 mx-4">✦</span> 
            <span className="mx-4">📊 Analytics</span> <span className="text-purple-500 mx-4">✦</span> 
            <span className="mx-4">🤖 AI Picks</span> <span className="text-purple-500 mx-4">✦</span> 
            <span className="mx-4">🔔 Reminders</span> <span className="text-purple-500 mx-4">✦</span> 
            <span className="mx-4">🎯 Track Everything</span> <span className="text-purple-500 mx-4">✦</span>
          </div>
        </div>

        {/* FEATURES */}
        <section id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative">
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Everything you need to stay organized and focused on landing your dream job.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <ClipboardList size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Visual Kanban</h3>
              <p className="text-gray-400 leading-relaxed">Drag and drop tracking to manage your applications across different stages seamlessly.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
                <Cpu size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">AI Recommendations</h3>
              <p className="text-gray-400 leading-relaxed">Smart company picks based on your profile, skills, and past applications.</p>
            </div>

            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <BarChart2 size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Analytics</h3>
              <p className="text-gray-400 leading-relaxed">Real time progress charts and conversion rates to track your success over time.</p>
            </div>

            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Bell size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Reminders</h3>
              <p className="text-gray-400 leading-relaxed">Never miss a deadline. Automated alerts for upcoming assessments and interviews.</p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-24 px-6 md:px-12 bg-[#080815] border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-20">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-10 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 text-[150px] font-black text-white/5 leading-none">01</div>
                <div className="relative z-10">
                  <div className="text-2xl font-bold mb-4 text-white">Register your profile</div>
                  <p className="text-gray-400 text-lg">Sign up in seconds, add your academic details, skills, and preferences.</p>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-10 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 text-[150px] font-black text-white/5 leading-none">02</div>
                <div className="relative z-10">
                  <div className="text-2xl font-bold mb-4 text-white">Add companies & apply</div>
                  <p className="text-gray-400 text-lg">Log your applications directly on the board. Keep track of every opportunity.</p>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-10 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 text-[150px] font-black text-white/5 leading-none">03</div>
                <div className="relative z-10">
                  <div className="text-2xl font-bold mb-4 text-white">Track & get matches</div>
                  <p className="text-gray-400 text-lg">Move cards as you progress. Receive AI suggestions for your next big move.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-[0_0_40px_rgba(124,58,237,0.3)]">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[400px] h-[400px] bg-black/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
                Ready to ace your <br/> placement season?
              </h2>
              <Link to="/register" className="inline-block bg-white text-[#4F46E5] px-10 py-5 rounded-full font-bold text-xl hover:bg-gray-100 hover:scale-105 transition-transform shadow-xl">
                Get Started Free
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#050510] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="text-2xl font-bold text-white mb-2">PlaceBoard</div>
            <p className="text-gray-500">Built for students, by a student 💙</p>
          </div>
          <div className="flex space-x-6 text-sm font-medium">
            <Link to="/login" className="text-gray-400 hover:text-white transition">Login</Link>
            <Link to="/register" className="text-gray-400 hover:text-white transition">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
