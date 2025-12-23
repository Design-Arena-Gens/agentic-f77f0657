'use client';

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  FileText, 
  CheckSquare, 
  Settings,
  User,
  Shield,
  Info
} from 'lucide-react';
import type { Task } from '@/lib/ai-engine';
import TaskList from './TaskList';
import FileManager from './FileManager';

interface CreatedFile {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'txt';
  content: string;
  createdAt: Date;
}

interface SidebarProps {
  tasks: Task[];
  files: CreatedFile[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteFile: (fileId: string) => void;
  onDownloadFile: (file: CreatedFile) => void;
  onSendFile: (file: CreatedFile, contact: string) => void;
}

type Tab = 'chat' | 'files' | 'tasks' | 'settings';

export default function Sidebar({
  tasks,
  files,
  onToggleTask,
  onDeleteTask,
  onDeleteFile,
  onDownloadFile,
  onSendFile,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  
  const tabs = [
    { id: 'chat' as Tab, icon: MessageSquare, label: 'Chat' },
    { id: 'files' as Tab, icon: FileText, label: 'Files' },
    { id: 'tasks' as Tab, icon: CheckSquare, label: 'Tasks' },
    { id: 'settings' as Tab, icon: Settings, label: 'Info' },
  ];
  
  return (
    <div
      className={`
        fixed top-0 right-0 h-full
        bg-dark-200 border-l border-slate-700
        transition-all duration-300 ease-in-out
        flex flex-col
        ${isOpen ? 'w-80' : 'w-16'}
      `}
    >
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-dark-100 border border-slate-700 rounded-l-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
      
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        {isOpen ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Somil&apos;s Agent</h2>
              <p className="text-xs text-slate-400">Private AI Assistant</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        )}
      </div>
      
      {/* Tabs */}
      <div className={`flex ${isOpen ? 'flex-row justify-around' : 'flex-col items-center gap-2'} p-2 border-b border-slate-700`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                p-2 rounded-lg transition-all duration-200
                flex items-center gap-2
                ${activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }
              `}
              title={tab.label}
            >
              <Icon className="w-5 h-5" />
              {isOpen && <span className="text-sm">{tab.label}</span>}
            </button>
          );
        })}
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {!isOpen ? (
          <div className="flex flex-col items-center gap-4 text-slate-500">
            <MessageSquare className="w-6 h-6" />
          </div>
        ) : activeTab === 'chat' ? (
          <div className="text-slate-400">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary-400" />
              <span className="font-medium text-white">Privacy Mode</span>
            </div>
            <p className="text-sm mb-4">
              All conversations are private and processed locally. No data is shared externally.
            </p>
            <div className="bg-dark-100 rounded-xl p-4 border border-slate-700">
              <p className="text-xs text-slate-500 mb-2">Quick Commands:</p>
              <ul className="space-y-2 text-sm">
                <li>&quot;What can you do?&quot;</li>
                <li>&quot;Create a document&quot;</li>
                <li>&quot;Remind me to...&quot;</li>
                <li>&quot;What&apos;s the time?&quot;</li>
                <li>&quot;Explain [topic]&quot;</li>
              </ul>
            </div>
          </div>
        ) : activeTab === 'files' ? (
          <FileManager
            files={files}
            onDelete={onDeleteFile}
            onDownload={onDownloadFile}
            onSend={onSendFile}
          />
        ) : activeTab === 'tasks' ? (
          <TaskList
            tasks={tasks}
            onToggle={onToggleTask}
            onDelete={onDeleteTask}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-primary-400" />
              <span className="font-medium text-white">Agent Information</span>
            </div>
            
            <div className="bg-dark-100 rounded-xl p-4 border border-slate-700 space-y-3">
              <div>
                <p className="text-xs text-slate-500">Agent Name</p>
                <p className="text-white">Somil&apos;s Personal AI Agent</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Creator</p>
                <p className="text-white">Somil</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Owner</p>
                <p className="text-white">Somil</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Privacy</p>
                <p className="text-green-400">100% Private & Secure</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Voice Control</p>
                <p className="text-primary-400">Active</p>
              </div>
            </div>
            
            <div className="bg-dark-100 rounded-xl p-4 border border-slate-700">
              <p className="text-xs text-slate-500 mb-2">Ownership Statement</p>
              <p className="text-sm text-slate-300">
                This is a private agent owned by Somil. It was fully designed and created by Somil for personal use. 
                This agent follows only Somil&apos;s commands and does not share data externally.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
