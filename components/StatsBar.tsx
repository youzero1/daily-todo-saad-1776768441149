'use client';

interface StatsBarProps {
  completed: number;
  total: number;
}

export default function StatsBar({ completed, total }: StatsBarProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">
          {completed} of {total} tasks done
        </span>
        <span className="text-sm font-bold text-indigo-600">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {total > 0 && percentage === 100 && (
        <p className="text-xs text-green-600 font-medium mt-2 text-center">
          🎉 All done! Great job today!
        </p>
      )}
    </div>
  );
}
