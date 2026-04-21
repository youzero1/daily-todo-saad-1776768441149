'use client';

import { useState } from 'react';

type Priority = 'low' | 'medium' | 'high';

interface Todo {
  id: string;
  title: string;
  priority: Priority;
  completed: boolean;
  created_at: string;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
}

const priorityConfig = {
  low: {
    dot: 'bg-green-400',
    badge: 'bg-green-100 text-green-700',
    label: 'Low',
  },
  medium: {
    dot: 'bg-yellow-400',
    badge: 'bg-yellow-100 text-yellow-700',
    label: 'Med',
  },
  high: {
    dot: 'bg-red-400',
    badge: 'bg-red-100 text-red-700',
    label: 'High',
  },
};

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = editText.trim();
    if (!trimmed) return;
    onEdit(todo.id, trimmed);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditText(todo.title);
      setIsEditing(false);
    }
  };

  const config = priorityConfig[todo.priority] ?? priorityConfig['medium'];

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 ${
        todo.completed ? 'border-gray-100 opacity-60' : 'border-gray-100 hover:border-indigo-200 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(todo.id)}
          className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            todo.completed
              ? 'bg-indigo-500 border-indigo-500'
              : 'border-gray-300 hover:border-indigo-400'
          }`}
        >
          {todo.completed && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                value={editText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-full bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditText(todo.title);
                    setIsEditing(false);
                  }}
                  className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <p
                className={`text-sm font-medium break-words ${
                  todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
                }`}
              >
                {todo.title}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${config.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                  {config.label}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(todo.created_at).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {!isEditing && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-150"
              title="Edit task"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-150"
              title="Delete task"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
