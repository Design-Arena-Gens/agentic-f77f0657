'use client';

import React from 'react';
import { User, Bot, FileText, CheckCircle } from 'lucide-react';
import type { Message } from '@/lib/ai-engine';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isAgent = message.role === 'agent';
  
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const renderContent = () => {
    const content = message.content;
    
    // Parse markdown-like formatting
    const parts = content.split(/(\*\*[^*]+\*\*|\n|📰|📈|🌍|🎯|📌|•|1\.|2\.|3\.|4\.|5\.)/);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-primary-300">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part === '\n') {
        return <br key={index} />;
      }
      if (['📰', '📈', '🌍', '🎯', '📌'].includes(part)) {
        return <span key={index} className="mr-1">{part}</span>;
      }
      if (part === '•') {
        return <span key={index} className="text-primary-400 mr-2">•</span>;
      }
      if (/^\d\.$/.test(part)) {
        return <span key={index} className="text-primary-400 font-medium">{part} </span>;
      }
      return part;
    });
  };
  
  return (
    <div
      className={`
        message-animation flex gap-3 mb-4
        ${isAgent ? 'justify-start' : 'justify-end'}
      `}
    >
      {/* Agent avatar */}
      {isAgent && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      {/* Message content */}
      <div
        className={`
          max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3
          ${isAgent
            ? 'bg-dark-100 border border-slate-700'
            : 'bg-gradient-to-br from-primary-600 to-primary-700'
          }
        `}
      >
        {/* Message type indicator */}
        {message.type === 'file' && (
          <div className="flex items-center gap-2 mb-2 text-primary-300">
            <FileText className="w-4 h-4" />
            <span className="text-sm">File Created</span>
          </div>
        )}
        
        {message.type === 'task' && (
          <div className="flex items-center gap-2 mb-2 text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Task Added</span>
          </div>
        )}
        
        {/* Message text */}
        <div className="text-white leading-relaxed whitespace-pre-wrap">
          {renderContent()}
        </div>
        
        {/* Timestamp */}
        <div
          className={`
            text-xs mt-2
            ${isAgent ? 'text-slate-500' : 'text-primary-200'}
          `}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
      
      {/* User avatar */}
      {!isAgent && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
}
