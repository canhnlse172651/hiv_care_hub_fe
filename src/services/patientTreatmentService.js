import axiosInstance from '@/utils/axiosInstance';

export const patientTreatmentService = {
  // Create new patient treatment
  createPatientTreatment: async (data, userId) => {
    try {
      const response = await axiosInstance.post('/patient-treatments', data, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all patient treatments with pagination and search
  getAllPatientTreatments: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/patient-treatments', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get patient treatment by ID
  getPatientTreatmentById: async (id) => {
    try {
      const response = await axiosInstance.get(`/patient-treatments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update patient treatment
  updatePatientTreatment: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/patient-treatments/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete patient treatment
  deletePatientTreatment: async (id) => {
    try {
      const response = await axiosInstance.delete(`/patient-treatments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get patient treatments by patient ID
  getPatientTreatmentsByPatientId: async (patientId, params = {}) => {
    try {
      const response = await axiosInstance.get(`/patient-treatments/patient/${patientId}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get patient treatments by doctor ID
  getPatientTreatmentsByDoctorId: async (doctorId, params = {}) => {
    try {
      const response = await axiosInstance.get(`/patient-treatments/doctor/${doctorId}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search patient treatments
  searchPatientTreatments: async (query, page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get('/patient-treatments/search', {
        params: { search: query, page, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get active patient treatments
  getActivePatientTreatments: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/patient-treatments/active', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get active patient treatments by patient
  getActivePatientTreatmentsByPatient: async (patientId) => {
    try {
      const response = await axiosInstance.get(`/patient-treatments/active/patient/${patientId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get treatments with custom medications
  getTreatmentsWithCustomMedications: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/patient-treatments/custom-medications', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get patient treatment statistics
  getPatientTreatmentStats: async (patientId) => {
    try {
      const response = await axiosInstance.get(`/patient-treatments/stats/patient/${patientId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get doctor workload statistics
  getDoctorWorkloadStats: async (doctorId) => {
    try {
      const response = await axiosInstance.get(`/patient-treatments/stats/doctor/${doctorId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get custom medication statistics
  getCustomMedicationStats: async () => {
    try {
      const response = await axiosInstance.get('/patient-treatments/analytics/custom-medication-stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Compare protocol vs custom treatments
  compareProtocolVsCustomTreatments: async (protocolId) => {
    try {
      const response = await axiosInstance.get(`/patient-treatments/analytics/protocol-comparison/${protocolId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get treatment compliance statistics
  getTreatmentComplianceStats: async (patientId) => {
    try {
      const response = await axiosInstance.get(`/patient-treatments/analytics/compliance/${patientId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get treatment cost analysis
  getTreatmentCostAnalysis: async (params) => {
    try {
      const response = await axiosInstance.get('/patient-treatments/analytics/cost-analysis', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Calculate treatment cost preview
  calculateTreatmentCost: async (costData) => {
    try {
      const response = await axiosInstance.post('/patient-treatments/calculate-cost', costData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // End active patient treatments
  endActivePatientTreatments: async (patientId) => {
    try {
      const response = await axiosInstance.post(`/patient-treatments/end-active/${patientId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Validate single protocol rule
  validateSingleProtocolRule: async (patientId) => {
    try {
      const response = await axiosInstance.get(`/patient-treatments/validate/single-protocol/${patientId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get general treatment statistics
  getGeneralTreatmentStats: async () => {
    try {
      const response = await axiosInstance.get('/patient-treatments/analytics/general-stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get patient treatments by date range
  getPatientTreatmentsByDateRange: async (startDate, endDate) => {
    try {
      const response = await axiosInstance.get('/patient-treatments/date-range', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create patient treatment with follow-up appointment
  createPatientTreatmentWithFollowUp: async (data, userId, followUpConfig) => {
    try {
      const response = await axiosInstance.post('/patient-treatments/with-followup', {
        ...data,
        followUpConfig
      }, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get patient treatments with follow-up information
  getPatientTreatmentsWithFollowUp: async (patientId) => {
    try {
      const response = await axiosInstance.get(`/patient-treatments/with-followup/${patientId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get recommended follow-up schedule
  getRecommendedFollowUpSchedule: async (treatmentId) => {
    try {
      const response = await axiosInstance.get(`/patient-treatments/recommended-followup/${treatmentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Quick business rules check
  quickBusinessRulesCheck: async (patientId) => {
    try {
      const response = await axiosInstance.get(`/patient-treatments/quick-business-rules-check/${patientId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Detect business rule violations
  detectBusinessRuleViolations: async () => {
    try {
      const response = await axiosInstance.get('/patient-treatments/detect-violations');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Fix business rule violations
  fixBusinessRuleViolations: async (isDryRun = true) => {
    try {
      const response = await axiosInstance.post('/patient-treatments/fix-violations', { isDryRun });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Validate emergency protocol
  validateEmergencyProtocol: async (treatmentType, exposureDate, riskFactors) => {
    try {
      const response = await axiosInstance.post('/patient-treatments/validate-emergency-protocol', {
        treatmentType,
        exposureDate,
        riskFactors
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Validate treatment continuity
  validateTreatmentContinuity: async (patientId, currentTreatmentStart) => {
    try {
      const response = await axiosInstance.post('/patient-treatments/validate-continuity', {
        patientId,
        currentTreatmentStart
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Validate doctor protocol authorization
  validateDoctorProtocolAuthorization: async (doctorId, protocolId) => {
    try {
      const response = await axiosInstance.post('/patient-treatments/validate-doctor-authorization', {
        doctorId,
        protocolId
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Validate organ function
  validateOrganFunction: async (liverFunction, kidneyFunction, protocolId) => {
    try {
      const response = await axiosInstance.post('/patient-treatments/validate-organ-function', {
        liverFunction,
        kidneyFunction,
        protocolId
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Validate pregnancy safety
  validatePregnancySafety: async (patientGender, isPregnant, isBreastfeeding, protocolId) => {
    try {
      const response = await axiosInstance.post('/patient-treatments/validate-pregnancy-safety', {
        patientGender,
        isPregnant,
        isBreastfeeding,
        protocolId
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Validate resistance pattern
  validateResistancePattern: async (resistanceData, proposedProtocolId) => {
    try {
      const response = await axiosInstance.post('/patient-treatments/validate-resistance-pattern', {
        resistanceData,
        proposedProtocolId
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Validate treatment adherence
  validateTreatmentAdherence: async (adherenceData) => {
    try {
      const response = await axiosInstance.post('/patient-treatments/validate-adherence', adherenceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Validate viral load monitoring
  validateViralLoadMonitoring: async (patientTreatmentId, treatmentStartDate) => {
    try {
      const response = await axiosInstance.post('/patient-treatments/validate-viral-load', {
        patientTreatmentId,
        treatmentStartDate
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Bulk create patient treatments
  bulkCreatePatientTreatments: async (data, userId) => {
    try {
      const response = await axiosInstance.post('/patient-treatments/bulk', data, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 