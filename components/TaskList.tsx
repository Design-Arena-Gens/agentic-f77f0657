'use client';

import React from 'react';
import { CheckCircle, Circle, Clock, Trash2 } from 'lucide-react';
import type { Task } from '@/lib/ai-engine';

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No tasks yet</p>
        <p className="text-sm">Say "remind me to..." to add a task</p>
      </div>
    );
  }
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`
            flex items-center gap-3 p-3 rounded-xl
            bg-dark-100 border border-slate-700
            transition-all duration-200
            ${task.status === 'completed' ? 'opacity-60' : ''}
          `}
        >
          {/* Toggle button */}
          <button
            onClick={() => onToggle(task.id)}
            className="flex-shrink-0 text-primary-400 hover:text-primary-300 transition-colors"
            aria-label={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
          >
            {task.status === 'completed' ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>
          
          {/* Task content */}
          <div className="flex-1 min-w-0">
            <p
              className={`
                text-white truncate
                ${task.status === 'completed' ? 'line-through text-slate-400' : ''}
              `}
            >
              {task.title}
            </p>
            {task.description && (
              <p className="text-sm text-slate-500 truncate">{task.description}</p>
            )}
          </div>
          
          {/* Date */}
          <span className="flex-shrink-0 text-xs text-slate-500">
            {formatDate(task.createdAt)}
          </span>
          
          {/* Delete button */}
          <button
            onClick={() => onDelete(task.id)}
            className="flex-shrink-0 text-slate-500 hover:text-red-400 transition-colors"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
