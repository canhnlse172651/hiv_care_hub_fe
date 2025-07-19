import axiosInstance from '../utils/axiosInstance';

export const testResultService = {
  // Get all test results
  getAllTestResults: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/test-results', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get test result by ID
  getTestResultById: async (id) => {
    try {
      const response = await axiosInstance.get(`/test-results/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new test result
  createTestResult: async (data, doctorId) => {
    try {
      const response = await axiosInstance.post('/test-results', data, {
        params: { doctorId }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update test result
  updateTestResult: async (id, data, userId) => {
    try {
      const response = await axiosInstance.put(`/test-results/${id}`, data, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete test result
  deleteTestResult: async (id) => {
    try {
      const response = await axiosInstance.delete(`/test-results/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get test results by user ID
  getTestResultsByUserId: async (userId) => {
    try {
      const response = await axiosInstance.get(`/test-results/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get test results by patient treatment ID
  getTestResultsByPatientTreatmentId: async (patientTreatmentId) => {
    try {
      const response = await axiosInstance.get(`/test-results/patient-treatment/${patientTreatmentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get test results by status
  getTestResultsByStatus: async (status, params = {}) => {
    try {
      const response = await axiosInstance.get(`/test-results/status/${status}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get test results by lab tech ID
  getTestResultsByLabTechId: async (labTechId) => {
    try {
      const response = await axiosInstance.get(`/test-results/lab-tech/${labTechId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get test results with null lab tech ID
  getTestResultsByNullLabTechId: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/test-results/null-lab-tech', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 