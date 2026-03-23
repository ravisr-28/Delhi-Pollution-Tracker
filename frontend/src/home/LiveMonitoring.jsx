import React, { useState, useEffect, useMemo } from 'react';
import API_BASE_URL from '../api';
import { motion } from 'framer-motion';
import {
  Activity, TrendingUp, Sparkles, Globe, Thermometer, MapPin
} from 'lucide-react';

// Animated counter hook
function AnimatedNumber({ value, duration = 2000 }) {
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration, started]);

  return (
    <motion.span
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true }}
    >
      {display}
    </motion.span>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function LiveMonitoring() {
  const [globalData, setGlobalData] = useState(null);
  const [temperature, setTemperature] = useState(null);

  useEffect(() => {
    // Fetch global AQI data summary
    fetch(`${API_BASE_URL}/aqi/global`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.total > 0) setGlobalData(data);
      })
      .catch((err) => console.error('Fetch error:', err));

    // Fetch temperature
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || 'eea48433f169fc82590680e20281052c';
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=${apiKey}&units=metric`
    )
      .then((r) => r.json())
      .then((data) => {
        if (data?.main) setTemperature(Math.round(data.main.temp));
      })
      .catch(() => setTemperature(28));
  }, []);

  const stats = useMemo(() => {
    if (!globalData)
      return {
        avg: 44,
        max: 187,
        min: 2,
        total: 11,
        worstCity: 'Loading...',
        bestCity: 'Loading...',
      };
    
    return {
      avg: globalData.avg,
      max: globalData.max,
      min: globalData.min,
      total: globalData.total,
      worstCity: globalData.worstCity,
      bestCity: globalData.bestCity,
    };
  }, [globalData]);

  const cards = [
    {
      label: 'Delhi Avg AQI',
      value: stats.avg,
      color: stats.avg > 150 ? '#ef4444' : stats.avg > 100 ? '#f97316' : stats.avg > 50 ? '#eab308' : '#22c55e',
      icon: <Activity className="w-5 h-5" />,
      glow: stats.avg > 150 ? 'rgba(239,68,68,0.15)' : stats.avg > 100 ? 'rgba(249,115,22,0.15)' : 'rgba(234,179,8,0.15)',
    },
    {
      label: 'Most Polluted',
      value: stats.max,
      sub: stats.worstCity,
      color: '#ef4444',
      icon: <TrendingUp className="w-5 h-5" />,
      glow: 'rgba(239,68,68,0.15)',
    },
    {
      label: 'Cleanest',
      value: stats.min,
      sub: stats.bestCity,
      color: '#22c55e',
      icon: <Sparkles className="w-5 h-5" />,
      glow: 'rgba(34,197,94,0.15)',
    },
    {
      label: 'Areas Covered',
      value: stats.total,
      color: '#3b82f6',
      icon: <Globe className="w-5 h-5" />,
      glow: 'rgba(59,130,246,0.15)',
    },
  ];

  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7 }}
        >
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl mb-6">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
            <span className="text-sm font-bold text-emerald-400 uppercase tracking-[0.2em]">
              Live Monitoring
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3">
            Delhi Air Quality
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto">
            Real-time pollution monitoring across{' '}
            <span className="text-white font-semibold">Delhi NCR Regions</span>
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group cursor-default"
            >
              <div
                className="relative p-5 md:p-6 rounded-2xl border border-white/[0.07] backdrop-blur-2xl overflow-hidden transition-all duration-300 hover:border-white/[0.12]"
                style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  boxShadow: `0 0 40px ${card.glow}`,
                }}
              >
                {/* Glass shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent rounded-2xl" />

                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] md:text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                      {card.label}
                    </span>
                    <span
                      style={{ color: card.color }}
                      className="opacity-40 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      {card.icon}
                    </span>
                  </div>
                  <div
                    className="text-3xl md:text-4xl lg:text-5xl font-black"
                    style={{
                      color: card.color,
                      textShadow: `0 0 30px ${card.color}30`,
                    }}
                  >
                    <AnimatedNumber value={card.value} />
                  </div>
                  {card.sub && (
                    <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {card.sub}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Temperature display */}
        <motion.div
          className="mt-6 md:mt-8 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border border-white/[0.07] backdrop-blur-2xl"
            style={{ background: 'rgba(15, 23, 42, 0.5)' }}
          >
            <Thermometer className="w-5 h-5 text-orange-400" />
            <span className="text-gray-400 text-sm">Current Temperature</span>
            <span className="text-2xl md:text-3xl font-black text-white">
              {temperature !== null ? `${temperature}°C` : '--°C'}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}