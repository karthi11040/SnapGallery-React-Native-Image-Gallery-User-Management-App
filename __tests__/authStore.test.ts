import { useAuthStore } from '../src/store/authStore';
import { storageService } from '../src/services/storageService';

describe('useAuthStore', () => {
  beforeEach(async () => {
    await storageService.removeUser();
    await storageService.clearSession();
    useAuthStore.setState({ user: null, isAuthenticated: false, error: null, isHydrating: false });
  });

  const testUser = {
    fullName: 'Sarah Miller',
    email: 'sarah.miller@lumina.art',
    gender: 'female',
    mobileNumber: '5550192834',
    address: '742 Evergreen Terrace',
    city: 'San Francisco, CA',
    password: 'lumina2025',
    confirmPassword: 'lumina2025',
  };

  it('registers a user successfully and sets session', async () => {
    const res = await useAuthStore.getState().register(testUser);
    expect(res.success).toBe(true);

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.email).toBe(testUser.email);
    expect(state.user?.fullName).toBe(testUser.fullName);

    // Verify stored user in storageService
    const stored = await storageService.getUser();
    expect(stored).not.toBeNull();
    expect(stored?.email).toBe(testUser.email);
  });

  it('prevents registering duplicate email', async () => {
    await useAuthStore.getState().register(testUser);
    const res = await useAuthStore.getState().register(testUser);
    expect(res.success).toBe(false);
    expect(res.error).toContain('already exists');
  });

  it('authenticates correct login credentials', async () => {
    await useAuthStore.getState().register(testUser);
    useAuthStore.setState({ user: null, isAuthenticated: false });

    const res = await useAuthStore.getState().login({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.success).toBe(true);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('rejects incorrect password', async () => {
    await useAuthStore.getState().register(testUser);
    useAuthStore.setState({ user: null, isAuthenticated: false });

    const res = await useAuthStore.getState().login({
      email: testUser.email,
      password: 'wrongpassword',
    });

    expect(res.success).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('updates profile and reflects in state immediately', async () => {
    await useAuthStore.getState().register(testUser);
    const updated = await useAuthStore.getState().updateProfile({
      fullName: 'Sarah M. Curator',
      city: 'Austin, TX',
    });

    expect(updated).toBe(true);
    expect(useAuthStore.getState().user?.fullName).toBe('Sarah M. Curator');
    expect(useAuthStore.getState().user?.city).toBe('Austin, TX');
  });

  it('clears session on logout', async () => {
    await useAuthStore.getState().register(testUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    await useAuthStore.getState().logout();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();

    const session = await storageService.getSession();
    expect(session).toBeNull();
  });
});
