import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const error = useAuthStore((state) => state.error);
  const hydrateSession = useAuthStore((state) => state.hydrateSession);
  const login = useAuthStore((state) => state.login);
  const tempLogin = useAuthStore((state) => state.tempLogin);
  const register = useAuthStore((state) => state.register);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const logout = useAuthStore((state) => state.logout);
  const clearError = useAuthStore((state) => state.clearError);

  return {
    user,
    isAuthenticated,
    isHydrating,
    error,
    hydrateSession,
    login,
    tempLogin,
    register,
    updateProfile,
    logout,
    clearError,
  };
}
