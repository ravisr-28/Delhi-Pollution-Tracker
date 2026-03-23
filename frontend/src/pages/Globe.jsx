import React, { useState, useEffect, useMemo } from 'react';
import API_BASE_URL from '../api';
import { useTheme } from '../contexts/ThemeContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  Map as MapIcon, 
  Activity, 
  Search, 
  Info, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  Download,
  FileText,
  Thermometer,
  Wind,
  Droplets,
  ChevronRight,
  LayoutGrid,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getAQIColor = (aqi) => {
  if (aqi <= 50) return '#22c55e';
  if (aqi <= 100) return '#eab308';
  if (aqi <= 150) return '#f97316';
  if (aqi <= 200) return '#ef4444';
  if (aqi <= 300) return '#a855f7';
  return '#7f1d1d';
};

const getAQICategory = (aqi) => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy (S)';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

const Globe = () => {
  const { theme } = useTheme();
  const [aqiData, setAqiData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/aqi/latest`);
        if (res.ok) {
          const dataArray = await res.json();
          const dataObj = {};
          dataArray.forEach(item => {
            dataObj[item.district] = item;
          });
          setAqiData(dataObj);
          if (dataArray.length > 0 && !selectedArea) {
            setSelectedArea(dataArray[0].district);
          }
        }
      } catch (err) {
        console.error('Failed to fetch Delhi AQI data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const sortedDistricts = useMemo(() => {
    return Object.entries(aqiData)
      .map(([code, data]) => ({
        code,
        name: data.district || code,
        aqi: data.aqi,
        category: getAQICategory(data.aqi),
        pollutants: data.pollutants
      }))
      .sort((a, b) => b.aqi - a.aqi);
  }, [aqiData]);

  const filteredDistricts = useMemo(() => {
    return sortedDistricts.filter(d => 
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedDistricts, searchQuery]);

  const stats = useMemo(() => {
    const values = Object.values(aqiData).map(d => d.aqi);
    if (values.length === 0) return { avg: 0, total: 0 };
    return {
      avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
      total: values.length,
    };
  }, [aqiData]);

  const currentArea = useMemo(() => {
    return aqiData[selectedArea] || null;
  }, [selectedArea, aqiData]);

  const pollutantData = useMemo(() => {
    if (!currentArea?.pollutants) return [];
    return [
      { name: 'PM2.5', value: currentArea.pollutants.pm25, color: '#ef4444' },
      { name: 'PM10', value: currentArea.pollutants.pm10, color: '#f97316' },
      { name: 'NO2', value: currentArea.pollutants.no2 || 45, color: '#a855f7' },
      { name: 'SO2', value: 12, color: '#3b82f6' },
    ];
  }, [currentArea]);

  const getHealthProtocols = (aqi) => {
    if (aqi <= 50) return ["Safe for outdoor exercise", "Keep windows open", "Ideal for long walks"];
    if (aqi <= 100) return ["Sensitivity groups should limit long stays", "Ventilate rooms during 12pm-4pm", "Moderate exercise advised"];
    if (aqi <= 200) return ["Wear N95 masks outdoors", "Avoid heavy exertion", "Use air purifiers indoors"];
    return ["Strictly stay indoors", "Air purification at max level", "Immediate medical contact if breathing issues"];
  };

  const handleDownloadReport = () => {
    if (!currentArea) return;
    const report = `
      DELHI AREA REPORT - ${currentArea.district.toUpperCase()}
      Generated: ${new Date().toLocaleString()}
      
      STATION METRICS:
      - AQI Index: ${currentArea.aqi} (${getAQICategory(currentArea.aqi)})
      - PM2.5: ${currentArea.pollutants.pm25} µg/m³
      - PM10: ${currentArea.pollutants.pm10} µg/m³
      
      HEALTH ADVISORY:
      ${getHealthProtocols(currentArea.aqi).map(p => `- ${p}`).join('\n')}
      
      City Average: ${stats.avg} AQI
    `;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentArea.district}_Report.txt`;
    link.click();
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Dynamic Pro Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 glass-card p-10 border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/20 border border-blue-400/20">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none">Delhi Area Intelligence</h1>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
              <Activity className="w-3 h-3 text-emerald-500" /> Granular Station Reporting Dashboard
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 relative z-10">
          <div className="flex items-center gap-6 px-8 py-4 bg-white/[0.03] border border-white/5 rounded-3xl backdrop-blur-md">
            <div className="text-center">
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">City Avg</div>
              <div className="text-2xl font-black text-white">{stats.avg} <span className="text-[10px] text-gray-600">AQI</span></div>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Stations</div>
              <div className="text-2xl font-black text-white">{stats.total}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Directory Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 border-white/5 flex flex-col h-[700px]">
            <div className="mb-6 space-y-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2 px-1">
                <LayoutGrid className="w-3.5 h-3.5" /> Station Directory
              </h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter by district name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0f172a] border border-white/10 text-white pl-10 pr-4 py-3 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all placeholder:text-gray-600"
                />
                <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-2">
                {loading ? (
                  Array(8).fill(0).map((_, i) => (
                    <div key={i} className="h-16 w-full animate-pulse bg-white/5 rounded-2xl" />
                  ))
                ) : filteredDistricts.map((d) => (
                  <button
                    key={d.code}
                    onClick={() => setSelectedArea(d.code)}
                    className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                      selectedArea === d.code 
                        ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-900/40 translate-x-1' 
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                        selectedArea === d.code ? 'bg-white/20 text-white' : 'bg-[#0f172a] text-gray-500'
                      }`}>
                        {d.aqi}
                      </div>
                      <div className="text-left">
                        <div className={`text-sm font-black ${selectedArea === d.code ? 'text-white' : 'text-gray-300'}`}>
                          {d.name}
                        </div>
                        <div className={`text-[9px] font-black uppercase tracking-widest ${selectedArea === d.code ? 'text-blue-100' : 'text-gray-500'}`}>
                          {d.category}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${selectedArea === d.code ? 'text-white translate-x-1' : 'text-gray-700'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Analytical Deep Report */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {!currentArea ? (
              <div className="h-full glass-card border-white/5 flex items-center justify-center p-20">
                <div className="text-center space-y-4">
                   <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Activity className="w-8 h-8 text-blue-500 animate-pulse" />
                   </div>
                   <p className="text-sm font-black text-gray-500 uppercase tracking-widest leading-relaxed">Select a station from the directory<br/>to generate a professional intelligence report.</p>
                </div>
              </div>
            ) : (
              <motion.div
                key={selectedArea}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                {/* Visual Status Card */}
                <div className="glass-card p-10 border-white/5 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-10">
                  <div className="absolute top-0 right-0 w-80 h-80 opacity-20 blur-[80px]" style={{ backgroundColor: getAQIColor(currentArea.aqi) }}></div>
                  
                  <div className="relative z-10 space-y-6 text-center md:text-left">
                    <div>
                      <h2 className="text-4xl font-black text-white tracking-tighter mb-2">{currentArea.district}</h2>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                        <MapIcon className="w-3 h-3 text-blue-400" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Station #DEL-{currentArea.district.slice(0,3).toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-10 items-end">
                      <div>
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Live Status</div>
                        <div className="px-5 py-2 rounded-xl text-sm font-black border uppercase tracking-wider inline-block shadow-lg" style={{
                           backgroundColor: `${getAQIColor(currentArea.aqi)}15`,
                           borderColor: `${getAQIColor(currentArea.aqi)}40`,
                           color: getAQIColor(currentArea.aqi)
                        }}>
                          {getAQICategory(currentArea.aqi)}
                        </div>
                      </div>
                      <button 
                        onClick={handleDownloadReport}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-[#050a18] text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all shadow-xl"
                      >
                        <Download className="w-4 h-4" /> Download Report
                      </button>
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-col items-center">
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Live AQI Score</div>
                    <div className="relative">
                       <svg className="w-40 h-40 transform -rotate-90">
                          <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                          <circle 
                            cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
                            strokeDasharray="440" 
                            strokeDashoffset={440 - (Math.min(currentArea.aqi, 300) / 300) * 440}
                            className="transition-all duration-1000 ease-out"
                            style={{ color: getAQIColor(currentArea.aqi) }}
                          />
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-5xl font-black text-white tracking-tighter">{currentArea.aqi}</span>
                          <span className="text-[10px] font-black text-gray-500">AQI</span>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pollutant Composition */}
                  <div className="glass-card p-8 border-white/5">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                       <LayoutGrid className="w-4 h-4 text-purple-400" /> Chemical Composition
                    </h3>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={pollutantData} layout="vertical" margin={{ left: 10, right: 30 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.03)" />
                            <XAxis type="number" hide />
                            <YAxis 
                              dataKey="name" 
                              type="category" 
                              stroke="#64748b" 
                              fontSize={10} 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: '#64748b', fontWeight: 900, fontFamily: 'Inter' }}
                            />
                            <Tooltip 
                               cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                               content={({ payload }) => payload?.[0] ? (
                                 <div className="bg-[#0f172a] border border-white/10 p-3 rounded-xl shadow-2xl">
                                    <p className="text-xs font-black text-white">{payload[0].value} µg/m³</p>
                                 </div>
                               ) : null}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                               {pollutantData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.color} />
                               ))}
                            </Bar>
                         </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Health Advisory Protocols */}
                  <div className="glass-card p-8 border-white/5">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                       <ShieldCheck className="w-4 h-4 text-emerald-400" /> Advisory Protocols
                    </h3>
                    <div className="space-y-4">
                       {getHealthProtocols(currentArea.aqi).map((p, i) => (
                         <div key={i} className="flex items-start gap-4 group p-3 rounded-xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
                            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            </div>
                            <p className="text-sm text-gray-400 font-medium group-hover:text-gray-200 transition-colors leading-snug">{p}</p>
                         </div>
                       ))}
                       <div className="pt-4 border-t border-white/5 mt-4">
                          <div className="flex items-center gap-3 text-amber-500/60">
                             <AlertCircle className="w-4 h-4" />
                             <span className="text-[10px] font-black uppercase tracking-widest">Medical Disclaimer</span>
                          </div>
                          <p className="text-[10px] text-gray-600 mt-2">These are generalized precautions based on AQI standards. Consult a physician for specific health conditions.</p>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Regional Context Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                   {[
                     { label: 'Relative to Avg', val: `${Math.round(((currentArea.aqi - stats.avg) / stats.avg) * 100)}%`, icon: <Activity className="w-4 h-4 text-blue-400" />, sub: currentArea.aqi > stats.avg ? 'Higher than avg' : 'Lower than avg' },
                     { label: 'Ambient Temp', val: '24°C', icon: <Thermometer className="w-4 h-4 text-orange-400" />, sub: 'Optimal Range' },
                     { label: 'Wind Velocity', val: '12 km/h', icon: <Wind className="w-4 h-4 text-cyan-400" />, sub: 'Draft: NW' },
                     { label: 'Humidity', val: '58%', icon: <Droplets className="w-4 h-4 text-blue-500" />, sub: 'Normal' },
                   ].map((m, i) => (
                     <div key={i} className="glass-card p-6 border-white/5 flex flex-col justify-between group">
                        <div className="flex items-center justify-between mb-4">
                           <div className="p-2 bg-white/5 rounded-lg group-hover:scale-110 transition-transform">{m.icon}</div>
                           <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{m.label}</span>
                        </div>
                        <div>
                          <div className="text-2xl font-black text-white tracking-tight">{m.val}</div>
                          <div className="text-[9px] text-gray-600 font-bold uppercase mt-1">{m.sub}</div>
                        </div>
                     </div>
                   ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Globe;