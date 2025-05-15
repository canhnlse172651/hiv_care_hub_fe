

import axiosInstance from "@/utils/axiosInstance";
import { localToken } from "@/utils/token";

export const authenService = {
  login(payload = {}) {
    return axiosInstance.post(`/customer/login`, payload);
  },

  register(payload = {}) {
    return axiosInstance.post(`/customer/register`, payload);
  },
  getProfile() {
    return axiosInstance.get(`/customer/profiles`);
  },
  updateProfile(payload = {}) {
    return axiosInstance.put(`/customer/profiles`, payload, {
      headers: {
        "Authorization": `Bearer ${localToken.get()?.accessToken}`,
        "Content-Type": `multipart/form-data`,                           
      },
    });
  },
  getProvince(){
    return axiosInstance.get(`/provinces`)
  },
  getProvinceById(id){
    return axiosInstance.get(`/provinces/${id}`)
  },
  getDistrict(id){
    return axiosInstance.get(`/districts?province=${id}`)
  },
  getDistrictById(id){
    return axiosInstance.get(`/districts/${id}`)
  },
  getWard(id){
    return axiosInstance.get(`/wards?district=${id}`)
  },
  getWardById(id) {
    return axiosInstance.get(`/wards/${id}`)
  },
  getOrderMe(){
    return axiosInstance.get(`/orders/me`)
  },
  review(payload={}){
    return axiosInstance.post(`/reviews`,payload)
  }
};
