'use client';

import React, { useState } from 'react';
import { FileText, Download, Trash2, File, Send, X, Check } from 'lucide-react';

interface CreatedFile {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'txt';
  content: string;
  createdAt: Date;
}

interface FileManagerProps {
  files: CreatedFile[];
  onDelete: (fileId: string) => void;
  onDownload: (file: CreatedFile) => void;
  onSend: (file: CreatedFile, contact: string) => void;
}

export default function FileManager({
  files,
  onDelete,
  onDownload,
  onSend,
}: FileManagerProps) {
  const [sendingFile, setSendingFile] = useState<CreatedFile | null>(null);
  const [contactName, setContactName] = useState('');
  
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-400" />;
      case 'doc':
        return <File className="w-5 h-5 text-blue-400" />;
      default:
        return <File className="w-5 h-5 text-slate-400" />;
    }
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const handleSendConfirm = () => {
    if (sendingFile && contactName.trim()) {
      onSend(sendingFile, contactName.trim());
      setSendingFile(null);
      setContactName('');
    }
  };
  
  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No files created yet</p>
        <p className="text-sm">Say "create a document" to get started</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {/* Send confirmation modal */}
      {sendingFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-100 rounded-2xl p-6 max-w-md w-full border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Send File</h3>
              <button
                onClick={() => setSendingFile(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-dark-200 rounded-xl flex items-center gap-3">
              {getFileIcon(sendingFile.type)}
              <span className="text-white">{sendingFile.name}</span>
            </div>
            
            <label className="block mb-2 text-sm text-slate-400">
              Send to (WhatsApp contact name):
            </label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Enter contact name..."
              className="w-full px-4 py-3 bg-dark-200 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 mb-4"
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => setSendingFile(null)}
                className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendConfirm}
                disabled={!contactName.trim()}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Confirm Send
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* File list */}
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center gap-3 p-3 rounded-xl bg-dark-100 border border-slate-700 transition-all duration-200 hover:border-slate-600"
        >
          {/* File icon */}
          {getFileIcon(file.type)}
          
          {/* File info */}
          <div className="flex-1 min-w-0">
            <p className="text-white truncate">{file.name}</p>
            <p className="text-xs text-slate-500">{formatDate(file.createdAt)}</p>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDownload(file)}
              className="p-2 text-slate-400 hover:text-primary-400 transition-colors"
              aria-label="Download file"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSendingFile(file)}
              className="p-2 text-slate-400 hover:text-green-400 transition-colors"
              aria-label="Send file"
              title="Send via WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(file.id)}
              className="p-2 text-slate-400 hover:text-red-400 transition-colors"
              aria-label="Delete file"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
