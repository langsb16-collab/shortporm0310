
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Video, 
  Upload, 
  Settings, 
  BarChart3, 
  Globe, 
  History,
  TrendingUp,
  Zap
} from 'lucide-react';
import { Language, translations } from '../lib/i18n';

export default function Sidebar({ lang, activeTab, setActiveTab }: { 
  lang: Language; 
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const t = translations[lang].common;

  const menuItems = [
    { id: 'generator', icon: Zap, label: t.createVideo },
    { id: 'dashboard', icon: LayoutDashboard, label: t.dashboard },
    { id: 'upload', icon: Upload, label: t.upload },
    { id: 'analytics', icon: BarChart3, label: t.analytics },
    { id: 'history', icon: History, label: t.history },
    { id: 'trends', icon: TrendingUp, label: t.trends },
    { id: 'settings', icon: Settings, label: t.settings },
  ];

  return (
    <div className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 text-primary">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
            <Video size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight uppercase">AI Factory</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-primary/5 text-primary font-semibold' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <item.icon size={20} />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={16} className="text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{t.globalMode}</span>
          </div>
          <p className="text-[11px] text-gray-500 mb-3">Support for 8 languages and automatic translation.</p>
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
