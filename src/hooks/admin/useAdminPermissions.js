import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { message } from 'antd';

export const useAdminPermissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Fetch permissions list
  const fetchPermissions = async (params = {}) => {
    setLoading(true);
    try {
      console.log('Fetching permissions with params:', params);
      const response = await adminService.getPermissions({
        limit: 100,
        ...params
      });
      
      console.log('Permissions API Response:', response);
      
      // Handle different API response structures
      let permissionsData;
      if (response.data?.data?.data) {
        permissionsData = response.data.data.data;
      } else if (response.data?.data) {
        permissionsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        permissionsData = response.data;
      } else {
        permissionsData = [];
        console.warn('Unexpected permissions data format:', response.data);
      }
      
      setPermissions(permissionsData);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      message.error('Failed to fetch permissions');
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle permission creation
  const handleCreate = async (values) => {
    try {
      console.log('Creating permission with values:', values);
      const response = await adminService.createPermission({
        ...values,
        createdById: 1, // This should be the current user's ID
      });
      
      console.log('Create permission response:', response);
      message.success('Permission created successfully');
      fetchPermissions();
      return true;
    } catch (error) {
      console.error('Error creating permission:', error);
      message.error(error.response?.data?.message || 'Failed to create permission');
      return false;
    }
  };

  // Handle permission update
  const handleUpdate = async (id, values) => {
    try {
      console.log('Updating permission with id:', id, 'and values:', values);
      const response = await adminService.updatePermission(id, {
        ...values,
        updatedById: 1, // This should be the current user's ID
      });
      
      console.log('Update permission response:', response);
      message.success('Permission updated successfully');
      fetchPermissions();
      return true;
    } catch (error) {
      console.error('Error updating permission:', error);
      message.error(error.response?.data?.message || 'Failed to update permission');
      return false;
    }
  };

  // Handle permission deletion
  const handleDelete = async (id) => {
    try {
      console.log('Deleting permission with id:', id);
      const response = await adminService.deletePermission(id);
      console.log('Delete permission response:', response);
      message.success('Permission deleted successfully');
      fetchPermissions();
      return true;
    } catch (error) {
      console.error('Error deleting permission:', error);
      message.error(error.response?.data?.message || 'Failed to delete permission');
      return false;
    }
  };

  // Filter permissions by search text
  const filteredPermissions = searchText
    ? permissions.filter(permission => 
        (permission.name && permission.name.toLowerCase().includes(searchText.toLowerCase())) ||
        (permission.path && permission.path.toLowerCase().includes(searchText.toLowerCase())) ||
        (permission.description && permission.description.toLowerCase().includes(searchText.toLowerCase()))
      )
    : permissions;

  useEffect(() => {
    fetchPermissions();
  }, []);

  return {
    permissions,
    filteredPermissions,
    loading,
    searchText,
    setSearchText,
    fetchPermissions,
    handleCreate,
    handleUpdate,
    handleDelete
  };
};
