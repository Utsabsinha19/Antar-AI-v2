// ============================================================
// HomePage - Premium SaaS Landing Page for Antar AI
// ============================================================

import { motion, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import { useApp } from '@/store/appStore';
import { futureVisions, pricingPlans, useCases } from '@/data/appContent';
import {
  Brain, Eye, Mic, BarChart3, Zap, Shield, ArrowRight,
  Play, Check, Globe, Cpu, Activity, ArrowUp,
  Sparkles, Users, Award, Sun, Moon
} from 'lucide-react';
import { useState, useRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';

// Fade-in animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

const useCaseIcons = {
  creator: Play,
  education: Brain,
  research: Eye,
  people: Users,
  marketing: BarChart3,
  student: Zap,
};

const futureIcons = {
  infrastructure: Cpu,
  business: Activity,
  brand: Globe,
  collaboration: Users,
};

export default function HomePage() {
  const { setCurrentPage, darkMode, setDarkMode } = useApp();
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const isLight = !darkMode;

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowBackToTop(latest > 400);
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const yText = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const yMockup = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const yOrb1 = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const yOrb2 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  const features = [
    { icon: Eye, title: 'Real-Time Face Analysis', desc: 'Track eye movements, blink rate, head position, and micro-expressions with 60fps precision.', color: '#00f0ff', details: 'Utilizes `FaceDetector` API and custom lightweight models for high-performance tracking. Detects landmarks, bounding boxes, and basic expressions.' },
    { icon: Brain, title: 'Emotion Detection', desc: 'Identify 7 core emotions using deep learning models trained on millions of facial expressions.', color: '#b44aff', details: 'Powered by a convolutional neural network (CNN) trained on the FER+ dataset, achieving over 85% accuracy on core emotions.' },
    { icon: Activity, title: 'Attention & Focus', desc: 'Measure attention levels and focus duration with our proprietary engagement scoring algorithm.', color: '#39ff14', details: 'Combines gaze vector, head pose stability, and blink rate into a time-series model to calculate a continuous attention score.' },
    { icon: Mic, title: 'Voice Analytics', desc: 'Analyze voice tone, confidence, stress levels, and detect filler words in real-time.', color: '#ff006e', details: 'Uses Fast Fourier Transform (FFT) for energy analysis and a fine-tuned speech model for filler word detection and sentiment.' },
    { icon: BarChart3, title: 'Smart Analytics', desc: 'Beautiful dashboards with time-series data, heatmaps, and AI-generated insights.', color: '#ff6b35', details: 'Data is processed and stored locally. Visualizations are rendered using Recharts for interactive and performant charts.' },
    { icon: Zap, title: 'AI Recommendations', desc: 'Get actionable recommendations based on engagement patterns and behavioral analysis.', color: '#00f0ff', details: 'A rule-based expert system combined with statistical analysis identifies patterns and suggests improvements in real-time.' },
  ];

  const goToLogin = () => setCurrentPage('login');
  const goToRegister = () => setCurrentPage('register');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitStatus === 'submitting') return;

    setSubmitStatus('submitting');

    // Simulate a real-time API call. In a real app, you'd use a service like Formspree or a backend endpoint.
    setTimeout(() => {
      setSubmitStatus('success');
      setContactForm({ name: '', email: '', message: '' });

      // Reset the form to idle state after a few seconds so the user can send another message.
      setTimeout(() => setSubmitStatus('idle'), 4000);
    }, 1500);
  };

  return (
    <div className={`min-h-screen overflow-hidden ${
      isLight
        ? 'bg-[#eef8fc] text-slate-950'
        : 'bg-dark-900 text-gray-100 noise-bg'
    }`}>
      {/* ============ NAVBAR ============ */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-10 pt-6">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-cyan-400 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Brain size={20} className="text-white" />
            </div>
            <span className={`font-display text-lg font-bold ${isLight ? 'text-[#13558a]' : 'gradient-text'}`}>Antar AI</span>
          </div>
          <div className={`hidden md:flex items-center gap-7 px-7 py-3 rounded-full backdrop-blur-xl shadow-xl ${
            isLight
              ? 'bg-white/55 border border-white/80 text-slate-600 shadow-cyan-900/10'
              : 'bg-white/8 border border-white/10 text-gray-400'
          }`}>
            <a href="#features" className={`text-sm font-medium transition-colors ${isLight ? 'hover:text-[#0b5f86]' : 'hover:text-white'}`}>About</a>
            <a href="#usecases" className={`text-sm font-medium transition-colors ${isLight ? 'hover:text-[#0b5f86]' : 'hover:text-white'}`}>Intelligence</a>
            <a href="#future" className={`text-sm font-medium transition-colors ${isLight ? 'hover:text-[#0b5f86]' : 'hover:text-white'}`}>Impact</a>
            <a href="#pricing" className={`text-sm font-medium transition-colors ${isLight ? 'hover:text-[#0b5f86]' : 'hover:text-white'}`}>Plans</a>
            <button
              onClick={goToRegister}
              className="px-5 py-2 rounded-full bg-linear-to-r from-[#0b4f78] to-cyan-500 text-white text-sm font-semibold shadow-lg shadow-cyan-700/20"
            >
              Talk to us
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-full border transition-all ${
                isLight
                  ? 'bg-white/70 border-cyan-100 text-[#145f86] hover:bg-white'
                  : 'bg-white/5 border-white/10 text-cyan-300 hover:bg-white/10'
              }`}
              title={isLight ? 'Turn on dark theme' : 'Turn on light theme'}
            >
              {isLight ? <Moon size={17} /> : <Sun size={17} />}
            </button>
            <button onClick={goToLogin} className={`text-sm transition-colors hidden sm:block ${isLight ? 'text-slate-600 hover:text-[#0b5f86]' : 'text-gray-300 hover:text-white'}`}>
              Sign In
            </button>
            <button
              onClick={goToRegister}
              className="px-5 py-2 rounded-full bg-linear-to-r from-cyan-500 to-blue-700 text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ============ HERO SECTION ============ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-20">
        {/* Background */}
        <div className="absolute inset-0">
          {isLight ? (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(0,212,230,0.18),transparent_32%),radial-gradient(circle_at_18%_80%,rgba(20,95,134,0.12),transparent_34%)]" />
              <div className="absolute inset-0 opacity-40" style={{
                backgroundImage: 'linear-gradient(120deg, rgba(0, 212, 230, 0.12) 1px, transparent 1px), linear-gradient(60deg, rgba(13, 80, 120, 0.08) 1px, transparent 1px)',
                backgroundSize: '220px 220px',
              }} />
            </>
          ) : (
            <>
              <img src="/images/hero-bg.jpg" alt="" className="w-full h-full object-cover opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-b from-dark-900/50 via-dark-900/80 to-dark-900" />
            </>
          )}
        </div>

        {/* Grid overlay */}
        {!isLight && <div className="absolute inset-0 grid-bg opacity-50" />}

        {/* Animated orbs */}
        <motion.div
          style={{ y: yOrb1 }}
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[128px] ${isLight ? 'bg-cyan-300/30' : 'bg-cyan-500/10'}`}
        />
        <motion.div
          style={{ y: yOrb2 }}
          animate={{ x: [0, -80, 0], y: [0, 80, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[128px] ${isLight ? 'bg-blue-300/25' : 'bg-purple-500/10'}`}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-center">
            <motion.div style={{ y: yText }} className="relative">
              <div className={`hidden md:block absolute -left-8 top-4 h-[520px] w-px ${isLight ? 'bg-gradient-to-b from-cyan-300 via-cyan-400 to-blue-500' : 'bg-gradient-to-b from-cyan-400 to-purple-500'}`}>
                <span className="absolute -top-1 -left-1.5 w-3 h-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/40" />
                <span className="absolute -bottom-1 -left-1.5 w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/40" />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-[0.24em] uppercase mb-8 ${
                  isLight
                    ? 'bg-white/60 text-[#0b7796] border border-cyan-100 shadow-lg shadow-cyan-900/5'
                    : 'glass text-cyan-400'
                }`}
              >
                <Sparkles size={12} />
                Engagement intelligence
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[0.98] mb-8 tracking-normal"
              >
                <span className={isLight ? 'text-slate-950' : 'text-white'}>From signal</span>
                <br />
                <span className={isLight ? 'text-slate-950' : 'text-white'}>to </span>
                <span className="font-display italic font-normal bg-gradient-to-r from-[#1278a2] to-cyan-400 bg-clip-text text-transparent">insight.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`text-lg sm:text-xl max-w-xl mb-10 leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-400'}`}
              >
                A unified engagement engine for live attention, voice energy, focus stability, and session intelligence in one seamless flow.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row items-start gap-4"
              >
                <button
                  onClick={goToRegister}
                  className="group px-7 py-4 rounded-full bg-gradient-to-r from-cyan-400 to-[#146899] text-white font-semibold text-base hover:opacity-95 transition-all flex items-center gap-3 shadow-xl shadow-cyan-700/20"
                >
                  Request a Walkthrough
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={goToLogin}
                  className={`px-7 py-4 rounded-full font-semibold text-base transition-all flex items-center gap-3 ${
                    isLight
                      ? 'bg-white/70 text-[#145f86] border border-cyan-100 hover:bg-white'
                      : 'glass text-white hover:bg-white/10'
                  }`}
                >
                  <Play size={18} className="text-cyan-400" />
                  View Live App
                </button>
              </motion.div>
            </motion.div>

            <motion.div style={{ y: yMockup }} className="relative min-h-[560px] hidden lg:block overflow-hidden rounded-3xl">
              {/* Sliding Glassmorphism Reveal Panel */}
              <motion.div
                initial={{ x: '0%' }}
                animate={{ x: '101%' }}
                transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 z-20 glass-strong"
              />

              {/* Content that gets revealed */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="relative"
              >
                {/* The mock UI elements */}
                <div className={`absolute left-0 top-28 w-72 rounded-3xl p-5 blur-[2px] opacity-45 ${isLight ? 'bg-white/55 border border-white shadow-xl' : 'glass'}`}>
                <div className="h-7 w-32 rounded-full bg-cyan-300/30 mb-5" />
                <div className="h-44 rounded-2xl bg-cyan-400/10 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full border border-cyan-300/40" />
                </div>
              </div>

              <div className={`absolute right-0 top-28 w-72 rounded-3xl p-5 blur-[2px] opacity-45 ${isLight ? 'bg-white/55 border border-white shadow-xl' : 'glass'}`}>
                <div className="h-7 w-40 rounded-full bg-blue-300/30 mb-5" />
                <div className="space-y-3">
                  {[1, 2, 3].map(item => (
                    <div key={item} className="h-16 rounded-2xl bg-cyan-400/10" />
                  ))}
                </div>
              </div>

              <div className={`absolute left-1/2 top-20 -translate-x-1/2 w-[390px] rounded-[28px] overflow-hidden shadow-2xl ${
                isLight
                  ? 'bg-white/85 border border-white shadow-cyan-900/20'
                  : 'bg-dark-800/90 border border-white/10'
              }`}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-[10px] text-cyan-500 uppercase tracking-[0.35em] font-bold">Engagement Intelligence</p>
                    <span className="px-3 py-1 rounded-lg border border-cyan-200 text-xs text-[#145f86] font-bold">Live</span>
                  </div>
                  <h3 className={`text-lg font-bold mb-4 ${isLight ? 'text-slate-800' : 'text-white'}`}>Signal dashboard</h3>
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      { label: 'Fit', value: '83', delta: '+6' },
                      { label: 'Risk', value: '04', delta: '-2' },
                      { label: 'Flow', value: '1.4x', delta: '+0.3' },
                    ].map(item => (
                      <div key={item.label} className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-3">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{item.label}</p>
                        <p className="text-xl text-slate-800 font-bold">{item.value} <span className="text-xs text-cyan-500">{item.delta}</span></p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'Live Attention', score: 92, state: 'MATCH' },
                      { name: 'Voice Energy', score: 78, state: 'REVIEW' },
                      { name: 'Focus Stability', score: 84, state: 'MATCH' },
                      { name: 'Signal Risk', score: 66, state: 'RISK' },
                    ].map((row, index) => (
                      <div key={row.name} className="grid grid-cols-[34px_1fr_44px_70px] gap-3 items-center rounded-2xl bg-slate-50/80 border border-slate-100 p-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${index === 1 ? 'bg-orange-400' : index === 3 ? 'bg-red-500' : 'bg-cyan-600'}`}>
                          {row.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                        </div>
                        <p className="text-xs font-bold text-slate-700">{row.name}</p>
                        <span className="text-xs font-bold text-cyan-600">{row.score}</span>
                        <span className={`text-[10px] text-center rounded-full px-2 py-1 font-bold ${row.state === 'RISK' ? 'bg-red-50 text-red-500' : row.state === 'REVIEW' ? 'bg-orange-50 text-orange-500' : 'bg-cyan-50 text-cyan-600'}`}>{row.state}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-50/80 border-t border-slate-100 p-4 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-bold">Updated 2s ago</span>
                  <button className="px-4 py-2 rounded-lg bg-[#0b5f86] text-white text-xs font-bold flex items-center gap-2">Review <ArrowRight size={13} /></button>
                </div>
              </div>
              <p className={`absolute bottom-4 left-1/2 -translate-x-1/2 font-sans italic ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                Surface the right signal with the evidence trail.
              </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Live signal stack */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-16 max-w-5xl mx-auto"
          >
            {[
              { icon: Eye, title: 'Live Attention', detail: 'camera framing + presence', color: '#00f0ff' },
              { icon: Mic, title: 'Voice Energy', detail: 'microphone signal strength', color: '#b44aff' },
              { icon: Activity, title: 'Focus Stability', detail: 'real-time signal changes', color: '#39ff14' },
              { icon: Shield, title: 'Private Reports', detail: 'stored locally in browser', color: '#ff6b35' },
            ].map((signal, i) => (
              <motion.div
                key={signal.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 + i * 0.08 }}
                className={`rounded-2xl p-4 text-left border backdrop-blur-xl ${
                  isLight ? 'bg-white/60 border-white/80 shadow-lg shadow-cyan-900/5' : 'glass'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${signal.color}15`, border: `1px solid ${signal.color}30` }}
                >
                  <signal.icon size={18} style={{ color: signal.color }} />
                </div>
                <p className={`text-sm sm:text-base font-semibold ${isLight ? 'text-slate-800' : 'text-white'}`}>{signal.title}</p>
                <p className={`text-[11px] mt-1 leading-relaxed ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>{signal.detail}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ FEATURES SECTION ============ */}
      <section id="features" className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <p className="text-sm text-cyan-400 font-medium mb-3 uppercase tracking-widest">Core Features</p>
            <h2 className="text-3xl sm:text-5xl font-display font-bold mb-4">
              <span className="gradient-text">AI-Powered</span> Intelligence
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Cutting-edge computer vision and NLP technology to analyze every aspect of human engagement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 [perspective:1200px]">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="relative min-h-[300px]"
              >
                <motion.div
                  className="w-full h-full"
                  style={{ transformStyle: 'preserve-3d' }}
                  whileHover={{ rotateY: 180 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                >
                  {/* Front */}
                  <div style={{ backfaceVisibility: 'hidden' }} className="absolute inset-0">
                    <div className="glass rounded-2xl p-8 h-full flex flex-col">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shrink-0"
                        style={{ background: `${feature.color}15`, border: `1px solid ${feature.color}25` }}
                      >
                        <feature.icon size={24} style={{ color: feature.color }} />
                      </div>
                      <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                  {/* Back */}
                  <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }} className="absolute inset-0">
                    <div className="glass rounded-2xl p-8 h-full flex flex-col justify-center">
                      <h4 className="text-sm font-semibold text-cyan-400 mb-3">Technical Details</h4>
                      <p className="text-sm text-gray-300 leading-relaxed">{feature.details}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ENGAGEMENT FORMULA SECTION ============ */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5" />
        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <p className="text-sm text-purple-400 font-medium mb-3 uppercase tracking-widest">The Engine</p>
            <h2 className="text-3xl sm:text-5xl font-display font-bold mb-4">
              AI <span className="gradient-text">Engagement Score</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="glass rounded-3xl p-8 sm:p-12 text-center"
          >
            <div className="font-mono text-lg sm:text-2xl text-gray-300 mb-8">
              <span className="text-cyan-400 glow-text-cyan">Engagement = </span>
              <br className="sm:hidden" />
              ( AttentionConfidence + FacialEngagement + InteractionScore ) - CognitiveFatigue
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              {[
                { label: 'Attention', desc: 'Gaze, Head, Blink', color: '#00f0ff', icon: Eye },
                { label: 'Facial', desc: 'Smile, Expression', color: '#b44aff', icon: Brain },
                { label: 'Interaction', desc: 'Voice Activity', color: '#39ff14', icon: Users },
                { label: 'Fatigue', desc: 'Yawn, Blink Rate', color: '#ff6b35', icon: Cpu },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i + 2}
                  className="glass rounded-2xl p-5 text-center"
                >
                  <item.icon size={28} style={{ color: item.color }} className="mx-auto mb-3" />
                  <p className="text-base font-display font-bold" style={{ color: item.color }}>{item.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ USE CASES ============ */}
      <section id="usecases" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <p className="text-sm text-cyan-400 font-medium mb-3 uppercase tracking-widest">Who It's For</p>
            <h2 className="text-3xl sm:text-5xl font-display font-bold mb-4">
              Built for <span className="gradient-text">Every Industry</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((uc, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -5 }}
                className="glass rounded-2xl p-8 group hover:border-white/15 transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-400/5 rounded-full blur-3xl group-hover:bg-purple-400/10 transition-colors" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-cyan-400/20 to-purple-500/20 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    {(() => {
                      const Icon = useCaseIcons[uc.icon as keyof typeof useCaseIcons];
                      return <Icon size={22} className="text-cyan-300" />;
                    })()}
                  </div>
                  <p className="text-[10px] text-cyan-400 uppercase tracking-widest mb-2">{uc.kicker}</p>
                  <h3 className="text-xl font-semibold mb-3 leading-snug">{uc.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{uc.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FUTURE VISION ============ */}
      <section id="future" className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
        <div className="absolute left-1/2 top-24 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <p className="text-sm text-cyan-400 font-medium mb-3 uppercase tracking-widest">Future View</p>
            <h2 className="text-3xl sm:text-5xl font-display font-bold mb-4">
              Shaping <span className="gradient-text">World-Scale Engagement</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Antar AI is built for a future where every digital interaction can become clearer, faster, and more human-aware.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            custom={1}
            className="max-w-5xl mx-auto mb-20"
          >
            {/* Laptop Mockup */}
            <div className="relative">
              {/* Screen */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                viewport={{ once: true }}
                className={`relative aspect-16/10 w-full rounded-t-2xl p-2 sm:p-3 shadow-2xl z-10 ${isLight ? 'bg-slate-200 shadow-cyan-900/10' : 'bg-dark-700 shadow-cyan-900/20'}`}
              >
                <div className="w-full h-full bg-black rounded-lg sm:rounded-xl overflow-hidden relative">
                  <video
                    src="/videos/project-overview.mp4"
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    Your browser does not support the video tag.
                  </video>
                  {/* Notch */}
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 rounded-b-lg flex justify-center items-center ${isLight ? 'bg-slate-200' : 'bg-dark-700'}`}>
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
                  </div>
                </div>
              </motion.div>
              {/* Base */}
              <div className={`relative h-6 w-[105%] -mt-2 left-1/2 -translate-x-1/2 rounded-b-2xl ${isLight ? 'bg-slate-300' : 'bg-dark-800'}`}>
                <div className={`absolute top-2 left-1/2 -translate-x-1/2 w-1/4 h-1 rounded-sm ${isLight ? 'bg-slate-400/50' : 'bg-dark-900/50'}`} />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {futureVisions.map((vision, i) => (
              <motion.div
                key={vision.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 2}
                whileHover={{ y: -5 }}
                className="glass rounded-2xl p-8 relative overflow-hidden group hover:border-cyan-400/20 transition-all"
              >
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-cyan-400/5 blur-3xl group-hover:bg-purple-400/10 transition-colors" />
                <div className="relative flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-cyan-400/20 to-purple-500/20 border border-white/10 flex items-center justify-center shrink-0">
                    {(() => {
                      const Icon = futureIcons[vision.icon as keyof typeof futureIcons];
                      return <Icon size={24} className="text-cyan-300" />;
                    })()}
                  </div>
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-cyan-300 uppercase tracking-widest mb-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-glow" />
                      {vision.pulse}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{vision.title}</h3>
                    <p className="text-sm text-white mb-3">{vision.horizon}</p>
                    <p className="text-sm text-gray-400 leading-relaxed">{vision.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <p className="text-sm text-purple-400 font-medium mb-3 uppercase tracking-widest">Pricing</p>
            <h2 className="text-3xl sm:text-5xl font-display font-bold mb-4">
              Simple, <span className="gradient-text">Transparent</span> Pricing
            </h2>
            <p className="text-gray-400">Start free, upgrade when you're ready.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="flex justify-center items-center gap-4 mb-10"
          >
            <span className={`text-sm font-medium transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                billingCycle === 'annual' ? 'bg-cyan-500' : 'bg-white/10'
              }`}
            >
              <motion.div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"
                layout
                transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                style={{ left: billingCycle === 'monthly' ? '2px' : '26px' }}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${billingCycle === 'annual' ? 'text-white' : 'text-gray-500'}`}>Annual</span>
            <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-semibold">Save 20%</span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, i) => {
              const annualPrice = plan.price > 0 ? Math.round(plan.price * 12 * 0.8) : 0;
              const displayPrice = billingCycle === 'annual' ? Math.round(annualPrice / 12) : plan.price;

              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i + 2}
                  whileHover={{ y: -5 }}
                  className={`glass rounded-2xl p-8 relative flex flex-col ${
                    plan.popular ? 'border-cyan-400/30 glow-cyan' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-xs font-semibold">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-display font-bold mb-2">{plan.name}</h3>
                  <p className="text-xs text-gray-400 mb-5">{plan.description}</p>
                  <div className="mb-6 min-h-[70px]">
                    <span className="text-4xl font-display font-bold gradient-text">
                      {displayPrice === 0 ? 'Free' : `$${displayPrice}`}
                    </span>
                    {plan.price > 0 && <span className="text-gray-500 text-sm">/month</span>}
                    {billingCycle === 'annual' && plan.price > 0 && (
                      <p className="text-xs text-gray-400 mt-1">Billed as ${annualPrice} per year</p>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                        <Check size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="grow" />

                  {plan.name !== 'Starter' && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-left mb-8">
                      <h4 className="text-xs font-semibold text-cyan-400 mb-2">Who is this for?</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {plan.name === 'Professional'
                          ? 'Individual creators, researchers, and small teams who need deep insights to optimize content and user experiences.'
                          : 'Organizations requiring advanced security, scalability, and custom models to drive business-wide engagement intelligence.'}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={goToRegister}
                    className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:opacity-90'
                        : 'glass text-white hover:bg-white/10'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ CONTACT FORM ============ */}
      <section id="contact" className="py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-12"
          >
            <p className="text-sm text-cyan-400 font-medium mb-3 uppercase tracking-widest">Contact Us</p>
            <h2 className="text-3xl sm:text-5xl font-display font-bold mb-4">
              Get in <span className="gradient-text">Touch</span>
            </h2>
          </motion.div>

          <motion.form
            onSubmit={handleContactSubmit}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="glass rounded-2xl p-8 min-h-[430px] flex flex-col justify-center"
          >
            {submitStatus === 'success' ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <Check size={48} className="mx-auto text-green-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                <p className="text-gray-400">Thank you for reaching out. We'll get back to you shortly.</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Email</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 transition-all"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Message</label>
                  <textarea
                    required
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 transition-all resize-none"
                    placeholder="Tell us about your needs..."
                  />
                </div>
                <button type="submit" disabled={submitStatus === 'submitting'} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitStatus === 'submitting' ? <><Sparkles size={16} className="animate-pulse" /> Sending...</> : 'Send Message'}
                </button>
              </div>
            )}
          </motion.form>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="py-12 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Brain size={20} className="text-cyan-400" />
                <span className="font-display font-bold gradient-text">Antar AI</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                AI-powered human engagement intelligence platform for creators, researchers, and enterprises.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'API Docs', 'Changelog'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Support', links: ['Help Center', 'Community', 'Status', 'Contact'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-sm font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-xs text-gray-500 hover:text-cyan-400 transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/5">
            <p className="text-xs text-gray-500">© 2026 Antar AI. All rights reserved.</p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <Globe size={16} className="text-gray-500 hover:text-cyan-400 cursor-pointer transition-colors" />
              <Shield size={16} className="text-gray-500 hover:text-cyan-400 cursor-pointer transition-colors" />
              <Award size={16} className="text-gray-500 hover:text-cyan-400 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors ${
              isLight
                ? 'bg-white/80 border border-cyan-100 text-[#145f86] hover:bg-white'
                : 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30'
            }`}
            title="Back to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
