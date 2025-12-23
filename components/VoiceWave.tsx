'use client';

import React from 'react';

interface VoiceWaveProps {
  isActive: boolean;
  color?: 'blue' | 'red' | 'green';
}

export default function VoiceWave({ isActive, color = 'blue' }: VoiceWaveProps) {
  const colors = {
    blue: 'from-primary-400 to-primary-600',
    red: 'from-red-400 to-red-600',
    green: 'from-green-400 to-green-600',
  };
  
  if (!isActive) return null;
  
  return (
    <div className="voice-wave h-10 flex items-center justify-center gap-1">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`
            w-1 rounded-full bg-gradient-to-t ${colors[color]}
          `}
          style={{
            animation: `wave 1s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`,
            height: '100%',
          }}
        />
      ))}
    </div>
  );
}
