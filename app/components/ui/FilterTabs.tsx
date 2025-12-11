'use client';

import React from 'react';

export interface FilterTab {
  label: string;
  value: string | null;
  count: number;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  activeFilter: string | null;
  onChange: (filter: string | null) => void;
  className?: string;
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  tabs,
  activeFilter,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 overflow-x-auto scrollbar-hide ${className}`}>
      <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1">
        {tabs.map((tab) => {
          const isActive = activeFilter === tab.value;

          return (
            <button
              key={tab.value || 'all'}
              onClick={() => onChange(tab.value)}
              className={`flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-md transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-primary text-white font-medium shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              aria-label={`Filtrera: ${tab.label}`}
            >
              <span className="text-sm font-medium">{tab.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterTabs;
