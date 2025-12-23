'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  generateResponse, 
  getStartupMessage, 
  generateId,
  type Message,
  type Task,
} from '@/lib/ai-engine';
import {
  createSpeechRecognition,
  isSpeechRecognitionSupported,
  speak,
  stopSpeaking,
  type SpeechRecognitionResult,
} from '@/lib/speech';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MessageBubble from '@/components/MessageBubble';
import ChatInput from '@/components/ChatInput';
import VoiceButton from '@/components/VoiceButton';
import VoiceWave from '@/components/VoiceWave';
import TypingIndicator from '@/components/TypingIndicator';

interface CreatedFile {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'txt';
  content: string;
  createdAt: Date;
}

export default function Home() {
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [files, setFiles] = useState<CreatedFile[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: string;
    metadata?: Record<string, unknown>;
  } | null>(null);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  
  // Check voice support on mount
  useEffect(() => {
    setVoiceSupported(isSpeechRecognitionSupported());
  }, []);
  
  // Add startup message
  useEffect(() => {
    const startupMessage: Message = {
      id: generateId(),
      role: 'agent',
      content: getStartupMessage(),
      timestamp: new Date(),
    };
    setMessages([startupMessage]);
    
    // Speak welcome message after a short delay
    const timer = setTimeout(() => {
      speakText("Welcome. Your personal AI agent, created by you, is ready. How can I assist you today?");
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  // Speak text
  const speakText = useCallback((text: string) => {
    setIsSpeaking(true);
    speak(
      text,
      { rate: 1, pitch: 1, volume: 1, language: 'en-US' },
      () => setIsSpeaking(false)
    );
  }, []);
  
  // Handle voice recognition result
  const handleSpeechResult = useCallback((result: SpeechRecognitionResult) => {
    if (result.isFinal) {
      setInterimTranscript('');
      if (result.transcript.trim()) {
        processUserMessage(result.transcript.trim());
      }
    } else {
      setInterimTranscript(result.transcript);
    }
  }, []);
  
  // Handle speech recognition error
  const handleSpeechError = useCallback((error: string) => {
    console.error('Speech recognition error:', error);
    setIsListening(false);
    setInterimTranscript('');
    
    // Add error message
    const errorMessage: Message = {
      id: generateId(),
      role: 'agent',
      content: `I had trouble hearing you. ${error} Please try again or type your message.`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, errorMessage]);
  }, []);
  
  // Handle speech recognition end
  const handleSpeechEnd = useCallback(() => {
    setIsListening(false);
    setInterimTranscript('');
  }, []);
  
  // Start/stop voice recognition
  const toggleVoiceRecognition = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    
    // Stop speaking if currently speaking
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    }
    
    const recognition = createSpeechRecognition(
      handleSpeechResult,
      handleSpeechError,
      handleSpeechEnd,
      'en-US'
    );
    
    if (recognition) {
      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    }
  }, [isListening, isSpeaking, handleSpeechResult, handleSpeechError, handleSpeechEnd]);
  
  // Process user message
  const processUserMessage = useCallback((content: string) => {
    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Check if this is a response to a pending action
    if (pendingAction) {
      handlePendingAction(content, pendingAction);
      return;
    }
    
    // Generate response after a short delay (simulate thinking)
    setTimeout(() => {
      const { response, action, metadata } = generateResponse(
        content,
        messages,
        { name: 'Somil', speakingStyle: [], topics: [], language: 'en' }
      );
      
      // Add agent response
      const agentMessage: Message = {
        id: generateId(),
        role: 'agent',
        content: response,
        timestamp: new Date(),
        type: action === 'create_file' ? 'file' : action === 'create_task' ? 'task' : 'text',
        metadata,
      };
      
      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
      
      // Set pending action if needed
      if (action && ['create_file', 'create_task'].includes(action)) {
        setPendingAction({ type: action, metadata });
      }
      
      // Speak response (shortened version)
      const shortResponse = response.split('\n')[0].replace(/\*\*/g, '');
      speakText(shortResponse);
    }, 800 + Math.random() * 400);
  }, [messages, pendingAction, speakText]);
  
  // Handle pending action (file creation, task creation, etc.)
  const handlePendingAction = useCallback((content: string, action: { type: string; metadata?: Record<string, unknown> }) => {
    setTimeout(() => {
      let response = '';
      let messageType: 'text' | 'file' | 'task' = 'text';
      
      if (action.type === 'create_file') {
        // Create the file
        const fileType = (action.metadata?.fileType as 'pdf' | 'doc' | 'txt') || 'txt';
        const fileName = `document_${Date.now()}.${fileType}`;
        
        const newFile: CreatedFile = {
          id: generateId(),
          name: fileName,
          type: fileType,
          content: content,
          createdAt: new Date(),
        };
        
        setFiles(prev => [...prev, newFile]);
        response = `I've created your ${fileType.toUpperCase()} file "${fileName}" with your content. You can find it in the Files section. Would you like me to send it to someone or create another file?`;
        messageType = 'file';
      } else if (action.type === 'create_task') {
        // Create the task
        const newTask: Task = {
          id: generateId(),
          title: content,
          status: 'pending',
          createdAt: new Date(),
        };
        
        setTasks(prev => [...prev, newTask]);
        response = `I've added "${content}" to your tasks. You can view and manage your tasks in the Tasks section. Is there anything else you'd like me to help with?`;
        messageType = 'task';
      }
      
      const agentMessage: Message = {
        id: generateId(),
        role: 'agent',
        content: response,
        timestamp: new Date(),
        type: messageType,
      };
      
      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
      setPendingAction(null);
      
      speakText(response.split('.')[0]);
    }, 600);
  }, [speakText]);
  
  // Handle send message
  const handleSendMessage = useCallback((content: string) => {
    processUserMessage(content);
  }, [processUserMessage]);
  
  // Task management
  const handleToggleTask = useCallback((taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ));
  }, []);
  
  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);
  
  // File management
  const handleDeleteFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  }, []);
  
  const handleDownloadFile = useCallback((file: CreatedFile) => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Confirm download
    const confirmMessage: Message = {
      id: generateId(),
      role: 'agent',
      content: `File "${file.name}" has been downloaded successfully.`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, confirmMessage]);
    speakText(`File ${file.name} has been downloaded.`);
  }, [speakText]);
  
  const handleSendFile = useCallback((file: CreatedFile, contact: string) => {
    // Simulate sending file
    const sendMessage: Message = {
      id: generateId(),
      role: 'agent',
      content: `Task completed successfully.\n\nI've prepared the file "${file.name}" to be sent to ${contact} via WhatsApp. Since this is a web application, please use the downloaded file to share manually through WhatsApp.\n\nFile: ${file.name}\nRecipient: ${contact}\nStatus: Ready to share`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, sendMessage]);
    
    // Auto-download the file
    handleDownloadFile(file);
    
    speakText(`Task completed. File ${file.name} is ready to send to ${contact}.`);
  }, [handleDownloadFile, speakText]);
  
  return (
    <div className="min-h-screen bg-dark-300">
      {/* Header */}
      <Header isListening={isListening} isSpeaking={isSpeaking} />
      
      {/* Sidebar */}
      <Sidebar
        tasks={tasks}
        files={files}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
        onDeleteFile={handleDeleteFile}
        onDownloadFile={handleDownloadFile}
        onSendFile={handleSendFile}
      />
      
      {/* Main content */}
      <main className="md:mr-80 pt-20 pb-40 min-h-screen">
        <div className="max-w-4xl mx-auto px-4">
          {/* Messages */}
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {/* Typing indicator */}
            {isTyping && <TypingIndicator />}
            
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>
      
      {/* Voice control area */}
      <div className="fixed bottom-0 left-0 right-0 md:right-80 bg-gradient-to-t from-dark-300 via-dark-300 to-transparent pt-8 pb-6">
        <div className="max-w-4xl mx-auto px-4">
          {/* Voice wave visualization */}
          {isListening && (
            <div className="flex justify-center mb-4">
              <div className="bg-dark-100/80 backdrop-blur-lg rounded-full px-6 py-3 border border-red-500/30">
                <div className="flex items-center gap-3">
                  <VoiceWave isActive={isListening} color="red" />
                  <span className="text-red-400 text-sm">
                    {interimTranscript || 'Listening...'}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Main voice button (centered) */}
          <div className="flex justify-center mb-4">
            <VoiceButton
              isListening={isListening}
              isSpeaking={isSpeaking}
              onClick={toggleVoiceRecognition}
              disabled={!voiceSupported}
            />
          </div>
          
          {/* Text input */}
          <ChatInput
            onSend={handleSendMessage}
            onVoiceClick={toggleVoiceRecognition}
            isListening={isListening}
            interimTranscript={interimTranscript}
            disabled={isTyping}
          />
          
          {/* Voice support warning */}
          {!voiceSupported && (
            <p className="text-center text-sm text-yellow-500 mt-2">
              Voice control is not supported in this browser. Please use Chrome, Edge, or Safari for full functionality.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
