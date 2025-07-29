import axiosInstance from '@/utils/axiosInstance';

export const orderService = {
  // Create a new order
  createOrder: async (orderData) => {
    try {
      const response = await axiosInstance.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all orders
  getAllOrders: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/orders', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (id) => {
    try {
      const response = await axiosInstance.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update order
  updateOrder: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/orders/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete order
  deleteOrder: async (id) => {
    try {
      const response = await axiosInstance.delete(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get orders by user ID
  getOrdersByUserId: async (userId, params = {}) => {
    try {
      const response = await axiosInstance.get(`/orders/user/${userId}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get orders by appointment ID
  getOrdersByAppointmentId: async (appointmentId, params = {}) => {
    try {
      const response = await axiosInstance.get(`/orders/appointment/${appointmentId}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 