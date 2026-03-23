import React, { useRef, useState, useEffect, Component } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BarChart3, ArrowRight, ChevronRight, Globe, MapPin, TrendingUp } from 'lucide-react';
import HomeNavbar from '../home/HomeNavbar';
import AnimatedHeadline from '../home/AnimatedHeadline';
import LiveMonitoring from '../home/LiveMonitoring';
import { Shield, Zap, Heart, Send, MessageSquare, Clock, Phone, Mail } from 'lucide-react';

// Error boundary for WebGL
class GlobeBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-[120px] animate-float select-none">🌍</div>
        </div>
      );
    }
    return this.props.children;
  }
}

const EarthGlobe = React.lazy(() => import('../home/EarthGlobe'));

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const [scrollVal, setScrollVal] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => setScrollVal(v));
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Parallax transforms
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, -80]);

  // Handle cross-page anchor scrolling
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Small delay for globe/content to load
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[200vh] bg-[#030712] overflow-x-hidden"
      style={{ scrollBehavior: 'smooth' }}
    >
      <div id="top" />
      <HomeNavbar />

      {/* ===== FULL-SCREEN 3D GLOBE BACKGROUND (sticky) ===== */}
      <div className="sticky top-0 w-full h-screen z-0">
        <div className="absolute inset-0">
          <React.Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center bg-[#030712]">
                <div className="text-[120px] animate-float select-none">🌍</div>
              </div>
            }
          >
            <GlobeBoundary>
              <EarthGlobe scrollProgress={scrollVal} />
            </GlobeBoundary>
          </React.Suspense>
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#030712]/40 via-transparent to-[#030712]/90 pointer-events-none" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#030712]/50 via-transparent to-[#030712]/50 pointer-events-none" />

        {/* ===== HERO CONTENT (overlaid on globe) ===== */}
        <motion.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 pt-20"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <AnimatedHeadline />

          {/* CTA Button */}
          <motion.div
            className="mt-10 md:mt-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
          >
            <Link to="/dashboard">
              <motion.button
                className="group relative inline-flex items-center gap-3 px-8 py-4 md:px-10 md:py-5 rounded-2xl text-base md:text-lg font-bold text-white overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Gradient bg */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient" style={{ backgroundSize: '200% 200%' }} />
                {/* Shimmer */}
                <div className="absolute inset-0 animate-shimmer" />
                {/* Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Open Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <motion.div
              className="flex flex-col items-center gap-2"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll</span>
              <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1.5">
                <motion.div
                  className="w-1 h-2 rounded-full bg-blue-400"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* ===== SCROLLABLE CONTENT BELOW ===== */}
      <div className="relative z-10 bg-[#030712]">
        {/* Seamless transition gradient */}
        <div className="absolute -top-32 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#030712] pointer-events-none" />

        {/* Live Monitoring Section */}
        <LiveMonitoring />

        {/* ===== ABOUT SECTION ===== */}
        <section id="about" className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 border-t border-white/[0.04]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">About Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                Monitoring the Planet's
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Air Quality
                </span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                AQI Pro is a comprehensive Delhi air quality intelligence platform providing real-time pollution data,
                predictive analytics, and actionable health insights across Delhi NCR areas.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-5 mb-16">
              {[
                {
                  icon: <Shield className="w-6 h-6" />,
                  title: 'Our Mission',
                  desc: 'Empowering communities in Delhi with transparent, real-time air quality data to protect public health and drive environmental action.',
                  color: 'text-blue-400',
                  glow: 'rgba(59,130,246,0.1)',
                  border: 'border-blue-500/15',
                },
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: 'Real-time Data',
                  desc: 'Our platform aggregates data from thousands of monitoring stations, satellites, and IoT sensors to deliver second-by-second pollution updates.',
                  color: 'text-purple-400',
                  glow: 'rgba(139,92,246,0.1)',
                  border: 'border-purple-500/15',
                },
                {
                  icon: <Heart className="w-6 h-6" />,
                  title: 'Health First',
                  desc: 'We translate complex pollution data into clear health recommendations, helping you make informed decisions about outdoor activities.',
                  color: 'text-emerald-400',
                  glow: 'rgba(16,185,129,0.1)',
                  border: 'border-emerald-500/15',
                },
              ].map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className={`p-6 rounded-2xl border ${card.border} backdrop-blur-xl hover:-translate-y-1 transition-transform duration-300`}
                  style={{ background: 'rgba(15,23,42,0.5)', boxShadow: `0 0 40px ${card.glow}` }}
                >
                  <div className={`${card.color} mb-4`}>{card.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Navigation / Explore Section */}
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
          <div className="max-w-5xl mx-auto">
            <motion.h3
              className="text-center text-sm font-bold text-gray-500 uppercase tracking-[0.25em] mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Explore More
            </motion.h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
              {[
                {
                  label: 'Delhi Map',
                  desc: 'Interactive pollution map',
                  href: '/heatmap',
                  icon: <Globe className="w-5 h-5" />,
                  gradient: 'from-cyan-500/15 to-blue-500/15',
                  border: 'border-cyan-500/20',
                  text: 'text-cyan-400',
                  glow: 'rgba(6,182,212,0.1)',
                },
                {
                  label: 'Analytics',
                  desc: 'Historical analysis',
                  href: '/analytics',
                  icon: <MapPin className="w-5 h-5" />,
                  gradient: 'from-orange-500/15 to-red-500/15',
                  border: 'border-orange-500/20',
                  text: 'text-orange-400',
                  glow: 'rgba(249,115,22,0.1)',
                },
                {
                  label: 'Advisory',
                  desc: 'Health recommendations',
                  href: '/advisory',
                  icon: <TrendingUp className="w-5 h-5" />,
                  gradient: 'from-emerald-500/15 to-cyan-500/15',
                  border: 'border-emerald-500/20',
                  text: 'text-emerald-400',
                  glow: 'rgba(16,185,129,0.1)',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Link to={item.href}>
                    <motion.div
                      className={`group p-6 rounded-2xl bg-gradient-to-br ${item.gradient} border ${item.border} cursor-pointer transition-shadow duration-300`}
                      style={{ boxShadow: `0 0 30px ${item.glow}` }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className={item.text}>{item.icon}</div>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <div className="mt-4">
                        <div className="text-base font-bold text-white">{item.label}</div>
                        <div className="text-sm text-gray-500 mt-1">{item.desc}</div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CONTACT SECTION ===== */}
        <section id="contact" className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 border-t border-white/[0.04]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Contact</span>
              </div>
              <h2 className="text-4xl md:text-5 font-black text-white mb-4 tracking-tight">
                Get in
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"> Touch</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">
                Have questions about air quality data or our platform? We'd love to hear from you.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Contact info */}
              <motion.div
                className="lg:col-span-2 space-y-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {[
                  { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'support@aqipro.com', color: 'text-blue-400', glow: 'rgba(59,130,246,0.1)' },
                  { icon: <MapPin className="w-5 h-5" />, label: 'Location', value: 'New Delhi, India', color: 'text-purple-400', glow: 'rgba(139,92,246,0.1)' },
                  { icon: <Phone className="w-5 h-5" />, label: 'Phone', value: '+91 98765 43210', color: 'text-emerald-400', glow: 'rgba(16,185,129,0.1)' },
                  { icon: <Clock className="w-5 h-5" />, label: 'Hours', value: 'Mon–Fri, 9AM–6PM IST', color: 'text-cyan-400', glow: 'rgba(6,182,212,0.1)' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-4 p-5 rounded-2xl border border-white/[0.06] backdrop-blur-xl hover:-translate-y-0.5 transition-transform duration-300"
                    style={{ background: 'rgba(15,23,42,0.5)', boxShadow: `0 0 30px ${item.glow}` }}
                  >
                    <div className={`${item.color} mt-0.5`}>{item.icon}</div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">{item.label}</div>
                      <div className="text-sm text-white font-medium">{item.value}</div>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Contact form - Unified with Home Page state if needed, or standalone for now */}
              <motion.div
                className="lg:col-span-3"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <form
                  className="p-6 md:p-8 rounded-3xl border border-white/[0.06] backdrop-blur-xl"
                  style={{ background: 'rgba(15,23,42,0.5)' }}
                >
                  <h3 className="text-lg font-bold text-white mb-6">Send a Message</h3>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Name</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/40 transition-all font-medium"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Email</label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/40 transition-all font-medium"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Message</label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/40 transition-all resize-none font-medium"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-black uppercase tracking-widest text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all active:scale-[0.98]"
                  >
                    <Send className="w-4 h-4 ml-1" />
                    Dispatch Message
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/[0.04] py-16 px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-white">AQI Pro</span>
            </div>
            <p className="text-xs text-gray-500">
              © 2026 AQI Pro. Delhi Air Quality Monitoring Platform.
            </p>
            <div className="flex gap-4">
              {['About', 'Contact', 'Privacy', 'Terms', 'Support'].map((t) => (
                <a
                  key={t}
                  href={t === 'About' ? '#about' : t === 'Contact' ? '#contact' : '#'}
                  onClick={(e) => {
                    if (t === 'About' || t === 'Contact') {
                      e.preventDefault();
                      const el = document.getElementById(t.toLowerCase());
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {t}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}