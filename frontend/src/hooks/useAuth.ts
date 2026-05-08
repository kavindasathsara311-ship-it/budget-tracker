import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, fetchProfile, logout } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && !user && !isLoading) {
      fetchProfile();
    }
  }, [isAuthenticated, user, isLoading, fetchProfile]);

  return { user, isAuthenticated, isLoading, logout };
};
