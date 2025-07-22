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
  SearchOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useAdminPermissions } from '@/hooks/admin';
import {
  PermissionFormModal,
  PermissionDetailsDrawer,
  PermissionTable
} from '@/components/admin/permissions';

const { Title } = Typography;

// Method color function
const getMethodColor = (method) => {
  switch (method) {
    case 'GET': return 'blue';
    case 'POST': return 'green';
    case 'PUT': return 'orange';
    case 'DELETE': return 'red';
    default: return 'default';
  }
};

const PermissionManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [editingPermission, setEditingPermission] = useState(null);
  const [form] = Form.useForm();

  const {
    filteredPermissions,
    loading,
    searchText,
    setSearchText,
    handleCreate,
    handleUpdate,
    handleDelete
  } = useAdminPermissions();

  // Open modal for creating/editing permission
  const showModal = (permission = null) => {
    setEditingPermission(permission);
    
    if (permission) {
      form.setFieldsValue({
        name: permission.name || '',
        description: permission.description || '',
        path: permission.path || '',
        method: permission.method || ''
      });
    } else {
      form.resetFields();
    }
    
    setIsModalOpen(true);
  };

  // Open drawer to view permission details
  const showDrawer = (permission) => {
    setSelectedPermission(permission);
    setIsDrawerOpen(true);
  };

  // Form submit handler
  const handleFormSubmit = async (values) => {
    let success;
    if (editingPermission) {
      success = await handleUpdate(editingPermission.id, values);
    } else {
      success = await handleCreate(values);
    }
    
    if (success) {
      setIsModalOpen(false);
      setEditingPermission(null);
    }
  };

  return (
    <div>
      <Card 
        className="mb-4"
        title={
          <div className="flex items-center">
            <FileTextOutlined className="mr-2 text-blue-500" />
            <Title level={4} className="mb-0">Permission Management</Title>
          </div>
        }
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            New Permission
          </Button>
        }
      >
        <div className="mb-4">
          <Input 
            placeholder="Search permissions..." 
            prefix={<SearchOutlined />} 
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            allowClear
          />
        </div>

        <PermissionTable
          permissions={filteredPermissions}
          loading={loading}
          onView={showDrawer}
          onEdit={showModal}
          onDelete={handleDelete}
          getMethodColor={getMethodColor}
        />
      </Card>

      <PermissionFormModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPermission(null);
        }}
        onSubmit={handleFormSubmit}
        editingPermission={editingPermission}
        form={form}
      />

      <PermissionDetailsDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        permission={selectedPermission}
        onEdit={() => {
          setIsDrawerOpen(false);
          showModal(selectedPermission);
        }}
        getMethodColor={getMethodColor}
      />
    </div>
  );
};

export default PermissionManagement;