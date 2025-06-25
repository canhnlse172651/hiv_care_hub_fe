import axiosInstance from '@/utils/axiosInstance';

export const blogService = {
  // Get all blogs with pagination and filtering
  getAllBlogs: async (params = {}) => {
    try {
      const requestParams = {};
      
      if (params.page) requestParams.page = params.page;
      if (params.limit) requestParams.limit = params.limit;
      if (params.search && params.search.trim()) requestParams.search = params.search.trim();
      if (params.sortBy && params.sortBy.trim()) requestParams.sortBy = params.sortBy.trim();
      if (params.sortOrder && params.sortOrder.trim()) requestParams.sortOrder = params.sortOrder.trim();

      const response = await axiosInstance.get('/blogs', {
        params: requestParams
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a single blog by slug
  getBlogBySlug: async (slug) => {
    try {
      // Assuming the endpoint is /blogs/slug/:slug based on common practices
      const response = await axiosInstance.get(`/blogs/slug/${slug}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}; 