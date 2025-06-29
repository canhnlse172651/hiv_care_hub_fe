import axiosInstance from "@/utils/axiosInstance";
import { authManager } from "@/utils/auth";

export const authenService = {
  /**
   * Login user with email and password
   * @param {Object} payload - Login credentials
   * @returns {Promise} API response
   */
  async login(payload = {}) {
    try {
      const response = await axiosInstance.post('/auth/login', payload);
      
      if (response.data?.data) {
        authManager.setAuth(response.data.data);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Register new user
   * @param {Object} payload - Registration data
   * @returns {Promise} API response
   */
  async register(payload = {}) {
    try {
      const response = await axiosInstance.post('/auth/register', payload);
      
      if (response.data?.data) {
        authManager.setAuth(response.data.data);
      }
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Refresh access token using refresh token
   * @param {Object} payload - Contains refresh token
   * @returns {Promise} API response
   */
  async refreshToken(payload = {}) {
    try {
      const response = await axiosInstance.post('/auth/refresh-token', payload);
      
      if (response.data?.data) {
        authManager.setAuth(response.data.data);
      }
      
      return response;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  },

  /**
   * Logout user and invalidate tokens
   * @returns {Promise} API response
   */
  async logout() {
    try {
      const response = await axiosInstance.post('/auth/logout');
      authManager.clearAuth();
      return response;
    } catch (error) {
      console.error('Logout error:', error);
      // Always clear auth data even if API call fails
      authManager.clearAuth();
      throw error;
    }
  },

  /**
   * Get current user profile
   * @returns {Object|null} User profile or null
   */
  getCurrentUser() {
    return authManager.getUser();
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    return authManager.isAuthenticated();
  },

  /**
   * Get user profile from server
   * @returns {Promise} API response
   */
  async getProfile() {
    try {
      const response = await axiosInstance.get('/auth/profile');
      
      if (response.data?.data) {
        authManager.updateUser(response.data.data);
      }
      
      return response;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {Object} payload - Profile update data
   * @returns {Promise} API response
   */
  async updateProfile(payload = {}) {
    try {
      const response = await axiosInstance.put('/auth/profile', payload);
      
      if (response.data?.data) {
        authManager.updateUser(response.data.data);
      }
      
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  /**
   * Change user password
   * @param {Object} payload - Password change data
   * @returns {Promise} API response
   */
  async changePassword(payload = {}) {
    try {
      const response = await axiosInstance.put('/auth/change-password', payload);
      return response;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  /**
   * Request password reset
   * @param {Object} payload - Email for password reset
   * @returns {Promise} API response
   */
  async forgotPassword(payload = {}) {
    try {
      const response = await axiosInstance.post('/auth/forgot-password', payload);
      return response;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  /**
   * Reset password with token
   * @param {Object} payload - Reset password data
   * @returns {Promise} API response
   */
  async resetPassword(payload = {}) {
    try {
      const response = await axiosInstance.post('/auth/reset-password', payload);
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }
};