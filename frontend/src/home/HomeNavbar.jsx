import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../api';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Menu, X, Bell, AlertCircle } from 'lucide-react';
import NotificationDropdown from '../components/Layout/NotificationDropdown';

const navItems = [
  { name: 'Home', id: 'top' },
  { name: 'About', id: 'about' },
  { name: 'Contact', id: 'contact' },
];

export default function HomeNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [activeSection, setActiveSection] = useState('top');
  const location = useLocation();

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/aqi/latest`);
        if (res.ok) {
          const data = await res.json();
          const critical = data
            .filter(d => d.aqi > 150)
            .map(d => ({
              id: d.district,
              title: 'High AQI Warning',
              desc: `${d.district} has reached ${d.aqi} (${d.category}). Health precautions advised.`,
              time: 'Live',
              level: d.aqi > 200 ? 'critical' : 'warning',
              location: d.district,
              icon: <AlertCircle className={`w-4 h-4 ${d.aqi > 200 ? 'text-red-400' : 'text-orange-400'}`} />
            }));
          setAlerts(critical);
        }
      } catch (err) {
        console.error('Failed to fetch alerts:', err);
      }
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Update scrolled state for styling
      setScrolled(currentScrollY > 30);

      // Visibility logic: hide when scrolling down, show when scrolling up
      if (currentScrollY < 10) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      // Scroll-spy: detect which section is in view
      const sectionIds = ['contact', 'about', 'top'];
      let found = 'top';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            found = id;
            break;
          }
        }
      }
      setActiveSection(found);

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: visible ? 0 : -100,
        opacity: visible ? 1 : 0
      }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      style={{
        backgroundColor: scrolled
          ? 'rgba(5, 10, 24, 0.85)'
          : 'rgba(5, 10, 24, 0.2)',
        backdropFilter: `blur(${scrolled ? '24px' : '12px'}) saturate(180%)`,
        borderBottom: scrolled
          ? '1px solid rgba(255,255,255,0.06)'
          : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 40px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'py-3' : 'py-4 md:py-5'}`}>
          {/* Logo */}
          <Link to="/" onClick={(e) => handleNavClick(e, 'top')} className="flex items-center gap-3 group">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.08, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 12 }}
            >
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow duration-300">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#050a18] shadow-lg shadow-emerald-400/50" />
            </motion.div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-white tracking-tight">AQI</span>
                <span className="text-lg font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Pro
                </span>
              </div>
              <div className="text-[10px] text-gray-500 -mt-1 font-medium tracking-wider uppercase">
                Air Quality Intelligence
              </div>
            </div>
          </Link>

          {/* Desktop nav — floating pill */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.name}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`relative px-5 py-2 rounded-xl text-[13px] font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                      <span className="relative z-10">{item.name}</span>
                    </motion.div>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Right side — CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            {/* Live badge (desktop) */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
                Live
              </span>
            </div>

            {/* Alert */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'alerts' ? null : 'alerts')}
                className={`relative p-2.5 rounded-xl transition-all group ${activeDropdown === 'alerts' ? 'bg-white/10' : 'hover:bg-white/[0.06]'}`}
              >
                <AlertCircle className={`w-[19px] h-[19px] transition-colors ${activeDropdown === 'alerts' ? 'text-red-400' : 'text-gray-400 group-hover:text-red-400'}`} />
                {alerts.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-[#050a18]"></span>
                )}
              </button>
              <NotificationDropdown
                type="alerts"
                data={alerts}
                isOpen={activeDropdown === 'alerts'}
                onClose={() => setActiveDropdown(null)}
              />
            </div>

            {/* Notifications */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'notifications' ? null : 'notifications')}
                className={`relative p-2.5 rounded-xl transition-all group ${activeDropdown === 'notifications' ? 'bg-white/10' : 'hover:bg-white/[0.06]'}`}
              >
                <Bell className={`w-[19px] h-[19px] transition-colors ${activeDropdown === 'notifications' ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-400'}`} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-[#050a18]"></span>
              </button>
              <NotificationDropdown
                type="notifications"
                isOpen={activeDropdown === 'notifications'}
                onClose={() => setActiveDropdown(null)}
              />
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-white/[0.06] transition-all"
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-white/5"
          >
            <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              {navItems.map((item, i) => {
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                  >
                    <button
                      onClick={(e) => handleNavClick(e, item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        activeSection === item.id
                          ? 'bg-gradient-to-r from-blue-600/70 to-purple-600/70 text-white shadow-lg shadow-blue-500/10'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {item.name}
                    </button>
                  </motion.div>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}