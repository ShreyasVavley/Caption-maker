'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
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
      setError('Please provide either an image/video or a text prompt.');
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
    <main className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
      <div className="w-full lg:w-1/2 flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-purple-400 mb-2 flex items-center gap-3">
            <Sparkles className="text-accent" /> CaptionForge AI
          </h1>
          <p className="text-gray-400 text-lg">Elite Multi-Modal Social Copy Generator</p>
        </div>

        <div className="glass-panel p-6 flex flex-col gap-6">
          <PlatformSelector 
            platform={platform} setPlatform={setPlatform}
            tone={tone} setTone={setTone}
          />
          
          <div className="w-full h-px bg-border-subtle" />

          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Context / Prompt (Optional)</h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What is this post about? (e.g., Launching a new SaaS product...)"
              className="w-full bg-surface border border-border-subtle rounded-xl p-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-accent transition-colors resize-none h-28"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Media (Optional)</h3>
            <DropZone onFileSelect={setFile} />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-accent text-white font-bold text-lg hover:bg-indigo-400 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <><Loader2 className="animate-spin" /> Forging...</> : 'Generate Copy'}
          </button>
        </div>
      </div>

      <div className="w-full lg:w-1/2">
        <AnimatePresence mode="wait">
          {!result && !loading ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="w-full h-full min-h-[500px] flex items-center justify-center border border-dashed border-border-subtle rounded-3xl bg-surface/10"
            >
              <p className="text-gray-500 text-center px-8">
                Your generated captions will appear here.<br/>Drop some media and hit generate.
              </p>
            </motion.div>
          ) : loading ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="w-full h-full min-h-[500px] flex flex-col items-center justify-center gap-4 border border-border-subtle rounded-3xl bg-surface/30 glass-panel"
            >
              <Loader2 size={48} className="text-accent animate-spin" />
              <p className="text-gray-300 font-medium animate-pulse">Analyzing media & crafting copy...</p>
            </motion.div>
          ) : result ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-6"
            >
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Sparkles size={24} className="text-accent" /> Results
              </h2>
              <CaptionCard title="Hook & Short" variation={result.variations.hookShort} platform={platform} />
              <CaptionCard title="Story & Context" variation={result.variations.storyContext} platform={platform} />
              <CaptionCard title="Engagement & Question" variation={result.variations.engagementQuestion} platform={platform} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </main>
  );
}
