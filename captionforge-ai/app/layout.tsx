import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CaptionForge AI',
  description: 'Production-ready multi-modal AI caption and social media copy generation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-obsidian text-gray-100" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
