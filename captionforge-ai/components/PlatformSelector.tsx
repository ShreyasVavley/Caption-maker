'use client';
import { Platform, Tone } from '@/types';

interface PlatformSelectorProps {
  platform: Platform;
  setPlatform: (p: Platform) => void;
  tone: Tone;
  setTone: (t: Tone) => void;
}

const PLATFORMS: Platform[] = [
  'Instagram Reels', 'TikTok', 'LinkedIn Authority', 'X (Twitter) Threads', 'YouTube Shorts'
];

const TONES: Tone[] = [
  'Witty & Sarcastic', 'Minimalist & Stoic', 'Tech Hustle / Obsidian Dark', 'Gen-Z Viral / Unhinged', 'High-Converting Sales'
];

export default function PlatformSelector({ platform, setPlatform, tone, setTone }: PlatformSelectorProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Target Platform</h3>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                platform === p 
                  ? 'bg-accent text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] border-transparent' 
                  : 'glass-panel text-gray-300 hover:text-white hover:border-gray-500'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Brand Tone</h3>
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                tone === t 
                  ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)] border-transparent' 
                  : 'glass-panel text-gray-300 hover:text-white hover:border-gray-500'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
