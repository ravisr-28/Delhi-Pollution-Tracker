import React, { useState, useEffect, useMemo } from 'react';
import API_BASE_URL from '../api';
import { MapContainer, TileLayer, CircleMarker, Popup, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});
import { useTheme } from '../contexts/ThemeContext';
import { 
  Map as MapIcon, 
  Filter, 
  AlertCircle, 
  Globe, 
  Activity, 
  TrendingUp, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Component to handle map center/zoom changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const DelhiMap = () => {
  const { theme } = useTheme();
  const [globalData, setGlobalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPollutant, setSelectedPollutant] = useState('aqi');
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]);
  const [mapZoom, setMapZoom] = useState(11);
  const [activePoint, setActivePoint] = useState(null);

  const regions = [
    { id: 'all', label: '🏙️ All Delhi', center: [28.6139, 77.2090], zoom: 10 },
    { id: 'central', label: '🏛️ Central', center: [28.6358, 77.2245], zoom: 11 },
    { id: 'north', label: '⬆️ North', center: [28.7041, 77.1025], zoom: 11 },
    { id: 'south', label: '⬇️ South', center: [28.5355, 77.2500], zoom: 11 },
    { id: 'east', label: '➡️ East', center: [28.6692, 77.3154], zoom: 11 },
    { id: 'west', label: '⬅️ West', center: [28.6562, 77.1000], zoom: 11 },
  ];

  useEffect(() => {
    fetchDelhiData();
    const interval = setInterval(fetchDelhiData, 180000); // 3 mins
    return () => clearInterval(interval);
  }, []);

  const delhiCoordinates = {
    'Central Delhi': { lat: 28.6358, lng: 77.2245 },
    'North Delhi': { lat: 28.7041, lng: 77.1025 },
    'South Delhi': { lat: 28.5355, lng: 77.2500 },
    'East Delhi': { lat: 28.6692, lng: 77.3154 },
    'West Delhi': { lat: 28.6562, lng: 77.1000 },
    'New Delhi': { lat: 28.6139, lng: 77.2090 },
    'North East Delhi': { lat: 28.7154, lng: 77.2842 },
    'North West Delhi': { lat: 28.7272, lng: 77.0688 },
    'South East Delhi': { lat: 28.5562, lng: 77.2760 },
    'South West Delhi': { lat: 28.5820, lng: 77.0707 },
    'Shahdara': { lat: 28.6714, lng: 77.2862 }
  };

  const fetchDelhiData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/aqi/latest`);
      if (!res.ok) throw new Error('Failed to fetch Delhi data');
      const dataArray = await res.json();
      
      const formatted = dataArray.map((district) => {
        const coords = delhiCoordinates[district.district] || { lat: 28.6139, lng: 77.2090 };
        return {
          code: district.district,
          name: district.district,
          aqi: district.aqi,
          lat: coords.lat,
          lng: coords.lng,
          pm25: district.pollutants?.pm25 || Math.round(district.aqi * 0.7),
          pm10: district.pollutants?.pm10 || Math.round(district.aqi * 1.2),
          status: getAQILevel(district.aqi)
        };
      });

      setGlobalData(formatted);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Live data connection interrupted. Please refresh.');
      setLoading(false);
    }
  };

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy (S)';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const getColor = (value, type = 'aqi') => {
    // Basic scale for visualization; can be refined with specific breakpoints for PM2.5/PM10
    let aqiValue = value;
    if (type === 'pm25') aqiValue = value * 2; // Approximate normalization for color scale
    if (type === 'pm10') aqiValue = value;

    if (aqiValue <= 50) return '#22c55e'; // emerald-500
    if (aqiValue <= 100) return '#eab308'; // yellow-500
    if (aqiValue <= 150) return '#f97316'; // orange-500
    if (aqiValue <= 200) return '#ef4444'; // red-500
    if (aqiValue <= 300) return '#a855f7'; // purple-500
    return '#7e0023'; // maroon
  };

  const stats = useMemo(() => {
    if (globalData.length === 0) return null;
    const sorted = [...globalData].sort((a, b) => b.aqi - a.aqi);
    const avg = Math.round(globalData.reduce((acc, curr) => acc + curr.aqi, 0) / globalData.length);
    return {
      worst: sorted[0],
      best: sorted[sorted.length - 1],
      avg,
      total: globalData.length
    };
  }, [globalData]);

  return (
    <div className="space-y-6 relative min-h-screen pb-12">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#050a18]/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 mx-auto">
        <div className="animate-fade-in-up">
          <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 via-white to-cyan-400 bg-clip-text text-transparent leading-tight tracking-tight">
            Delhi Air Intelligence
          </h1>
          <p className="text-gray-400 text-[10px] font-bold mt-1 opacity-70 uppercase tracking-widest">
            Station Synchronized • <span className="text-blue-400">{stats?.total || 0} Nodes</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            {regions.map(r => (
              <button
                key={r.id}
                onClick={() => { setMapCenter(r.center); setMapZoom(r.zoom); }}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:text-white text-gray-400 hover:bg-white/5 active:scale-95"
              >
                {r.label}
              </button>
            ))}
          </div>
          
          <select 
            value={selectedPollutant}
            onChange={(e) => setSelectedPollutant(e.target.value)}
            className="bg-[#0f172a] border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            <option value="aqi">AQI Index</option>
            <option value="pm25">PM2.5</option>
            <option value="pm10">PM10</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Professional Map View */}
        <div className="lg:col-span-3 relative rounded-[40px] overflow-hidden border border-white/10 h-[700px] group shadow-2xl shadow-blue-500/10">
          {loading && (
            <div className="absolute inset-0 z-[1000] bg-[#050a18] flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_30px_rgba(59,130,246,0.3)]"></div>
              <p className="text-blue-400 font-black tracking-tighter animate-pulse">SYNCHRONIZING DELHI STATIONS...</p>
            </div>
          )}
          
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            style={{ height: '100%', width: '100%', background: '#050a18' }}
            zoomControl={false}
            attributionControl={false}
          >
            <ChangeView center={mapCenter} zoom={mapZoom} />
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            {globalData.map((city) => (
              <CircleMarker
                key={city.code}
                center={[city.lat, city.lng]}
                radius={city[selectedPollutant] / 10 + 2}
                pathOptions={{
                  fillColor: getColor(city[selectedPollutant], selectedPollutant),
                  fillOpacity: 0.6,
                  color: getColor(city[selectedPollutant], selectedPollutant),
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => setActivePoint(city)
                }}
              >
                <Popup className="aqi-popup">
                  <div className="p-3 min-w-[200px] bg-[#0f172a] text-white border border-white/10 rounded-2xl">
                    <div className="flex justify-between items-start mb-3">
                        <span className="font-black text-white uppercase tracking-tighter">{city.name}</span>
                        <span className="text-[10px] text-gray-400 font-bold">{city.status}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                            <div className="text-[9px] font-black text-gray-500 uppercase mb-1">AQI</div>
                            <div className="text-xl font-black" style={{ color: getColor(city.aqi, 'aqi') }}>{city.aqi}</div>
                        </div>
                        <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                            <div className="text-[9px] font-black text-gray-500 uppercase mb-1">Status</div>
                            <div className="text-[10px] font-bold truncate" style={{ color: getColor(city.aqi, 'aqi') }}>{city.status}</div>
                        </div>
                    </div>

                    <div className="space-y-2 border-t border-white/5 pt-3">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-gray-400 uppercase">PM2.5</span>
                            <span className="text-blue-400">{city.pm25} µg/m³</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-gray-400 uppercase">PM10</span>
                            <span className="text-cyan-400">{city.pm10} µg/m³</span>
                        </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>

          {/* Map Overlay Elements */}
          <div className="absolute bottom-10 right-10 z-[500] pointer-events-none space-y-3">
             <div className="glass-card p-4 flex flex-col items-end gap-2 text-right">
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Delhi Status</div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-400">GOOD</span>
                    <div className="w-20 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-600"></div>
                    <span className="text-xs font-bold text-red-500">HAZARDOUS</span>
                </div>
             </div>
          </div>

          {/* Error Warning */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-10 left-10 z-[500] glass-card border-amber-500/30 p-3 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold text-amber-400 uppercase tracking-tight">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-6">
          {/* Active Insight Card */}
          <div className="glass-card p-6 border-blue-500/20 shadow-xl shadow-blue-500/5">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-6 flex items-center justify-between opacity-60">
              Active Intelligence
              <Activity className="w-4 h-4 text-blue-500" />
            </h3>
            
            {stats ? (
              <div className="space-y-8">
                <div>
                  <div className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-widest opacity-60">Delhi Average</div>
                  <div className="text-5xl font-black text-white tracking-tighter leading-none">
                    {stats.avg}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Sync Active</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                  <div>
                    <div className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1 opacity-80">Peak</div>
                    <div className="text-sm font-black text-white leading-tight truncate">{stats.worst.name}</div>
                    <div className="text-2xl font-black text-red-500 tracking-tighter">{stats.worst.aqi}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1 opacity-80">Cleanest</div>
                    <div className="text-sm font-black text-white leading-tight truncate">{stats.best.name}</div>
                    <div className="text-2xl font-black text-emerald-500 tracking-tighter">{stats.best.aqi}</div>
                  </div>
                </div>
                
                <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-blue-600/20 hover:scale-[1.02] transition-transform">
                  Export Dataset
                </button>
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500 italic text-sm">Quantizing data...</div>
            )}
          </div>

          <div className="glass-card p-6">
            <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Legend
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Good', color: '#22c55e', range: '0-50' },
                { label: 'Moderate', color: '#eab308', range: '51-100' },
                { label: 'Unhealthy (S)', color: '#f97316', range: '101-150' },
                { label: 'Unhealthy', color: '#ef4444', range: '151-200' },
                { label: 'Hazardous', color: '#7e0023', range: '201+' },
              ].map(lvl => (
                <div key={lvl.label} className="flex items-center justify-between group cursor-help">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: lvl.color, boxShadow: `0 0 10px ${lvl.color}40` }}></div>
                    <span className="text-xs font-bold text-gray-300 transition-colors group-hover:text-white">{lvl.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">{lvl.range}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelhiMap;