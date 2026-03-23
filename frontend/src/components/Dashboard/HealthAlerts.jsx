import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight } from 'lucide-react';

const HealthAlerts = () => {
  return (
    <div className="p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-orange-900/20 animate-gradient" style={{ backgroundSize: '200% 200%' }}></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-bold text-red-400">Active Alert</h3>
            </div>
            <div className="text-3xl font-black text-white">
              AQI: <span className="text-red-400" style={{ textShadow: '0 0 20px rgba(239,68,68,0.3)' }}>245</span>
            </div>
            <div className="text-sm text-red-300/70 mt-1">Very Unhealthy</div>
          </div>
          <div className="text-4xl animate-pulse">🚨</div>
        </div>
        
        <p className="mb-4 text-sm text-gray-400 leading-relaxed">
          Air quality is very unhealthy. Sensitive groups should avoid outdoor activities.
        </p>
        
        <Link 
          to="/alerts"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-600/80 to-orange-600/80 hover:from-red-600 hover:to-orange-600 transition-all shadow-lg shadow-red-900/20"
        >
          View Details <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default HealthAlerts;