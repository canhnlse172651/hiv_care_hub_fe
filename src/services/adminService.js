import axiosInstance from "@/utils/axiosInstance";

export const adminService = {
  // User management
  getUsers: (params) => {
    return axiosInstance.get('/users', { params });
  },

  getUserById: (userId) => {
    return axiosInstance.get(`/users/${userId}`);
  },

  createUser: (data) => {
    return axiosInstance.post('/users', data);
  },

  updateUser: (userId, data) => {
    return axiosInstance.put(`/users/${userId}`, data);
  },

  deleteUser: (userId) => {
    return axiosInstance.delete(`/users/${userId}`);
  },

  restoreUser: (userId) => {
    return axiosInstance.patch(`/users/${userId}/restore`);
  },

  // Doctor Management
  addDoctor: (payload) => {
    return axiosInstance.post('/doctors', payload);
  },

  getDoctors: (params) => {
    return axiosInstance.get('/doctors', { params });
  },

  getDoctorById: (doctorId) => {
    return axiosInstance.get(`/doctors/${doctorId}`);
  },

  updateDoctor: (doctorId, data) => {
    return axiosInstance.put(`/doctors/${doctorId}`, data);
  },

  deleteDoctor: (doctorId) => {
    return axiosInstance.delete(`/doctors/${doctorId}`);
  },

  // Schedule Management
  getDoctorSchedule: (doctorId) => {
    return axiosInstance.get(`/doctors/${doctorId}/schedule`);
  },

  createDoctorSchedule: (payload) => {
    return axiosInstance.post('/doctors/schedule/manual', payload);
  },

  updateDoctorSchedule: (scheduleId, payload) => {
    return axiosInstance.put(`/doctors/schedule/${scheduleId}`, payload);
  },

  deleteDoctorSchedule: (scheduleId) => {
    return axiosInstance.delete(`/doctors/schedule/${scheduleId}`);
  },

  // Roles Management
  getRoles: (params) => {
    // Remove pagination by not sending page/limit
    return axiosInstance.get('/roles', { params });
  },

  createRole: (payload) => {
    return axiosInstance.post('/roles', payload);
  },

  getRoleById: (id) => {
    return axiosInstance.get(`/roles/${id}`);
  },

  updateRole: (id, payload) => {
    return axiosInstance.put(`/roles/${id}`, payload);
  },

  deleteRole: (id) => {
    return axiosInstance.delete(`/roles/${id}`);
  },

  getUserRoles: (userId) => {
    return axiosInstance.get(`/roles/user/${userId}`);
  },

  updateUserRole: (userId, payload) => {
    return axiosInstance.put(`/roles/user/${userId}/roles`, payload);
  },

  // Permissions Management
  getPermissions: (params) => {
    return axiosInstance.get('/permissions', { params });
  },

  createPermission: (payload) => {
    return axiosInstance.post('/permissions', payload);
  },

  getPermissionById: (id) => {
    return axiosInstance.get(`/permissions/${id}`);
  },

  updatePermission: (id, payload) => {
    return axiosInstance.put(`/permissions/${id}`, payload);
  },

  deletePermission: (id) => {
    return axiosInstance.delete(`/permissions/${id}`);
  },

  addPermissionsToUser: (userId, payload) => {
    return axiosInstance.post(`/permissions/user/${userId}`, payload);
  },

  removePermissionsFromUser: (userId, payload) => {
    return axiosInstance.delete(`/permissions/user/${userId}`, { data: payload });
  },
};