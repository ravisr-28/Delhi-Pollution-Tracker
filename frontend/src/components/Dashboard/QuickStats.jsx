import React from 'react';

const QuickStats = ({ title, value, unit, description, icon, trend, change }) => {
  return (
    <div className="p-5 glass-card glass-card-hover transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{title}</div>
          <div className="text-2xl font-black mt-2 text-white">
            {value} {unit && <span className="text-sm font-normal text-gray-500">{unit}</span>}
          </div>
          {description && (
            <div className="text-xs text-gray-500 mt-1.5">{description}</div>
          )}
          {change && (
            <div className={`text-xs mt-1.5 font-bold flex items-center gap-1 ${
              trend === 'up' ? 'text-red-400' : 'text-emerald-400'
            }`}>
              <span className={`inline-block w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                trend === 'up' ? 'bg-red-500/20' : 'bg-emerald-500/20'
              }`}>
                {trend === 'up' ? '↑' : '↓'}
              </span>
              {change}
            </div>
          )}
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
    </div>
  );
};

export default QuickStats;