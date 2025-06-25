import axiosInstance from '@/utils/axiosInstance';

export const regimenService = {
  // Get all treatment protocols with pagination and filtering
  getAllRegimens: async (params = {}) => {
    try {
      // Build params object, only including non-empty values
      const requestParams = {};
      
      if (params.page) requestParams.page = params.page;
      if (params.limit) requestParams.limit = params.limit;
      if (params.search && params.search.trim()) requestParams.search = params.search.trim();
      if (params.targetDisease && params.targetDisease.trim()) requestParams.targetDisease = params.targetDisease.trim();
      if (params.sortBy && params.sortBy.trim()) requestParams.sortBy = params.sortBy.trim();
      if (params.sortOrder && params.sortOrder.trim()) requestParams.sortOrder = params.sortOrder.trim();

      const response = await axiosInstance.get('/treatment-protocols', {
        params: requestParams
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a single treatment protocol by ID
  getRegimenById: async (id) => {
    try {
      const response = await axiosInstance.get(`/treatment-protocols/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new treatment protocol
  createRegimen: async (data) => {
    try {
      const response = await axiosInstance.post('/treatment-protocols', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a treatment protocol
  updateRegimen: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/treatment-protocols/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a treatment protocol
  deleteRegimen: async (id) => {
    try {
      const response = await axiosInstance.delete(`/treatment-protocols/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 