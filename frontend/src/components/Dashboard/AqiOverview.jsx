import React from 'react';

const AqiOverview = ({ data, loading }) => {
  const getAQICategory = (aqi) => {
    if (!aqi) return { level: 'Loading...', color: '#64748b', bg: 'from-gray-800 to-gray-900' };
    if (aqi <= 50) return { level: 'Good', color: '#00e400', bg: 'from-emerald-900/30 to-emerald-800/20' };
    if (aqi <= 100) return { level: 'Moderate', color: '#ffde33', bg: 'from-yellow-900/30 to-yellow-800/20' };
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive', color: '#ff9933', bg: 'from-orange-900/30 to-orange-800/20' };
    if (aqi <= 200) return { level: 'Unhealthy', color: '#cc0033', bg: 'from-red-900/30 to-red-800/20' };
    if (aqi <= 300) return { level: 'Very Unhealthy', color: '#660099', bg: 'from-purple-900/30 to-purple-800/20' };
    return { level: 'Hazardous', color: '#7e0023', bg: 'from-red-900/40 to-red-800/30' };
  };

  const category = getAQICategory(data?.overallAQI);
  const aqiValue = data?.overallAQI || 0;
  const percentage = Math.min((aqiValue / 500) * 100, 100);

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Animated AQI Circle */}
        <div className="relative">
          <div className="relative w-40 h-40">
            {/* Outer glow ring */}
            <div 
              className="absolute inset-0 rounded-full animate-pulse-glow"
              style={{ boxShadow: `0 0 40px ${category.color}30, 0 0 80px ${category.color}15` }}
            />
            
            {/* SVG Ring */}
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle 
                cx="60" cy="60" r="52" fill="none" 
                stroke={category.color} 
                strokeWidth="8" 
                strokeLinecap="round"
                strokeDasharray={`${percentage * 3.27} 327`}
                style={{ transition: 'stroke-dasharray 1.5s ease-in-out', filter: `drop-shadow(0 0 6px ${category.color}80)` }}
              />
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div 
                className="text-4xl font-black"
                style={{ color: category.color, textShadow: `0 0 20px ${category.color}50` }}
              >
                {loading ? '--' : aqiValue}
              </div>
              <div className="text-xs text-gray-400 font-medium mt-1">US AQI</div>
            </div>
          </div>
          
          <div className="text-center mt-3">
            <span 
              className="inline-block px-4 py-1.5 rounded-full text-sm font-bold"
              style={{ 
                backgroundColor: `${category.color}20`, 
                color: category.color,
                boxShadow: `0 0 15px ${category.color}15`
              }}
            >
              {category.level}
            </span>
          </div>
        </div>

        {/* AQI Scale Bar */}
        <div className="flex-1 w-full">
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-gray-500 font-medium">
              <span>0</span><span>50</span><span>100</span><span>150</span><span>200</span><span>300</span><span>500</span>
            </div>
            <div className="relative h-4 rounded-full overflow-hidden bg-gray-800/50">
              <div className="flex h-full">
                <div className="flex-1" style={{ background: 'linear-gradient(90deg, #00e400, #00e400)' }}></div>
                <div className="flex-1" style={{ background: 'linear-gradient(90deg, #ffde33, #ffde33)' }}></div>
                <div className="flex-1" style={{ background: 'linear-gradient(90deg, #ff9933, #ff9933)' }}></div>
                <div className="flex-1" style={{ background: 'linear-gradient(90deg, #cc0033, #cc0033)' }}></div>
                <div className="flex-1" style={{ background: 'linear-gradient(90deg, #660099, #660099)' }}></div>
                <div className="flex-1" style={{ background: 'linear-gradient(90deg, #7e0023, #7e0023)' }}></div>
              </div>
              {/* Marker */}
              <div 
                className="absolute top-0 h-full w-0.5"
                style={{ 
                  left: `${percentage}%`, 
                  backgroundColor: 'white',
                  boxShadow: '0 0 8px white',
                  transition: 'left 1.5s ease-in-out'
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>Good</span><span>Moderate</span><span>Sensitive</span><span>Unhealthy</span><span>Very Bad</span><span>Hazardous</span>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
            Primary Pollutant: <span className="text-gray-200 font-semibold">{data?.primaryPollutant || 'PM2.5'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AqiOverview;