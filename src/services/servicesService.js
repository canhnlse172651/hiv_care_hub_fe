import axiosInstance from "@/utils/axiosInstance";

export const servicesService = {
  getPublicServices: (params) => {
    return axiosInstance.get('/services/public', { params });
  },
}; 