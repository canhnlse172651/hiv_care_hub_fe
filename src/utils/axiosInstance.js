import axios from "axios";
import { BASE_URL } from "@/constant/environment";
import { authManager } from "./auth";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  // Add timeout to prevent hanging requests
  timeout: 15000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = authManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log outgoing requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
        {
          headers: config.headers,
          data: config.data,
        }
      );
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor with token refresh logic
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `API Response: ${response.status} ${response.config.url}`,
        {
          data: response.data,
        }
      );
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log error details in development
    if (process.env.NODE_ENV === 'development') {
      console.error("Response error:", {
        url: error.config?.url,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
    }

    // Handle token refresh for 401/403 errors
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const newAccessToken = await authManager.refreshToken();
        
        if (newAccessToken) {
          // Update the Authorization header with the new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          
          // Retry the original request
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Token refresh failed, redirect to login
        authManager.clearAuth();
        
        // Only redirect if we're not already on a login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
