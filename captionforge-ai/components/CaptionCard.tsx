'use client';
import { Copy, Hash, ChevronRight } from 'lucide-react';
import { CaptionVariation, Platform } from '@/types';
import { toast } from 'sonner';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CaptionCardProps {
  title: string;
  variation: CaptionVariation;
  platform: Platform;
  index: number;
}

export default function CaptionCard({ title, variation, platform, index }: CaptionCardProps) {
  const getFullText = () => {
    return `${variation?.hook || ''}\n\n${variation?.story || ''}\n\n${variation?.callToAction || ''}\n\n${(variation?.hashtags || []).map(h => h.startsWith('#') ? h : `#${h}`).join(' ')}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFullText());
    toast.success('Copied to clipboard', {
      description: 'Ready to paste into your social media manager.',
    });
  };

  const textLength = getFullText().length;
  const isX = platform === 'X (Twitter) Threads';
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative group overflow-hidden rounded-2xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl transition-all duration-300 hover:bg-zinc-900/60 hover:border-zinc-700/50 h-full flex flex-col"
    >
      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
           style={{ background: 'radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(45,212,191,0.15), transparent 40%)' }} />
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
      
      <div className="p-6 relative z-10 flex flex-col h-full flex-grow">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 text-sm font-semibold">
              0{index}
            </span>
            <div>
              <h3 className="text-base font-medium text-zinc-100">{title}</h3>
              <p className={cn("text-xs mt-1", isWarning ? "text-rose-400" : "text-zinc-500")}>
                {textLength} chars {isX && textLength > 280 ? '(Thread required)' : ''}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleCopy}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-800/50 text-zinc-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all duration-200"
            aria-label="Copy caption"
          >
            <Copy size={16} />
          </button>
        </div>

        <div className="space-y-4 flex-grow text-[15px] leading-relaxed">
          <p className="font-medium text-zinc-200">{variation?.hook || <span className="animate-pulse text-zinc-600">Generating hook...</span>}</p>
          <p className="text-zinc-400 whitespace-pre-wrap">{variation?.story || ''}</p>
          {variation?.callToAction && (
            <p className="font-medium text-teal-300 flex items-center gap-2">
              <ChevronRight size={16} className="text-teal-500" />
              {variation.callToAction}
            </p>
          )}
        </div>

        <div className="pt-5 mt-5 border-t border-zinc-800/50 flex flex-wrap gap-2 min-h-[40px]">
          {(variation?.hashtags || []).map((tag, i) => (
            <span 
              key={i} 
              className="px-2.5 py-1 rounded-lg bg-black/20 border border-zinc-800/80 text-xs font-medium text-zinc-500 flex items-center gap-1 hover:text-zinc-300 hover:border-zinc-700 transition-colors cursor-default"
            >
              <Hash size={12} className="text-teal-500/70" />
              {tag.replace('#', '')}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
