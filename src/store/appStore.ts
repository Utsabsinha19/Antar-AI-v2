// ============================================================
// Antar AI - Global Application State (React Context)
// ============================================================

import { createContext, useContext } from 'react';

export type Page = 'home' | 'dashboard' | 'analytics' | 'reports' | 'profile' | 'settings' | 'admin' | 'login' | 'register';

export interface AppState {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  chatOpen: boolean;
  setChatOpen: (val: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (val: boolean) => void;
  webcamActive: boolean;
  setWebcamActive: (val: boolean) => void;
}

export const AppContext = createContext<AppState | null>(null);

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
