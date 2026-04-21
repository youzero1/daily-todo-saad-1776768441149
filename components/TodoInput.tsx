'use client';

import { useState } from 'react';

interface TodoInputProps {
  onAdd: (text: string, priority: 'low' | 'medium' | 'high') => void;
}

export default function TodoInput({ onAdd }: TodoInputProps) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed, priority);
    setText('');
  };

  const priorityConfig = {
    low: { label: 'Low', color: 'bg-green-100 text-green-700 border-green-300' },
    medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    high: { label: 'High', color: 'bg-red-100 text-red-700 border-red-300' },
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={text}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 flex items-center gap-1.5 whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 font-medium">Priority:</span>
        {(['low', 'medium', 'high'] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPriority(p)}
            className={`text-xs px-3 py-1 rounded-full border font-medium transition-all duration-150 ${
              priority === p
                ? priorityConfig[p].color + ' ring-2 ring-offset-1 ring-current'
                : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'
            }`}
          >
            {priorityConfig[p].label}
          </button>
        ))}
      </div>
    </form>
  );
}
