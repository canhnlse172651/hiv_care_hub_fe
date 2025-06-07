import axios from "axios";
import { BASE_URL } from "@/constant/environment";
import { localToken } from "./token";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  // Add timeout to prevent hanging requests
  timeout: 15000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localToken.get()?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log outgoing requests (helpful for debugging)
    console.log(
      `API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      {
        headers: config.headers,
        data: config.data,
      }
    );

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful responses (helpful for debugging)
    console.log(
      `API Response: ${response.status} ${response.config.url}`,
      {
        data: response.data,
      }
    );

    return response;
  },
  async (error) => {
    // Log detailed error information
    console.error("Response error:", {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });

    const originalRequest = error.config;

    // Handle token refresh for 401/403 errors
    if (
      (error.response?.status === 403 || error.response?.status === 401) &&
      !!!originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        console.log("Attempting token refresh");
        const refreshToken = localToken.get()?.refreshToken;

        if (!refreshToken) {
          console.log("No refresh token available");
          throw new Error("No refresh token");
        }

        const res = await axios.post(
          `${BASE_URL}/auth/refresh-token`,
          { refreshToken },
          { skipAuthRefresh: true } // Prevent infinite loops
        );

        console.log("Token refresh response:", res.data);

        const { token: accessToken, refreshToken: newRefreshToken } =
          res.data.data || {};

        // Save new tokens
        localToken.set({
          accessToken,
          refreshToken: newRefreshToken,
        });

        // Update auth header and retry request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Don't immediately remove token and redirect
        // Instead, let the calling code handle this specific error

        // Return the original error to be handled by calling code
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
