import { create } from 'zustand';
import { User, RegisterFormData, LoginFormData, StoredUser, AuthSession } from '../types/auth';
import { storageService } from '../services/storageService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  error: string | null;

  hydrateSession: () => Promise<void>;
  login: (formData: LoginFormData) => Promise<{ success: boolean; error?: string }>;
  tempLogin: () => Promise<{ success: boolean; error?: string }>;
  register: (formData: RegisterFormData) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updatedUser: Partial<User>) => Promise<boolean>;
  updateCredits: (credits: number) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

function toSafeUser(stored: StoredUser): User {
  return {
    fullName: stored.fullName,
    email: stored.email,
    gender: stored.gender,
    mobileNumber: stored.mobileNumber,
    address: stored.address,
    city: stored.city,
    credits: stored.credits ?? 100,
    avatarUrl: stored.avatarUrl,
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isHydrating: true,
  error: null,

  hydrateSession: async () => {
    try {
      const session = await storageService.getSession();
      if (session && session.userEmail) {
        const storedUser = await storageService.getUser();
        if (storedUser && storedUser.email.toLowerCase() === session.userEmail.toLowerCase()) {
          const savedCredits = await storageService.getUserCredits();
          storedUser.credits = savedCredits ?? storedUser.credits ?? 100;
          set({ user: toSafeUser(storedUser), isAuthenticated: true, isHydrating: false });
          return;
        }
      }
      set({ user: null, isAuthenticated: false, isHydrating: false });
    } catch {
      set({ user: null, isAuthenticated: false, isHydrating: false });
    }
  },

  register: async (formData: RegisterFormData) => {
    try {
      const existingUser = await storageService.getUser();
      if (existingUser && existingUser.email.toLowerCase() === formData.email.trim().toLowerCase()) {
        const err = 'An account with this email address already exists.';
        set({ error: err });
        return { success: false, error: err };
      }

      const initialCredits = 100;
      const storedUser: StoredUser = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        gender: formData.gender,
        mobileNumber: formData.mobileNumber.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        passwordHash: formData.password,
        createdAt: new Date().toISOString(),
        credits: initialCredits,
      };

      await storageService.saveUser(storedUser);
      await storageService.saveUserCredits(initialCredits);

      // Establish session
      const session: AuthSession = {
        userEmail: storedUser.email,
        token: `session_${Date.now()}`,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      };
      await storageService.saveSession(session);

      set({ user: toSafeUser(storedUser), isAuthenticated: true, error: null });
      return { success: true };
    } catch {
      const err = 'Failed to create account. Please try again.';
      set({ error: err });
      return { success: false, error: err };
    }
  },

  login: async (formData: LoginFormData) => {
    try {
      const storedUser = await storageService.getUser();
      if (!storedUser) {
        const err = 'No registered user found. Please register first.';
        set({ error: err });
        return { success: false, error: err };
      }

      const isEmailMatch = storedUser.email.toLowerCase() === formData.email.trim().toLowerCase();
      const isPasswordMatch = storedUser.passwordHash === formData.password;

      if (!isEmailMatch || !isPasswordMatch) {
        const err = 'Invalid email or password.';
        set({ error: err });
        return { success: false, error: err };
      }

      // Preserve / initialize credits
      const userCredits = storedUser.credits ?? (await storageService.getUserCredits()) ?? 100;
      storedUser.credits = userCredits;
      await storageService.saveUser(storedUser);
      await storageService.saveUserCredits(userCredits);

      // Save remembered credentials if requested
      if (formData.rememberSession) {
        await storageService.saveRememberedCredentials({
          email: formData.email.trim(),
          password: formData.password,
          rememberedAt: Date.now(),
        });
      } else {
        await storageService.clearRememberedCredentials();
      }

      // Establish session
      const session: AuthSession = {
        userEmail: storedUser.email,
        token: `session_${Date.now()}`,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      };
      await storageService.saveSession(session);

      set({ user: toSafeUser(storedUser), isAuthenticated: true, error: null });
      return { success: true };
    } catch {
      const err = 'Login failed. Please try again.';
      set({ error: err });
      return { success: false, error: err };
    }
  },

  tempLogin: async () => {
    try {
      const guestUser: StoredUser = {
        fullName: 'Demo Guest',
        email: 'guest@snapgallery.art',
        gender: 'unspecified',
        mobileNumber: '+1 555-0199',
        address: '100 Gallery Plaza',
        city: 'San Francisco, CA',
        passwordHash: 'guest123',
        createdAt: new Date().toISOString(),
        credits: 100,
      };

      await storageService.saveUser(guestUser);
      await storageService.saveUserCredits(100);

      const session: AuthSession = {
        userEmail: guestUser.email,
        token: `session_guest_${Date.now()}`,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      };
      await storageService.saveSession(session);

      set({ user: toSafeUser(guestUser), isAuthenticated: true, error: null });
      return { success: true };
    } catch {
      const err = 'Failed to sign in as guest. Please try again.';
      set({ error: err });
      return { success: false, error: err };
    }
  },

  updateProfile: async (updatedFields: Partial<User>) => {
    try {
      const currentUser = get().user;
      if (!currentUser) return false;

      const storedUser = await storageService.getUser();
      if (!storedUser) return false;

      const updatedStoredUser: StoredUser = {
        ...storedUser,
        ...updatedFields,
      };

      await storageService.saveUser(updatedStoredUser);
      set({ user: toSafeUser(updatedStoredUser) });
      return true;
    } catch {
      return false;
    }
  },

  updateCredits: async (newCredits: number) => {
    try {
      const currentUser = get().user;
      if (!currentUser) return false;

      const storedUser = await storageService.getUser();
      if (!storedUser) return false;

      storedUser.credits = newCredits;
      await storageService.saveUser(storedUser);
      await storageService.saveUserCredits(newCredits);

      set({ user: { ...currentUser, credits: newCredits } });
      return true;
    } catch {
      return false;
    }
  },

  logout: async () => {
    await storageService.clearSession();
    set({ user: null, isAuthenticated: false, error: null });
  },

  clearError: () => set({ error: null }),
}));
