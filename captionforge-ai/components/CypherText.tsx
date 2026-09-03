'use client';
import { useState, useEffect } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>';

export default function CypherText({ text, speed = 30, className = '' }: { text: string; speed?: number; className?: string }) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (!text) {
      setDisplayText('');
      return;
    }

    let iteration = 0;
    let interval: NodeJS.Timeout;

    interval = setInterval(() => {
      setDisplayText(() => {
        return text.split('').map((char, index) => {
          if (index < iteration) {
            return text[index];
          }
          if (char === ' ' || char === '\n') return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join('');
      });

      iteration += 1 / 2; // Scramble two ticks per character

      if (iteration >= text.length) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span className={className}>{displayText}</span>;
}
