import React, { useState, useEffect, useMemo, Component } from 'react';
import API_BASE_URL from '../api';
import { motion } from 'framer-motion';
import AqiOverview from '../components/Dashboard/AqiOverview';
import AtmosphericStats from '../components/Dashboard/AtmosphericStats';
import HealthAlerts from '../components/Dashboard/HealthAlerts';
import AreaRankCard from '../components/Dashboard/AreaRankCard';
import QuickStats from '../components/Dashboard/QuickStats';

import { 
  Globe, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle,
  Cloud,
  Activity,
  Zap,
  MapPin,
  ChevronDown,
  ChevronUp,
  Thermometer,
  Wind,
  Eye,
  BarChart3,
  Shield,
  Sparkles,
  Clock
} from 'lucide-react';

// Error boundary for WebGL
class GlobeBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-6xl animate-float">🌍</div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy load the DashboardGlobe
const DashboardGlobe = React.lazy(() => import('../components/Dashboard/DashboardGlobe'));

// Collapsible Section Component
function Section({ title, subtitle, icon, children, defaultOpen = false, badge, accentColor = 'blue' }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const colors = {
    blue: { border: 'border-blue-500/30', bg: 'from-blue-500/10 to-blue-600/5', text: 'text-blue-400', shadow: 'shadow-blue-500/10' },
    red: { border: 'border-red-500/30', bg: 'from-red-500/10 to-red-600/5', text: 'text-red-400', shadow: 'shadow-red-500/10' },
    purple: { border: 'border-purple-500/30', bg: 'from-purple-500/10 to-purple-600/5', text: 'text-purple-400', shadow: 'shadow-purple-500/10' },
    emerald: { border: 'border-emerald-500/30', bg: 'from-emerald-500/10 to-emerald-600/5', text: 'text-emerald-400', shadow: 'shadow-emerald-500/10' },
    orange: { border: 'border-orange-500/30', bg: 'from-orange-500/10 to-orange-600/5', text: 'text-orange-400', shadow: 'shadow-orange-500/10' },
    cyan: { border: 'border-cyan-500/30', bg: 'from-cyan-500/10 to-cyan-600/5', text: 'text-cyan-400', shadow: 'shadow-cyan-500/10' },
  };
  const c = colors[accentColor] || colors.blue;

  return (
    <div className={`glass-card overflow-hidden transition-all duration-500 ${isOpen ? `${c.border} shadow-lg ${c.shadow}` : 'border-white/5'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-5 flex items-center justify-between group hover:bg-white/[0.02] transition-all`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center border ${c.border} transition-transform duration-300 ${isOpen ? 'scale-110' : 'group-hover:scale-105'}`}>
            <span className={c.text}>{icon}</span>
          </div>
          <div className="text-left">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              {title}
              {badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${badge.className}`}>
                  {badge.text}
                </span>
              )}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          </div>
        </div>
        <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </button>
      
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-white/5">
          {children}
        </div>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const [globalData, setGlobalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('all');

  useEffect(() => {
    fetchGlobalData();
    const interval = setInterval(fetchGlobalData, 120000);
    return () => clearInterval(interval);
  }, []);

  const fetchGlobalData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/aqi/latest`);
      if (res.ok) {
        const dataArray = await res.json();
        if (dataArray && dataArray.length > 0) {
            // Convert array back to object keyed by district name to match globalData format
            const dataObj = {};
            dataArray.forEach(item => {
                dataObj[item.district] = item;
            });
            setGlobalData(dataObj);
        }
      }
    } catch (err) {
      console.log('Using fallback data', err);
    } finally {
      setLoading(false);
    }
  };

  const regionMap = {
    central: ['Central Delhi', 'New Delhi'],
    north: ['North Delhi', 'North West Delhi'],
    south: ['South Delhi', 'South East Delhi', 'South West Delhi'],
    east: ['East Delhi', 'North East Delhi', 'Shahdara'],
    west: ['West Delhi'],
  };

  const stats = useMemo(() => {
    if (!globalData) return { avg: 0, max: 0, min: 0, total: 0, worst: null, best: null, mostPollutedCountries: [] };
    const entries = Object.entries(globalData);
    if (entries.length === 0) return { avg: 0, max: 0, min: 0, total: 0, worst: null, best: null, mostPollutedCountries: [] };
    const values = entries.map(([_, d]) => d.aqi);
    const sorted = [...entries].sort((a, b) => b[1].aqi - a[1].aqi);
    return {
      avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
      max: Math.max(...values),
      min: Math.min(...values),
      total: values.length,
      worst: sorted[0],
      best: sorted[sorted.length - 1],
      mostPollutedCountries: sorted.slice(0, 10).map(([code, data]) => ({
        name: data.district || code, aqi: data.aqi,
        pm25: data.pollutants?.pm25 || Math.round(data.aqi * 0.7),
        status: getCategory(data.aqi),
        trend: data.aqi > 150 ? 'up' : data.aqi < 50 ? 'down' : 'stable',
        code,
      })),
    };
  }, [globalData]);

  const regionStats = useMemo(() => {
    if (!globalData || selectedRegion === 'all') return stats;
    const codes = regionMap[selectedRegion] || [];
    const filtered = Object.entries(globalData).filter(([code]) => codes.includes(code));
    if (filtered.length === 0) return stats;
    const values = filtered.map(([_, d]) => d.aqi);
    const sorted = [...filtered].sort((a, b) => b[1].aqi - a[1].aqi);
    return {
      avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
      max: Math.max(...values), min: Math.min(...values), total: values.length,
      worst: sorted[0], best: sorted[sorted.length - 1],
      mostPollutedCountries: sorted.slice(0, 10).map(([code, data]) => ({
        name: data.district || code, aqi: data.aqi,
        pm25: data.pollutants?.pm25 || Math.round(data.aqi * 0.7),
        status: getCategory(data.aqi),
        trend: data.aqi > 150 ? 'up' : data.aqi < 50 ? 'down' : 'stable',
        code,
      })),
    };
  }, [globalData, selectedRegion, stats]);

  const liveData = useMemo(() => {
    if (!regionStats.worst) return null;
    const w = regionStats.worst[1];
    return {
      overallAQI: regionStats.avg, pm25: w.pm25 || 165, pm10: w.pm10 || 245, no2: 45,
      temperature: 22, humidity: 55, windSpeed: 8, windDirection: 'NW',
      pressure: 1013, lastUpdated: new Date().toLocaleTimeString(), primaryPollutant: 'PM2.5'
    };
  }, [regionStats]);

  const regions = [
    { id: 'all', label: '🏙️ All Delhi' },
    { id: 'central', label: '🏛️ Central' },
    { id: 'north', label: '⬆️ North' },
    { id: 'south', label: '⬇️ South' },
    { id: 'east', label: '➡️ East' },
    { id: 'west', label: '⬅️ West' },
  ];

  return (
    <div className="space-y-0 -mx-4 sm:-mx-6 lg:-mx-8 -mt-8">
      
      {/* ===== 3D HERO SECTION ===== */}
      <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden" style={{ background: 'radial-gradient(ellipse at center, #0d1f3c 0%, #050a18 70%)' }}>
        {/* 3D Globe */}
        <div className="absolute inset-0">
          <React.Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-8xl animate-float">🌍</div>
            </div>
          }>
            <GlobeBoundary>
              <DashboardGlobe />
            </GlobeBoundary>
          </React.Suspense>
        </div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050a18]/40 via-transparent to-[#050a18]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050a18]/60 via-transparent to-[#050a18]/60"></div>
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
              <span className="text-sm font-black text-blue-400 uppercase tracking-[0.2em]">Live Intelligence</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-[1.1]">
              <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                {selectedRegion === 'all' ? 'Delhi' : regions.find(r => r.id === selectedRegion)?.label.split(' ')[1]}
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Air Quality
              </span>
            </h1>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-gray-400 mb-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.03] backdrop-blur-md">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>{regionStats.total} Monitoring Stations</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.03] backdrop-blur-md">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>Real-time Updates</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <ChevronDown className="w-6 h-6 text-gray-500" />
        </div>
      </div>

      {/* ===== HORIZONTAL STATS ROW ===== */}
      <div className="px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { title: selectedRegion === 'all' ? 'Delhi Average' : 'Region Average', value: String(regionStats.avg), unit: 'AQI', icon: <Activity className="w-6 h-6 text-blue-400" />, delay: '0.1s' },
            { title: 'Most Polluted', value: regionStats.worst ? String(regionStats.worst[1].aqi) : '--', unit: 'AQI', description: regionStats.worst?.[1]?.district || regionStats.worst?.[1]?.city, icon: <TrendingUp className="w-6 h-6 text-red-400" />, delay: '0.2s' },
            { title: 'Cleanest Air', value: regionStats.best ? String(regionStats.best[1].aqi) : '--', unit: 'AQI', description: regionStats.best?.[1]?.district || regionStats.best?.[1]?.city, icon: <Sparkles className="w-6 h-6 text-emerald-400" />, delay: '0.3s' },
            { title: 'Locations', value: String(regionStats.total), description: selectedRegion === 'all' ? 'Tracked in Delhi' : `Tracked in ${selectedRegion}`, icon: <Globe className="w-6 h-6 text-purple-400" />, delay: '0.4s' },
          ].map((stat, i) => (
            <div key={i} className="animate-fade-in-up" style={{ animationDelay: stat.delay }}>
              <QuickStats {...stat} />
            </div>
          ))}
        </div>
      </div>

      {/* ===== REGION FILTER ===== */}
      <div className="px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {regions.map(region => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                selectedRegion === region.id 
                  ? 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white shadow-lg shadow-blue-500/20 border border-blue-500/30'
                  : 'glass-card text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {region.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== COLLAPSIBLE SECTIONS ===== */}
      <div className="px-4 sm:px-6 lg:px-8 mt-6 space-y-4 pb-8">
        
        {/* AQI Overview — open by default */}
        <Section 
          title="Air Quality Index" 
          subtitle={`${regionStats.total} locations aggregated`}
          icon={<Activity className="w-5 h-5" />}
          accentColor="blue"
          defaultOpen={true}
          badge={{ text: 'LIVE', className: 'bg-green-500/20 text-green-400 border border-green-500/20' }}
        >
          <AqiOverview data={liveData} loading={loading} />
        </Section>

        {/* Most Polluted — horizontal cards */}
        <Section 
          title="Most Polluted Cities" 
          subtitle="Click to see Delhi pollution rankings"
          icon={<AlertTriangle className="w-5 h-5" />}
          accentColor="red"
          badge={{ text: `${regionStats.mostPollutedCountries.filter(c => c.aqi > 150).length} alerts`, className: 'bg-red-500/20 text-red-400 border border-red-500/20' }}
        >
          <div className="p-4">
            {/* Horizontal scrolling cards */}
            <div className="flex gap-4 overflow-x-auto pb-3 snap-x">
              {regionStats.mostPollutedCountries.map((country, i) => (
                <div 
                  key={country.code}
                  className="glass-card glass-card-hover min-w-[200px] flex-shrink-0 snap-start overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-300 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black text-gray-500">
                        {i + 1}
                      </span>
                      {country.name}
                    </span>
                    <span className="text-[10px] text-gray-600 font-mono">{country.code}</span>
                  </div>
                  <div className="p-4">
                    <div className="text-3xl font-black" style={{ 
                      color: country.aqi > 200 ? '#ef4444' : country.aqi > 100 ? '#f97316' : country.aqi > 50 ? '#eab308' : '#22c55e',
                      textShadow: `0 0 15px ${country.aqi > 200 ? 'rgba(239,68,68,0.3)' : country.aqi > 100 ? 'rgba(249,115,22,0.3)' : 'rgba(234,179,8,0.3)'}`
                    }}>
                      {country.aqi}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{country.status}</div>
                    <div className="mt-2 h-1 rounded-full bg-gray-800/50 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-700"
                        style={{ 
                          width: `${Math.min((country.aqi / 300) * 100, 100)}%`,
                          background: country.aqi > 200 ? '#ef4444' : country.aqi > 100 ? '#f97316' : country.aqi > 50 ? '#eab308' : '#22c55e'
                        }}
                      />
                    </div>
                    <div className="text-[10px] text-gray-600 mt-2">PM2.5: {country.pm25} µg/m³</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Weather & Conditions — horizontal */}
        <Section 
          title="Atmospheric Conditions" 
          subtitle="Global weather overview"
          icon={<Thermometer className="w-5 h-5" />}
          accentColor="cyan"
        >
          <AtmosphericStats data={liveData} />
        </Section>

        {/* Alerts */}
        <Section 
          title="Active Health Alerts" 
          subtitle="Delhi health advisories"
          icon={<Shield className="w-5 h-5" />}
          accentColor="orange"
          badge={{ text: 'URGENT', className: 'bg-red-500/20 text-red-400 border border-red-500/20 animate-pulse' }}
        >
          <HealthAlerts />
        </Section>

        {/* Rankings Table */}
        <Section 
          title="Area Rankings" 
          subtitle="Full pollution leaderboard"
          icon={<BarChart3 className="w-5 h-5" />}
          accentColor="purple"
        >
          <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto">
            {regionStats.mostPollutedCountries.map((country) => (
              <AreaRankCard key={country.code} district={country} />
            ))}
          </div>
        </Section>

        {/* Footer */}
        <div className="glass-card p-4 text-center text-sm text-gray-500">
          <p>⚠️ Health Advisory: When AQI exceeds 200, everyone should reduce outdoor exposure.</p>
          <p className="mt-1 text-gray-600">Data updates every 2 minutes • {stats.total} locations • {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};

function getCategory(aqi) {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy (S)';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

export default Dashboard;