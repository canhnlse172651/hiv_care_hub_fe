import axiosInstance from "@/utils/axiosInstance";

export const protocolService = {
  getProtocols(params = {}) {
    return axiosInstance.get('/protocols', { params });
  },

  getProtocolById(id) {
    return axiosInstance.get(`/protocols/${id}`);
  },

  createProtocol(payload = {}) {
    return axiosInstance.post('/protocols', payload);
  },

  updateProtocol(id, payload = {}) {
    return axiosInstance.put(`/protocols/${id}`, payload);
  },

  deleteProtocol(id) {
    return axiosInstance.delete(`/protocols/${id}`);
  },
};
