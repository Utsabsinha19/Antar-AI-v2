// ============================================================
// AnalyticsPage - Live and historical real-session analytics
// ============================================================

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Activity, Calendar, Mic, Volume2 } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import GaugeChart from '@/components/ui/GaugeChart';
import { useAnalysis } from '@/store/analysisStore';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl p-3 shadow-xl">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-sm font-medium" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? Math.round(entry.value) : entry.value}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'voice' | 'sessions'>('overview');
  const { metrics, timeline, completedSessions } = useAnalysis();

  const chartData = timeline.length
    ? timeline
    : [{ time: '0:00', engagement: 0, attentionConfidence: 0, deepFocus: 0, interactionScore: 0, cognitiveFatigueIndex: 0, boredomIndex: 0 }];

  const sessionRows = completedSessions.map(session => ({
    ...session,
    date: new Date(session.startedAt).toLocaleDateString(),
    duration: `${Math.round(session.durationSeconds / 60)} min`,
  }));

  const sessionComparison = useMemo(() => (
    completedSessions.slice(0, 8).reverse().map(session => ({
      name: new Date(session.startedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      engagement: session.averageEngagement,
      attention: session.averageAttentionConfidence,
      focus: session.averageDeepFocus,
      voice: session.averageInteractionScore,
    }))
  ), [completedSessions]);

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Activity },
    { id: 'voice' as const, label: 'Voice Signal', icon: Mic },
    { id: 'sessions' as const, label: 'Session History', icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-2 inline-flex gap-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-cyan-400/15 text-cyan-400'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <GlassCard delay={0.1}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Live Engagement Model</h3>
                <p className="text-xs text-gray-500 mt-1">Signals captured from camera, microphone, and tab visibility</p>
              </div>
              <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Engagement</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400" /> Attention</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" /> Focus</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="engagementFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#666' }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#666' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="engagement" name="Engagement" stroke="#00f0ff" fill="url(#engagementFill)" strokeWidth={2} />
                <Line type="monotone" dataKey="attentionConfidence" name="Attention" stroke="#b44aff" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="deepFocus" name="Focus" stroke="#39ff14" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard delay={0.2}>
              <h3 className="text-lg font-semibold mb-2">Attention and Focus</h3>
              <p className="text-xs text-gray-500 mb-4">Frame presence, framing quality, tab visibility, and stability</p>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#666' }} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#666' }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="attentionConfidence" name="Attention" stroke="#00f0ff" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="deepFocus" name="Focus" stroke="#39ff14" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </GlassCard>

            <GlassCard delay={0.3}>
              <h3 className="text-lg font-semibold mb-2">Model Confidence</h3>
              <p className="text-xs text-gray-500 mb-4">Higher when more real signals are available</p>
              <div className="grid grid-cols-2 gap-4">
                <GaugeChart value={metrics.confidence} size={150} label="Confidence" color="#00f0ff" />
                <GaugeChart value={metrics.postureStability} size={150} label="Stability" color="#39ff14" />
              </div>
            </GlassCard>
          </div>
        </motion.div>
      )}

      {activeTab === 'voice' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassCard delay={0} className="text-center">
              <GaugeChart value={metrics.interactionScore} size={140} label="Interaction" color="#b44aff" />
            </GlassCard>
            <GlassCard delay={0.1} className="text-center">
              <GaugeChart value={metrics.engagement} size={140} label="Engage" color="#00f0ff" />
            </GlassCard>
            <GlassCard delay={0.2} className="text-center">
              <GaugeChart value={metrics.deepFocus} size={140} label="Focus" color="#39ff14" />
            </GlassCard>
            <GlassCard delay={0.3} className="text-center">
              <GaugeChart value={metrics.confidence} size={140} label="Signal" color="#ff6b35" />
            </GlassCard>
          </div>

          <GlassCard delay={0.4}>
            <div className="flex items-center gap-2 mb-6">
              <Volume2 size={18} className="text-cyan-400" />
              <h3 className="text-lg font-semibold">Voice Energy Timeline</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="voiceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b44aff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#b44aff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#666' }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#666' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="interactionScore" name="Voice" stroke="#b44aff" fill="url(#voiceFill)" strokeWidth={2} />
                <Line type="monotone" dataKey="engagement" name="Engagement" stroke="#00f0ff" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>
      )}

      {activeTab === 'sessions' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <GlassCard delay={0.1}>
            <h3 className="text-lg font-semibold mb-6">Real Session History</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Session', 'Date', 'Duration', 'Engagement', 'Attention', 'Deep Focus', 'Interaction', 'Samples'].map(h => (
                      <th key={h} className="text-left text-xs text-gray-500 uppercase tracking-wider py-3 px-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sessionRows.length ? sessionRows.map(session => (
                    <tr key={session.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-sm font-mono text-cyan-400">{session.id}</td>
                      <td className="py-3 px-4 text-sm text-gray-300">{session.date}</td>
                      <td className="py-3 px-4 text-sm text-gray-300">{session.duration}</td>
                      <ScoreCell value={session.averageEngagement} />
                      <ScoreCell value={session.averageAttentionConfidence} />
                      <ScoreCell value={session.averageDeepFocus} />
                      <ScoreCell value={session.averageInteractionScore} />
                      <td className="py-3 px-4 text-sm text-gray-300">{session.sampleCount}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-sm text-gray-500">
                        No completed real sessions yet. Start and stop a live analysis session to save one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>

          <GlassCard delay={0.2}>
            <h3 className="text-lg font-semibold mb-6">Session Score Comparison</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={sessionComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#666' }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#666' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="engagement" name="Engagement" fill="#00f0ff" radius={[4, 4, 0, 0]} opacity={0.8} />
                <Bar dataKey="attention" name="Attention" fill="#b44aff" radius={[4, 4, 0, 0]} opacity={0.7} />
                <Bar dataKey="focus" name="Deep Focus" fill="#39ff14" radius={[4, 4, 0, 0]} opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}

function ScoreCell({ value }: { value: number }) {
  return (
    <td className="py-3 px-4">
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.round(value)}%`,
              background: value >= 80 ? '#39ff14' : value >= 60 ? '#00f0ff' : '#ff006e',
            }}
          />
        </div>
        <span className="text-sm font-medium">{Math.round(value)}%</span>
      </div>
    </td>
  );
}
