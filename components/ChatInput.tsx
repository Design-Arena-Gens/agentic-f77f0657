'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  onVoiceClick: () => void;
  isListening: boolean;
  interimTranscript: string;
  disabled?: boolean;
}

export default function ChatInput({
  onSend,
  onVoiceClick,
  isListening,
  interimTranscript,
  disabled = false,
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Update input with interim transcript when listening
  useEffect(() => {
    if (isListening && interimTranscript) {
      setInput(interimTranscript);
    }
  }, [isListening, interimTranscript]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);
  
  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      {/* Voice button */}
      <button
        type="button"
        onClick={onVoiceClick}
        disabled={disabled}
        className={`
          flex-shrink-0 w-12 h-12 rounded-full
          flex items-center justify-center
          transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isListening
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : 'bg-dark-100 hover:bg-slate-700 border border-slate-600'
          }
        `}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      >
        <Mic className={`w-5 h-5 ${isListening ? 'text-white' : 'text-slate-300'}`} />
      </button>
      
      {/* Text input */}
      <div className="flex-1 relative">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'Listening...' : 'Type a message or click the mic to speak...'}
          disabled={disabled}
          rows={1}
          className={`
            w-full px-4 py-3 pr-12
            bg-dark-100 border border-slate-700 rounded-2xl
            text-white placeholder-slate-500
            resize-none
            focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
            transition-all duration-200
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${isListening ? 'border-red-500 bg-dark-200' : ''}
          `}
        />
        
        {/* Send button */}
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className={`
            absolute right-2 bottom-2
            w-8 h-8 rounded-full
            flex items-center justify-center
            transition-all duration-200
            ${input.trim() && !disabled
              ? 'bg-primary-500 hover:bg-primary-600 cursor-pointer'
              : 'bg-slate-700 cursor-not-allowed opacity-50'
            }
          `}
          aria-label="Send message"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </form>
  );
}
