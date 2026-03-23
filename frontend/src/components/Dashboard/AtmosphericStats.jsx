import React from 'react';
import { Thermometer, Droplets, Wind, Cloud, Eye } from 'lucide-react';

const AtmosphericStats = ({ data }) => {
  const weatherItems = [
    { icon: <Droplets className="w-4 h-4" />, label: 'Humidity', value: `${data?.humidity || '--'}%`, color: '#3b82f6' },
    { icon: <Wind className="w-4 h-4" />, label: 'Wind', value: `${data?.windSpeed || '--'} m/s`, color: '#06b6d4' },
    { icon: <Eye className="w-4 h-4" />, label: 'Pressure', value: `${data?.pressure || '1013'} hPa`, color: '#8b5cf6' },
  ];

  return (
    <div className="p-6">
      {/* Temperature display */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/20">
            <Thermometer className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <div className="text-4xl font-black text-white">
              {data?.temperature || '--'}
              <span className="text-lg text-gray-500">°C</span>
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <Cloud className="w-3.5 h-3.5" /> {data?.windDirection || 'NW'} Wind
            </div>
          </div>
        </div>
        <div className="text-5xl animate-float">🌤️</div>
      </div>

      {/* Weather metrics */}
      <div className="space-y-3">
        {weatherItems.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-all">
            <span className="flex items-center gap-2.5 text-sm text-gray-400">
              <span style={{ color: item.color }}>{item.icon}</span>
              {item.label}
            </span>
            <span className="font-semibold text-gray-200">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AtmosphericStats;