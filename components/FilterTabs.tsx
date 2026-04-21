'use client';

type FilterType = 'all' | 'active' | 'completed';

interface FilterTabsProps {
  filter: FilterType;
  setFilter: (f: FilterType) => void;
  counts: { all: number; active: number; completed: number };
}

export default function FilterTabs({ filter, setFilter, counts }: FilterTabsProps) {
  const tabs: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setFilter(tab.key)}
          className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all duration-200 ${
            filter === tab.key
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
          <span
            className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
              filter === tab.key ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'
            }`}
          >
            {counts[tab.key]}
          </span>
        </button>
      ))}
    </div>
  );
}
