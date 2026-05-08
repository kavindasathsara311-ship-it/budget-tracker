import { create } from 'zustand';
import { User } from '../types';
import { getProfile, logout as apiLogout } from '../api/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  fetchProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  setUser: (user) => {
    set({ user, isAuthenticated: !!user || !!localStorage.getItem('accessToken') });
  },
  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const { data } = await getProfile();
      set({ user: data, isAuthenticated: true });
    } catch (error: any) {
      set({ user: null, isAuthenticated: false });
      localStorage.removeItem('accessToken');
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    try {
      await apiLogout();
    } finally {
      localStorage.removeItem('accessToken');
      set({ user: null, isAuthenticated: false });
    }
  },
}));
