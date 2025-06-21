import axiosInstance from "@/utils/axiosInstance";

export const patientService = {
    getAppointmentsByUserId(userId) {
        return axiosInstance.get(`/appoinments/user/${userId}`);
    },
    cancelAppointment(appointmentId) {
        return axiosInstance.patch(`/appoinments/${appointmentId}/cancel`);
    }
} 