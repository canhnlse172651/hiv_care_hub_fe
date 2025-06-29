import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Space, 
  Typography, 
  Tag,
  message,
  Form
} from 'antd';
import { 
  PlusOutlined, 
  KeyOutlined
} from '@ant-design/icons';
import { adminService } from '@/services/adminService';
import { useAdminTable } from '@/hooks/useAdminTable';
import AdminTable, { StatusTag, ActionButtons, ActionTypes } from '@/components/AdminTable';
import PermissionFormModal from './components/PermissionFormModal';
import PermissionDetailsDrawer from './components/PermissionDetailsDrawer';
import { useModalForm } from '@/hooks/useModalForm';
import { getMethodColor } from '@/constant/admin';

const { Title, Text } = Typography;

const PermissionManagement = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [form] = Form.useForm();
  const { isOpen, editingItem, openModal, closeModal } = useModalForm(form);

  // Use the custom hook for table operations
  const {
    data: permissions,
    loading,
    pagination,
    handleTableChange,
    handleSearch,
    handleRefresh,
    fetchData,
  } = useAdminTable({
    fetchFunction: adminService.getPermissions,
    searchField: 'search',
    defaultPageSize: 10,
    defaultSortField: 'name',
    defaultSortOrder: 'ascend',
  });

  // Handle permission creation
  const handleCreate = async (values) => {
    try {
      await adminService.createPermission({
        ...values,
        createdById: 1,
      });
      message.success('Permission created successfully');
      fetchData();
      closeModal();
    } catch (error) {
      console.error('Error creating permission:', error);
      message.error(error.response?.data?.message || 'Failed to create permission');
    }
  };

  // Handle permission update
  const handleUpdate = async (id, values) => {
    try {
      await adminService.updatePermission(id, {
        ...values,
        updatedById: 1,
      });
      message.success('Permission updated successfully');
      fetchData();
      closeModal();
    } catch (error) {
      console.error('Error updating permission:', error);
      message.error(error.response?.data?.message || 'Failed to update permission');
    }
  };

  // Handle permission deletion
  const handleDelete = async (permission) => {
    try {
      await adminService.deletePermission(permission.id);
      message.success('Permission deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting permission:', error);
      message.error(error.response?.data?.message || 'Failed to delete permission');
    }
  };

  // Open drawer to view permission details
  const showDrawer = (permission) => {
    setSelectedPermission(permission);
    setIsDrawerOpen(true);
  };

  // Form submit handler
  const handleFormSubmit = (values) => {
    if (editingItem) {
      handleUpdate(editingItem.id, values);
    } else {
      handleCreate(values);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a onClick={() => showDrawer(record)} className="text-blue-600 hover:text-blue-800">
          {text || 'N/A'}
        </a>
      ),
      sorter: true,
    },
    {
      title: 'Path',
      dataIndex: 'path',
      key: 'path',
      render: (text) => <Text code>{text || 'N/A'}</Text>,
      sorter: true,
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      render: (text) => (
        text ? <Tag color={getMethodColor(text)}>{text}</Tag> : <Tag>N/A</Tag>
      ),
      sorter: true,
      filters: [
        {value: 'GET', text: 'GET'},
        {value: 'POST', text: 'POST'},
        {value: 'PUT', text: 'PUT'},
        {value: 'DELETE', text: 'DELETE'}
      ],
      onFilter: (value, record) => record.method === value,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => text || 'No description',
      sorter: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <ActionButtons
          record={record}
          actions={[
            {
              ...ActionTypes.VIEW,
              onClick: showDrawer,
            },
            {
              ...ActionTypes.EDIT,
              onClick: openModal,
            },
            {
              ...ActionTypes.DELETE,
              onClick: handleDelete,
              confirmTitle: "Delete this permission?",
              confirmText: {
                ok: "Yes",
                cancel: "No"
              },
            },
          ]}
        />
      ),
    }
  ];

  const extraActions = (
    <Button 
      type="primary" 
      icon={<PlusOutlined />}
      onClick={openModal}
    >
      New Permission
    </Button>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminTable
        title={
          <div className="flex items-center">
            <KeyOutlined className="mr-2 text-blue-500" />
            <span>Permission Management</span>
          </div>
        }
        columns={columns}
        dataSource={permissions}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        searchPlaceholder="Search permissions..."
        searchValue=""
        onSearchChange={handleSearch}
        onRefresh={handleRefresh}
        extraActions={extraActions}
        rowKey="id"
      />

      <PermissionFormModal 
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        editingPermission={editingItem}
        form={form}
      />

      <PermissionDetailsDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        permission={selectedPermission}
        onEdit={() => {
          setIsDrawerOpen(false);
          openModal(selectedPermission);
        }}
        getMethodColor={getMethodColor}
      />
    </div>
  );
};

export default PermissionManagement;
