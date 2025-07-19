import axiosInstance from '../utils/axiosInstance';

export const testService = {
  // Get all tests
  getAllTests: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/tests', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get test by ID
  getTestById: async (id) => {
    try {
      const response = await axiosInstance.get(`/tests/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new test
  createTest: async (data) => {
    try {
      const response = await axiosInstance.post('/tests', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update test
  updateTest: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/tests/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete test
  deleteTest: async (id) => {
    try {
      const response = await axiosInstance.delete(`/tests/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search tests
  searchTests: async (query) => {
    try {
      const response = await axiosInstance.get('/tests/search', {
        params: { query }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get tests by category
  getTestsByCategory: async (category) => {
    try {
      const response = await axiosInstance.get('/tests/category', {
        params: { category }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get tests by type (quantitative/qualitative)
  getTestsByType: async (isQuantitative) => {
    try {
      const response = await axiosInstance.get('/tests/type', {
        params: { isQuantitative }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 