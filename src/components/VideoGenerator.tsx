import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Play, 
  Download, 
  Share2, 
  CheckCircle2, 
  Loader2,
  Youtube,
  Music,
  Type as TypeIcon,
  Image as ImageIcon,
  Zap,
  TrendingUp,
  Search
} from 'lucide-react';
import { Language, translations } from '../lib/i18n';
import { generateShortsScripts, generateThumbnailPrompt, generateThumbnailImage } from '../lib/gemini';
import { validateApiKey } from '../lib/apiKeyHelper';

interface Script {
  title: string;
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
}

export default function VideoGenerator({ lang }: { lang: Language }) {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('Economy');
  const [platform, setPlatform] = useState('YouTube Shorts');
  const [isGenerating, setIsGenerating] = useState(false);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [step, setStep] = useState(1); // 1: Input, 2: Scripts, 3: Preview
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const t = translations[lang].generator;
  const tc = translations[lang].common;

  React.useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleGenerate = async () => {
    if (!keyword) {
      alert(t.placeholder || "키워드를 입력해주세요");
      return;
    }
    
    // API 키 검증
    if (!validateApiKey()) {
      return;
    }
    
    setIsGenerating(true);
    console.log(`🚀 Starting generation for keyword: ${keyword}, category: ${category}`);
    
    try {
      // API 호출 (Worker 또는 직접 생성)
      const result = await generateShortsScripts(keyword, category, lang);
      console.log(`✅ Generated ${result.length} scripts`);
      
      setScripts(result);
      setStep(2);
    } catch (error: any) {
      console.error("❌ Generation failed:", error);
      
      if (error.message.includes("API key")) {
        alert("❌ API 키 오류\n\n.env 파일에 올바른 VITE_GEMINI_API_KEY를 설정하고 개발 서버를 재시작하세요.\n\nGoogle AI Studio: https://aistudio.google.com/app/apikey");
      } else {
        alert("스크립트 생성 실패. 다시 시도해주세요.\n\n오류: " + error.message);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectScript = async (script: Script) => {
    setSelectedScript(script);
    setStep(3); // Move to preview immediately for better UX
    setThumbnail(null);
    setIsPlaying(true); // Auto-play simulation
    
    try {
      const prompt = await generateThumbnailPrompt(script.title);
      const img = await generateThumbnailImage(prompt);
      setThumbnail(img || `https://picsum.photos/seed/${encodeURIComponent(script.title)}/1080/1920`);
    } catch (error) {
      console.error(error);
      setThumbnail(`https://picsum.photos/seed/${encodeURIComponent(script.title)}/1080/1920`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-12">
      {/* Step 1: Input & Hero */}
      {step === 1 && (
        <div className="space-y-12">
          {/* Main Hero */}
          <div className="text-center space-y-6 py-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl sm:text-7xl font-black text-text-primary tracking-tighter leading-[0.9] uppercase"
            >
              AI Shorts Factory
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-text-secondary font-medium tracking-tight"
            >
              Create 100 Viral Shorts from One Keyword
            </motion.p>
          </div>

          {/* Input Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-3xl group-hover:bg-primary/30 transition-all duration-500 rounded-full" />
              <div className="relative glass-card rounded-3xl p-2 flex items-center gap-2">
                <div className="pl-6 text-text-secondary">
                  <Search size={24} />
                </div>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder={t.placeholder}
                  className="flex-1 bg-transparent border-none px-4 py-6 text-2xl font-bold text-text-primary outline-none placeholder:text-text-secondary/50"
                />
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !keyword}
                  className="btn-primary px-8 py-5 flex items-center gap-2 text-lg relative z-10"
                  aria-label="Generate AI Scripts"
                >
                  {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={24} />}
                </button>
              </div>
            </div>

            {/* Quick Action Chips */}
            <div className="flex flex-wrap justify-center gap-3">
              {['Economy', 'Tech', 'Culture', 'Politics', 'Entertainment'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold border transition-all ${
                    category === cat 
                      ? 'bg-primary border-primary text-white glow-primary' 
                      : 'bg-white/5 border-white/10 text-text-secondary hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Platform Selection */}
            <div className="flex justify-center gap-8 pt-4">
              {['YouTube Shorts', 'TikTok', 'Instagram Reels'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className="flex items-center gap-2 group"
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    platform === p ? 'border-primary bg-primary' : 'border-white/20'
                  }`}>
                    {platform === p && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className={`text-sm font-bold transition-all ${
                    platform === p ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'
                  }`}>
                    {p}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* AI Result Preview (Placeholder/Mock) */}
          <div className="space-y-8 pt-12">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-xl font-bold text-text-primary uppercase tracking-widest">AI Result Preview</h2>
              <div className="flex items-center gap-2 text-accent font-bold">
                <TrendingUp size={18} />
                <span>Est. 1.2M Views</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="premium-card group cursor-pointer overflow-hidden aspect-[9/16] relative">
                  <img 
                    src={`https://picsum.photos/seed/short-${i}/400/711`} 
                    alt="Mock" 
                    className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 space-y-2">
                    <div className="h-2 w-2/3 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-3/4" />
                    </div>
                    <p className="text-sm font-bold text-text-primary">AI Generated Script #{i}</p>
                    <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">Ready to render</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Scripts Selection */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-text-primary uppercase tracking-tight">{t.aiScripts}</h2>
            <button 
              onClick={() => setStep(1)} 
              className="px-6 py-2 rounded-xl bg-white/5 text-text-secondary font-bold hover:bg-white/10 transition-all"
            >
              {t.back}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {scripts.map((script, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="premium-card p-8 flex flex-col h-full"
              >
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6 font-black text-xl">
                  {i + 1}
                </div>
                <h3 className="font-bold text-xl mb-4 text-text-primary leading-tight">{script.title}</h3>
                <p className="text-sm text-text-secondary mb-6 line-clamp-6 leading-relaxed">
                  {script.hook} {script.body}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {script.hashtags.map((tag, j) => (
                    <span key={j} className="text-[10px] bg-white/5 text-text-secondary px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">#{tag}</span>
                  ))}
                </div>
                <button
                  onClick={() => handleSelectScript(script)}
                  className="mt-auto btn-primary w-full py-4 text-sm"
                >
                  {t.selectRender}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Step 3: Preview & Output */}
      {step === 3 && selectedScript && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12"
        >
          {/* Preview Canvas */}
          <div className="lg:col-span-5">
            <div className="aspect-[9/16] bg-black rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden relative border-[12px] border-card group">
              {thumbnail ? (
                <img src={thumbnail} alt="Preview" className={`w-full h-full object-cover transition-all duration-1000 ${isPlaying ? 'scale-110 opacity-100' : 'opacity-80'}`} referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-card">
                  <Loader2 className="animate-spin text-primary" size={40} />
                </div>
              )}
              
              {/* Overlay Subtitles */}
              <div className="absolute inset-x-0 bottom-24 px-6 text-center">
                <motion.div
                  key={progress > 50 ? 'body' : 'hook'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-accent text-white font-black text-xl px-6 py-3 rounded-xl inline-block shadow-2xl uppercase italic glow-accent"
                >
                  {progress > 50 ? selectedScript.body.substring(0, 30) + '...' : selectedScript.hook}
                </motion.div>
              </div>

              {/* Playback Progress */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                <div 
                  className="h-full bg-primary transition-all duration-100" 
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Play Button Overlay */}
              {!isPlaying && thumbnail && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setIsPlaying(true)}
                    className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl glow-primary"
                  >
                    <Play size={40} fill="currentColor" />
                  </button>
                </div>
              )}

              {/* Player Controls UI */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none" />
              <div className="absolute right-4 bottom-32 flex flex-col gap-6 items-center">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20"><CheckCircle2 /></div>
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20"><Share2 /></div>
              </div>
              <div className="absolute left-6 bottom-8 right-20">
                <p className="text-text-primary font-bold text-lg mb-1">@AI_Factory</p>
                <p className="text-text-secondary text-sm line-clamp-1">{selectedScript.title}</p>
              </div>
            </div>
          </div>

          {/* Editor/Details */}
          <div className="lg:col-span-7 space-y-8">
            <div className="premium-card p-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-text-primary uppercase tracking-tight">{t.finalizing}</h2>
                <button onClick={() => setStep(2)} className="text-sm text-text-secondary font-bold hover:text-primary transition-all">{t.changeScript}</button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-5 p-6 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                    <Music size={28} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">{t.bgm}</p>
                    <p className="text-lg font-bold text-text-primary">Trending Lo-fi Beats</p>
                  </div>
                  <button className="text-sm text-primary font-bold px-4 py-2 bg-primary/10 rounded-lg">Change</button>
                </div>

                <div className="flex items-center gap-5 p-6 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center text-accent">
                    <TypeIcon size={28} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">{t.autoSub}</p>
                    <p className="text-lg font-bold text-text-primary">Dynamic Animation</p>
                  </div>
                  <button className="text-sm text-primary font-bold px-4 py-2 bg-primary/10 rounded-lg">Edit</button>
                </div>

                <div className="flex items-center gap-5 p-6 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-500">
                    <ImageIcon size={28} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">{t.broll}</p>
                    <p className="text-lg font-bold text-text-primary">Cinematic Visuals</p>
                  </div>
                  <button className="text-sm text-primary font-bold px-4 py-2 bg-primary/10 rounded-lg">Regen</button>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-white/5 grid grid-cols-2 gap-6">
                <button className="flex items-center justify-center gap-3 py-5 bg-white/5 hover:bg-white/10 text-text-primary font-bold rounded-2xl transition-all border border-white/10">
                  <Download size={20} />
                  {t.download}
                </button>
                <button className="btn-primary flex items-center justify-center gap-3 py-5">
                  <Youtube size={20} />
                  {t.publish}
                </button>
              </div>
            </div>

            {/* Analytics Prediction */}
            <div className="bg-gradient-to-br from-primary to-primary-hover rounded-[32px] p-10 text-white shadow-2xl glow-primary">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold uppercase tracking-widest">{t.prediction}</h3>
                <TrendingUp size={24} />
              </div>
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <p className="text-[10px] opacity-60 uppercase font-bold tracking-widest mb-2">{t.estViews}</p>
                  <p className="text-3xl font-black">1.2M+</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] opacity-60 uppercase font-bold tracking-widest mb-2">{t.estCtr}</p>
                  <p className="text-3xl font-black">8.4%</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] opacity-60 uppercase font-bold tracking-widest mb-2">{t.viralScore}</p>
                  <p className="text-3xl font-black">92/100</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
