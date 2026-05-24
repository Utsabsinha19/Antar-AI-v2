// ============================================================
// AdminPage - Local session operations and data quality
// ============================================================

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Eye,
  Search,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import GlassCard from '@/components/ui/GlassCard';
import StatCard from '@/components/ui/StatCard';
import { useAnalysis } from '@/store/analysisStore';

const ChartTooltip = ({ active, payload, label }: any) => {
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

export default function AdminPage() {
  const { completedSessions, metrics } = useAnalysis();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSessions = completedSessions.filter(session =>
    session.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(session.startedAt).toLocaleDateString().includes(searchTerm)
  );

  const averages = useMemo(() => {
    if (!completedSessions.length) {
      return {
        engagement: metrics.engagement,
        attention: metrics.attentionConfidence,
        focus: metrics.deepFocus,
        voice: metrics.interactionScore,
      };
    }
    return {
      engagement: completedSessions.reduce((sum, session) => sum + session.averageEngagement, 0) / completedSessions.length,
      attention: completedSessions.reduce((sum, session) => sum + session.averageAttentionConfidence, 0) / completedSessions.length,
      focus: completedSessions.reduce((sum, session) => sum + session.averageDeepFocus, 0) / completedSessions.length,
      voice: completedSessions.reduce((sum, session) => sum + session.averageInteractionScore, 0) / completedSessions.length,
    };
  }, [completedSessions, metrics.engagement, metrics.attentionConfidence, metrics.deepFocus, metrics.interactionScore]);

  const chartData = completedSessions.slice(0, 8).reverse().map(session => ({
    name: new Date(session.startedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    engagement: session.averageEngagement,
    attention: session.averageAttentionConfidence,
    focus: session.averageDeepFocus,
  }));

  const exportAll = () => {
    const blob = new Blob([JSON.stringify(completedSessions, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'antar-ai-sessions.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const clearSessions = () => {
    localStorage.removeItem('neurolens.sessions');
    localStorage.removeItem('antar-ai.sessions');
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold">Admin Panel</h2>
          <p className="text-sm text-gray-500 mt-1">Manage real session records and monitor data quality</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportAll}
            className="px-4 py-2 rounded-xl glass text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <Download size={14} />
            Export JSON
          </button>
          <button
            onClick={clearSessions}
            className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors flex items-center gap-2"
          >
            <Trash2 size={14} />
            Clear Local Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Saved Sessions" value={completedSessions.length} icon={Users} color="#00f0ff" delay={0} />
        <StatCard title="Avg Engagement" value={`${Math.round(averages.engagement)}%`} icon={TrendingUp} color="#b44aff" delay={0.1} />
        <StatCard title="Avg Attention" value={`${Math.round(averages.attention)}%`} icon={Eye} color="#39ff14" delay={0.2} />
        <StatCard title="Live Confidence" value={`${Math.round(metrics.confidence)}%`} icon={Search} color="#ff6b35" delay={0.3} />
      </div>

      <GlassCard delay={0.2}>
        <h3 className="text-lg font-semibold mb-6">Session Quality Trend</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData.length ? chartData : [{ name: 'Current', engagement: metrics.engagement, attention: metrics.attentionConfidence, focus: metrics.deepFocus }]}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#666' }} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#666' }} tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="engagement" name="Engagement" fill="#00f0ff" radius={[4, 4, 0, 0]} opacity={0.8} />
            <Bar dataKey="attention" name="Attention" fill="#b44aff" radius={[4, 4, 0, 0]} opacity={0.7} />
            <Bar dataKey="focus" name="Deep Focus" fill="#39ff14" radius={[4, 4, 0, 0]} opacity={0.6} />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      <GlassCard delay={0.4}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Session Records</h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 w-64 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-white/10">
                {['Session', 'Started', 'Duration', 'Samples', 'Engagement', 'Attention', 'Deep Focus', 'Interaction'].map(h => (
                  <th key={h} className="text-left text-xs text-gray-500 uppercase tracking-wider py-3 px-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredSessions.length ? filteredSessions.map((session, i) => (
                <motion.tr
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-4 text-sm font-mono text-cyan-400">{session.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-400">{new Date(session.startedAt).toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{Math.round(session.durationSeconds / 60)} min</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{session.sampleCount}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{Math.round(session.averageEngagement)}%</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{Math.round(session.averageAttentionConfidence)}%</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{Math.round(session.averageDeepFocus)}%</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{Math.round(session.averageInteractionScore)}%</td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-sm text-gray-500">
                    No real session records are stored yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
