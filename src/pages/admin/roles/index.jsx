import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Space, 
  Typography, 
  Tag,
  Badge,
  message,
  Form
} from 'antd';
import { 
  PlusOutlined, 
  UserOutlined
} from '@ant-design/icons';
import { adminService } from '@/services/adminService';
import { useAdminTable } from '@/hooks/useAdminTable';
import AdminTable, { StatusTag, ActionButtons, ActionTypes } from '@/components/AdminTable';
import RoleFormModal from './components/RoleFormModal';
import RoleDetailsDrawer from './components/RoleDetailsDrawer';
import { useModalForm } from '@/hooks/useModalForm';

const { Title, Text } = Typography;

const RoleManagement = () => {
  const [permissions, setPermissions] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState({
    create: false,
    update: false,
    delete: null,
  });
  const [form] = Form.useForm();
  const { isOpen, editingItem, openModal, closeModal } = useModalForm(form);

  // Use the custom hook for table operations
  const {
    data: roles,
    loading: tableLoading,
    pagination,
    handleTableChange,
    handleSearch,
    handleRefresh,
    fetchData,
  } = useAdminTable({
    fetchFunction: adminService.getRoles,
    searchField: 'search',
    defaultPageSize: 10,
    defaultSortField: 'id',
    defaultSortOrder: 'ascend',
  });

  // Fetch permissions list for role creation/editing
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await adminService.getPermissions({ limit: 100 });
        
        let permissionsData;
        if (response.data?.data?.data) {
          permissionsData = response.data.data.data;
        } else if (response.data?.data) {
          permissionsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          permissionsData = response.data;
        } else {
          permissionsData = [];
        }
        
        setPermissions(permissionsData);
      } catch (error) {
        console.error('Error fetching permissions:', error);
        setPermissions([]);
      }
    };
    fetchPermissions();
  }, []);

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
      
      await adminService.createRole(payload);
      message.success('Role created successfully');
      closeModal();
      fetchData();
    } catch (error) {
      console.error('Error creating role:', error);
      message.error(error.response?.data?.message || 'Failed to create role');
    } finally {
      setLoading(prev => ({ ...prev, create: false }));
    }
  };

  // Handle role update
  const handleUpdateRole = async (values) => {
    if (!editingItem) return;
    setLoading(prev => ({ ...prev, update: true }));
    try {
      const payload = {
        name: values.name,
        description: values.description,
        permissions: values.permissionIds || [],
        isActive: values.isActive !== false,
        updatedById: 1
      };
      
      await adminService.updateRole(editingItem.id, payload);
      message.success('Role updated successfully');
      closeModal();
      fetchData();
    } catch (error) {
      console.error('Error updating role:', error);
      message.error(error.response?.data?.message || 'Failed to update role');
    } finally {
      setLoading(prev => ({ ...prev, update: false }));
    }
  };

  // Handle role deletion
  const handleDeleteRole = async (role) => {
    setLoading(prev => ({ ...prev, delete: role.id }));
    try {
      await adminService.deleteRole(role.id);
      message.success('Role deleted successfully');
      
      if (selectedRole && selectedRole.id === role.id) {
        setIsDrawerOpen(false);
        setSelectedRole(null);
      }
      fetchData();
    } catch (error) {
      console.error('Error deleting role:', error);
      message.error(error.response?.data?.message || 'Failed to delete role');
    } finally {
      setLoading(prev => ({ ...prev, delete: null }));
    }
  };

  // Show role details in drawer
  const showRoleDetails = async (role) => {
    try {
      const response = await adminService.getRoleById(role.id);
      const detailedRole = response.data?.data || role;
      setSelectedRole(detailedRole);
      setIsDrawerOpen(true);
    } catch (error) {
      console.error('Error fetching role details:', error);
      setSelectedRole(role);
      setIsDrawerOpen(true);
    }
  };

  // Get method color for permission tags
  const getMethodColor = (method) => {
    switch (method?.toUpperCase()) {
      case 'GET':
        return 'blue';
      case 'POST':
        return 'green';
      case 'PUT':
        return 'orange';
      case 'DELETE':
        return 'red';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: true,
    },
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text, record) => (
        <Space>
          <UserOutlined />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => <StatusTag status={isActive} type="role" />,
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions) => (
        <Space>
          <Badge count={permissions?.length || 0} color="blue" />
          <Text>permissions</Text>
        </Space>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
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
              onClick: showRoleDetails,
            },
            {
              ...ActionTypes.EDIT,
              onClick: openModal,
            },
            {
              ...ActionTypes.DELETE,
              onClick: handleDeleteRole,
              confirmTitle: "Are you sure you want to delete this role?",
              loading: loading.delete === record.id,
            },
          ]}
        />
      ),
    },
  ];

  const extraActions = (
    <Button 
      type="primary" 
      icon={<PlusOutlined />} 
      onClick={openModal}
    >
      Create Role
    </Button>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminTable
        title="Role Management"
        columns={columns}
        dataSource={roles}
        loading={tableLoading}
        pagination={pagination}
        onTableChange={handleTableChange}
        searchPlaceholder="Search by role name or description"
        searchValue=""
        onSearchChange={handleSearch}
        onRefresh={handleRefresh}
        extraActions={extraActions}
        rowKey="id"
      />

      {/* Role Form Modal */}
      <RoleFormModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={editingItem ? handleUpdateRole : handleCreateRole}
        editingRole={editingItem}
        permissions={permissions}
        form={form}
        loading={editingItem ? loading.update : loading.create}
      />

      {/* Role Details Drawer */}
      <RoleDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        role={selectedRole}
        onEdit={(role) => {
          setIsDrawerOpen(false);
          openModal(role);
        }}
        getMethodColor={getMethodColor}
      />
    </div>
  );
};

export default RoleManagement;
