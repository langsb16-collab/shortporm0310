
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Mic, Video, Languages, Image as ImageIcon, Paperclip } from 'lucide-react';
import { Language, translations } from '../lib/i18n';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  translated?: string;
}

export default function ChatWindow({ lang }: { lang: Language }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! How can I help you today?', sender: 'ai', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = translations[lang].chat;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: `I received your message: "${input}". This is a simulated real-time response.`,
        sender: 'ai',
        timestamp: new Date(),
        translated: lang !== 'en' ? `(Translated to ${lang})` : undefined
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 sm:w-96 h-[500px] bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border"
          >
            {/* Header */}
            <div className="bg-primary p-4 text-white flex items-center justify-between glow-primary">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-widest">{t.title}</h3>
                  <p className="text-[10px] opacity-80">{t.online}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"><Video size={18} /></button>
                <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"><Mic size={18} /></button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-bg/50 scrollbar-hide">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-white rounded-tr-none glow-primary' 
                      : 'bg-card text-text-primary shadow-sm border border-border rounded-tl-none'
                  }`}>
                    <p>{msg.text}</p>
                    {msg.translated && <p className="text-[10px] mt-1 opacity-60 italic">{msg.translated}</p>}
                    <p className={`text-[9px] mt-1 ${msg.sender === 'user' ? 'text-white/60' : 'text-text-secondary'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-card border-t border-border">
              <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-border">
                <button className="text-text-secondary hover:text-primary"><Paperclip size={18} /></button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t.placeholder}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1 text-text-primary"
                />
                <button onClick={handleSend} className="text-primary hover:text-primary-hover">
                  <Send size={18} />
                </button>
              </div>
              <div className="flex justify-between mt-3 px-1">
                <button className="flex items-center gap-1 text-[10px] text-text-secondary hover:text-primary">
                  <Mic size={14} /> {t.record}
                </button>
                <button className="flex items-center gap-1 text-[10px] text-text-secondary hover:text-primary">
                  <Languages size={14} /> {t.autoTranslate}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-hover transition-colors glow-primary"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>
    </div>
  );
}
