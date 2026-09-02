'use client';
import { useState } from 'react';
import { Copy, Check, Hash } from 'lucide-react';
import { CaptionVariation, Platform } from '@/types';

interface CaptionCardProps {
  title: string;
  variation: CaptionVariation;
  platform: Platform;
}

export default function CaptionCard({ title, variation, platform }: CaptionCardProps) {
  const [copied, setCopied] = useState(false);

  const getFullText = () => {
    return `${variation.hook}\n\n${variation.story}\n\n${variation.callToAction}\n\n${variation.hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' ')}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFullText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const textLength = getFullText().length;
  const isX = platform === 'X (Twitter) Threads';
  const isWarning = isX && textLength > 280;

  return (
    <div className="glass-panel p-6 flex flex-col gap-4 relative group">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold text-accent">{title}</h3>
          <p className="text-xs text-gray-500 mt-1">
            <span className={isWarning ? 'text-red-400' : 'text-gray-400'}>
              {textLength} chars {isX ? '/ 280 limit (Thread required)' : ''}
            </span>
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg bg-surface/50 text-gray-300 hover:text-white hover:bg-surface border border-border-subtle transition-all"
          title="Copy full caption"
        >
          {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
        </button>
      </div>

      <div className="space-y-4 text-sm leading-relaxed">
        <p className="font-medium text-white">{variation.hook}</p>
        <p className="text-gray-300 whitespace-pre-wrap">{variation.story}</p>
        <p className="font-semibold text-accent/90">{variation.callToAction}</p>
      </div>

      <div className="pt-4 border-t border-border-subtle mt-2 flex flex-wrap gap-2">
        {variation.hashtags.map((tag, i) => (
          <span key={i} className="px-2 py-1 rounded-md bg-surface border border-border-subtle text-xs text-gray-400 flex items-center gap-1">
            <Hash size={10} className="text-accent" />
            {tag.replace('#', '')}
          </span>
        ))}
      </div>
    </div>
  );
}
