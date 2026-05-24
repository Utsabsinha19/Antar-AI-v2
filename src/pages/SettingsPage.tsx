// ============================================================
// SettingsPage — Application settings and preferences
// ============================================================

import { useState } from 'react';
import { useApp } from '@/store/appStore';
import { useProfile, UserSettings } from '@/store/profileStore';
import { Camera, Bell, Shield, Palette, Code, Save, RefreshCw, Check } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

export default function SettingsPage() {
  const { settings, updateSettings } = useProfile();
  const { darkMode, setDarkMode } = useApp();
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  type BooleanKeys = { [K in keyof UserSettings]: UserSettings[K] extends boolean ? K : never }[keyof UserSettings];

  const toggle = (key: BooleanKeys) => {
    updateSettings({ [key]: !settings[key] });
  };

  const handleSave = () => {
    if (isSaving) return;
    setIsSaving(true);
    // Simulate a save operation
    setTimeout(() => {
      setIsSaving(false);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 2000);
    }, 1200);
  };

  const Toggle = ({ enabled, onClick }: { enabled: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`relative w-11 h-6 rounded-full transition-all ${
        enabled ? 'bg-cyan-500' : 'bg-white/10'
      }`}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
        enabled ? 'left-5' : 'left-0.5'
      }`} />
    </button>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-display font-bold">Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your preferences and platform configuration</p>
      </div>

      {/* Webcam Settings */}
      <GlassCard delay={0.1}>
        <div className="flex items-center gap-3 mb-6">
          <Camera size={20} className="text-cyan-400" />
          <h3 className="text-lg font-semibold">Webcam & Analysis</h3>
        </div>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Auto-start webcam</p>
              <p className="text-xs text-gray-500 mt-0.5">Automatically start webcam when entering a session</p>
            </div>
            <Toggle enabled={settings.webcamAutoStart} onClick={() => toggle('webcamAutoStart')} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Voice analytics</p>
              <p className="text-xs text-gray-500 mt-0.5">Enable real-time voice and speech analysis</p>
            </div>
            <Toggle enabled={settings.voiceAnalytics} onClick={() => toggle('voiceAnalytics')} />
          </div>
        </div>
      </GlassCard>

      {/* Notifications */}
      <GlassCard delay={0.2}>
        <div className="flex items-center gap-3 mb-6">
          <Bell size={20} className="text-purple-400" />
          <h3 className="text-lg font-semibold">Notifications</h3>
        </div>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Push notifications</p>
              <p className="text-xs text-gray-500 mt-0.5">Receive real-time alerts and insights</p>
            </div>
            <Toggle enabled={settings.notificationsEnabled} onClick={() => toggle('notificationsEnabled')} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Email digest</p>
              <p className="text-xs text-gray-500 mt-0.5">Weekly summary of your analytics</p>
            </div>
            <Toggle enabled={settings.emailDigest} onClick={() => toggle('emailDigest')} />
          </div>
        </div>
      </GlassCard>

      {/* Appearance */}
      <GlassCard delay={0.3}>
        <div className="flex items-center gap-3 mb-6">
          <Palette size={20} className="text-orange-400" />
          <h3 className="text-lg font-semibold">Appearance</h3>
        </div>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Dark mode</p>
              <p className="text-xs text-gray-500 mt-0.5">Use dark theme across the platform</p>
            </div>
            <Toggle enabled={darkMode} onClick={() => setDarkMode(!darkMode)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Language</p>
              <p className="text-xs text-gray-500 mt-0.5">Select your preferred language</p>
            </div>
            <select
              value={settings.language}
              onChange={e => updateSettings({ language: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cyan-400/50"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
              <option value="zh">中文</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Privacy & Security */}
      <GlassCard delay={0.4}>
        <div className="flex items-center gap-3 mb-6">
          <Shield size={20} className="text-green-400" />
          <h3 className="text-lg font-semibold">Privacy & Security</h3>
        </div>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Two-factor authentication</p>
              <p className="text-xs text-gray-500 mt-0.5">Add an extra layer of security</p>
            </div>
            <Toggle enabled={settings.twoFactor} onClick={() => toggle('twoFactor')} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Data retention period</p>
              <p className="text-xs text-gray-500 mt-0.5">How long to keep session data</p>
            </div>
            <select
              value={settings.dataRetention}
              onChange={e => updateSettings({ dataRetention: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cyan-400/50"
            >
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="180">6 months</option>
              <option value="365">1 year</option>
              <option value="0">Forever</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* API */}
      <GlassCard delay={0.5}>
        <div className="flex items-center gap-3 mb-6">
          <Code size={20} className="text-cyan-400" />
          <h3 className="text-lg font-semibold">API & Integrations</h3>
        </div>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">API access</p>
              <p className="text-xs text-gray-500 mt-0.5">Enable REST API access for integrations</p>
            </div>
            <Toggle enabled={settings.apiAccess} onClick={() => toggle('apiAccess')} />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">API Key</p>
            <div className="flex gap-2">
              <input
                type="text"
                value="antai_sk_7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c"
                readOnly
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-gray-400"
              />
              <button className="px-4 py-2.5 rounded-xl glass text-xs text-cyan-400 hover:bg-cyan-400/10 transition-all">
                Copy
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Auto-export reports</p>
              <p className="text-xs text-gray-500 mt-0.5">Automatically export reports to connected services</p>
            </div>
            <Toggle enabled={settings.autoExport} onClick={() => toggle('autoExport')} />
          </div>
        </div>
      </GlassCard>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving || showConfirmation}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-70"
      >
        {isSaving ? (
          <>
            <RefreshCw size={16} className="animate-spin" />
            Saving...
          </>
        ) : showConfirmation ? (
          <>
            <Check size={16} />
            Settings Saved!
          </>
        ) : (
          <>
            <Save size={16} />
            Save Settings
          </>
        )}
      </button>
    </div>
  );
}
