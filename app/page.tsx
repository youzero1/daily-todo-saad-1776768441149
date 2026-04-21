'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

type Priority = 'low' | 'medium' | 'high';
type Filter = 'all' | 'active' | 'completed';

interface Todo {
  id: string;
  title: string;
  priority: Priority;
  completed: boolean;
  created_at: string;
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// ── TodoInput ──────────────────────────────────────────────────────────────
function TodoInput({ onAdd }: { onAdd: (title: string, priority: Priority) => void }) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  const priorities: Record<Priority, { label: string; color: string }> = {
    low: { label: 'Low', color: 'bg-green-100 text-green-700 border-green-300' },
    medium: { label: 'Medium', color: 'bg-yellow-200 text-yellow-800 border-yellow-400' },
    high: { label: 'High', color: 'bg-red-100 text-red-700 border-red-300' },
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const trimmed = text.trim();
        if (trimmed) { onAdd(trimmed, priority); setText(''); }
      }}
      className="bg-white rounded-2xl shadow-sm border border-yellow-200 p-4 mb-4"
    >
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 disabled:text-yellow-400 text-yellow-900 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 flex items-center gap-1.5 whitespace-nowrap shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-yellow-600 font-medium">Priority:</span>
        {(['low', 'medium', 'high'] as Priority[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPriority(p)}
            className={`text-xs px-3 py-1 rounded-full border font-medium transition-all duration-150 ${
              priority === p
                ? priorities[p].color + ' ring-2 ring-offset-1 ring-current'
                : 'bg-yellow-50 text-yellow-500 border-yellow-200 hover:bg-yellow-100'
            }`}
          >
            {priorities[p].label}
          </button>
        ))}
      </div>
    </form>
  );
}

// ── TodoItem ───────────────────────────────────────────────────────────────
const priorityStyles: Record<Priority, { dot: string; badge: string; label: string }> = {
  low: { dot: 'bg-green-400', badge: 'bg-green-100 text-green-700', label: 'Low' },
  medium: { dot: 'bg-yellow-400', badge: 'bg-yellow-100 text-yellow-700', label: 'Med' },
  high: { dot: 'bg-red-400', badge: 'bg-red-100 text-red-700', label: 'High' },
};

function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const style = priorityStyles[todo.priority] ?? priorityStyles.medium;

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 ${
        todo.completed ? 'border-yellow-100 opacity-60' : 'border-yellow-100 hover:border-yellow-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        <button
          onClick={() => onToggle(todo.id)}
          className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            todo.completed ? 'bg-yellow-400 border-yellow-400' : 'border-yellow-300 hover:border-yellow-500'
          }`}
        >
          {todo.completed && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          {editing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const trimmed = editText.trim();
                if (trimmed) { onEdit(todo.id, trimmed); setEditing(false); }
              }}
            >
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Escape') { setEditText(todo.title); setEditing(false); } }}
                autoFocus
                className="w-full bg-yellow-50 border border-yellow-300 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <div className="flex gap-2 mt-2">
                <button type="submit" className="text-xs bg-yellow-400 text-yellow-900 px-3 py-1 rounded-lg hover:bg-yellow-500 transition-colors font-semibold">Save</button>
                <button type="button" onClick={() => { setEditText(todo.title); setEditing(false); }} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
              </div>
            </form>
          ) : (
            <div>
              <p className={`text-sm font-medium break-words ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {todo.title}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${style.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                  {style.label}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(todo.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          )}
        </div>

        {!editing && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 transition-all duration-150" title="Edit task">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button onClick={() => onDelete(todo.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-150" title="Delete task">
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

// ── TodoList ───────────────────────────────────────────────────────────────
function TodoList({ todos, onToggle, onDelete, onEdit }: { todos: Todo[]; onToggle: (id: string) => void; onDelete: (id: string) => void; onEdit: (id: string, title: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}

// ── DateHeader ─────────────────────────────────────────────────────────────
function DateHeader() {
  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
  const fullDate = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-yellow-200 p-4 mb-4 flex items-center gap-3">
      <div className="w-12 h-12 bg-yellow-400 rounded-xl flex flex-col items-center justify-center shadow-sm">
        <span className="text-xs font-semibold text-yellow-900 uppercase leading-none">{now.toLocaleDateString('en-US', { month: 'short' })}</span>
        <span className="text-lg font-bold text-yellow-900 leading-none">{now.getDate()}</span>
      </div>
      <div>
        <p className="font-semibold text-gray-800">{dayName}</p>
        <p className="text-sm text-gray-400">{fullDate}</p>
      </div>
    </div>
  );
}

// ── StatsBar ───────────────────────────────────────────────────────────────
function StatsBar({ completed, total }: { completed: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-yellow-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{completed} of {total} tasks done</span>
        <span className="text-sm font-bold text-yellow-600">{pct}%</span>
      </div>
      <div className="w-full bg-yellow-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {total > 0 && pct === 100 && (
        <p className="text-xs text-green-600 font-medium mt-2 text-center">🎉 All done! Great job today!</p>
      )}
    </div>
  );
}

