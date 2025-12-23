'use client';

import React from 'react';
import { Bot, Shield, Mic, MicOff } from 'lucide-react';

interface HeaderProps {
  isListening: boolean;
  isSpeaking: boolean;
}

export default function Header({ isListening, isSpeaking }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 md:right-80 z-40 bg-dark-200/80 backdrop-blur-xl border-b border-slate-700">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center glow">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white glow-text">Somil&apos;s Personal AI Agent</h1>
              <div className="flex items-center gap-2 text-xs">
                <Shield className="w-3 h-3 text-green-400" />
                <span className="text-green-400">Private & Secure</span>
              </div>
            </div>
          </div>
          
          {/* Status indicators */}
          <div className="flex items-center gap-3">
            {/* Voice status */}
            <div
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full text-sm
                ${isListening
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : isSpeaking
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                }
              `}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 animate-pulse" />
                  <span>Listening...</span>
                </>
              ) : isSpeaking ? (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Speaking...</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Ready</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
