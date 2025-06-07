import axiosInstance from "@/utils/axiosInstance";
import { localToken } from "@/utils/token";

export const authenService = {
  login(payload = {}) {
    return axiosInstance.post(`/auth/login`, payload);
  },

  register(payload = {}) {
    return axiosInstance.post(`/auth/register`, payload);
  },

  refreshToken(payload = {}) {
    return axiosInstance.post(`/auth/refresh-token`, payload);
  },

  logout() {
    return axiosInstance.post(`/auth/logout`);
  },
}