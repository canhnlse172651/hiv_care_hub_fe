import axiosInstance from "@/utils/axiosInstance";
import { localToken } from "@/utils/token";

export const authenService = {
  login(payload = {}) {
    return axiosInstance.post(`/auth/login`, payload)
      .then(response => {
        if (response.data?.data) {
          localToken.set(response.data.data);
        }
        return response;
      });
  },

  register(payload = {}) {
    return axiosInstance.post(`/auth/register`, payload)
      .then(response => {
        if (response.data?.data) {
          localToken.set(response.data.data);
        }
        return response;
      });
  },

  refreshToken(payload = {}) {
    return axiosInstance.post(`/auth/refresh-token`, payload)
      .then(response => {
        if (response.data?.data) {
          localToken.set(response.data.data);
        }
        return response;
      });
  },

  logout() {
    return axiosInstance.post(`/auth/logout`)
      .then(() => {
        localToken.remove();
      });
  },

  getCurrentUser() {
    return localToken.getUser();
  },

  isAuthenticated() {
    return !!localToken.getAccessToken();
  }
};