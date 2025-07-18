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

  getDoctorsByDate: async (date) => {
    try {
      const response = await axiosInstance.get(`/doctors/schedule/by-date`, { params: { date } });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getDoctorIdByUserId: async (userId) => {
    // Use /auth/profile to get doctorId for the current user
    const response = await axiosInstance.get('/auth/profile');
    return response.data?.data?.doctorId;
  },
};
