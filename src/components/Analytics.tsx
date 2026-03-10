import React from 'react';
import { motion } from 'motion/react';
import { translations, Language } from '../lib/i18n';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, Users, Eye, Share2, Heart, MessageCircle } from 'lucide-react';

interface AnalyticsProps {
  lang: Language;
}

const data = [
  { name: 'Mon', views: 4000, engagement: 2400 },
  { name: 'Tue', views: 3000, engagement: 1398 },
  { name: 'Wed', views: 2000, engagement: 9800 },
  { name: 'Thu', views: 2780, engagement: 3908 },
  { name: 'Fri', views: 1890, engagement: 4800 },
  { name: 'Sat', views: 2390, engagement: 3800 },
  { name: 'Sun', views: 3490, engagement: 4300 },
];

const platformData = [
  { name: 'TikTok', value: 45, color: '#000000' },
  { name: 'YouTube', value: 30, color: '#FF0000' },
  { name: 'Instagram', value: 25, color: '#E1306C' },
];

export default function Analytics({ lang }: AnalyticsProps) {
  const t = translations[lang].common;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{t.analytics}</h1>
          <p className="text-gray-500 text-sm">Deep dive into your content performance.</p>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white p-6 sm:p-8 rounded-[40px] shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-900">Growth Overview</h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Views</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Engagement</span>
            </div>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6321" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#FF6321" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#FF6321" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorViews)" 
              />
              <Area 
                type="monotone" 
                dataKey="engagement" 
                stroke="#F27D26" 
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="transparent"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Platform Distribution */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Platform Reach</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8">
            {platformData.map((p) => (
              <div key={p.name} className="text-center">
                <p className="text-2xl font-black text-gray-900">{p.value}%</p>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{p.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="grid grid-cols-2 gap-6">
          {[
            { label: 'Likes', value: '842K', icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
            { label: 'Shares', value: '124K', icon: Share2, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Comments', value: '12.5K', icon: MessageCircle, color: 'text-green-500', bg: 'bg-green-50' },
            { label: 'Retention', value: '78%', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center"
            >
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                <stat.icon size={24} />
              </div>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
