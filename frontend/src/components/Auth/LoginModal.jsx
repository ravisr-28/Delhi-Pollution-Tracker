import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LogIn, Mail, Lock, X, Shield, Loader2, AlertCircle } from 'lucide-react';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setLoginError('');
    const result = await login(formData.email, formData.password);
    if (result.success) {
      if (onLoginSuccess) onLoginSuccess();
      onClose();
    } else {
      setLoginError(result.message || 'Authentication failed');
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#050a18]/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`relative w-full max-w-md overflow-hidden rounded-[2.5rem] border p-8 shadow-2xl ${
              theme === 'dark' 
                ? 'bg-slate-900 border-white/10' 
                : 'bg-white border-slate-200'
            }`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-6 top-6 p-2 rounded-full hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5 opacity-50" />
            </button>

            {/* Header */}
            <div className="mb-8 text-center">
              <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 mb-4">
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-3xl font-black tracking-tight mb-2">Login Required</h2>
              <p className="text-sm opacity-60">Authentication is mandatory to access the intelligence dashboard.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {loginError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-bold flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  {loginError}
                </motion.div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest opacity-50 ml-1">Email Protocol</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="agent@delhi-aqi.pro"
                    className={`w-full pl-11 pr-4 py-4 rounded-2xl border transition-all focus:ring-2 focus:ring-blue-500/20 outline-none font-medium ${
                      theme === 'dark' ? 'bg-white/5 border-white/5 placeholder:opacity-20' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest opacity-50 ml-1">Key Authorization</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-4 py-4 rounded-2xl border transition-all focus:ring-2 focus:ring-blue-500/20 outline-none font-medium ${
                      theme === 'dark' ? 'bg-white/5 border-white/5 placeholder:opacity-20' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
                {errors.password && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                {loading ? 'Authorizing...' : 'Establish Connection'}
              </button>
            </form>

            <div className="mt-8 text-center bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10">
              <p className="text-xs font-medium opacity-60">
                Encrypted with RSA-4096. Your credentials are secure.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


export default LoginModal;