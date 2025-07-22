import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';

export const useAdminDashboard = () => {
  const [userStats, setUserStats] = useState({ total: 0, recent: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getUsers({
        limit: 5,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      if (response.data?.data) {
        setUserStats({
          total: response.data.data.meta.total,
          recent: response.data.data.data,
        });
      }
    } catch (err) {
      setError('Failed to fetch user data. Please try again later.');
      console.error("Fetch user error:", err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    userStats,
    loading,
    error,
    refetch
  };
};