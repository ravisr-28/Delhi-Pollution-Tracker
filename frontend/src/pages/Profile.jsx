import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  User, Mail, Shield, Bell, Save, Loader2,
  CheckCircle2, AlertCircle, ArrowLeft, MapPin, Clock
} from 'lucide-react';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setEmailAlerts(user.emailAlerts !== false);
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, emailAlerts }),
      });

      const data = await res.json();

      if (res.ok) {
        updateUser({ name, emailAlerts });
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }

    setSaving(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  if (!user) return null;

  const memberSince = user.iat
    ? new Date(user.iat * 1000).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown';

  return (
    <div className="min-h-screen bg-[#030712] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-6 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-blue-500/25">
              {name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Profile Settings</h1>
              <p className="text-sm text-gray-500">Manage your account and preferences</p>
            </div>
          </div>
        </motion.div>

        {/* Status Message */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 text-sm font-semibold ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </motion.div>
        )}

        {/* Profile Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 mb-6"
        >
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
            <User className="w-4 h-4" />
            Account Information
          </h2>

          <div className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold transition-transform group-focus-within:scale-110">
                  {name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-16 pr-4 py-4 rounded-xl border border-white/[0.06] bg-white/[0.03] text-white placeholder-gray-600 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40 transition-all"
                  placeholder="Your name"
                />
              </div>
            </div>

            {/* Email (read-only) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/[0.04] bg-white/[0.01] text-gray-500 text-sm font-medium outline-none cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] text-gray-600 ml-1">Email cannot be changed</p>
            </div>
          </div>
        </motion.div>

        {/* Preferences Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 mb-6"
        >
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notification Preferences
          </h2>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] cursor-pointer hover:bg-white/[0.04] transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Email Alerts</div>
                  <div className="text-xs text-gray-500">Receive AQI alerts via email</div>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 rounded-full bg-white/10 peer-checked:bg-blue-600 transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-lg transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          </div>
        </motion.div>

        {/* Account Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 mb-8"
        >
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Account Details
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-white/[0.04]">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                Member since
              </div>
              <span className="text-sm text-gray-300 font-medium">{memberSince}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/[0.04]">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Shield className="w-3.5 h-3.5" />
                Account type
              </div>
              <span className="text-sm text-gray-300 font-medium">{user.role === 'admin' ? 'Admin' : 'User'}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-3.5 h-3.5" />
                Region
              </div>
              <span className="text-sm text-gray-300 font-medium">Delhi NCR</span>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-4"
        >
          <motion.button
            onClick={handleSave}
            disabled={saving}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm uppercase tracking-wider shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </motion.button>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-6 py-4 rounded-2xl border border-rose-500/20 text-rose-400 font-bold text-sm uppercase tracking-wider hover:bg-rose-500/10 transition-all"
          >
            Logout
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;