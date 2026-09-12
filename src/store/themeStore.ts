import { create } from 'zustand';
import { ThemeMode } from '../types/theme';
import { storageService } from '../services/storageService';

interface ThemeState {
  themeMode: ThemeMode;
  isHydrated: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  hydrateTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  themeMode: 'light', // Default to crisp white theme
  isHydrated: false,

  setThemeMode: async (mode: ThemeMode) => {
    set({ themeMode: mode });
    await storageService.saveTheme(mode);
  },

  hydrateTheme: async () => {
    const savedTheme = await storageService.getTheme();
    if (savedTheme) {
      set({ themeMode: savedTheme, isHydrated: true });
    } else {
      set({ isHydrated: true });
    }
  },
}));
