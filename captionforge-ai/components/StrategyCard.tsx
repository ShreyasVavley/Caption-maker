'use client';
import { CalendarClock, Image as ImageIcon } from 'lucide-react';
import { PlatformStrategy } from '@/types';

interface StrategyCardProps {
  strategy: PlatformStrategy;
}

export default function StrategyCard({ strategy }: StrategyCardProps) {
  return (
    <div className="relative group overflow-hidden rounded-2xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl transition-all duration-300 hover:bg-zinc-900/60 hover:border-zinc-700/50 h-full flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="p-6 relative z-10 flex flex-col h-full flex-grow space-y-6">
        <div>
          <h3 className="text-base font-medium text-zinc-100 mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 text-teal-400">
              <CalendarClock size={16} />
            </span>
            Optimal Posting Times
          </h3>
          <div className="flex flex-wrap gap-2">
            {(strategy?.optimalPostingTimes || []).map((time, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-xs font-medium text-teal-400 shadow-sm">
                {time}
              </span>
            ))}
            {!strategy?.optimalPostingTimes && <span className="animate-pulse text-zinc-600 text-sm">Analyzing algorithms...</span>}
          </div>
        </div>

        <div className="flex-grow">
          <h3 className="text-base font-medium text-zinc-100 mb-3 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 text-emerald-400">
              <ImageIcon size={16} />
            </span>
            Thumbnail / Cover Idea
          </h3>
          <p className="text-[14px] leading-relaxed text-zinc-400">
            {strategy?.thumbnailIdea || <span className="animate-pulse text-zinc-600">Generating visual concept...</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
