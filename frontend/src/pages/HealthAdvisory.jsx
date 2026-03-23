import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Lightbulb, Shield, Leaf, Wind, AlertTriangle, 
  Info, CheckCircle2, Waves, Home, Map, 
  ChevronRight, Heart, Activity, Droplets, Loader2, FileText, Download
} from 'lucide-react';

const HealthAdvisory = () => {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedAqi, setSelectedAqi] = useState(150);
  const [isLoaded, setIsLoaded] = useState(false);
  const [checkingItems, setCheckingItems] = useState({});
  const [loadingLibrary, setLoadingLibrary] = useState(null);
  const [showProtocol, setShowProtocol] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const healthAdvisories = [
    { range: [0, 50], status: 'Good', color: '#10b981', advice: 'Air quality is satisfactory, and air pollution poses little or no risk.', action: 'General outdoor activities are recommended.' },
    { range: [51, 100], status: 'Moderate', color: '#f59e0b', advice: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.', action: 'Sensitive individuals should reduce prolonged outdoor exertion.' },
    { range: [101, 150], status: 'Unhealthy for Sensitive Groups', color: '#f97316', advice: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.', action: 'Sensitive groups should reduce outdoor exercise.' },
    { range: [151, 200], status: 'Unhealthy', color: '#ef4444', advice: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.', action: 'Avoid prolonged outdoor activities.' },
    { range: [201, 300], status: 'Very Unhealthy', color: '#a855f7', advice: 'Health alert: The risk of health effects is increased for everyone.', action: 'Avoid all outdoor physical activity.' },
    { range: [301, 500], status: 'Hazardous', color: '#7f1d1d', advice: 'Health warning of emergency conditions: The entire population is more likely to be affected.', action: 'Remain indoors and keep activity levels low.' },
  ];

  const currentAdvisory = healthAdvisories.find(h => selectedAqi >= h.range[0] && selectedAqi <= h.range[1]);

  const categories = [
    { id: 'all', name: 'All Insights', icon: <Waves className="w-4 h-4" /> },
    { id: 'protection', name: 'Personal Protection', icon: <Shield className="w-4 h-4" /> },
    { id: 'indoor', name: 'Indoor Optimization', icon: <Home className="w-4 h-4" /> },
    { id: 'lifestyle', name: 'Lifestyle & Health', icon: <Heart className="w-4 h-4" /> },
    { id: 'emergency', name: 'Emergency Protocol', icon: <AlertTriangle className="w-4 h-4" /> },
  ];

  const insights = [
    {
      id: 1,
      category: 'protection',
      title: 'Advanced Mask Selection',
      description: 'N95 or N99 respirators are essential when AQI exceeds 150. Ensure a hermetic seal around the facial contour for maximum filtration efficiency.',
      insight: 'Recommended by WHO for PM2.5 protection.',
      icon: <Wind className="text-blue-500" />,
      impact: 'Critical',
      cost: 'Low'
    },
    {
      id: 2,
      category: 'indoor',
      title: 'HEPA Filtration Systems',
      description: 'High-Efficiency Particulate Air (HEPA) filters can remove 99.97% of dust, pollen, mold, bacteria, and any airborne particles with a size of 0.3 microns.',
      insight: 'CDC standard for indoor air purification.',
      icon: <Droplets className="text-cyan-500" />,
      impact: 'High',
      cost: 'Medium'
    },
    {
      id: 3,
      category: 'lifestyle',
      title: 'Antioxidant-Rich Nutrition',
      description: 'Incorporate Vitamin C, Vitamin E, and Omega-3 fatty acids to help bolster the body\'s natural defenses against oxidative stress caused by pollutants.',
      insight: 'Clinically proven to reduce inflammatory response.',
      icon: <Activity className="text-emerald-500" />,
      impact: 'Moderate',
      cost: 'Low'
    },
    {
      id: 4,
      category: 'indoor',
      title: 'Phytoremediation Strategies',
      description: 'Utilize specific botanical species like Dracaena, Snake Plant, or Peace Lily to naturally sequester formaldehyde, benzene, and trichloroethylene from indoor environments.',
      insight: 'NASA Clean Air Study validated.',
      icon: <Leaf className="text-green-500" />,
      impact: 'Medium',
      cost: 'Low'
    },
    {
      id: 5,
      category: 'emergency',
      title: 'Critical Exposure Protocol',
      description: 'During hazardous events (AQI 300+), seal window gaps with damp towels and utilize internal air recirculation modes in HV AC systems.',
      insight: 'EPA Emergency Guidelines.',
      icon: <AlertTriangle className="text-rose-500" />,
      impact: 'Critical',
      cost: 'Free'
    },
    {
      id: 6,
      category: 'protection',
      title: 'Activity Rescheduling',
      description: 'Consult real-time temporal patterns and shift intensive physical activities to periods with minimal vehicular density, typically pre-dawn or post-midnight.',
      insight: 'Optimized via local sensor data.',
      icon: <Map className="text-indigo-500" />,
      impact: 'High',
      cost: 'Free'
    }
  ];

  const filteredInsights = activeCategory === 'all' ? insights : insights.filter(t => t.category === activeCategory);

  const toggleChecklist = (index) => {
    setCheckingItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const openLibraryItem = (link) => {
    setLoadingLibrary(link);
    setTimeout(() => {
      setLoadingLibrary(null);
      setShowProtocol(link);
    }, 1500);
  };

  const handeFileDownload = (title) => {
    setDownloading(true);
    
    // Simulate generation delay
    setTimeout(() => {
      const content = `
=========================================
      POLLUTION SAFETY DOSSIER
=========================================
TITLE: ${title || 'Comprehensive Advisory Guide'}
DATE: ${new Date().toLocaleDateString()}
STATUS: VALIDATED - WHO / EPA STANDARDS

-----------------------------------------
CORE RECOMMENDATIONS
-----------------------------------------
1. PERSONAL PROTECTION:
   - Use certified N95/N99 respirators in high PM2.5 environments.
   - Maintain hermetic seal for maximum efficiency.

2. INDOOR OPTIMIZATION:
   - Deploy HEPA filtration with high CADR rating.
   - Strategic botanical placement (Snake Plant, Dracaena).
   - Seal ventilation gaps during peak pollution windows.

3. LIFESTYLE ADVISORY:
   - High-antioxidant dietary intake (Vitamin C, E).
   - Optimal hydration (3L+ daily).
   - Activity rescheduling based on real-time data.

-----------------------------------------
EMERGENCY PROTOCOL (AQI 301+)
-----------------------------------------
- REMAIN INDOORS.
- SEAL ALL AIR GAPS.
- RECIRCULATE INDOOR AIR.
- MONITOR FOR RESPIRATORY DISTRESS.

-----------------------------------------
DIGITAL ACCESS CODE: DELHI-AQI-2024
=========================================
      STAY PROTECTED. BREATHE SAFE.
=========================================
      `;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/\s+/g, '_')}_Safety_Guide.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDownloading(false);
    }, 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0f172a] text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[100px] opacity-20 ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-300'}`}></div>
        <div className={`absolute top-1/2 -left-24 w-72 h-72 rounded-full blur-[80px] opacity-10 ${theme === 'dark' ? 'bg-purple-600' : 'bg-purple-300'}`}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <header className="mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3 mb-4"
          >
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Health <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">Advisory</span>
              </h1>
              <p className={`mt-2 text-lg ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Professional strategies for atmospheric health optimization.
              </p>
            </div>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Interactive Advisory Widget */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-3xl border backdrop-blur-md ${theme === 'dark' ? 'bg-slate-800/40 border-slate-700/50 shadow-xl shadow-black/20' : 'bg-white/70 border-white shadow-xl shadow-blue-100/50'}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-xl font-bold flex items-center mb-4">
                    <Activity className="w-5 h-5 mr-2 text-blue-500" />
                    Real-time Protocol Adjuster
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span>Select Local AQI Exposure</span>
                      <span className="text-blue-500 font-bold px-3 py-1 bg-blue-500/10 rounded-full">{selectedAqi} AQI</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="500" 
                      value={selectedAqi} 
                      onChange={(e) => setSelectedAqi(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold px-1 uppercase tracking-wider">
                      <span>Good</span>
                      <span>Moderate</span>
                      <span>Unhealthy</span>
                      <span>Hazardous</span>
                    </div>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentAdvisory?.status}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="md:w-64 p-5 rounded-2xl flex flex-col items-center justify-center text-center space-y-3"
                    style={{ backgroundColor: `${currentAdvisory?.color}15`, border: `1px solid ${currentAdvisory?.color}30` }}
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-1 shadow-lg" style={{ backgroundColor: currentAdvisory?.color }}>
                      <Info className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest" style={{ color: currentAdvisory?.color }}>{currentAdvisory?.status}</span>
                    <p className="text-xs leading-relaxed font-medium opacity-80">{currentAdvisory?.advice}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Filter Navigation */}
            <nav className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeCategory === cat.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                    : theme === 'dark' ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-100 shadow-sm'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.name}</span>
                </button>
              ))}
            </nav>

            {/* Advisory Cards */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredInsights.map((insight) => (
                  <motion.div
                    key={insight.id}
                    layout
                    variants={itemVariants}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`group relative p-6 rounded-3xl border transition-all duration-300 backdrop-blur-sm ${
                      theme === 'dark' 
                      ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-blue-500/50' 
                      : 'bg-white border-white hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-200/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                        {insight.icon}
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          insight.impact === 'Critical' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {insight.impact}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">{insight.title}</h3>
                    <p className={`text-sm leading-relaxed mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      {insight.description}
                    </p>
                    <div className={`flex items-center space-x-2 p-3 rounded-xl text-xs font-semibold ${theme === 'dark' ? 'bg-slate-900/40 text-blue-400' : 'bg-blue-50 text-blue-700'}`}>
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      <span>{insight.insight}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Sidebar / Secondary Info */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Quick Action Checklist */}
            <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-slate-800/20 border-slate-700/50' : 'bg-white border-slate-100 shadow-sm shadow-blue-100'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-500" />
                  Daily Checklist
                </h3>
                <span className="text-[10px] font-black uppercase tracking-tight text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full">
                  {Object.values(checkingItems).filter(Boolean).length}/5 Complete
                </span>
              </div>
              <div className="space-y-4">
                {[
                  'Verify current PM2.5 levels',
                  'Calibrate indoor purifiers',
                  'Seal high-traffic ventilation gaps',
                  'Monitor hydration status',
                  'Strategic exposure planning'
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleChecklist(i)}
                    className={`flex items-center p-3 rounded-2xl cursor-pointer transition-all ${
                      checkingItems[i] 
                      ? theme === 'dark' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50/50 border border-emerald-100'
                      : theme === 'dark' ? 'hover:bg-slate-800/50 border border-transparent' : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center mr-3 transition-all ${
                      checkingItems[i] 
                      ? 'bg-emerald-500 border-emerald-500' 
                      : theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
                    }`}>
                      {checkingItems[i] && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <span className={`text-sm font-semibold transition-all ${
                      checkingItems[i] 
                      ? 'line-through opacity-50' 
                      : 'opacity-90'
                    }`}>{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Resource Library Card */}
            <div className={`relative overflow-hidden p-6 rounded-3xl border ${
              theme === 'dark' 
              ? 'bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border-indigo-500/30' 
              : 'bg-gradient-to-br from-blue-600 to-indigo-700 border-blue-200 text-white'
            }`}>
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-2">Protocol Library</h3>
                <p className="text-sm opacity-80 mb-6 leading-relaxed">Access comprehensive dossiers on atmospheric health and respiratory protection.</p>
                <div className="space-y-3">
                  {['Scientific Whitepapers', 'Technical Specifications', 'Public Health Alerts'].map((link, i) => (
                    <div key={i} className="space-y-2">
                      <button 
                        onClick={() => openLibraryItem(link)}
                        disabled={loadingLibrary === link}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all relative ${
                          theme === 'dark' ? 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300' : 'bg-white/10 hover:bg-white/20'
                        } ${loadingLibrary === link ? 'opacity-50' : ''}`}
                      >
                        <div className="flex items-center space-x-3">
                          {loadingLibrary === link ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                          <span className="text-sm font-bold">{link}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform ${loadingLibrary === link ? 'translate-x-1' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {showProtocol === link && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className={`overflow-hidden rounded-2xl ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-black/10'}`}
                          >
                            <div className="p-4 space-y-3">
                              <p className="text-xs opacity-70 leading-relaxed font-medium">
                                Technical documentation for **{link}** has been loaded. This dossier contains validated datasets and respiratory protocols.
                              </p>
                              <button 
                                onClick={() => handeFileDownload(link)}
                                disabled={downloading}
                                className={`w-full py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center space-x-2 ${
                                  theme === 'dark' ? 'bg-blue-600 text-white disabled:bg-blue-800' : 'bg-white text-blue-600 shadow-sm disabled:text-blue-300'
                                }`}
                              >
                                {downloading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                                <span>{downloading ? 'Downloading...' : 'Download PDF'}</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </div>

            {/* Emergency Support */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-3xl border flex items-center space-x-4 cursor-pointer transition-all ${
                theme === 'dark' ? 'bg-rose-900/10 border-rose-500/20 hover:bg-rose-900/20' : 'bg-rose-50 border-rose-100 hover:bg-rose-100'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-rose-500">Respiratory Crisis</h4>
                <p className="text-xs font-semibold opacity-70">Immediate protocols for acute exposure symptoms.</p>
              </div>
            </motion.div>

          </aside>
        </div>

        {/* Global CTA */}
        <div className={`mt-12 p-8 rounded-[2.5rem] border text-center relative overflow-hidden ${
          theme === 'dark' 
          ? 'bg-slate-800/40 border-slate-700/50' 
          : 'bg-white border-white shadow-2xl shadow-blue-100/50'
        }`}>
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-4">Stay Protected, Stay Informed</h2>
            <p className={`text-lg mb-8 max-w-2xl mx-auto ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Download our comprehensive 2024 Pollution Mastery Guide for end-to-end respiratory protection strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => handeFileDownload('Mastery_Guide_2024')}
                disabled={downloading}
                className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2"
              >
                {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                <span>{downloading ? 'Preparing Guide...' : 'Download PDF Guide'}</span>
              </button>
              <button className={`px-8 py-4 rounded-2xl border font-bold transition-all ${
                theme === 'dark' ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50 shadow-sm'
              }`}>
                Subscribe to Alerts
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px]"></div>
        </div>

        {/* Footer Note */}
        <footer className="mt-16 text-center">
          <p className={`text-xs font-medium uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
            Data sourced from WHO & EPA Global Standards • Updated March 2024
          </p>
        </footer>

      </div>
    </div>
  );
};

export default HealthAdvisory;