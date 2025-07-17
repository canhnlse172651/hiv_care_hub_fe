import { doctorService } from "@/services/doctorService";
import { localToken } from "@/utils/token";

export async function ensureDoctorId() {
  const user = localToken.getUser();
  if (!user) return null;
  let doctorId = localStorage.getItem("doctorId");
  if (!doctorId) {
    doctorId = await doctorService.getDoctorIdByUserId(user.id);
    if (doctorId) {
      localStorage.setItem("doctorId", doctorId);
    }
  }
  return doctorId;
}