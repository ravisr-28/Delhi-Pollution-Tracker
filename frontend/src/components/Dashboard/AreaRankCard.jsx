import React from 'react';

const AreaRankCard = ({ district }) => {
  const getStatusColor = (aqi) => {
    if (aqi <= 50) return { bg: 'rgba(0,228,0,0.15)', text: '#00e400', shadow: 'rgba(0,228,0,0.1)' };
    if (aqi <= 100) return { bg: 'rgba(255,222,51,0.15)', text: '#ffde33', shadow: 'rgba(255,222,51,0.1)' };
    if (aqi <= 150) return { bg: 'rgba(255,153,51,0.15)', text: '#ff9933', shadow: 'rgba(255,153,51,0.1)' };
    if (aqi <= 200) return { bg: 'rgba(204,0,51,0.15)', text: '#cc0033', shadow: 'rgba(204,0,51,0.1)' };
    if (aqi <= 300) return { bg: 'rgba(102,0,153,0.15)', text: '#9933ff', shadow: 'rgba(102,0,153,0.1)' };
    return { bg: 'rgba(126,0,35,0.2)', text: '#ff3366', shadow: 'rgba(126,0,35,0.1)' };
  };

  const colors = getStatusColor(district.aqi);

  return (
    <div className="px-5 py-4 hover:bg-white/[0.03] transition-all cursor-pointer group">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold text-gray-200 group-hover:text-white transition-colors">{district.name}</div>
          <div className="text-sm text-gray-500 mt-0.5">
            PM2.5: {district.pm25} µg/m³
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div 
              className="text-lg font-black"
              style={{ color: colors.text, textShadow: `0 0 10px ${colors.shadow}` }}
            >
              {district.aqi}
            </div>
            <div 
              className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold"
              style={{ backgroundColor: colors.bg, color: colors.text }}
            >
              {district.status}
            </div>
          </div>
          <div className="text-lg opacity-60 group-hover:opacity-100 transition-opacity">
            {district.trend === 'up' ? '↗️' : 
             district.trend === 'down' ? '↘️' : '➡️'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaRankCard;