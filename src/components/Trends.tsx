import React from 'react';
import { motion } from 'motion/react';
import { translations, Language } from '../lib/i18n';
import { TrendingUp, ArrowUpRight, Search, Globe, Zap, MessageSquare, Heart, Share2 } from 'lucide-react';

interface TrendsProps {
  lang: Language;
}

const trendingKeywords = [
  { keyword: 'AI Finance', growth: '+450%', category: 'Finance', color: 'bg-blue-500' },
  { keyword: 'Elon Musk Mars', growth: '+320%', category: 'Tech', color: 'bg-purple-500' },
  { keyword: 'Healthy Habits', growth: '+210%', category: 'Lifestyle', color: 'bg-green-500' },
  { keyword: 'Crypto News', growth: '+180%', category: 'Finance', color: 'bg-orange-500' },
  { keyword: 'Travel Hacks', growth: '+150%', category: 'Travel', color: 'bg-pink-500' },
];

const trendingTopics = [
  { id: 1, title: 'The Rise of AI Agents', description: 'AI agents are transforming how we work and interact with technology.', engagement: '8.4M', thumbnail: 'https://picsum.photos/seed/ai-agents/400/225' },
  { id: 2, title: 'Sustainable Living in 2024', description: 'Practical tips for reducing your carbon footprint and living more sustainably.', engagement: '5.2M', thumbnail: 'https://picsum.photos/seed/sustainable/400/225' },
  { id: 3, title: 'The Future of Remote Work', description: 'How remote work is evolving and what it means for the global workforce.', engagement: '3.1M', thumbnail: 'https://picsum.photos/seed/remote-work/400/225' },
];

export default function Trends({ lang }: TrendsProps) {
  const t = translations[lang].common;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{t.trends}</h1>
          <p className="text-gray-500 text-sm">Discover what's trending and boost your reach.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search trends..."
            className="w-full bg-white border border-gray-100 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trending Keywords */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Hot Keywords</h2>
            <Globe size={20} className="text-gray-300" />
          </div>
          <div className="space-y-3">
            {trendingKeywords.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 5 }}
                className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{item.keyword}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{item.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-lg">
                  <TrendingUp size={12} />
                  {item.growth}
                </div>
              </motion.div>
            ))}
          </div>
          <button className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl text-sm shadow-lg hover:bg-black transition-all">
            Unlock Premium Trends
          </button>
        </div>

        {/* Trending Topics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Viral Topics</h2>
            <button className="text-sm text-primary font-bold hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trendingTopics.map((topic) => (
              <motion.div
                key={topic.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden flex flex-col"
              >
                <div className="aspect-video relative">
                  <img src={topic.thumbnail} alt={topic.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-widest">
                    Trending
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{topic.title}</h3>
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">{topic.description}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-xs text-gray-400"><Heart size={14} /> 12K</div>
                      <div className="flex items-center gap-1 text-xs text-gray-400"><MessageSquare size={14} /> 450</div>
                      <div className="flex items-center gap-1 text-xs text-gray-400"><Share2 size={14} /> 890</div>
                    </div>
                    <button className="p-2 bg-primary/5 text-primary rounded-xl hover:bg-primary/10 transition-all">
                      <ArrowUpRight size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
