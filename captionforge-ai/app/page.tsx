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
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 selection:bg-indigo-500/30 font-sans pb-24">
      <Toaster theme="dark" position="bottom-right" className="font-sans" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-[#0a0a0c]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="font-semibold tracking-wide">CaptionForge AI</span>
          </div>
          <a href="https://github.com/ShreyasVavley/Caption-maker" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <Code2 size={20} />
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12 lg:pt-20">
        <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-12 xl:gap-20">
          
          {/* Left Column: Controls */}
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                Forge high-converting <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  social copy instantly.
                </span>
              </h1>
              <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
                Upload your creative assets, define your brand tone, and let our multi-modal AI engineer the perfect caption blueprint.
              </p>
            </div>

            <div className="p-1 rounded-3xl bg-gradient-to-b from-zinc-800/50 to-zinc-900/50">
              <div className="p-6 sm:p-8 rounded-[22px] bg-[#121316] flex flex-col gap-8 shadow-2xl">
                <PlatformSelector 
                  platform={platform} setPlatform={setPlatform}
                  tone={tone} setTone={setTone}
                />
                
                <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">Context (Optional)</h3>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Briefly describe the context or key takeaways..."
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all resize-none h-24"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">Media Asset</h3>
                    <span className="text-xs text-zinc-500">Video / Image</span>
                  </div>
                  <DropZone onFileSelect={setFile} />
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="relative group w-full py-4 rounded-xl bg-zinc-100 text-zinc-900 font-semibold text-base transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-white overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <div className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                        <span>Analyzing & Generating...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        <span>Generate Copy</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="relative h-full min-h-[600px] lg:mt-6">
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20"
                >
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 shadow-xl">
                    <Sparkles className="w-6 h-6 text-zinc-600" />
                  </div>
                  <h3 className="text-lg font-medium text-zinc-300 mb-2">Awaiting Instructions</h3>
                  <p className="text-zinc-500 text-center text-sm max-w-[260px] leading-relaxed">
                    Configure your platform, tone, and media to generate optimized copy.
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, filter: 'blur(10px)' }}
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-zinc-800/50 bg-[#121316]/50 backdrop-blur-xl"
                >
                  <div className="relative w-20 h-20 mb-8">
                    <div className="absolute inset-0 border-t-2 border-indigo-500 rounded-full animate-spin" />
                    <div className="absolute inset-2 border-r-2 border-purple-500 rounded-full animate-spin animation-delay-200" />
                    <div className="absolute inset-4 border-b-2 border-indigo-400 rounded-full animate-spin animation-delay-400" />
                  </div>
                  <h3 className="text-lg font-medium text-zinc-200 mb-2">Processing via Gemini 2.5</h3>
                  <p className="text-zinc-500 text-sm animate-pulse">Extracting visual context & engineering hooks...</p>
                </motion.div>
              )}

              {result && (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-5"
                >
                  <div className="flex items-center gap-3 mb-2 px-2">
                    <div className="h-px bg-zinc-800 flex-grow" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Generated Assets</span>
                    <div className="h-px bg-zinc-800 flex-grow" />
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
