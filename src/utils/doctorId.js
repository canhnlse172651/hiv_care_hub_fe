import { doctorService } from "@/services/doctorService";
import { localToken } from "@/utils/token";

export async function ensureDoctorId() {
  // Try to get from localStorage first
  let doctorId = localStorage.getItem("doctorId");
  if (doctorId) return doctorId;

  // Fallback: fetch from backend
  try {
    const user = localToken.getUser();
    if (!user) return null;
    doctorId = await doctorService.getDoctorIdByUserId(user.id);
    if (doctorId) {
      localStorage.setItem("doctorId", doctorId);
      return doctorId;
    }
  } catch (e) {
    // Optionally log error
  }
  return null;
}