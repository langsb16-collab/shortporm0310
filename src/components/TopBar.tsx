
import React from 'react';
import { Globe, Bell, User, Search, ChevronDown } from 'lucide-react';
import { Language, languages, translations } from '../lib/i18n';

export default function TopBar({ 
  lang, 
  setLang 
}: { 
  lang: Language; 
  setLang: (l: Language) => void;
}) {
  const t = translations[lang].common;

  return (
    <header className="h-16 lg:h-20 bg-dark-bg/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-sm text-text-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-secondary"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        {/* Language Switcher */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors">
            <Globe size={18} className="text-text-secondary" />
            <span className="text-sm font-bold hidden sm:inline text-text-primary">{languages.find(l => l.code === lang)?.name}</span>
            <ChevronDown size={14} className="text-text-secondary" />
          </button>
          <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-2xl shadow-2xl border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2 grid grid-cols-1 gap-1">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                  lang === l.code ? 'bg-primary/20 text-text-primary font-bold' : 'text-text-secondary hover:bg-white/5'
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.name}</span>
              </button>
            ))}
          </div>
        </div>

        <button className="relative p-2 text-text-secondary hover:bg-white/5 rounded-xl transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-dark-bg" />
        </button>

        <div className="h-8 w-[1px] bg-border hidden sm:block" />

        <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-white/5 transition-colors">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-text-primary">{t.guestUser}</p>
            <p className="text-[10px] text-text-secondary">{t.freeAccount}</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center text-white font-bold shadow-lg glow-primary">
            <User size={20} />
          </div>
        </button>
      </div>
    </header>
  );
}
