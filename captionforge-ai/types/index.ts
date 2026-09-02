export type Platform = 'Instagram Reels' | 'TikTok' | 'LinkedIn Authority' | 'X (Twitter) Threads' | 'YouTube Shorts';

export type Tone = 'Witty & Sarcastic' | 'Minimalist & Stoic' | 'Tech Hustle / Obsidian Dark' | 'Gen-Z Viral / Unhinged' | 'High-Converting Sales';

export interface CaptionVariation {
  hook: string;
  story: string;
  engagement: string;
  hashtags: string[];
  callToAction: string;
}

export interface CaptionResponse {
  variations: {
    hookShort: CaptionVariation;
    storyContext: CaptionVariation;
    engagementQuestion: CaptionVariation;
  };
}
