'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Wand2, Code2 } from 'lucide-react';
import { Toaster } from 'sonner';
import DropZone from '@/components/DropZone';
import PlatformSelector from '@/components/PlatformSelector';
import CaptionCard from '@/components/CaptionCard';
import { Platform, Tone, CaptionResponse } from '@/types';

export default function Home() {
  const [platform, setPlatform] = useState<Platform>('Instagram Reels');
  const [tone, setTone] = useState<Tone>('Tech Hustle / Obsidian Dark');
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CaptionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!file && !prompt.trim()) {
      setError('Please provide either media or a context prompt.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('platform', platform);
    formData.append('tone', tone);
    if (file) formData.append('file', file);
    if (prompt) formData.append('prompt', prompt);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-zinc-100 selection:bg-indigo-500/30 font-sans pb-24 relative overflow-hidden">
      <div className="uiverse-bg-orbs">
        <div className="uiverse-bg-orb-3" />
      </div>
      <Toaster theme="dark" position="bottom-right" className="font-sans" />
      
      {/* Header */}
      <header className="relative z-50 w-full border-b border-zinc-800/30 bg-[#0a0a0c]/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <Sparkles className="w-4 h-4 text-[#00ddeb]" />
            </div>
            <span className="font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#00ddeb] to-[#af40ff]">CaptionForge</span>
          </div>
          <a href="https://github.com/ShreyasVavley/Caption-maker" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-[#00ddeb] transition-colors drop-shadow-[0_0_8px_rgba(0,221,235,0.8)]">
            <Code2 size={22} />
          </a>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 lg:pt-20">
        <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-12 xl:gap-20">
          
          {/* Left Column: Controls */}
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-5xl sm:text-6xl font-black tracking-tighter mb-4 leading-tight">
                Forging <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#af40ff] via-[#5b42f3] to-[#00ddeb] drop-shadow-[0_0_30px_rgba(91,66,243,0.6)]">
                  Hyper-Viral Copy.
                </span>
              </h1>
              <p className="text-zinc-400 text-lg leading-relaxed max-w-xl font-medium">
                Unleash our multi-modal AI engine. Drop your media, pick your aesthetic, and let the forge ignite.
              </p>
            </div>

            <div className="uiverse-holo-card p-6 sm:p-8 flex flex-col gap-8">
              <PlatformSelector 
                platform={platform} setPlatform={setPlatform}
                tone={tone} setTone={setTone}
              />
              
              <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Context Directive (Optional)</h3>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Define the narrative parameters..."
                  className="w-full bg-[#0a0a0c]/80 backdrop-blur-md border border-zinc-800 rounded-xl p-4 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-[#af40ff] focus:ring-1 focus:ring-[#af40ff] transition-all resize-none h-24 shadow-inner"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Media Uplink</h3>
                <DropZone onFileSelect={setFile} />
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-400 text-sm font-medium flex items-start gap-3 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                  <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0 animate-pulse" />
                  <p>{error}</p>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="uiverse-galaxy-btn mt-2"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Igniting Core...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5" />
                    <span>Initiate Forge sequence</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="relative h-full min-h-[600px] lg:mt-6">
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 flex flex-col items-center justify-center uiverse-holo-card"
                >
                  <div className="w-20 h-20 rounded-2xl bg-[#0a0a0c]/80 border border-zinc-800 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,221,235,0.2)]">
                    <Sparkles className="w-8 h-8 text-[#00ddeb] animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 tracking-wide">Awaiting Uplink</h3>
                  <p className="text-zinc-500 text-center text-sm max-w-[260px] leading-relaxed">
                    Stand by for media input and parameter configuration.
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center uiverse-holo-card bg-[#0a0a0c]/60 backdrop-blur-xl"
                >
                  <div className="uiverse-atom-loader mb-12">
                    <div className="uiverse-atom-core" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 tracking-widest uppercase">Processing via Gemini</h3>
                  <p className="text-[#00ddeb] text-sm animate-pulse tracking-wide font-medium">Extracting multi-modal intelligence...</p>
                </motion.div>
              )}

              {result && (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col gap-6 relative z-20"
                >
                  <div className="flex items-center gap-4 mb-2 px-2">
                    <div className="h-px bg-gradient-to-r from-transparent via-[#af40ff] to-transparent flex-grow opacity-50" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[#00ddeb] drop-shadow-[0_0_5px_rgba(0,221,235,0.8)]">Output Generated</span>
                    <div className="h-px bg-gradient-to-r from-transparent via-[#af40ff] to-transparent flex-grow opacity-50" />
                  </div>
                  
                  <CaptionCard index={1} title="The Hook" variation={result.variations.hookShort} platform={platform} />
                  <CaptionCard index={2} title="Story Context" variation={result.variations.storyContext} platform={platform} />
                  <CaptionCard index={3} title="Engagement Drive" variation={result.variations.engagementQuestion} platform={platform} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
    </div>
  );
}
