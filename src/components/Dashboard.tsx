import React from 'react';
import { motion } from 'motion/react';
import { translations, Language } from '../lib/i18n';
import { TrendingUp, Video, Users, Eye, Play, Clock, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  lang: Language;
}

export default function Dashboard({ lang }: DashboardProps) {
  const t = translations[lang].common;
  
  const stats = [
    { label: 'Total Videos', value: '128', icon: Video, color: 'bg-blue-500', trend: '+12%' },
    { label: 'Total Views', value: '1.2M', icon: Eye, color: 'bg-purple-500', trend: '+25%' },
    { label: 'Subscribers', value: '45.2K', icon: Users, color: 'bg-pink-500', trend: '+8%' },
    { label: 'Avg. Watch Time', value: '42s', icon: Clock, color: 'bg-orange-500', trend: '+5%' },
  ];

  const recentVideos = [
    { id: 1, title: 'Top 10 AI Tools 2024', views: '45K', date: '2 hours ago', thumbnail: 'https://picsum.photos/seed/ai/400/225' },
    { id: 2, title: 'How to make money with AI', views: '120K', date: '5 hours ago', thumbnail: 'https://picsum.photos/seed/money/400/225' },
    { id: 3, title: 'Elon Musk on Mars', views: '890K', date: '1 day ago', thumbnail: 'https://picsum.photos/seed/mars/400/225' },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{t.dashboard}</h1>
          <p className="text-gray-500 text-sm">Welcome back! Here's what's happening with your AI shorts.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
          <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/20">Last 7 Days</button>
          <button className="px-4 py-2 text-gray-500 text-xs font-bold hover:bg-gray-50 rounded-xl transition-colors">Last 30 Days</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-lg">
                <TrendingUp size={12} />
                {stat.trend}
              </div>
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Videos */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Creations</h2>
            <button className="text-sm text-primary font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {recentVideos.map((video) => (
              <motion.div
                key={video.id}
                whileHover={{ x: 5 }}
                className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 group cursor-pointer"
              >
                <div className="w-24 h-16 rounded-xl overflow-hidden relative flex-shrink-0">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={20} className="text-white fill-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{video.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Eye size={12} /> {video.views}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} /> {video.date}</span>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                  <ArrowUpRight size={20} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Tips / AI Insights */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">AI Insights</h2>
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 text-white shadow-xl">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp size={20} className="text-primary" />
            </div>
            <h3 className="font-bold mb-2">Viral Opportunity!</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              "AI Finance" keywords are trending in your region. Create a 30s short about "Passive Income with AI" to boost reach by up to 40%.
            </p>
            <button className="w-full py-3 bg-primary text-white font-bold rounded-xl text-sm shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all">
              Try This Topic
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">AI Rendering</span>
                <span className="text-green-500 font-bold">Optimal</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">B-Roll Library</span>
                <span className="text-green-500 font-bold">Updated</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">API Latency</span>
                <span className="text-gray-900 font-bold">12ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
