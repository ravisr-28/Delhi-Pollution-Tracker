import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  LogIn, Mail, Lock, Shield, Loader2, Globe, Eye, EyeOff,
  ArrowLeft, Fingerprint, CheckCircle2
} from 'lucide-react';
import SocialLogin from '../components/Auth/SocialLogin';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';
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
      navigate('/dashboard');
    } else {
      setLoginError(result.message || 'Authentication failed. Please try again.');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex bg-[#030712]">
      {/* Left Side — Branding & Visual */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden items-center justify-center">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[100px]" />

        {/* Content */}
        <div className="relative z-10 px-12 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/25">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black text-white">AQI</span>
                  <span className="text-xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Pro</span>
                </div>
                <div className="text-[10px] text-gray-500 font-medium tracking-wider uppercase -mt-0.5">Air Quality Intelligence</div>
              </div>
            </div>

            <h1 className="text-4xl font-black text-white leading-tight mb-4">
              Welcome to the
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Intelligence Hub
              </span>
            </h1>

            <p className="text-gray-400 text-lg leading-relaxed mb-10">
              Access real-time pollution analytics, predictive insights, and health advisories for Delhi NCR.
            </p>

            <div className="space-y-4">
              {[
                { icon: <Shield className="w-4 h-4" />, text: 'Enterprise-grade security', color: 'text-blue-400' },
                { icon: <Fingerprint className="w-4 h-4" />, text: 'Multi-factor authentication', color: 'text-purple-400' },
                { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Real-time pollution monitoring', color: 'text-emerald-400' },
              ].map((feature, i) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <div className={`${feature.color}`}>{feature.icon}</div>
                  <span className="text-sm text-gray-400 font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Decorative border */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
      </div>

      {/* Right Side — Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-12 relative">
        {/* Back to Home */}
        <motion.div
          className="absolute top-6 left-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:text-white hover:bg-white/[0.04] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>

        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-white">AQI</span>
                <span className="text-lg font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Pro</span>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-5">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Secure Access</span>
            </div>
            <h2 className="text-3xl font-black text-white mb-2">Sign in</h2>
            <p className="text-sm text-gray-500">Enter your credentials to access the dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-semibold flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-rose-400" />
                </div>
                {loginError}
              </motion.div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border bg-white/[0.03] text-white placeholder-gray-600 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-blue-500/30 ${
                    errors.email ? 'border-rose-500/40' : 'border-white/[0.06] focus:border-blue-500/40'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-rose-400 font-semibold ml-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
                <button type="button" className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-4 rounded-2xl border bg-white/[0.03] text-white placeholder-gray-600 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-blue-500/30 ${
                    errors.password ? 'border-rose-500/40' : 'border-white/[0.06] focus:border-blue-500/40'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-400 font-semibold ml-1">{errors.password}</p>}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="w-4 h-4 rounded-md border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500/20 focus:ring-offset-0"
              />
              <label htmlFor="remember-me" className="text-sm text-gray-500 font-medium">
                Keep me signed in
              </label>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm uppercase tracking-wider shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
              {loading ? 'Signing in...' : 'Sign in to Dashboard'}
            </motion.button>
          </form>

          {/* Social Login */}
          <SocialLogin />

          {/* Sign Up */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
              Create one free
            </Link>
          </p>

          {/* Security badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-gray-600">
            <Lock className="w-3 h-3" />
            <span>256-bit Encrypted Connection</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;