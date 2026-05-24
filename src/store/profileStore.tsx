import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export interface UserProfile {
  fullName: string;
  avatarUrl: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  plan: string;
  goal: string;
  bio: string;
}

export interface UserSettings {
  webcamAutoStart: boolean;
  notificationsEnabled: boolean;
  emailDigest: boolean;
  voiceAnalytics: boolean;
  language: string;
  dataRetention: string;
  apiAccess: boolean;
  twoFactor: boolean;
  autoExport: boolean;
}

interface ProfileState {
  profile: UserProfile;
  initials: string;
  updateProfile: (updates: Partial<UserProfile>) => void;
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
}

const defaultProfile: UserProfile = {
  fullName: 'Your Name',
  avatarUrl: '',
  role: 'Engagement Strategist',
  company: 'Antar AI Workspace',
  email: 'you@example.com',
  phone: '',
  location: '',
  website: '',
  plan: 'Builder Plan',
  goal: 'Build clearer, more human-aware digital sessions.',
  bio: 'Use this profile to personalize your Antar AI workspace, reports, and engagement analysis.',
};

const defaultSettings: UserSettings = {
  webcamAutoStart: true,
  notificationsEnabled: true,
  emailDigest: false,
  voiceAnalytics: true,
  language: 'en',
  dataRetention: '90',
  apiAccess: true,
  twoFactor: false,
  autoExport: false,
};

const ProfileContext = createContext<ProfileState | null>(null);

function loadProfile() {
  try {
    const saved = localStorage.getItem('antar-ai.profile') || localStorage.getItem('neurolens.profile');
    return saved ? { ...defaultProfile, ...JSON.parse(saved) } as UserProfile : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

function loadSettings() {
  try {
    const saved = localStorage.getItem('antar-ai.settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'NL';
  return parts.slice(0, 2).map(part => part[0]?.toUpperCase()).join('');
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [settings, setSettings] = useState<UserSettings>(loadSettings);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(currentProfile => {
      const newProfile = { ...currentProfile, ...updates };
      localStorage.setItem('antar-ai.profile', JSON.stringify(newProfile));
      return newProfile;
    });
  };

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings(currentSettings => {
      const newSettings = { ...currentSettings, ...updates };
      localStorage.setItem('antar-ai.settings', JSON.stringify(newSettings));
      return newSettings;
    });
  };

  const value = useMemo(() => ({
    profile,
    initials: getInitials(profile.fullName),
    updateProfile,
    settings,
    updateSettings,
  }), [profile, settings]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be inside ProfileProvider');
  return ctx;
}
