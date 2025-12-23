'use client';

import React from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceButtonProps {
  isListening: boolean;
  isSpeaking: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function VoiceButton({
  isListening,
  isSpeaking,
  onClick,
  disabled = false,
}: VoiceButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-20 h-20 rounded-full
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
        ${isListening 
          ? 'bg-gradient-to-br from-red-500 to-red-600 glow' 
          : isSpeaking
            ? 'bg-gradient-to-br from-green-500 to-green-600'
            : 'bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500'
        }
      `}
      aria-label={isListening ? 'Stop listening' : 'Start voice input'}
    >
      {/* Animated rings when listening */}
      {isListening && (
        <>
          <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20" />
          <span className="absolute inset-[-8px] rounded-full border-2 border-red-400 animate-pulse opacity-50" />
          <span className="absolute inset-[-16px] rounded-full border border-red-300 animate-pulse opacity-30" />
        </>
      )}
      
      {/* Speaking animation */}
      {isSpeaking && (
        <>
          <span className="absolute inset-0 rounded-full bg-green-500 animate-pulse opacity-30" />
        </>
      )}
      
      {/* Icon */}
      <div className="relative z-10">
        {isSpeaking ? (
          <Volume2 className="w-8 h-8 text-white" />
        ) : isListening ? (
          <MicOff className="w-8 h-8 text-white" />
        ) : (
          <Mic className="w-8 h-8 text-white" />
        )}
      </div>
    </button>
  );
}
