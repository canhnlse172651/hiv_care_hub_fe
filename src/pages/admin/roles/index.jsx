import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Typography, 
  Input,
  Form
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined
} from '@ant-design/icons';
import { useAdminRoles } from '@/hooks/admin';
import {
  RoleFormModal,
  RoleDetailsDrawer,
  RoleTable
} from '@/components/admin/roles';

const { Title } = Typography;

const RoleManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [form] = Form.useForm();

  const {
    roles,
    permissions,
    meta,
    loading,
    searchText,
    setSearchText,
    setMeta,
    handleCreateRole,
    handleUpdateRole,
    handleDeleteRole,
    fetchRoleDetails
  } = useAdminRoles();

  // Get method color for permission tags
  const getMethodColor = (method) => {
    switch (method?.toUpperCase()) {
      case 'GET': return 'blue';
      case 'POST': return 'green';
      case 'PUT': return 'orange';
      case 'DELETE': return 'red';
      default: return 'default';
    }
  };

  // Show role details in drawer
  const showRoleDetails = async (role) => {
    try {
      const detailedRole = await fetchRoleDetails(role.id);
      setSelectedRole(detailedRole || role);
      setIsDrawerOpen(true);
    } catch (error) {
      setSelectedRole(role);
      setIsDrawerOpen(true);
    }
  };

  // Show modal for create/edit
  const showModal = (role = null) => {
    if (role) {
      console.log('Editing role:', role);
      setEditingRole(role);
      form.setFieldsValue({
        name: role.name,
        description: role.description,
        permissionIds: role.permissions?.map(p => p.id) || [],
        isActive: role.isActive !== false,
      });
    } else {
      setEditingRole(null);
      form.resetFields();
      form.setFieldsValue({
        isActive: true,
        permissionIds: [],
      });
    }
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleFormSubmit = async (values) => {
    let success;
    if (editingRole) {
      success = await handleUpdateRole(editingRole.id, values);
    } else {
      success = await handleCreateRole(values);
    }
    
    if (success) {
      setIsModalOpen(false);
      form.resetFields();
      setEditingRole(null);
    }
  };

  // Handle role deletion
  const handleDelete = async (roleId) => {
    const success = await handleDeleteRole(roleId);
    if (success && selectedRole && selectedRole.id === roleId) {
      setIsDrawerOpen(false);
      setSelectedRole(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Title level={2} className="!mb-0 text-gray-800">Role Management</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => showModal()}
          className="shadow-md hover:shadow-lg transition-shadow"
        >
          Create Role
        </Button>
      </div>

      <Card className="shadow-lg border-0 rounded-lg">
        <div className="mb-4">
          <Input
            placeholder="Search by role name or description"
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="max-w-md rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            allowClear
          />
        </div>

        <RoleTable
          roles={roles}
          meta={meta}
          loading={loading}
          onView={showRoleDetails}
          onEdit={showModal}
          onDelete={handleDelete}
          onMetaChange={setMeta}
        />
      </Card>

      <RoleFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditingRole(null);
        }}
        onSubmit={handleFormSubmit}
        editingRole={editingRole}
        permissions={permissions}
        form={form}
        loading={editingRole ? loading.update : loading.create}
      />

      <RoleDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        role={selectedRole}
        onEdit={(role) => {
          setIsDrawerOpen(false);
          showModal(role);
        }}
        getMethodColor={getMethodColor}
      />
    </div>
  );
};

export default RoleManagement;