import axiosInstance from '@/utils/axiosInstance';

export const appointmentService = {
  createAppointment: async (data) => {
    try {
      const response = await axiosInstance.post('/appointments', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllAppointments: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/appointments', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAppointment: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/appointments/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteAppointment: async (id) => {
    try {
      const response = await axiosInstance.delete(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAppointmentById: async (id) => {
    try {
      const response = await axiosInstance.get(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAppointmentStatus: async (id, statusData) => {
    try {
      const response = await axiosInstance.put(`/appointments/status/${id}`, statusData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAppointmentsByUserId: async (userId, params = {}) => {
    try {
      const response = await axiosInstance.get(`/appointments/user/${userId}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAppointmentsByDoctorId: async (doctorId, params = {}) => {
    try {
      const response = await axiosInstance.get(`/appointments/doctor/${doctorId}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getStaffAppointments: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/appointments/staff', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};