import axiosInstance from '@/utils/axiosInstance';

export const medicineService = {
  createMedicine: async (data) => {
    return axiosInstance.post('/medicines', data);
  },
  getAllMedicines: async () => {
    return axiosInstance.get('/medicines');
  },
  getMedicineById: async (id) => {
    return axiosInstance.get(`/medicines/${id}`);
  },
  updateMedicine: async (id, data) => {
    return axiosInstance.put(`/medicines/${id}`, data);
  },
  deleteMedicine: async (id) => {
    return axiosInstance.delete(`/medicines/${id}`);
  },
  advancedSearch: async (params) => {
    return axiosInstance.get('/medicines/advanced-search', { params });
  },
}; 