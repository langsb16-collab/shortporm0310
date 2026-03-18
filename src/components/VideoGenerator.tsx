
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
  TrendingUp
} from 'lucide-react';
import { Language, translations } from '../lib/i18n';
import { generateShortsScripts, generateThumbnailPrompt, generateThumbnailImage } from '../lib/gemini';

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

  const t = translations[lang].generator;
  const tc = translations[lang].common;

  const handleGenerate = async () => {
    if (!keyword) return;
    setIsGenerating(true);
    try {
      const result = await generateShortsScripts(keyword, category, lang);
      setScripts(result);
      setStep(2);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectScript = async (script: Script) => {
    setSelectedScript(script);
    setStep(3); // Move to preview immediately for better UX
    setThumbnail(null);
    
    try {
      // Parallelize prompt and image generation logic if possible, 
      // but here we need the prompt for the image. 
      // Still, we move to Step 3 first so the user sees the layout.
      const prompt = await generateThumbnailPrompt(script.title);
      const img = await generateThumbnailImage(prompt);
      setThumbnail(img);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
          {t.title}
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          {t.subtitle}
        </p>
      </div>

      {/* Step 1: Input */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-gray-100"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                {t.placeholder}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. Elon Musk, Real Estate, AI Trends"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-lg focus:border-primary focus:ring-0 transition-all outline-none"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Sparkles className="text-primary opacity-30" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  {t.category}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-primary focus:ring-0 transition-all outline-none"
                >
                  <option>Economy</option>
                  <option>Politics</option>
                  <option>Culture</option>
                  <option>Tech</option>
                  <option>Entertainment</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  {t.platform}
                </label>
                <div className="flex gap-2">
                  {['YouTube Shorts', 'TikTok', 'Instagram Reels'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={`flex-1 py-4 rounded-2xl text-xs font-bold transition-all ${
                        platform === p 
                          ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                          : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      {p.split(' ')[1] || p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !keyword}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Zap size={20} />
                  {tc.generate}
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Scripts Selection */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">{t.aiScripts}</h2>
            <button onClick={() => setStep(1)} className="text-sm text-primary font-bold">{t.back}</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scripts.map((script, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 flex flex-col"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 font-bold">
                  0{i + 1}
                </div>
                <h3 className="font-bold text-lg mb-3 line-clamp-2">{script.title}</h3>
                <p className="text-xs text-gray-500 mb-4 line-clamp-4 leading-relaxed">
                  {script.hook} {script.body}
                </p>
                <div className="flex flex-wrap gap-1 mb-6">
                  {script.hashtags.map((tag, j) => (
                    <span key={j} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-md">#{tag}</span>
                  ))}
                </div>
                <button
                  onClick={() => handleSelectScript(script)}
                  className="mt-auto w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors"
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
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Preview Canvas */}
          <div className="lg:col-span-5">
            <div className="aspect-[9/16] bg-black rounded-[40px] shadow-2xl overflow-hidden relative border-[8px] border-gray-900">
              {thumbnail ? (
                <img src={thumbnail} alt="Preview" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader2 className="animate-spin text-white" />
                </div>
              )}
              
              {/* Overlay Subtitles */}
              <div className="absolute inset-x-0 bottom-24 px-6 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-yellow-400 text-black font-black text-xl px-4 py-2 rounded-lg inline-block shadow-lg uppercase italic"
                >
                  {selectedScript.hook}
                </motion.div>
              </div>

              {/* Player Controls UI */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
              <div className="absolute right-4 bottom-32 flex flex-col gap-6 items-center">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white"><CheckCircle2 /></div>
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white"><Share2 /></div>
              </div>
              <div className="absolute left-4 bottom-8 right-20">
                <p className="text-white font-bold text-sm mb-1">@AI_Factory_User</p>
                <p className="text-white/80 text-xs line-clamp-1">{selectedScript.title}</p>
              </div>
            </div>
          </div>

          {/* Editor/Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{t.finalizing}</h2>
                <button onClick={() => setStep(2)} className="text-sm text-gray-400">{t.changeScript}</button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Music size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.bgm}</p>
                    <p className="text-sm font-bold">Trending Lo-fi Beats (AI Matched)</p>
                  </div>
                  <button className="text-xs text-primary font-bold">Change</button>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                    <TypeIcon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.autoSub}</p>
                    <p className="text-sm font-bold">Dynamic Animation (8 Languages)</p>
                  </div>
                  <button className="text-xs text-primary font-bold">Edit</button>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">
                    <ImageIcon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.broll}</p>
                    <p className="text-sm font-bold">AI Generated Cinematic Visuals</p>
                  </div>
                  <button className="text-xs text-primary font-bold">Regen</button>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all">
                  <Download size={18} />
                  {t.download}
                </button>
                <button className="flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all">
                  <Youtube size={18} />
                  {t.publish}
                </button>
              </div>
            </div>

            {/* Analytics Prediction */}
            <div className="bg-gradient-to-br from-primary to-primary-hover rounded-3xl p-8 text-white shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold">{t.prediction}</h3>
                <TrendingUp size={20} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-[10px] opacity-60 uppercase font-bold tracking-widest mb-1">{t.estViews}</p>
                  <p className="text-2xl font-black">1.2M+</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] opacity-60 uppercase font-bold tracking-widest mb-1">{t.estCtr}</p>
                  <p className="text-2xl font-black">8.4%</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] opacity-60 uppercase font-bold tracking-widest mb-1">{t.viralScore}</p>
                  <p className="text-2xl font-black">92/100</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
