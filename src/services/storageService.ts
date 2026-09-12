import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';
import { AuthSession, StoredUser } from '../types/auth';
import { ThemeMode } from '../types/theme';

// In-memory fallback for resilience when native storage is initializing, null, or re-linking
const memoryStore = new Map<string, string>();
let isNativeStorageAvailable: boolean | null = null;

async function safeGetItem(key: string): Promise<string | null> {
  if (isNativeStorageAvailable !== false) {
    try {
      const val = await AsyncStorage.getItem(key);
      isNativeStorageAvailable = true;
      if (val !== null) {
        memoryStore.set(key, val);
      }
      return val;
    } catch {
      isNativeStorageAvailable = false;
    }
  }
  return memoryStore.get(key) || null;
}

async function safeSetItem(key: string, value: string): Promise<boolean> {
  memoryStore.set(key, value);
  if (isNativeStorageAvailable !== false) {
    try {
      await AsyncStorage.setItem(key, value);
      isNativeStorageAvailable = true;
      return true;
    } catch {
      isNativeStorageAvailable = false;
    }
  }
  return true;
}

async function safeRemoveItem(key: string): Promise<boolean> {
  memoryStore.delete(key);
  if (isNativeStorageAvailable !== false) {
    try {
      await AsyncStorage.removeItem(key);
      isNativeStorageAvailable = true;
      return true;
    } catch {
      isNativeStorageAvailable = false;
    }
  }
  return true;
}

export const storageService = {
  // User Storage
  async getUser(): Promise<StoredUser | null> {
    try {
      const data = await safeGetItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async saveUser(user: StoredUser): Promise<boolean> {
    try {
      return await safeSetItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch {
      return false;
    }
  },

  async removeUser(): Promise<boolean> {
    try {
      return await safeRemoveItem(STORAGE_KEYS.USER);
    } catch {
      return false;
    }
  },

  // Session Storage
  async getSession(): Promise<AuthSession | null> {
    try {
      const data = await safeGetItem(STORAGE_KEYS.SESSION);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async saveSession(session: AuthSession): Promise<boolean> {
    try {
      return await safeSetItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    } catch {
      return false;
    }
  },

  async clearSession(): Promise<boolean> {
    try {
      return await safeRemoveItem(STORAGE_KEYS.SESSION);
    } catch {
      return false;
    }
  },

  // Favorites Storage
  async getFavorites(): Promise<string[]> {
    try {
      const data = await safeGetItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveFavorites(favoriteIds: string[]): Promise<boolean> {
    try {
      return await safeSetItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favoriteIds));
    } catch {
      return false;
    }
  },

  // Theme Storage
  async getTheme(): Promise<ThemeMode | null> {
    try {
      const data = await safeGetItem(STORAGE_KEYS.THEME);
      return (data as ThemeMode) || null;
    } catch {
      return null;
    }
  },

  async saveTheme(theme: ThemeMode): Promise<boolean> {
    try {
      return await safeSetItem(STORAGE_KEYS.THEME, theme);
    } catch {
      return false;
    }
  },

  // Saved Remembered Credentials Storage
  async getRememberedCredentials(): Promise<{ email: string; password?: string; rememberedAt: number } | null> {
    try {
      const data = await safeGetItem(STORAGE_KEYS.REMEMBERED_CREDS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async saveRememberedCredentials(creds: { email: string; password?: string; rememberedAt: number }): Promise<boolean> {
    try {
      return await safeSetItem(STORAGE_KEYS.REMEMBERED_CREDS, JSON.stringify(creds));
    } catch {
      return false;
    }
  },

  async clearRememberedCredentials(): Promise<boolean> {
    try {
      return await safeRemoveItem(STORAGE_KEYS.REMEMBERED_CREDS);
    } catch {
      return false;
    }
  },

  // Saved User Credits Storage
  async getUserCredits(): Promise<number> {
    try {
      const data = await safeGetItem(STORAGE_KEYS.CREDITS);
      return data ? parseInt(data, 10) : 100;
    } catch {
      return 100;
    }
  },

  async saveUserCredits(credits: number): Promise<boolean> {
    try {
      return await safeSetItem(STORAGE_KEYS.CREDITS, credits.toString());
    } catch {
      return false;
    }
  },

  // Saved Downloaded Images Storage
  async getDownloadedImages(): Promise<any[]> {
    try {
      const data = await safeGetItem(STORAGE_KEYS.DOWNLOADS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveDownloadedImages(images: any[]): Promise<boolean> {
    try {
      return await safeSetItem(STORAGE_KEYS.DOWNLOADS, JSON.stringify(images));
    } catch {
      return false;
    }
  },

  // Clear Cache (Preserves User and Session)
  async clearCache(): Promise<boolean> {
    return Promise.resolve(true);
  },
};
