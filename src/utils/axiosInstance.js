import axios from "axios";
import { BASE_URL } from "@/constant/environment";
import { localToken } from "./token";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  // config request before sent to sever
  (config) => {
    config.headers.Authorization = `Bearer ${localToken.get()?.accessToken}`;
    console.log("config", config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho phép can thiệp vào quá trình nhận phản hồi (RESPONSE) từ server.
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log("error", error);
    const originalRequest = error.config;

    // Nếu mã lỗi 403 hoặc 401 và request không chứa key _retry
    if (
      (error.response?.status === 403 || error.response?.status === 401) &&
      !!!originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Gọi API để cập nhật token mới
        const res = await axiosInstance.put("/customer/refresh", {
          refreshToken: localToken.get()?.refreshToken,
        });
        const { token: accessToken, refreshToken } = res.data.data || {};

        // Lưu lại token mới vào local storage hoặc cookie
        localToken.set({
          accessToken,
          refreshToken,
        });

        // Thay đổi token trong header của yêu cầu ban đầu
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Gọi lại yêu cầu ban đầu với token mới
        return axiosInstance(originalRequest);
      } catch (error) {
        console.log(error);
        // Xử lý lỗi nếu không thể cập nhật token mới
        localToken.remove();
      }
    }

    // Nếu lỗi không phải 403 hoặc 401, trả về lỗi ban đầu
    return Promise.reject(error);
  }
);
export default axiosInstance;
