import React, { useState } from 'react';
import { motion } from 'motion/react';
import { translations, Language } from '../lib/i18n';
import { Upload as UploadIcon, File, X, CheckCircle2, Loader2, Video, Music, ImageIcon } from 'lucide-react';

interface UploadProps {
  lang: Language;
}

export default function Upload({ lang }: UploadProps) {
  const t = translations[lang].common;
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<{ name: string; size: string; status: 'uploading' | 'completed'; type: string }[]>([]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const newFiles = Array.from(e.dataTransfer.files).map((f: File) => ({
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(2) + ' MB',
      status: 'uploading' as const,
      type: f.type
    }));
    setFiles(prev => [...prev, ...newFiles]);
    
    // Simulate upload
    setTimeout(() => {
      setFiles(prev => prev.map(f => ({ ...f, status: 'completed' })));
    }, 2000);
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-primary uppercase tracking-tight">{t.upload}</h1>
          <p className="text-text-secondary text-sm">Upload your assets to the AI cloud library.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Zone */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`aspect-video rounded-[40px] border-4 border-dashed transition-all flex flex-col items-center justify-center p-12 text-center cursor-pointer ${
              isDragging ? 'border-primary bg-primary/10 scale-[0.98]' : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center text-primary mb-6 glow-primary">
              <UploadIcon size={40} />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2 uppercase tracking-widest">Drag & Drop Assets</h3>
            <p className="text-text-secondary text-sm max-w-xs mb-8">
              Support for MP4, MOV, PNG, JPG, and MP3 files. Max size 500MB.
            </p>
            <button className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg glow-primary hover:bg-primary-hover transition-all">
              Browse Files
            </button>
          </motion.div>

          {/* Upload Queue */}
          {files.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest px-2">Upload Queue</h2>
              <div className="space-y-3">
                {files.map((file, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="premium-card p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-text-secondary">
                        {file.type.includes('video') ? <Video size={20} /> : file.type.includes('audio') ? <Music size={20} /> : <ImageIcon size={20} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-primary truncate max-w-[200px]">{file.name}</p>
                        <p className="text-[10px] text-text-secondary font-bold">{file.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {file.status === 'uploading' ? (
                        <Loader2 size={18} className="text-primary animate-spin" />
                      ) : (
                        <CheckCircle2 size={18} className="text-green-500" />
                      )}
                      <button className="p-1.5 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                        <X size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Storage Info */}
        <div className="space-y-6">
          <div className="premium-card p-8">
            <h3 className="font-bold text-text-primary mb-6 uppercase tracking-widest text-xs">Cloud Storage</h3>
            <div className="space-y-6">
              <div className="relative h-4 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  className="absolute inset-y-0 left-0 bg-primary rounded-full glow-primary"
                />
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-text-primary">6.5 GB Used</span>
                <span className="text-text-secondary">10 GB Total</span>
              </div>
              <div className="pt-4 space-y-3">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-text-secondary">Videos</span>
                  <span className="text-text-primary">4.2 GB</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-text-secondary">Images</span>
                  <span className="text-text-primary">1.8 GB</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-text-secondary">Audio</span>
                  <span className="text-text-primary">0.5 GB</span>
                </div>
              </div>
              <button className="w-full py-4 bg-primary/10 text-primary font-bold rounded-2xl text-sm hover:bg-primary/20 transition-all border border-primary/20">
                Upgrade Storage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
