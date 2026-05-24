// ============================================================
// DashboardPage - Real-time analytics dashboard
// ============================================================

import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Info,
  MessageSquareQuote,
  Sparkles,
  Target,
  Users,
  XCircle,
  Zap,
  Award,
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import StatCard from '@/components/ui/StatCard';
import GaugeChart from '@/components/ui/GaugeChart';
import HeatmapChart from '@/components/ui/HeatmapChart';
import WebcamAnalysis from '@/components/webcam/WebcamAnalysis';
import { AnalysisInsight, useAnalysis } from '@/store/analysisStore';
import { useProfile } from '@/store/profileStore';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl p-3 shadow-xl">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-sm font-medium" style={{ color: entry.color }}>
          {entry.name}: {Math.round(entry.value)}%
        </p>
      ))}
    </div>
  );
};

const formatElapsed = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

const insightIcon = (type: string) => {
  switch (type) {
    case 'warning': return <AlertTriangle size={14} className="text-yellow-400" />;
    case 'success': return <CheckCircle size={14} className="text-green-400" />;
    case 'critical': return <XCircle size={14} className="text-red-400" />;
    default: return <Info size={14} className="text-cyan-400" />;
  }
};

export default function DashboardPage() {
  const {
    status,
    sessionId,
    elapsedSeconds,
    metrics,
    timeline,
    completedSessions,
    insights,
    recommendations,
    explanation,
    startSession,
    stopSession,
  } = useAnalysis();

  const { settings } = useProfile();

  useEffect(() => {
    // Automatically start the session if the setting is enabled and the session is idle.
    if (settings.webcamAutoStart && status === 'idle') {
      startSession();
    }
  }, [settings.webcamAutoStart, status, startSession]);

  const liveData = timeline.length
    ? timeline
    : [{
        time: '0:00',
        engagement: 0,
        attentionConfidence: 0,
        deepFocus: 0,
        interactionScore: 0,
        cognitiveFatigueIndex: 0,
        boredomIndex: 0
      }];

  const signalData = useMemo(() => [ // Replaced with new metrics
    { name: 'Gaze Focus', value: metrics.gazeFocus, color: '#00f0ff' },
    { name: 'Head Align', value: metrics.headAlignment, color: '#39ff14' },
    { name: 'Blink Stability', value: metrics.blinkStability, color: '#b44aff' },
    { name: 'Posture', value: metrics.postureStability, color: '#ff6b35' },
  ], [metrics.gazeFocus, metrics.headAlignment, metrics.blinkStability, metrics.postureStability]);

  const radarData = useMemo(() => [
    { subject: 'Attention', score: metrics.attentionConfidence },
    { subject: 'Deep Focus', score: metrics.deepFocus },
    { subject: 'Voice', score: metrics.voice },
    { subject: 'Framing', score: metrics.framing },
    { subject: 'Posture', score: metrics.postureStability },
    { subject: 'Confidence', score: metrics.confidence },
  ], [metrics.attentionConfidence, metrics.confidence, metrics.deepFocus, metrics.framing, metrics.postureStability, metrics.voice]);

  const sessionBars = useMemo(() => {
    const history = completedSessions.slice(0, 7).reverse().map(session => ({
      day: new Date(session.startedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      engagement: session.averageEngagement,
      attention: session.averageAttentionConfidence,
    }));
    return history.length ? history : [{ day: 'Current', engagement: metrics.engagement, attention: metrics.attentionConfidence }];
  }, [completedSessions, metrics.attentionConfidence, metrics.engagement]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${status === 'running' ? 'bg-green-400 pulse-glow' : 'bg-gray-600'}`} />
          <span className="text-sm">{status === 'running' ? 'Live Session Active' : 'No Live Session'}</span>
          <span className="text-xs text-gray-500">- {sessionId}</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock size={12} />
            <span>Duration: {formatElapsed(elapsedSeconds)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Users size={12} />
            <span>1 participant</span>
          </div>
          <button
            onClick={startSession}
            disabled={status === 'running'}
            className="px-4 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-xs font-medium hover:bg-green-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Start Session
          </button>
          <button
            onClick={stopSession}
            disabled={status !== 'running'}
            className="px-4 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            End Session
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Engagement" value={`${Math.round(metrics.engagement)}%`} icon={Zap} color="#00f0ff" delay={0} />
        <StatCard title="Attention Confidence" value={`${Math.round(metrics.attentionConfidence)}%`} icon={Eye} color="#b44aff" delay={0.1} />
        <StatCard title="Deep Focus" value={`${Math.round(metrics.deepFocus)}%`} icon={Target} color="#39ff14" delay={0.2} />
        <StatCard title="Learning Retention" value={`${Math.round(metrics.learningRetentionPrediction)}%`} icon={Award} color="#ff6b35" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2" delay={0.2}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Engagement Timeline</h3>
              <p className="text-xs text-gray-500 mt-1">Real sensor samples captured during this session</p>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Engagement</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400" /> Attention</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> Fatigue</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={liveData}>
              <defs>
                <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAttention" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b44aff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#b44aff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorFatigue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff006e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff006e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#666' }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#666' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="engagement" name="Engagement" stroke="#00f0ff" fill="url(#colorEngagement)" strokeWidth={2} />
              <Area type="monotone" dataKey="attentionConfidence" name="Attention" stroke="#b44aff" fill="url(#colorAttention)" strokeWidth={1} />
              <Area type="monotone" dataKey="cognitiveFatigueIndex" name="Fatigue" stroke="#ff006e" fill="url(#colorFatigue)" strokeWidth={1} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard delay={0.3}>
          <h3 className="text-lg font-semibold mb-2">Overall Score</h3>
          <p className="text-xs text-gray-500 mb-6">Based on Attention, Engagement, and Interaction signals</p>
          <GaugeChart value={metrics.engagement} label="Engagement" />
          <div className="grid grid-cols-2 gap-3 mt-6">
            {[
              { label: 'Gaze Focus', value: `${Math.round(metrics.gazeFocus)}%`, color: '#00f0ff' },
              { label: 'Head Align', value: `${Math.round(metrics.headAlignment)}%`, color: '#39ff14' },
              { label: 'Posture', value: `${Math.round(metrics.postureStability)}%`, color: '#b44aff' },
              { label: 'Signal', value: `${Math.round(metrics.confidence)}%`, color: '#ff6b35' },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-sm font-semibold mt-1" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard delay={0.4}>
          <h3 className="text-lg font-semibold mb-2">Signal Distribution</h3>
          <p className="text-xs text-gray-500 mb-4">Measured inputs powering the current score</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={signalData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {signalData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {signalData.map(item => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                <span className="text-gray-400">{item.name}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard delay={0.5}>
          <h3 className="text-lg font-semibold mb-2">Signal Radar</h3>
          <p className="text-xs text-gray-500 mb-4">Multi-dimensional live analysis</p>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#888' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Score" dataKey="score" stroke="#00f0ff" fill="#00f0ff" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard delay={0.6}>
          <h3 className="text-lg font-semibold mb-2">Session Trend</h3>
          <p className="text-xs text-gray-500 mb-4">Completed sessions stored locally in this browser</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sessionBars}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#666' }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#666' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="engagement" name="Engagement" fill="#00f0ff" radius={[4, 4, 0, 0]} opacity={0.8} />
              <Bar dataKey="attention" name="Attention" fill="#b44aff" radius={[4, 4, 0, 0]} opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WebcamAnalysis />
        <GlassCard delay={0.7}>
          <h3 className="text-lg font-semibold mb-2">Engagement Heatmap</h3>
          <p className="text-xs text-gray-500 mb-4">Recorded activity intensity by browser session</p>
          <HeatmapChart data={timeline} />
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">
            This heatmap visualizes engagement over time. Brighter areas indicate moments of high engagement (strong attention, focus, and voice activity), while darker areas represent periods of lower engagement. Use this to identify which parts of the session were most or least engaging.
          </p>
        </GlassCard>
      </div>

      <GlassCard delay={0.8}>
        <div className="flex items-center gap-3 mb-4">
          <MessageSquareQuote size={20} className="text-purple-400" />
          <h3 className="text-lg font-semibold">AI Decision Explanation</h3>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed mb-4">{explanation}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
          <div>
            <p className="text-xs text-gray-500 mb-1">Attention Confidence</p>
            <p className="text-lg font-display font-bold text-cyan-400">{Math.round(metrics.attentionConfidence)}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Boredom Index</p>
            <p className="text-lg font-display font-bold text-orange-400">{Math.round(metrics.boredomIndex)}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Emotion Confidence</p>
            <p className="text-lg font-display font-bold text-purple-400">N/A</p>
            <p className="text-[10px] text-gray-600">Model not active</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Overall Signal Confidence</p>
            <p className="text-lg font-display font-bold text-green-400">{Math.round(metrics.confidence)}%</p>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard delay={0.9}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-cyan-400" />
            <h3 className="text-lg font-semibold">Live Insights</h3>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {insights.map((insight, i) => (
              <InsightRow key={insight.id} insight={insight} delay={0.9 + i * 0.1} />
            ))}
          </div>
        </GlassCard>

        <GlassCard delay={1.0}>
          <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
          <p className="text-xs text-gray-500 mb-4">Generated from current measured signals</p>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <InsightRow key={rec.id} insight={rec} delay={1.0 + i * 0.1} />
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function InsightRow({ insight, delay }: { insight: AnalysisInsight; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`p-4 rounded-xl border transition-all hover:bg-white/5 ${
        insight.type === 'critical' ? 'bg-red-500/5 border-red-500/20' :
        insight.type === 'warning' ? 'bg-yellow-500/5 border-yellow-500/20' :
        insight.type === 'success' ? 'bg-green-500/5 border-green-500/20' :
        'bg-cyan-500/5 border-cyan-500/20'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{insightIcon(insight.type)}</div>
        <div className="flex-1">
          <p className="text-sm font-medium">{insight.title}</p>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">{insight.description}</p>
        </div>
        {insight.value !== undefined && (
          <span className="text-lg font-display font-bold" style={{
            color: insight.value >= 70 ? '#39ff14' : insight.value >= 50 ? '#ff6b35' : '#ff006e',
          }}>
            {Math.round(insight.value)}%
          </span>
        )}
      </div>
    </motion.div>
  );
}
