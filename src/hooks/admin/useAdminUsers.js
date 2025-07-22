import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { message } from 'antd';
import useDebounce from '@/hooks/useDebounce';

export const useAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, 500);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [sorter, setSorter] = useState({ field: 'createdAt', order: 'descend' });

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsers({
        page: pagination.current,
        limit: pagination.pageSize,
        sortBy: sorter.field,
        sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc',
        search: debouncedSearch,
      });

      const { data, meta } = response.data?.data || {};
      setUsers(
        Array.isArray(data)
          ? data.filter(user => !user.deletedAt).map((user) => ({ ...user, key: user.id }))
          : []
      );
      setPagination({
        ...pagination,
        total: meta?.total || 0,
      });
    } catch (error) {
      message.error('Failed to fetch users. Please check the console for details.');
      console.error('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const response = await adminService.getRoles();
      const rolesData = response.data?.data?.data;
      if (rolesData && Array.isArray(rolesData)) {
        const filteredRoles = rolesData.filter(
          (role) => role.name.toLowerCase() !== "admin"
        );
        setRoles(filteredRoles);
      } else {
        message.error("Failed to process roles from API response.");
      }
    } catch (error) {
      message.error("Failed to fetch roles.");
      console.error("Error fetching roles:", error);
    }
  };

  // Create user
  const handleCreateUser = async (values) => {
    try {
      await adminService.createUser({
        email: values.email,
        roleId: values.roleId,
      });
      message.success("User created successfully!");
      fetchUsers();
      return true;
    } catch (err) {
      message.error(err.response?.data?.message || "An error occurred.");
      return false;
    }
  };

  // Update user
  const handleUpdateUser = async (userId, values) => {
    try {
      await adminService.updateUser(userId, {
        email: values.email,
        roleId: values.roleId,
      });
      message.success("User updated successfully!");
      fetchUsers();
      return true;
    } catch (err) {
      message.error(err.response?.data?.message || "An error occurred.");
      return false;
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    try {
      await adminService.deleteUser(userId);
      message.success('User deleted successfully');
      fetchUsers();
      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to delete user.';
      message.error(errorMsg);
      return false;
    }
  };

  // Toggle user status
  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await adminService.updateUser(user.id, { status: newStatus });
      message.success(`User status updated to ${newStatus.toLowerCase()}`);
      fetchUsers();
      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update status.';
      message.error(errorMsg);
      return false;
    }
  };

  // Handle table changes
  const handleTableChange = (newPagination, filters, newSorter) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
    setSorter({
      field: newSorter.field || 'createdAt',
      order: newSorter.order || 'descend',
    });
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [debouncedSearch, pagination.current, pagination.pageSize, sorter]);

  return {
    users,
    roles,
    loading,
    searchText,
    setSearchText,
    pagination,
    sorter,
    fetchUsers,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleToggleStatus,
    handleTableChange
  };
};
