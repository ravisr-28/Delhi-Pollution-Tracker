import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  X,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';

const dropdownVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    y: 8, 
    scale: 0.98,
    transition: { duration: 0.15, ease: "easeIn" }
  }
};

const NotificationDropdown = ({ isOpen, onClose, type = 'notifications', data = [] }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const isAlert = type === 'alerts';

  // Default mock data if none provided
  const items = data.length > 0 ? data : (isAlert ? [
    {
      id: 1,
      title: 'High AQI Warning',
      desc: 'Central Delhi reaching 280 (Very Unhealthy). Recommended to stay indoors.',
      time: '12 mins ago',
      level: 'critical',
      icon: <AlertCircle className="w-4 h-4 text-red-400" />
    },
    {
      id: 2,
      title: 'Pollution Increase',
      desc: 'Significant rise in PM2.5 detected in East Delhi areas.',
      time: '1 hour ago',
      level: 'warning',
      icon: <TrendingUp className="w-4 h-4 text-orange-400" />
    }
  ] : [
    {
      id: 1,
      title: 'Air Quality Improving',
      desc: 'West Delhi reported 15% reduction in smog levels today.',
      time: '3 hours ago',
      type: 'success',
      icon: <TrendingDown className="w-4 h-4 text-emerald-400" />
    },
    {
      id: 2,
      title: 'New Health Advisory',
      desc: 'Check out the new guide for mask recommendations.',
      time: '5 hours ago',
      type: 'info',
      icon: <Info className="w-4 h-4 text-blue-400" />
    }
  ]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute top-full right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-[#0a1120]/95 backdrop-blur-2xl border border-white/10 shadow-2xl z-[60] overflow-hidden"
          style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isAlert ? (
                <AlertCircle className="w-5 h-5 text-red-400" />
              ) : (
                <Bell className="w-5 h-5 text-blue-400" />
              )}
              <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none mt-1">
                {isAlert ? 'Critical Alerts' : 'Notifications'}
              </h3>
              <span className="ml-1 text-[10px] font-black px-1.5 py-0.5 rounded-md bg-white/10 text-white/50">
                {items.length}
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <X className="w-4 h-4 text-gray-500 group-hover:text-white" />
            </button>
          </div>

          {/* List */}
          <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
            {items.length > 0 ? (
              <div className="divide-y divide-white/5">
                {items.map((item) => (
                  <div 
                    key={item.id}
                    className="px-6 py-5 hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  >
                    <div className="flex gap-4">
                      <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center bg-white/5 border border-white/5`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
                            {item.title}
                          </h4>
                          <span className="text-[9px] font-bold text-gray-600 uppercase whitespace-nowrap">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed mb-2">
                          {item.desc}
                        </p>
                        {item.location && (
                          <div className="flex items-center gap-1.5 text-[10px] text-blue-400/70 font-bold uppercase tracking-widest">
                            <MapPin className="w-3 h-3" /> {item.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 px-6 text-center">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6 text-gray-600" />
                </div>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Everything is up to date</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5">
            <Link 
              to={isAlert ? "/alerts" : "/dashboard"}
              onClick={onClose}
              className="flex items-center justify-center gap-2 text-[11px] font-black text-blue-400 uppercase tracking-[0.2em] group"
            >
              View all {isAlert ? 'alerts' : 'activity'}
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationDropdown;