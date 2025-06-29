import axiosInstance from "@/utils/axiosInstance";

export const doctorService = {
  // Get doctor schedule by doctor ID
  getDoctorSchedule: (doctorId) => {
    return axiosInstance.get(`/doctors/${doctorId}/schedule`);
  },

  // Generate automatic schedule for doctors
  generateSchedule: (payload) => {
    return axiosInstance.post('/doctors/schedule/generate', payload);
  },

  // Manually assign doctors to shifts
  manualAssignSchedule: (payload) => {
    return axiosInstance.post('/doctors/schedule/manual', payload);
  },

  getDoctors(params) {
    return axiosInstance.get("/doctors", { params });
  },

  // Dashboard related APIs
  getDoctorDashboard: (doctorId) => {
    return axiosInstance.get(`/doctors/${doctorId}/dashboard`);
  },

  getTodayAppointments: (doctorId) => {
    return axiosInstance.get(`/doctors/${doctorId}/appointments/today`);
  },

  getCompletedAppointments: (doctorId) => {
    return axiosInstance.get(`/doctors/${doctorId}/appointments/completed`);
  },

  // Consultation related APIs
  getAppointmentDetails: (appointmentId) => {
    return axiosInstance.get(`/appointments/${appointmentId}`);
  },

  getPatientMedicalHistory: (patientId) => {
    return axiosInstance.get(`/patients/${patientId}/medical-history`);
  },

  saveConsultation: (appointmentId, consultationData) => {
    return axiosInstance.post(`/appointments/${appointmentId}/consultation`, consultationData);
  },

  updateConsultation: (appointmentId, consultationData) => {
    return axiosInstance.put(`/appointments/${appointmentId}/consultation`, consultationData);
  },

  // Medical records related APIs
  getPatientMedicalRecords: (patientId, params = {}) => {
    return axiosInstance.get(`/patients/${patientId}/medical-records`, { params });
  },

  getPatientLabResults: (patientId, params = {}) => {
    return axiosInstance.get(`/patients/${patientId}/lab-results`, { params });
  },

  getPatientProfile: (patientId) => {
    return axiosInstance.get(`/patients/${patientId}`);
  },

  // Schedule management
  createSchedule: (scheduleData) => {
    return axiosInstance.post('/doctors/schedule', scheduleData);
  },

  updateSchedule: (scheduleId, scheduleData) => {
    return axiosInstance.put(`/doctors/schedule/${scheduleId}`, scheduleData);
  },

  deleteSchedule: (scheduleId) => {
    return axiosInstance.delete(`/doctors/schedule/${scheduleId}`);
  },
};
