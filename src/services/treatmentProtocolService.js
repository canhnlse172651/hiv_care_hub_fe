import axiosInstance from '@/utils/axiosInstance';

export const treatmentProtocolService = {
  // Create new treatment protocol
  createTreatmentProtocol: async (data, userId) => {
    try {
      const response = await axiosInstance.post('/treatment-protocols', data, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all treatment protocols with pagination and search
  getAllTreatmentProtocols: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/treatment-protocols', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get treatment protocol by ID
  getTreatmentProtocolById: async (id) => {
    try {
      const response = await axiosInstance.get(`/treatment-protocols/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update treatment protocol
  updateTreatmentProtocol: async (id, data, userId) => {
    try {
      const response = await axiosInstance.put(`/treatment-protocols/${id}`, data, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete treatment protocol
  deleteTreatmentProtocol: async (id) => {
    try {
      const response = await axiosInstance.delete(`/treatment-protocols/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search treatment protocols
  searchTreatmentProtocols: async (query) => {
    try {
      const response = await axiosInstance.get('/treatment-protocols/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Advanced search treatment protocols
  advancedSearchTreatmentProtocols: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/treatment-protocols/advanced-search', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Find treatment protocol by name
  findTreatmentProtocolByName: async (name) => {
    try {
      const response = await axiosInstance.get('/treatment-protocols/find-by-name', {
        params: { name }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get most popular protocols
  getMostPopularProtocols: async (limit = 10) => {
    try {
      const response = await axiosInstance.get('/treatment-protocols/stats/popular', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get protocols with custom variations
  getProtocolsWithCustomVariations: async () => {
    try {
      const response = await axiosInstance.get('/treatment-protocols/stats/custom-variations');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get protocol trend analysis
  getProtocolTrendAnalysis: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/treatment-protocols/analytics/trends', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Bulk create treatment protocols
  bulkCreateTreatmentProtocols: async (protocols, userId, skipDuplicates = false) => {
    try {
      const response = await axiosInstance.post('/treatment-protocols/bulk', {
        protocols,
        skipDuplicates
      }, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get protocol usage stats
  getProtocolUsageStats: async (protocolId) => {
    try {
      const response = await axiosInstance.get(`/treatment-protocols/stats/usage/${protocolId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get protocol effectiveness metrics
  getProtocolEffectivenessMetrics: async (protocolId) => {
    try {
      const response = await axiosInstance.get(`/treatment-protocols/analytics/effectiveness/${protocolId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get protocol cost estimation
  getProtocolCostEstimation: async (protocolId) => {
    try {
      const response = await axiosInstance.get(`/treatment-protocols/analytics/cost/${protocolId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Compare protocols
  compareProtocols: async (protocolIds) => {
    try {
      const response = await axiosInstance.post('/treatment-protocols/analytics/comparison', {
        protocolIds
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Clone treatment protocol
  cloneTreatmentProtocol: async (id, newName, userId) => {
    try {
      const response = await axiosInstance.post(`/treatment-protocols/clone/${id}`, {
        newName
      }, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create custom protocol from treatment
  createCustomProtocolFromTreatment: async (treatmentId, protocolData, userId) => {
    try {
      const response = await axiosInstance.post(`/treatment-protocols/custom/from-treatment/${treatmentId}`, protocolData, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get protocol analytics
  getProtocolAnalytics: async () => {
    try {
      const response = await axiosInstance.get('/treatment-protocols/analytics/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Validate protocol for patient
  validateProtocolForPatient: async (protocolId, patientId) => {
    try {
      const response = await axiosInstance.post('/treatment-protocols/validate-for-patient', {
        protocolId,
        patientId
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get recommended protocols for patient
  getRecommendedProtocolsForPatient: async (patientId, disease) => {
    try {
      const response = await axiosInstance.get('/treatment-protocols/recommended', {
        params: { patientId, disease }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Calculate protocol cost for patient
  calculateProtocolCostForPatient: async (protocolId, patientId, customizations = {}) => {
    try {
      const response = await axiosInstance.post('/treatment-protocols/calculate-cost', {
        protocolId,
        patientId,
        customizations
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 