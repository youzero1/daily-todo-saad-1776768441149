'use client';

import { useState, useEffect } from 'react';
import TodoInput from '@/components/TodoInput';
import TodoList from '@/components/TodoList';
import DateHeader from '@/components/DateHeader';
import StatsBar from '@/components/StatsBar';
import FilterTabs from '@/components/FilterTabs';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  date: string;
}

export type FilterType = 'all' | 'active' | 'completed';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [mounted, setMounted] = useState(false);

  const todayKey = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('daily-todos');
    if (stored) {
      try {
        const parsed: Todo[] = JSON.parse(stored);
        setTodos(parsed);
      } catch {
        setTodos([]);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('daily-todos', JSON.stringify(todos));
    }
  }, [todos, mounted]);

  const addTodo = (text: string, priority: 'low' | 'medium' | 'high') => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
      date: todayKey,
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const editTodo = (id: string, text: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text } : t))
    );
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  const todayTodos = todos.filter((t) => t.date === todayKey);
  const filteredTodos = todayTodos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completedCount = todayTodos.filter((t) => t.completed).length;
  const totalCount = todayTodos.length;

  if (!mounted) return null;

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Daily Tasks</h1>
          <p className="text-gray-500 text-sm">Stay organized, stay productive</p>
        </div>

        {/* Date Header */}
        <DateHeader />

        {/* Stats */}
        <StatsBar completed={completedCount} total={totalCount} />

        {/* Input */}
        <TodoInput onAdd={addTodo} />

        {/* Filter Tabs */}
        <FilterTabs filter={filter} setFilter={setFilter} counts={{
          all: todayTodos.length,
          active: todayTodos.filter((t) => !t.completed).length,
          completed: completedCount,
        }} />

        {/* List */}
        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
        />

        {/* Clear Completed */}
        {completedCount > 0 && (
          <div className="mt-4 text-center">
            <button
              onClick={clearCompleted}
              className="text-sm text-red-400 hover:text-red-600 transition-colors duration-200 underline underline-offset-2"
            >
              Clear {completedCount} completed task{completedCount !== 1 ? 's' : ''}
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredTodos.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">
              {filter === 'completed' ? '🎉' : filter === 'active' ? '✅' : '📝'}
            </div>
            <p className="text-gray-400 font-medium">
              {filter === 'completed'
                ? 'No completed tasks yet'
                : filter === 'active'
                ? 'All tasks completed!'
                : 'Add your first task for today'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
