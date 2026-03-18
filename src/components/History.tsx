import React from 'react';
import { motion } from 'motion/react';
import { translations, Language } from '../lib/i18n';
import { Play, Download, Share2, Trash2, MoreVertical, CheckCircle2, Clock } from 'lucide-react';

interface HistoryProps {
  lang: Language;
}

const historyItems = [
  { id: 1, title: 'AI Revolution in 2024', status: 'Completed', date: '2024-03-10', views: '45.2K', thumbnail: 'https://picsum.photos/seed/ai-rev/400/225' },
  { id: 2, title: 'How to Build a Startup', status: 'Completed', date: '2024-03-09', views: '12.8K', thumbnail: 'https://picsum.photos/seed/startup/400/225' },
  { id: 3, title: 'The Future of Mars', status: 'Rendering', date: '2024-03-10', views: '0', thumbnail: 'https://picsum.photos/seed/mars-future/400/225' },
  { id: 4, title: 'Healthy Eating Tips', status: 'Completed', date: '2024-03-08', views: '8.4K', thumbnail: 'https://picsum.photos/seed/healthy/400/225' },
  { id: 5, title: 'Travel Hacks for 2024', status: 'Completed', date: '2024-03-07', views: '22.1K', thumbnail: 'https://picsum.photos/seed/travel/400/225' },
];

export default function History({ lang }: HistoryProps) {
  const t = translations[lang].common;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-primary uppercase tracking-tight">{t.history}</h1>
          <p className="text-text-secondary text-sm">Manage and review your generated content.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-6 py-2.5 bg-card text-text-primary text-sm font-bold rounded-xl hover:bg-white/5 border border-border transition-all">Export All</button>
        </div>
      </div>

      <div className="premium-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-border">
                <th className="px-8 py-5 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Video</th>
                <th className="px-8 py-5 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Views</th>
                <th className="px-8 py-5 text-[10px] font-bold text-text-secondary uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {historyItems.map((item) => (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-12 rounded-lg overflow-hidden relative flex-shrink-0 bg-dark-bg">
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play size={16} className="text-white fill-white" />
                        </div>
                      </div>
                      <span className="font-bold text-text-primary truncate max-w-[200px]">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2">
                      {item.status === 'Completed' ? (
                        <>
                          <CheckCircle2 size={16} className="text-green-500" />
                          <span className="text-xs font-bold text-green-500">{item.status}</span>
                        </>
                      ) : (
                        <>
                          <Clock size={16} className="text-accent animate-pulse" />
                          <span className="text-xs font-bold text-accent">{item.status}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-4 text-sm text-text-secondary">{item.date}</td>
                  <td className="px-8 py-4 text-sm font-bold text-text-primary">{item.views}</td>
                  <td className="px-8 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-xl transition-all"><Download size={18} /></button>
                      <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-xl transition-all"><Share2 size={18} /></button>
                      <button className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={18} /></button>
                      <button className="p-2 text-text-secondary hover:bg-white/10 rounded-xl transition-all"><MoreVertical size={18} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
