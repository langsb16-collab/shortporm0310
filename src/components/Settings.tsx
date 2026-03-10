import React from 'react';
import { motion } from 'motion/react';
import { translations, Language } from '../lib/i18n';
import { User, Bell, Shield, Globe, Zap, CreditCard, ChevronRight, LogOut, Moon, Sun } from 'lucide-react';

interface SettingsProps {
  lang: Language;
}

export default function Settings({ lang }: SettingsProps) {
  const t = translations[lang].common;

  const sections = [
    {
      title: 'Account',
      items: [
        { label: 'Profile Information', icon: User, value: 'Guest User' },
        { label: 'Security & Password', icon: Shield, value: 'Protected' },
        { label: 'Billing & Subscription', icon: CreditCard, value: 'Free Plan' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { label: 'Notifications', icon: Bell, value: 'On' },
        { label: 'Language', icon: Globe, value: lang.toUpperCase() },
        { label: 'Appearance', icon: Moon, value: 'Light Mode' },
      ],
    },
    {
      title: 'AI Engine',
      items: [
        { label: 'Model Selection', icon: Zap, value: 'Gemini 3.1 Pro' },
        { label: 'Auto-Optimization', icon: Zap, value: 'Enabled' },
      ],
    },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{t.settings}</h1>
          <p className="text-gray-500 text-sm">Manage your account and app preferences.</p>
        </div>
      </div>

      <div className="space-y-8">
        {sections.map((section, i) => (
          <div key={i} className="space-y-4">
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">{section.title}</h2>
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
              {section.items.map((item, j) => (
                <button
                  key={j}
                  className={`w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors ${
                    j !== section.items.length - 1 ? 'border-b border-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                      <item.icon size={20} />
                    </div>
                    <span className="font-bold text-gray-900">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400">{item.value}</span>
                    <ChevronRight size={18} className="text-gray-300" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-4">
          <button className="w-full flex items-center justify-center gap-2 p-5 bg-red-50 text-red-500 font-bold rounded-[32px] hover:bg-red-100 transition-all">
            <LogOut size={20} />
            Sign Out
          </button>
        </div>

        <div className="text-center space-y-2">
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">AI Shorts Factory v1.0.4</p>
          <p className="text-[10px] text-gray-400">© 2024 AI Factory Inc. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
