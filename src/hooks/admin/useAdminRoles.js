import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { message } from 'antd';

export const useAdminRoles = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 100, total: 0 });
  const [loading, setLoading] = useState({
    table: false,
    create: false,
    update: false,
    delete: null,
  });
  const [searchText, setSearchText] = useState('');

  // Fetch roles list
  const fetchRoles = async (params = {}) => {
    setLoading(prev => ({ ...prev, table: true }));
    try {
      console.log('Fetching roles with params:', params);
      
      const response = await adminService.getRoles({
        limit: 100,
        search: searchText,
        ...params,
      });
      
      console.log('Roles API Response:', response);
      
      // Handle different API response structures
      let rolesData;
      if (response.data?.data?.data) {
        rolesData = response.data.data.data;
      } else if (response.data?.data) {
        rolesData = response.data.data;
      } else if (Array.isArray(response.data)) {
        rolesData = response.data;
      } else {
        rolesData = [];
        console.warn('Unexpected roles data format:', response.data);
      }
      
      const metaData = { page: 1, limit: rolesData.length, total: rolesData.length };
      
      console.log('Extracted roles data:', rolesData);
      
      if (Array.isArray(rolesData)) {
        setRoles(rolesData);
      } else {
        console.warn('Roles data is not an array:', rolesData);
        setRoles([]);
      }
      setMeta(metaData);
    } catch (error) {
      console.error('Error fetching roles:', error);
      message.error('Failed to fetch roles');
      setRoles([]);
      setMeta({ page: 1, limit: 0, total: 0 });
    } finally {
      setLoading(prev => ({ ...prev, table: false }));
    }
  };

  // Fetch permissions list for role creation/editing
  const fetchPermissions = async () => {
    try {
      console.log('Fetching permissions');
      
      const response = await adminService.getPermissions({ limit: 100 });
      console.log('Permissions API Response:', response);
      
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
      
      console.log('Extracted permissions data:', permissionsData);
      
      if (Array.isArray(permissionsData)) {
        setPermissions(permissionsData);
      } else {
        console.warn('Permissions data is not an array:', permissionsData);
        setPermissions([]);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      message.error('Failed to fetch permissions');
      setPermissions([]);
    }
  };

  // Handle role creation
  const handleCreateRole = async (values) => {
    setLoading(prev => ({ ...prev, create: true }));
    try {
      const payload = {
        name: values.name,
        description: values.description,
        permissions: values.permissionIds || [],
        isActive: values.isActive !== false
      };
      
      console.log('Creating role with payload:', payload);
      
      await adminService.createRole(payload);
      message.success('Role created successfully');
      fetchRoles();
      return true;
    } catch (error) {
      console.error('Error creating role:', error);
      message.error(error.response?.data?.message || 'Failed to create role');
      return false;
    } finally {
      setLoading(prev => ({ ...prev, create: false }));
    }
  };

  // Handle role update
  const handleUpdateRole = async (roleId, values) => {
    setLoading(prev => ({ ...prev, update: true }));
    try {
      const payload = {
        name: values.name,
        description: values.description,
        permissions: values.permissionIds || [],
        isActive: values.isActive !== false,
        updatedById: 1
      };
      
      console.log('Updating role with payload:', payload);
      
      await adminService.updateRole(roleId, payload);
      message.success('Role updated successfully');
      fetchRoles();
      return true;
    } catch (error) {
      console.error('Error updating role:', error);
      message.error(error.response?.data?.message || 'Failed to update role');
      return false;
    } finally {
      setLoading(prev => ({ ...prev, update: false }));
    }
  };

  // Handle role deletion
  const handleDeleteRole = async (roleId) => {
    setLoading(prev => ({ ...prev, delete: roleId }));
    try {
      console.log('Deleting role with ID:', roleId);
      
      const hide = message.loading('Deleting role...', 0);
      
      await adminService.deleteRole(roleId);
      
      hide();
      
      message.success('Role deleted successfully');
      fetchRoles();
      return true;
    } catch (error) {
      console.error('Error deleting role:', error);
      message.error(error.response?.data?.message || 'Failed to delete role');
      return false;
    } finally {
      setLoading(prev => ({ ...prev, delete: null }));
    }
  };

  // Fetch role details by ID
  const fetchRoleDetails = async (roleId) => {
    try {
      const response = await adminService.getRoleById(roleId);
      return response.data?.data || null;
    } catch (error) {
      console.error('Error fetching role details:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  useEffect(() => {
    if (searchText !== undefined) {
      fetchRoles();
    }
  }, [searchText]);

  return {
    roles,
    permissions,
    meta,
    loading,
    searchText,
    setSearchText,
    setMeta,
    fetchRoles,
    fetchPermissions,
    handleCreateRole,
    handleUpdateRole,
    handleDeleteRole,
    fetchRoleDetails
  };
};
