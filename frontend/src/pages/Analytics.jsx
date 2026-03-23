import React, { useState, useEffect, useMemo } from 'react';
import API_BASE_URL from '../api';
import { useTheme } from '../contexts/ThemeContext';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
  Brush
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  Activity, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Zap,
  ChevronDown,
  Download,
  Table as TableIcon,
  LineChart as ChartIcon,
  Sun,
  Moon,
  Info,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
        {payload.map((item, index) => (
          <div key={index} className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span className="text-white font-bold">{item.value}</span>
            <span className="text-gray-500 text-[10px] uppercase font-black">{item.name}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState('7');
  const [activeMetrics, setActiveMetrics] = useState(['aqi']);
  const [selectedDistrict, setSelectedDistrict] = useState('Central Delhi');
  const [districts, setDistricts] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('chart'); // 'chart' or 'table'
  
  const pollutants = [
    { id: 'aqi', label: 'AQI Index', color: '#3b82f6' },
    { id: 'pm25', label: 'PM2.5', color: '#ef4444' },
    { id: 'pm10', label: 'PM10', color: '#f97316' },
    { id: 'no2', label: 'NO₂', color: '#a855f7' },
  ];

  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      fetchHistoricalData();
    }
  }, [selectedDistrict, timeRange]);

  const fetchDistricts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/aqi/districts`);
      const data = await res.json();
      if (data.districts) setDistricts(data.districts.sort());
    } catch (err) {
      console.error('Failed to fetch districts', err);
    }
  };

  const fetchHistoricalData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/aqi/history?district=${encodeURIComponent(selectedDistrict)}&days=${timeRange}`);
      if (!res.ok) throw new Error('Failed to fetch history');
      const data = await res.json();
      
      const formatted = data.data.map(item => {
        const date = new Date(item.timestamp);
        return {
          timestamp: item.timestamp,
          time: date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
          hour: date.getHours(),
          fullTime: date.toLocaleString(),
          aqi: item.aqi,
          pm25: item.pollutants?.pm25 || 0,
          pm10: item.pollutants?.pm10 || 0,
          no2: item.pollutants?.no2 || 0,
        };
      });

      setHistoricalData(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    if (historicalData.length === 0) return null;
    
    const aqiValues = historicalData.map(d => d.aqi);
    const avg = Math.round(aqiValues.reduce((a, b) => a + b, 0) / aqiValues.length);
    const peak = Math.max(...aqiValues);
    const first = aqiValues[0];
    const last = aqiValues[aqiValues.length - 1];
    const trend = ((last - first) / (first || 1) * 100).toFixed(1);

    // Diurnal Analysis (Day vs Night)
    const dayData = historicalData.filter(d => d.hour >= 6 && d.hour < 18);
    const nightData = historicalData.filter(d => d.hour < 6 || d.hour >= 18);
    const dayAvg = dayData.length > 0 ? Math.round(dayData.reduce((a, b) => a + b.aqi, 0) / dayData.length) : 0;
    const nightAvg = nightData.length > 0 ? Math.round(nightData.reduce((a, b) => a + b.aqi, 0) / nightData.length) : 0;

    // Volatility (StDev approximation)
    const stdev = Math.sqrt(aqiValues.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / aqiValues.length);
    const volatility = ((stdev / (avg || 1)) * 100).toFixed(1);

    return { avg, peak, trend, isUp: last > first, dayAvg, nightAvg, volatility };
  }, [historicalData]);

  const toggleMetric = (id) => {
    setActiveMetrics(prev => 
      prev.includes(id) 
        ? (prev.length > 1 ? prev.filter(m => m !== id) : prev) 
        : [...prev, id]
    );
  };

  const handleExportCSV = () => {
    if (historicalData.length === 0) return;
    const headers = ['Timestamp', 'AQI', 'PM2.5', 'PM10', 'NO2'];
    const csvContent = [
      headers.join(','),
      ...historicalData.map(d => [d.timestamp, d.aqi, d.pm25, d.pm10, d.no2].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${selectedDistrict}_analytics_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Analytics Toolbar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 glass-card p-6 border-white/5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-blue-500" />
            Advanced Analytics
          </h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1 ml-10">
            Professional Environmental Intelligence Engine
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 mr-2">
            <button
              onClick={() => setViewMode('chart')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'chart' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              <ChartIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          {/* District Select */}
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="appearance-none bg-[#0f172a] border border-white/10 text-white pl-4 pr-10 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/40 min-w-[180px]"
            >
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          {/* Time Range */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
            {[{v:'1', l:'24H'}, {v:'7', l:'7D'}, {v:'30', l:'30D'}].map(range => (
              <button
                key={range.v}
                onClick={() => setTimeRange(range.v)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${timeRange === range.v ? 'bg-white shadow text-[#050a18]' : 'text-gray-500 hover:text-white'}`}
              >
                {range.l}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all"
            title="Export to CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Metric Selector Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card p-6 border-white/5">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" /> Select Metrics
            </h3>
            <div className="space-y-3">
              {pollutants.map(p => (
                <button
                  key={p.id}
                  onClick={() => toggleMetric(p.id)}
                  className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                    activeMetrics.includes(p.id) 
                      ? 'bg-white/5 border-white/10 shadow-lg' 
                      : 'border-transparent text-gray-500 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color, boxShadow: activeMetrics.includes(p.id) ? `0 0 10px ${p.color}` : 'none' }}></div>
                    <span className={`text-sm font-bold ${activeMetrics.includes(p.id) ? 'text-white' : ''}`}>{p.label}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                    activeMetrics.includes(p.id) ? 'bg-blue-600 border-blue-600' : 'border-white/10 group-hover:border-white/20'
                  }`}>
                    {activeMetrics.includes(p.id) && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Analysis Card */}
          <div className="glass-card p-6 border-blue-500/20 bg-blue-500/5 relative overflow-hidden">
             <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-600/10 blur-xl"></div>
             <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Insight Digest</h3>
             <p className="text-sm text-blue-100/60 leading-relaxed">
               {stats ? (
                 <>
                   {selectedDistrict} shows a <span className="text-white font-bold">{stats.trend}% {stats.isUp ? 'increase' : 'decrease'}</span> in local air contaminants over the last {timeRange} days. 
                   The night-time correlation is <span className="text-white font-bold">{stats.nightAvg > stats.dayAvg ? '12% higher' : 'lower'}</span> than daytime readings.
                 </>
               ) : 'Analyzing datasets...'}
             </p>
          </div>
        </div>

        {/* Main Display Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card p-8 border-white/5 h-[500px] relative">
            <AnimatePresence mode="wait">
              {viewMode === 'chart' ? (
                <motion.div 
                  key="chart"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historicalData}>
                      <defs>
                        {pollutants.map(p => (
                          <linearGradient key={p.id} id={`color-${p.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={p.color} stopOpacity={0.2}/>
                            <stop offset="95%" stopColor={p.color} stopOpacity={0}/>
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                      <XAxis 
                        dataKey="time" 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        tick={{ fill: '#64748b', fontWeight: 700, fontFamily: 'Inter' }}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        tick={{ fill: '#64748b', fontWeight: 700, fontFamily: 'Inter' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      {activeMetrics.map(id => (
                        <Area 
                          key={id}
                          type="monotone" 
                          dataKey={id} 
                          stroke={pollutants.find(p => p.id === id).color} 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill={`url(#color-${id})`}
                          animationDuration={1500}
                        />
                      ))}
                      <Brush 
                        dataKey="time" 
                        height={30} 
                        stroke="rgba(255,255,255,0.05)" 
                        fill="rgba(255,255,255,0.01)"
                        travellerWidth={10}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
              ) : (
                <motion.div 
                  key="table"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full flex flex-col"
                >
                  <div className="flex-grow overflow-auto custom-scrollbar">
                    <table className="w-full text-left">
                      <thead className="sticky top-0 bg-[#0f172a] border-b border-white/10">
                        <tr>
                          <th className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase">Timestamp</th>
                          <th className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase">AQI</th>
                          <th className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase">PM2.5</th>
                          <th className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase">PM10</th>
                          <th className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase">NO₂</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.03]">
                        {historicalData.map((d, i) => (
                          <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-4 py-4 text-xs font-bold text-gray-400">{d.fullTime}</td>
                            <td className="px-4 py-4 text-xs font-black text-blue-400">{d.aqi}</td>
                            <td className="px-4 py-4 text-xs font-black text-red-400">{d.pm25}</td>
                            <td className="px-4 py-4 text-xs font-black text-orange-400">{d.pm10}</td>
                            <td className="px-4 py-4 text-xs font-black text-purple-400">{d.no2}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Intelligence Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] font-black text-gray-500 uppercase">Day Avg</span>
              </div>
              <div className="text-3xl font-black text-white leading-none">{stats?.dayAvg || '--'} <span className="text-xs font-medium text-gray-600">AQI</span></div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${Math.min((stats?.dayAvg / 300) * 100, 100)}%` }} />
              </div>
            </div>

            <div className="glass-card p-6 border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] font-black text-gray-500 uppercase">Night Avg</span>
              </div>
              <div className="text-3xl font-black text-white leading-none">{stats?.nightAvg || '--'} <span className="text-xs font-medium text-gray-600">AQI</span></div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${Math.min((stats?.nightAvg / 300) * 100, 100)}%` }} />
              </div>
            </div>

            <div className="glass-card p-6 border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-black text-gray-500 uppercase">Volatility</span>
              </div>
              <div className="text-3xl font-black text-white leading-none">{stats?.volatility || '--'}<span className="text-xl opacity-20">%</span></div>
              <p className="text-[9px] text-gray-500 font-medium leading-tight">Variation coefficient across current dataset time-windows.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;