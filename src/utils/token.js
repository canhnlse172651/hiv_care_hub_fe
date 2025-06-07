import { STORAGE } from "@/constant/storage"
import { decodeJwt } from './jwt';

/**
 * Enhanced token storage service
 * Stores tokens and extracts user information
 */
export const localToken = {
  set(data = {}) {
    if (data?.accessToken) {
      // Decode token and extract userId
      const decodedToken = decodeJwt(data.accessToken);
      const userId = decodedToken?.userId;
      
      // Store tokens and user info
      localStorage.setItem(
        "auth",
        JSON.stringify({
          ...data,
          userId,
        })
      );
    }
  },
  get() {
    const authData = localStorage.getItem("auth");
    if (!!authData) {
      return JSON.parse(authData);
    }
    return null;
  },
  remove() {
    localStorage.removeItem("auth");
  },
};
