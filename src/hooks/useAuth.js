import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { authManager } from '@/utils/auth';

export const useAuth = () => {
  const { profile, loading } = useSelector(state => state.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Update auth state when profile or localStorage changes
  const updateAuthState = useCallback(() => {
    const localUser = authManager.getUser();
    const hasValidToken = authManager.isAuthenticated();
    
    // Priority: Redux profile > Local storage user
    if (profile) {
      setIsAuthenticated(true);
      setCurrentUser(profile);
    } else if (localUser && hasValidToken) {
      setIsAuthenticated(true);
      setCurrentUser(localUser);
    } else {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  }, [profile]);

  useEffect(() => {
    updateAuthState();

    // Listen for storage changes (e.g., when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'auth_session' || e.key === 'user_profile' || e.key === 'refresh_token') {
        updateAuthState();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom auth events
    const handleAuthChange = () => updateAuthState();
    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, [updateAuthState]);

  // Helper functions
  const hasRole = useCallback((requiredRole) => {
    return authManager.hasRole(requiredRole);
  }, []);

  const hasAnyRole = useCallback((roles) => {
    return authManager.hasAnyRole(roles);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authManager.logout();
      updateAuthState();
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('auth-change'));
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [updateAuthState]);

  return {
    // State
    isAuthenticated,
    currentUser,
    loading,
    
    // User info
    userRole: currentUser?.role?.toLowerCase(),
    userId: currentUser?.id,
    userName: currentUser?.name,
    userEmail: currentUser?.email,
    
    // Role checks
    isAdmin: hasRole('ADMIN'),
    isDoctor: hasRole('DOCTOR'),
    isStaff: hasRole('STAFF'),
    isPatient: hasRole('PATIENT'),
    
    // Helper functions
    hasRole,
    hasAnyRole,
    logout,
    
    // Auth manager access
    authManager
  };
}; 