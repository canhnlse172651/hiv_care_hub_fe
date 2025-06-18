import { STORAGE } from "@/constant/storage"

/**
 * Enhanced token storage service
 * Stores tokens and user information
 */
export const localToken = {
  set(data = {}) {
    if (data?.accessToken) {
      // Remove old 'token' key if exists
      localStorage.removeItem("token");
      // Store tokens and user info
      localStorage.setItem(
        "auth",
        JSON.stringify({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user // user: { id, name, email, role }
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
    localStorage.removeItem("token"); // Clean up old key
  },
  getUser() {
    const authData = this.get();
    return authData?.user || null;
  },
  getAccessToken() {
    const authData = this.get();
    return authData?.accessToken || null;
  },
  getRefreshToken() {
    const authData = this.get();
    return authData?.refreshToken || null;
  }
};
