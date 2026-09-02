# CaptionForge AI ✨

CaptionForge AI is an elite, multi-modal social media copy generation platform. Built for creators and agencies, it leverages **Gemini 2.5 Flash** to extract context from text, images, and videos, instantly engineering highly-converting captions tailored to specific platforms and brand tones.

![CaptionForge UI Showcase](https://img.shields.io/badge/UI-Ultimate_Glassmorphism-00A896?style=for-the-badge) ![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js) ![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-1B4D3E?style=for-the-badge&logo=google)

## 🚀 Features

- **Multi-Modal AI Engine**: Upload text context, high-res images (`.png`, `.jpg`), or heavy video files (`.mp4`, up to 50MB). The `@google/genai` SDK processes media securely using the Gemini Files API.
- **Platform & Tone Optimization**: 
  - *Platforms:* Instagram Reels, TikTok, LinkedIn Authority, X (Twitter) Threads, YouTube Shorts.
  - *Tones:* Witty & Sarcastic, Minimalist & Stoic, Tech Hustle, Gen-Z Viral, High-Converting Sales.
- **Triple-Variation Output**: Generates exactly 3 specialized variations via strict JSON schemas:
  1. The Hook (Punchy, <15 words)
  2. Story Context (Narrative driven)
  3. Engagement Drive (Debate & question focused)
- **Ultimate "Crazy" UI**: 
  - Dynamic **Sapphire Teal & Bottle Green** aesthetic.
  - Custom UIverse.io components including a floating ambient orb background, animated galaxy buttons, 3D atom loaders, and heavily frosted holographic glass cards.
- **Quality-of-Life Tooling**: 1-click clipboard copy with Sonner toast notifications, real-time X (Twitter) character limit warnings, and robust error handling.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router, Serverless Route Handlers)
- **Styling**: Tailwind CSS v4, Framer Motion, UIverse.io custom CSS
- **AI Integration**: `@google/genai` (Official SDK)
- **Icons**: Lucide React
- **Language**: TypeScript

## ⚙️ Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ShreyasVavley/Caption-maker.git
   cd captionforge-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

This project is fully optimized for **Vercel**:
1. Push your code to GitHub.
2. Import the repository into your Vercel dashboard.
3. Add the `GEMINI_API_KEY` to the Environment Variables section.
4. Deploy! Next.js serverless functions will automatically handle the multipart parsing and Node `fs` temp files required for Gemini video processing.

---
*Forged with precision. Engineered for engagement.*
