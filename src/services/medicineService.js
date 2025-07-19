import axiosInstance from '@/utils/axiosInstance';

export const medicineService = {
  // Create new medicine
  createMedicine: async (data) => {
    try {
      const response = await axiosInstance.post('/medicines', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all medicines with pagination and search
  getAllMedicines: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/medicines', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get medicine by ID
  getMedicineById: async (id) => {
    try {
      const response = await axiosInstance.get(`/medicines/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update medicine
  updateMedicine: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/medicines/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete medicine
  deleteMedicine: async (id) => {
    try {
      const response = await axiosInstance.delete(`/medicines/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search medicines
  searchMedicines: async (query) => {
    try {
      const response = await axiosInstance.get('/medicines/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get medicines by price range
  getMedicinesByPriceRange: async (minPrice, maxPrice) => {
    try {
      const response = await axiosInstance.get('/medicines/price-range', {
        params: { minPrice, maxPrice }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Advanced search medicines
  advancedSearchMedicines: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/medicines/advanced-search', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Bulk create medicines
  bulkCreateMedicines: async (medicines, skipDuplicates = false) => {
    try {
      const response = await axiosInstance.post('/medicines/bulk', {
        medicines,
        skipDuplicates
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get medicine usage statistics
  getMedicineUsageStats: async () => {
    try {
      const response = await axiosInstance.get('/medicines/analytics/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get medicine by name
  getMedicineByName: async (name) => {
    try {
      const response = await axiosInstance.get('/medicines/search', {
        params: { q: name }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get medicines by unit
  getMedicinesByUnit: async (unit) => {
    try {
      const response = await axiosInstance.get('/medicines', {
        params: { unit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get medicines by disease/target
  getMedicinesByTarget: async (targetDisease) => {
    try {
      const response = await axiosInstance.get('/medicines', {
        params: { targetDisease }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get medicine price distribution
  getMedicinePriceDistribution: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/medicines/analytics/price-distribution', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get medicine unit usage statistics
  getMedicineUnitUsageStats: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/medicines/analytics/unit-usage', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Validate medicine for protocol
  validateMedicineForProtocol: async (medicineId, protocolId) => {
    try {
      const response = await axiosInstance.post('/medicines/validate-for-protocol', {
        medicineId,
        protocolId
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get medicine interactions
  getMedicineInteractions: async (medicineId) => {
    try {
      const response = await axiosInstance.get(`/medicines/${medicineId}/interactions`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get medicine side effects
  getMedicineSideEffects: async (medicineId) => {
    try {
      const response = await axiosInstance.get(`/medicines/${medicineId}/side-effects`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get medicine contraindications
  getMedicineContraindications: async (medicineId) => {
    try {
      const response = await axiosInstance.get(`/medicines/${medicineId}/contraindications`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Calculate medicine cost for treatment
  calculateMedicineCostForTreatment: async (medicineId, dosage, duration) => {
    try {
      const response = await axiosInstance.post('/medicines/calculate-cost', {
        medicineId,
        dosage,
        duration
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 