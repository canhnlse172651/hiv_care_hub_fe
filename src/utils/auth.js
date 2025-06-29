import { authenService } from '@/services/authenService';

/**
 * Secure Authentication Manager
 * Handles token storage, refresh, and user session management
 */
class AuthManager {
  constructor() {
    this.AUTH_KEY = 'auth_session';
    this.REFRESH_KEY = 'refresh_token';
    this.USER_KEY = 'user_profile';
  }

  /**
   * Store authentication data securely
   * @param {Object} authData - Authentication data from server
   */
  setAuth(authData = {}) {
    if (!authData?.accessToken) {
      console.warn('No access token provided to setAuth');
      return;
    }

    try {
      // Store access token in sessionStorage (cleared on tab close)
      sessionStorage.setItem(this.AUTH_KEY, authData.accessToken);
      
      // Store refresh token in localStorage (persists across sessions)
      if (authData.refreshToken) {
        localStorage.setItem(this.REFRESH_KEY, authData.refreshToken);
      }
      
      // Store minimal user data (no sensitive info)
      if (authData.user) {
        const safeUserData = {
          id: authData.user.id,
          name: authData.user.name,
          email: authData.user.email,
          role: authData.user.role,
          avatar: authData.user.avatar
        };
        sessionStorage.setItem(this.USER_KEY, JSON.stringify(safeUserData));
      }

      // Clean up old storage keys
      this.cleanupOldStorage();
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  }

  /**
   * Get access token from session storage
   */
  getAccessToken() {
    return sessionStorage.getItem(this.AUTH_KEY);
  }

  /**
   * Get refresh token from local storage
   */
  getRefreshToken() {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  /**
   * Get user profile from session storage
   */
  getUser() {
    try {
      const userData = sessionStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  /**
   * Get complete auth data object
   */
  getAuth() {
    return {
      accessToken: this.getAccessToken(),
      refreshToken: this.getRefreshToken(),
      user: this.getUser()
    };
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getAccessToken();
  }

  /**
   * Check if user has specific role
   */
  hasRole(requiredRole) {
    const user = this.getUser();
    return user?.role === requiredRole;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles) {
    const user = this.getUser();
    return Array.isArray(roles) ? roles.includes(user?.role) : user?.role === roles;
  }

  /**
   * Clear all authentication data
   */
  clearAuth() {
    try {
      sessionStorage.removeItem(this.AUTH_KEY);
      sessionStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.REFRESH_KEY);
      this.cleanupOldStorage();
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  /**
   * Clean up old storage keys
   */
  cleanupOldStorage() {
    try {
      localStorage.removeItem('auth');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Error cleaning up old storage:', error);
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authenService.refreshToken({ refreshToken });
      
      if (response.data?.data) {
        this.setAuth(response.data.data);
        return response.data.data.accessToken;
      }
      
      throw new Error('Invalid refresh response');
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearAuth();
      throw error;
    }
  }

  /**
   * Logout user and clear all data
   */
  async logout() {
    try {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        await authenService.logout({ refreshToken });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      this.clearAuth();
    }
  }

  /**
   * Update user profile data
   */
  updateUser(userData) {
    try {
      if (userData) {
        const safeUserData = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          avatar: userData.avatar
        };
        sessionStorage.setItem(this.USER_KEY, JSON.stringify(safeUserData));
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  }
}

// Export singleton instance
export const authManager = new AuthManager();

// Export convenience functions for backward compatibility
export const localToken = {
  set: (data) => authManager.setAuth(data),
  get: () => authManager.getAuth(),
  remove: () => authManager.clearAuth(),
  getUser: () => authManager.getUser(),
  getAccessToken: () => authManager.getAccessToken(),
  getRefreshToken: () => authManager.getRefreshToken()
}; 