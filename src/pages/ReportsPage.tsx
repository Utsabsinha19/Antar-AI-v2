// ============================================================
// ReportsPage - Real session report generation and export
// ============================================================

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Printer, Share2 } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { CompletedSession, useAnalysis } from '@/store/analysisStore';

type FilterType = 'all' | 'strong' | 'needs-review';

function buildReportText(session: CompletedSession) {
  return [
    `Antar AI Session Report`,
    `Session: ${session.id}`,
    `Started: ${new Date(session.startedAt).toLocaleString()}`,
    `Ended: ${new Date(session.endedAt).toLocaleString()}`,
    `Duration: ${Math.round(session.durationSeconds / 60)} minutes`,
    `Samples: ${session.sampleCount}`,
    ``,
    `Average Engagement: ${Math.round(session.averageEngagement)}%`,
    `Average Attention Confidence: ${Math.round(session.averageAttentionConfidence)}%`,
    `Average Deep Focus: ${Math.round(session.averageDeepFocus)}%`,
    `Average Interaction Score: ${Math.round(session.averageInteractionScore)}%`,
    `Average Cognitive Fatigue: ${Math.round(session.averageFatigue)}%`,
    ``,
    `Scoring Model: Engagement is a function of Attention Confidence, Facial Engagement, and Interaction Score, minus a Cognitive Fatigue penalty.`,
  ].join('\n');
}

export default function ReportsPage() {
  const { completedSessions, metrics, timeline } = useAnalysis();
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = useMemo(() => {
    if (filter === 'strong') return completedSessions.filter(session => session.averageEngagement >= 75);
    if (filter === 'needs-review') return completedSessions.filter(session => session.averageEngagement < 60);
    return completedSessions;
  }, [completedSessions, filter]);

  const currentSessionSummary = {
    averageEngagement: metrics.engagement,
    averageAttention: metrics.attentionConfidence,
    averageDeepFocus: metrics.deepFocus,
    averageInteraction: metrics.interactionScore,
    sampleCount: timeline.length,
  };

  const downloadReport = (session: CompletedSession) => {
    const blob = new Blob([buildReportText(session)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${session.id}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold">Reports</h2>
          <p className="text-sm text-gray-500 mt-1">Export reports generated from real completed analysis sessions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: FileText, label: 'Completed Sessions', value: completedSessions.length.toString(), color: '#39ff14' },
          { icon: Download, label: 'Current Samples', value: currentSessionSummary.sampleCount.toString(), color: '#b44aff' },
          { icon: Printer, label: 'Live Engagement', value: `${Math.round(currentSessionSummary.averageEngagement)}%`, color: '#00f0ff' },
          { icon: Share2, label: 'Signal Confidence', value: `${Math.round(metrics.confidence)}%`, color: '#ff6b35' },
        ].map((action, i) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl" style={{ background: `${action.color}15`, border: `1px solid ${action.color}25` }}>
                <action.icon size={18} style={{ color: action.color }} />
              </div>
              <div>
                <p className="text-sm font-medium">{action.label}</p>
                <p className="text-xl font-display font-bold" style={{ color: action.color }}>{action.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['all', 'strong', 'needs-review'] as FilterType[]).map(item => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`px-4 py-2 rounded-xl text-xs capitalize transition-all ${
              filter === item
                ? 'bg-cyan-400/15 text-cyan-400 border border-cyan-400/30'
                : 'glass text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {item.replace('-', ' ')}
          </button>
        ))}
      </div>

      <GlassCard delay={0.2}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-white/10">
                {['Session', 'Date', 'Duration', 'Samples', 'Engagement', 'Attention', 'Deep Focus', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs text-gray-500 uppercase tracking-wider py-3 px-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length ? filtered.map(session => (
                <motion.tr
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-4 text-sm font-mono text-cyan-400">{session.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-400">{new Date(session.startedAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-sm text-gray-400">{Math.round(session.durationSeconds / 60)} min</td>
                  <td className="py-3 px-4 text-sm text-gray-400">{session.sampleCount}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{Math.round(session.averageEngagement)}%</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{Math.round(session.averageAttentionConfidence)}%</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{Math.round(session.averageDeepFocus)}%</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => downloadReport(session)}
                      className="p-2 rounded-lg hover:bg-cyan-400/10 text-gray-400 hover:text-cyan-400 transition-all"
                      title="Download text report"
                    >
                      <Download size={14} />
                    </button>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-sm text-gray-500">
                    No real completed sessions match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <GlassCard delay={0.3}>
        <h3 className="text-lg font-semibold mb-4">Current Live Summary</h3>
        <p className="text-xs text-gray-500 mb-6">This section updates from the active real-time analysis stream.</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: 'Engagement', value: currentSessionSummary.averageEngagement, color: '#00f0ff' },
            { label: 'Attention', value: currentSessionSummary.averageAttention, color: '#b44aff' },
            { label: 'Deep Focus', value: currentSessionSummary.averageDeepFocus, color: '#39ff14' },
            { label: 'Interaction', value: currentSessionSummary.averageInteraction, color: '#ff6b35' },
            { label: 'Confidence', value: metrics.confidence, color: '#ff006e' },
          ].map(item => (
            <div key={item.label} className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="text-2xl font-display font-bold mt-1" style={{ color: item.color }}>
                {Math.round(item.value)}%
              </p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
