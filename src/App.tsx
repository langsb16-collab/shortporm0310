import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import VideoGenerator from './components/VideoGenerator';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import History from './components/History';
import Trends from './components/Trends';
import Settings from './components/Settings';
import Upload from './components/Upload';
import ChatWindow from './components/ChatWindow';
import FAQWindow from './components/FAQWindow';
import { Language, translations } from './lib/i18n';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [lang, setLang] = useState<Language>('ko');
  const [activeTab, setActiveTab] = useState('generator');

  const t = translations[lang].common;

  const renderContent = () => {
    switch (activeTab) {
      case 'generator':
        return <VideoGenerator lang={lang} />;
      case 'dashboard':
        return <Dashboard lang={lang} />;
      case 'analytics':
        return <Analytics lang={lang} />;
      case 'history':
        return <History lang={lang} />;
      case 'trends':
        return <Trends lang={lang} />;
      case 'settings':
        return <Settings lang={lang} />;
      case 'upload':
        return <Upload lang={lang} />;
      default:
        return (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-[calc(100vh-80px)] text-center p-8"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-300 mb-6">
              <span className="text-4xl font-bold">?</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.comingSoon}</h2>
            <p className="text-gray-500 max-w-md">
              {t.comingSoonDesc}
            </p>
          </motion.div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-bg-soft">
      {/* Sidebar */}
      <Sidebar lang={lang} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar lang={lang} setLang={setLang} />
        
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating UI Elements */}
      <ChatWindow lang={lang} />
      <FAQWindow lang={lang} />
    </div>
  );
}
