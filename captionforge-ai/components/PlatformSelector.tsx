'use client';
import { Platform, Tone } from '@/types';
import { Camera, UserRound, Hash, Tv, Video, Zap, Briefcase, Flame, TrendingUp } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PlatformSelectorProps {
  platform: Platform;
  setPlatform: (p: Platform) => void;
  tone: Tone;
  setTone: (t: Tone) => void;
}

const PLATFORMS: { name: Platform; icon: React.ElementType }[] = [
  { name: 'Instagram Reels', icon: Camera },
  { name: 'TikTok', icon: Video },
  { name: 'LinkedIn Authority', icon: UserRound },
  { name: 'X (Twitter) Threads', icon: Hash },
  { name: 'YouTube Shorts', icon: Tv }
];

const TONES: { name: Tone; icon: React.ElementType }[] = [
  { name: 'Witty & Sarcastic', icon: Zap },
  { name: 'Minimalist & Stoic', icon: Briefcase },
  { name: 'Tech Hustle / Obsidian Dark', icon: TrendingUp },
  { name: 'Gen-Z Viral / Unhinged', icon: Flame },
  { name: 'High-Converting Sales', icon: TrendingUp }
];

export default function PlatformSelector({ platform, setPlatform, tone, setTone }: PlatformSelectorProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">Platform</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PLATFORMS.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => setPlatform(name)}
              className={cn(
                "flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border",
                platform === name
                  ? "bg-teal-500/10 border-teal-500/50 text-teal-400 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                  : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              )}
            >
              <Icon size={18} className={platform === name ? "text-teal-400" : "text-zinc-500"} />
              <span className="truncate">{name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">Tone of Voice</h3>
        <div className="flex flex-wrap gap-2.5">
          {TONES.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => setTone(name)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border",
                tone === name
                  ? "bg-zinc-100 border-zinc-100 text-zinc-900 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              )}
            >
              <Icon size={16} className={tone === name ? "text-zinc-900" : "text-zinc-500"} />
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
