// ============================================================
// ProfilePage - Editable user profile and workspace identity
// ============================================================

import { FormEvent, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  BarChart3,
  Briefcase,
  Calendar,
  Camera,
  Clock,
  Globe,
  Mail,
  MapPin,
  Phone,
  Save,
  Sparkles,
  Target,
  Trash2,
  Upload,
  User,
  Zap,
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import GaugeChart from '@/components/ui/GaugeChart';
import { useAnalysis } from '@/store/analysisStore';
import { useProfile, UserProfile } from '@/store/profileStore';

const inputClass = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 transition-all';

export default function ProfilePage() {
  const { profile, initials, updateProfile } = useProfile();
  const { metrics, completedSessions } = useAnalysis();
  const [form, setForm] = useState<UserProfile>(profile);
  const [saved, setSaved] = useState(false);

  const stats = useMemo(() => {
    const totalSeconds = completedSessions.reduce((sum, session) => sum + session.durationSeconds, 0);
    const bestScore = completedSessions.reduce((best, session) => Math.max(best, session.averageEngagement), metrics.engagement);
    const avgEngagement = completedSessions.length
      ? completedSessions.reduce((sum, session) => sum + session.averageEngagement, 0) / completedSessions.length
      : metrics.engagement;

    return {
      totalSessions: completedSessions.length,
      avgEngagement,
      totalTime: `${Math.floor(totalSeconds / 3600)}h ${Math.round((totalSeconds % 3600) / 60)}m`,
      bestScore,
    };
  }, [completedSessions, metrics.engagement]);

  const handleChange = (key: keyof UserProfile, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    updateProfile(form);
    setSaved(true);
  };

  const handleAvatarUpload = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      const avatarUrl = String(reader.result);
      const nextProfile = { ...form, avatarUrl };
      setForm(nextProfile);
      updateProfile(nextProfile);
      setSaved(true);
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    const nextProfile = { ...form, avatarUrl: '' };
    setForm(nextProfile);
    updateProfile(nextProfile);
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <GlassCard delay={0}>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white text-3xl font-display font-bold shadow-lg shadow-cyan-500/20 overflow-hidden">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />
                ) : initials}
              </div>
              <div className="absolute -bottom-2 -right-2 p-1.5 rounded-lg bg-dark-700 border border-white/10 text-cyan-300">
                <Camera size={12} />
              </div>
            </div>

            <div className="text-center sm:text-left flex-1">
              <p className="text-xs text-cyan-400 uppercase tracking-widest mb-2">Your Antar AI Identity</p>
              <h2 className="text-2xl font-display font-bold">{profile.fullName}</h2>
              <p className="text-sm text-gray-400 mt-1">{profile.role} at {profile.company}</p>
              <p className="text-sm text-gray-300 mt-4 max-w-2xl leading-relaxed">{profile.goal}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Mail size={12} /> {profile.email}</span>
                {profile.location && <span className="flex items-center gap-1"><MapPin size={12} /> {profile.location}</span>}
                <span className="flex items-center gap-1"><Calendar size={12} /> Profile saved locally</span>
              </div>
            </div>
          </div>

          <div className="lg:w-72 rounded-2xl bg-white/5 border border-white/10 p-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Workspace Signal</p>
            <div className="space-y-3">
              {[
                { label: 'Plan', value: profile.plan },
                { label: 'Live confidence', value: `${Math.round(metrics.confidence)}%` },
                { label: 'Saved sessions', value: stats.totalSessions.toString() },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between gap-3">
                  <span className="text-xs text-gray-500">{item.label}</span>
                  <span className="text-sm text-gray-200 font-medium truncate">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: BarChart3, label: 'Real Sessions', value: stats.totalSessions, color: '#00f0ff' },
          { icon: Zap, label: 'Avg Engagement', value: `${Math.round(stats.avgEngagement)}%`, color: '#39ff14' },
          { icon: Clock, label: 'Total Time', value: stats.totalTime, color: '#b44aff' },
          { icon: Award, label: 'Best Score', value: `${Math.round(stats.bestScore)}%`, color: '#ff6b35' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-5 text-center"
          >
            <stat.icon size={24} className="mx-auto mb-3" style={{ color: stat.color }} />
            <p className="text-xl font-display font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        <GlassCard delay={0.2}>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold">Fill Your Profile Details</h3>
              <p className="text-xs text-gray-500 mt-1">These details personalize your sidebar, reports, and workspace identity.</p>
            </div>
            {saved && <span className="text-xs text-green-400">Saved</span>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white text-xl font-display font-bold overflow-hidden flex-shrink-0">
                {form.avatarUrl ? (
                  <img src={form.avatarUrl} alt={form.fullName} className="w-full h-full object-cover" />
                ) : initials}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Profile picture</p>
                <p className="text-xs text-gray-500 mt-1">Upload a square or portrait image. It is saved locally in this browser.</p>
              </div>
              <div className="flex gap-2">
                <label className="px-4 py-2.5 rounded-xl glass text-xs text-cyan-300 hover:bg-cyan-400/10 transition-all flex items-center gap-2 cursor-pointer">
                  <Upload size={14} />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => handleAvatarUpload(e.target.files?.[0])}
                  />
                </label>
                {form.avatarUrl && (
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-all flex items-center gap-2"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field icon={User} label="Full name">
                <input className={inputClass} value={form.fullName} onChange={e => handleChange('fullName', e.target.value)} required />
              </Field>
              <Field icon={Briefcase} label="Role or title">
                <input className={inputClass} value={form.role} onChange={e => handleChange('role', e.target.value)} required />
              </Field>
              <Field icon={Briefcase} label="Company or workspace">
                <input className={inputClass} value={form.company} onChange={e => handleChange('company', e.target.value)} required />
              </Field>
              <Field icon={Sparkles} label="Plan name">
                <input className={inputClass} value={form.plan} onChange={e => handleChange('plan', e.target.value)} required />
              </Field>
              <Field icon={Mail} label="Email">
                <input className={inputClass} type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} required />
              </Field>
              <Field icon={Phone} label="Phone">
                <input className={inputClass} value={form.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="+1 555 0123" />
              </Field>
              <Field icon={MapPin} label="Location">
                <input className={inputClass} value={form.location} onChange={e => handleChange('location', e.target.value)} placeholder="City, country" />
              </Field>
              <Field icon={Globe} label="Website">
                <input className={inputClass} value={form.website} onChange={e => handleChange('website', e.target.value)} placeholder="https://example.com" />
              </Field>
            </div>

            <Field icon={Target} label="Primary engagement goal">
              <input className={inputClass} value={form.goal} onChange={e => handleChange('goal', e.target.value)} required />
            </Field>

            <Field icon={Sparkles} label="Short bio">
              <textarea
                className={`${inputClass} min-h-28 resize-none`}
                value={form.bio}
                onChange={e => handleChange('bio', e.target.value)}
                placeholder="What are you building, improving, or measuring with Antar AI?"
              />
            </Field>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Save size={16} />
              Save Profile
            </button>
          </form>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard delay={0.3} className="text-center">
            <h3 className="text-sm font-semibold mb-4">Attention</h3>
            <GaugeChart value={metrics.attentionConfidence} size={160} label="Attention" color="#00f0ff" />
          </GlassCard>
          <GlassCard delay={0.4} className="text-center">
            <h3 className="text-sm font-semibold mb-4">Focus</h3>
            <GaugeChart value={metrics.deepFocus} size={160} label="Deep Focus" color="#39ff14" />
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, children }: { icon: typeof User; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider mb-2">
        <Icon size={13} />
        {label}
      </span>
      {children}
    </label>
  );
}
