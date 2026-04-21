'use client';

export default function DateHeader() {
  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = now.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4 flex items-center gap-3">
      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex flex-col items-center justify-center">
        <span className="text-xs font-semibold text-indigo-600 uppercase leading-none">
          {now.toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span className="text-lg font-bold text-indigo-700 leading-none">
          {now.getDate()}
        </span>
      </div>
      <div>
        <p className="font-semibold text-gray-800">{dayName}</p>
        <p className="text-sm text-gray-400">{dateStr}</p>
      </div>
    </div>
  );
}
