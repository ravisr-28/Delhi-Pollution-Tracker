import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../api';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UserMenu from './UserMenu';
import NotificationDropdown from './NotificationDropdown';
import LoginModal from '../Auth/LoginModal';
import {
  Globe,
  Menu,
  X,
  Bell,
  AlertCircle,
  Home,
  BarChart2,
  Activity,
  Lightbulb,
  Map,
  Mail
} from 'lucide-react';
const navLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: <Home size={18} /> },
  { name: 'Analytics', path: '/analytics', icon: <BarChart2 size={18} /> },
  { name: 'Delhi Reports', path: '/globe', icon: <Map size={18} /> },
  { name: 'Health Advisory', path: '/advisory', icon: <Lightbulb size={18} /> },
];

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProtectedClick = (e, path) => {
    if (!user) {
      e.preventDefault();
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-3'
          }`}
        style={{
          backgroundColor: scrolled ? 'rgba(5, 10, 24, 0.92)' : 'rgba(5, 10, 24, 0.5)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#050a18] shadow-lg shadow-emerald-400/50"></div>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-white tracking-tight">AQI</span>
                  <span className="text-lg font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Pro</span>
                </div>
                <div className="text-[10px] text-gray-500 -mt-1 font-medium tracking-wider uppercase">Air Quality Intelligence</div>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center">
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                {navLinks.map(item => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={(e) => handleProtectedClick(e, item.path)}
                    className={({ isActive }) =>
                      `relative flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-300 ${isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className={isActive ? 'text-white' : 'text-gray-500'}>{item.icon}</span>
                        <span>{item.name}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </nav>

            {/* Right section */}
            <div className="flex items-center gap-1.5">
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mr-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50"></div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">Live</span>
              </div>

              <div className="relative hidden sm:block">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'alerts' ? null : 'alerts')}
                  className={`relative p-2.5 rounded-xl transition-all group ${activeDropdown === 'alerts' ? 'bg-white/10' : 'hover:bg-white/[0.06]'}`}
                >
                  <AlertCircle className={`w-[18px] h-[18px] transition-colors ${activeDropdown === 'alerts' ? 'text-red-400' : 'text-gray-400 group-hover:text-red-400'}`} />
                  {alerts.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-[#050a18]"></span>}
                </button>
                <NotificationDropdown type="alerts" data={alerts} isOpen={activeDropdown === 'alerts'} onClose={() => setActiveDropdown(null)} />
              </div>

              <div className="relative hidden sm:block">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'notifications' ? null : 'notifications')}
                  className={`relative p-2.5 rounded-xl transition-all group ${activeDropdown === 'notifications' ? 'bg-white/10' : 'hover:bg-white/[0.06]'}`}
                >
                  <Bell className={`w-[18px] h-[18px] transition-colors ${activeDropdown === 'notifications' ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-400'}`} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-[#050a18]"></span>
                </button>
                <NotificationDropdown type="notifications" isOpen={activeDropdown === 'notifications'} onClose={() => setActiveDropdown(null)} />
              </div>

              <div className="hidden sm:block w-px h-6 bg-white/10 mx-1.5"></div>
              <UserMenu />

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 rounded-xl hover:bg-white/[0.06] transition-all ml-1"
              >
                {mobileOpen ? <X className="w-5 h-5 text-gray-300" /> : <Menu className="w-5 h-5 text-gray-300" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-400 ease-in-out ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="border-t border-white/5 mt-2">
            <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              {navLinks.map(item => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={(e) => {
                    handleProtectedClick(e, item.path);
                    if (!user) return;
                    setMobileOpen(false);
                  }}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-gradient-to-r from-blue-600/70 to-purple-600/70 text-white shadow-lg shadow-blue-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => navigate('/dashboard')}
      />
    </>
  );
};

export default Header;