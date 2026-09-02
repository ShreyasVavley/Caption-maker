'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Wand2, Code2, Download, Copy, History, Eye, EyeOff } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import DropZone from '@/components/DropZone';
import PlatformSelector from '@/components/PlatformSelector';
import CaptionCard from '@/components/CaptionCard';
import StrategyCard from '@/components/StrategyCard';
import { Platform, Tone, CaptionResponse } from '@/types';
import { parse } from 'partial-json';

interface HistoryItem {
  id: string;
  date: string;
  platform: Platform;
  result: CaptionResponse;
}

export default function Home() {
  const [platform, setPlatform] = useState<Platform>('Instagram Reels');
  const [tone, setTone] = useState<Tone>('Tech Hustle / Obsidian Dark');
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [creativity, setCreativity] = useState<number>(0.7);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CaptionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [visionText, setVisionText] = useState<string | null>(null);
  const [isVisionLoading, setIsVisionLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('cf_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (!file) { setVisionText(null); return; }
    const analyzeMedia = async () => {
      setIsVisionLoading(true);
      setVisionText(null);
      try {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/vision', { method: 'POST', body: fd });
        const data = await res.json();
        if(data.description) setVisionText(data.description);
      } catch(e) {}
      setIsVisionLoading(false);
    }
    analyzeMedia();
  }, [file]);

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
    formData.append('creativity', creativity.toString());
    if (file) formData.append('file', file);
    if (prompt) formData.append('prompt', prompt);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Generation failed');
      }
      
      setLoading(false); // Stop loader, show cards
      setResult({ variations: { hookShort: {} as any, storyContext: {} as any, engagementQuestion: {} as any } });

      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let jsonString = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            try {
              const finalParsed = parse(jsonString) as CaptionResponse;
              const newItem = { id: Date.now().toString(), date: new Date().toISOString(), platform, result: finalParsed };
              const newHistory = [newItem, ...history].slice(0, 10);
              setHistory(newHistory);
              localStorage.setItem('cf_history', JSON.stringify(newHistory));
            } catch (e) {}
            break;
          }
          jsonString += decoder.decode(value, { stream: true });
          try {
            const parsed = parse(jsonString);
            if (parsed && parsed.variations) {
              setResult(parsed as CaptionResponse);
            }
          } catch (e) {
            // Ignore partial parse errors if they happen
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const handleCopyAll = () => {
    if (!result) return;
    const text = `HOOK:\n${result.variations.hookShort?.hook}\n\nSTORY:\n${result.variations.hookShort?.story}\n\nCTA:\n${result.variations.hookShort?.callToAction}\n\nHASHTAGS:\n${result.variations.hookShort?.hashtags?.join(' ')}`;
    navigator.clipboard.writeText(text);
    toast.success('Copied all captions to clipboard!');
  };

  const handleDownloadTxt = () => {
    if (!result) return;
    const text = `HOOK:\n${result.variations.hookShort?.hook}\n\nSTORY:\n${result.variations.hookShort?.story}\n\nCTA:\n${result.variations.hookShort?.callToAction}\n\nHASHTAGS:\n${result.variations.hookShort?.hashtags?.join(' ')}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `captionforge-${Date.now()}.txt`;
    a.click();
    toast.success('Downloaded captions as TXT!');
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
              <Sparkles className="w-4 h-4 text-teal-400" />
            </div>
            <span className="font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">CaptionForge</span>
          </div>
          <a href="https://github.com/ShreyasVavley/Caption-maker" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-teal-400 transition-colors drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]">
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-[#1B4D3E] drop-shadow-[0_0_30px_rgba(45,212,191,0.3)]">
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
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Creativity Level</h3>
                  <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2 py-1 rounded-md">{creativity.toFixed(1)}</span>
                </div>
                <input 
                  type="range" min="0" max="1.5" step="0.1"
                  value={creativity} onChange={(e) => setCreativity(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-1">
                  <span>Factual</span>
                  <span>Unhinged</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Context Directive (Optional)</h3>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Define the narrative parameters..."
                  className="w-full bg-[#0a0a0c]/80 backdrop-blur-md border border-zinc-800 rounded-xl p-4 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all resize-none h-24 shadow-inner"
                />
              </div>

              {file && (
                <div className="bg-[#0a0a0c]/80 border border-zinc-800 rounded-xl p-3 flex items-start gap-3 mt-2">
                  <div className="mt-0.5"><Eye size={16} className={isVisionLoading ? "text-zinc-500 animate-pulse" : "text-teal-400"} /></div>
                  <div className="text-xs text-zinc-300 leading-relaxed italic">
                    {isVisionLoading ? 'AI is analyzing media...' : visionText || 'Media ready.'}
                  </div>
                </div>
              )}

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
                disabled={loading || (!file && !prompt.trim())}
                className="uiverse-galaxy-btn w-full mt-4 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={20} className="group-hover:rotate-12 transition-transform" />}
                {loading ? 'Forging...' : 'Generate Copy'}
              </button>

              {history.length > 0 && (
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-2 text-zinc-500 mb-4">
                    <History size={16} />
                    <h3 className="text-xs font-bold uppercase tracking-widest">Recent Forges</h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    {history.map(item => (
                      <button 
                        key={item.id} 
                        onClick={() => {
                          setResult(item.result);
                          setPlatform(item.platform);
                        }}
                        className="text-left bg-[#0a0a0c]/60 border border-zinc-800/80 p-3 rounded-lg hover:border-teal-500/50 hover:bg-teal-500/5 transition-all group"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-teal-400/80">{item.platform}</span>
                          <span className="text-[10px] text-zinc-600">{new Date(item.date).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-sm text-zinc-300 truncate font-medium">
                          {item.result.variations?.hookShort?.hook || 'Forged Caption...'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Dynamic Bento Grid */}
          <div className="relative min-h-[600px] flex flex-col">
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div
                  key="empty-bento"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, staggerChildren: 0.1 }}
                  className="absolute inset-0 grid grid-cols-2 grid-rows-3 gap-4"
                >
                  {/* Bento Box 1: Main Status */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="col-span-2 row-span-2 uiverse-holo-card flex flex-col items-center justify-center border border-teal-500/10 p-8"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-[#0a0a0c]/80 border border-zinc-800 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,168,150,0.2)]">
                      <Sparkles className="w-8 h-8 text-teal-400 animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">Awaiting Uplink</h3>
                    <p className="text-zinc-500 text-center text-sm max-w-[280px] leading-relaxed">
                      Configure your parameters and initiate the forge sequence to generate multi-modal copy.
                    </p>
                  </motion.div>

                  {/* Bento Box 2: Speed */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                    className="col-span-1 row-span-1 uiverse-holo-card flex flex-col justify-center border border-teal-500/10 p-6 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Wand2 size={40} /></div>
                    <h4 className="text-teal-400 font-bold text-sm mb-1 uppercase tracking-wider">Lightning Fast</h4>
                    <p className="text-zinc-400 text-xs">Powered by Gemini 2.5 Flash streaming.</p>
                  </motion.div>

                  {/* Bento Box 3: Multi-Modal */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                    className="col-span-1 row-span-1 uiverse-holo-card flex flex-col justify-center border border-teal-500/10 p-6 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Eye size={40} /></div>
                    <h4 className="text-teal-400 font-bold text-sm mb-1 uppercase tracking-wider">Vision Engine</h4>
                    <p className="text-zinc-400 text-xs">Native video and image context analysis.</p>
                  </motion.div>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, filter: 'blur(10px)' }}
                  className="absolute inset-0 flex flex-col items-center justify-center uiverse-holo-card border border-teal-500/30 shadow-[0_0_50px_rgba(0,168,150,0.1)]"
                >
                  <div className="relative w-24 h-24 mb-8">
                    <div className="uiverse-atom-loader" />
                    <div className="uiverse-atom-core" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 tracking-widest uppercase">Processing via Gemini</h3>
                  <p className="text-teal-400 text-sm animate-pulse tracking-wide font-medium">Extracting multi-modal intelligence...</p>
                </motion.div>
              )}

              {result && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.15 }}
                  className="flex flex-col gap-4 relative z-20 h-full"
                >
                  <div className="flex items-center gap-4 mb-1 px-2">
                    <div className="h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent flex-grow opacity-50" />
                    <span className="text-xs font-bold uppercase tracking-widest text-teal-400 drop-shadow-[0_0_5px_rgba(45,212,191,0.8)]">Output Generated</span>
                    <div className="h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent flex-grow opacity-50" />
                  </div>

                  <div className="flex justify-end gap-2 px-2 mb-1">
                    <button onClick={handleCopyAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a0a0c]/80 border border-zinc-800 hover:border-teal-500/50 text-xs font-semibold text-zinc-300 hover:text-teal-400 transition-colors">
                      <Copy size={14} /> Copy All
                    </button>
                    <button onClick={handleDownloadTxt} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a0a0c]/80 border border-zinc-800 hover:border-teal-500/50 text-xs font-semibold text-zinc-300 hover:text-teal-400 transition-colors">
                      <Download size={14} /> Export .TXT
                    </button>
                  </div>
                  
                  {/* Results Bento Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                      className="md:col-span-2 h-full"
                    >
                      <CaptionCard index={1} title="The Hook" variation={result.variations?.hookShort} platform={platform} />
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                      className="md:col-span-2 h-full"
                    >
                      <StrategyCard strategy={result.platformStrategy as any} />
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                      className="md:col-span-1 h-full"
                    >
                      <CaptionCard index={2} title="Story Context" variation={result.variations?.storyContext} platform={platform} />
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                      className="md:col-span-1 h-full"
                    >
                      <CaptionCard index={3} title="Engagement Drive" variation={result.variations?.engagementQuestion} platform={platform} />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
    </div>
  );
}