// ── FilterTabs ─────────────────────────────────────────────────────────────
function FilterTabs({ filter, setFilter, counts }: { filter: Filter; setFilter: (f: Filter) => void; counts: Record<string, number> }) {
  return (
    <div className="flex gap-1 bg-yellow-100 rounded-xl p-1 mb-4">
      {([{ key: 'all', label: 'All' }, { key: 'active', label: 'Active' }, { key: 'completed', label: 'Completed' }] as { key: Filter; label: string }[]).map((tab) => (
        <button
          key={tab.key}
          onClick={() => setFilter(tab.key)}
          className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all duration-200 ${
            filter === tab.key ? 'bg-white text-yellow-700 shadow-sm' : 'text-yellow-600 hover:text-yellow-800'
          }`}
        >
          {tab.label}
          <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
            filter === tab.key ? 'bg-yellow-100 text-yellow-700' : 'bg-yellow-200 text-yellow-600'
          }`}>
            {counts[tab.key]}
          </span>
        </button>
      ))}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supabase] = useState(() => getSupabaseClient());

  const loadTodos = useCallback(async () => {
    if (!supabase) {
      setError('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('todos')
      .select('id, title, priority, completed, created_at')
      .order('created_at', { ascending: false });
    if (err) {
      setError(`Failed to load tasks: ${err.message}`);
    } else {
      setTodos(data ?? []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => { loadTodos(); }, [loadTodos]);

  const addTodo = async (title: string, priority: Priority) => {
    if (!supabase) return;
    const { data, error: err } = await supabase
      .from('todos')
      .insert([{ title, priority, completed: false }])
      .select('id, title, priority, completed, created_at')
      .single();
    if (err) setError(`Failed to add task: ${err.message}`);
    else if (data) setTodos((prev) => [data, ...prev]);
  };

  const toggleTodo = async (id: string) => {
    if (!supabase) return;
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    const { error: err } = await supabase.from('todos').update({ completed: !todo.completed }).eq('id', id);
    if (err) setError(`Failed to update task: ${err.message}`);
    else setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTodo = async (id: string) => {
    if (!supabase) return;
    const { error: err } = await supabase.from('todos').delete().eq('id', id);
    if (err) setError(`Failed to delete task: ${err.message}`);
    else setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const editTodo = async (id: string, title: string) => {
    if (!supabase) return;
    const { error: err } = await supabase.from('todos').update({ title }).eq('id', id);
    if (err) setError(`Failed to edit task: ${err.message}`);
    else setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));
  };

  const clearCompleted = async () => {
    if (!supabase) return;
    const ids = todos.filter((t) => t.completed).map((t) => t.id);
    if (ids.length === 0) return;
    const { error: err } = await supabase.from('todos').delete().in('id', ids);
    if (err) setError(`Failed to clear tasks: ${err.message}`);
    else setTodos((prev) => prev.filter((t) => !t.completed));
  };

  const filtered = todos.filter((t) =>
    filter === 'active' ? !t.completed : filter === 'completed' ? t.completed : true
  );
  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-400 rounded-2xl mb-4 shadow-lg">
            <svg className="w-7 h-7 text-yellow-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Daily Tasks</h1>
          <p className="text-yellow-600 text-sm font-medium">Stay organized, stay productive</p>
        </div>

        <DateHeader />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-2 text-red-400 hover:text-red-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <StatsBar completed={completedCount} total={totalCount} />
        <TodoInput onAdd={addTodo} />
        <FilterTabs
          filter={filter}
          setFilter={setFilter}
          counts={{ all: totalCount, active: todos.filter((t) => !t.completed).length, completed: completedCount }}
        />

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-yellow-200 border-t-yellow-500 rounded-full animate-spin mb-3" />
            <p className="text-yellow-500 text-sm font-medium">Loading tasks...</p>
          </div>
        ) : (
          <>
            <TodoList todos={filtered} onToggle={toggleTodo} onDelete={deleteTodo} onEdit={editTodo} />
            {completedCount > 0 && (
              <div className="mt-4 text-center">
                <button onClick={clearCompleted} className="text-sm text-red-400 hover:text-red-600 transition-colors duration-200 underline underline-offset-2">
                  Clear {completedCount} completed task{completedCount !== 1 ? 's' : ''}
                </button>
              </div>
            )}
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">
                  {filter === 'completed' ? '🎉' : filter === 'active' ? '✅' : '📝'}
                </div>
                <p className="text-yellow-500 font-medium">
                  {filter === 'completed' ? 'No completed tasks yet' : filter === 'active' ? 'All tasks completed!' : 'Add your first task for today'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
