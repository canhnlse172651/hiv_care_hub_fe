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
};
