import axiosInstance from "@/utils/axiosInstance";

export const servicesService = {
  // Get all services (admin, with pagination, filter, search)
  getAllServices: (params = {}) => {
    return axiosInstance.get('/services', { params });
  },
  // Get public services (active, with pagination, search)
  getPublicServices: (params = {}) => {
    return axiosInstance.get('/services/public', { params });
  },
  // Get service by id
  getServiceById: (id) => {
    return axiosInstance.get(`/services/${id}`);
  },
  // Create new service
  createService: (data) => {
    return axiosInstance.post('/services', data);
  },
  // Update service (PATCH)
  updateService: (id, data) => {
    return axiosInstance.patch(`/services/${id}`, data);
  },
  // Delete service
  deleteService: (id) => {
    return axiosInstance.delete(`/services/${id}`);
  },
}; 