import React, { useState } from 'react';
import { 
  Button, 
  Input, 
  Space, 
  Typography,
  Card,
  Form
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined
} from '@ant-design/icons';
import { useAdminUsers } from '@/hooks/admin';
import {
  UserFormModal,
  UserTable,
  UserPermissionSelectorModal
} from '@/components/admin/users';

const { Title } = Typography;

const UserManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [isPermissionsModalVisible, setIsPermissionsModalVisible] = useState(false);
  const [selectedUserForPermissions, setSelectedUserForPermissions] = useState(null);
  const [permissionAction, setPermissionAction] = useState(null);

  const {
    users,
    roles,
    loading,
    searchText,
    setSearchText,
    pagination,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleToggleStatus,
    handleTableChange
  } = useAdminUsers();

  const showModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      form.setFieldsValue({
        email: user.email,
        roleId: user.roleId,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  const onFinish = async (values) => {
    let success;
    if (editingUser) {
      success = await handleUpdateUser(editingUser.id, values);
    } else {
      success = await handleCreateUser(values);
    }
    
    if (success) {
      handleCancel();
    }
  };

  const handlePermissionModalClose = (refresh) => {
    setIsPermissionsModalVisible(false);
    setSelectedUserForPermissions(null);
    setPermissionAction(null);
    // Refresh logic handled by the modal component
  };

  const handleOpenPermissions = (user, action) => {
    setSelectedUserForPermissions(user);
    setPermissionAction(action);
    setIsPermissionsModalVisible(true);
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="mb-0">User Management</Title>
        <Space>
          <Input
            placeholder="Search by name or email..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
            Add User
          </Button>
        </Space>
      </div>

      <UserTable
        users={users}
        loading={loading}
        pagination={pagination}
        onEdit={showModal}
        onDelete={handleDeleteUser}
        onToggleStatus={handleToggleStatus}
        onTableChange={handleTableChange}
        onOpenPermissions={handleOpenPermissions}
      />

      <UserFormModal
        isOpen={isModalVisible}
        onClose={handleCancel}
        onSubmit={onFinish}
        editingUser={editingUser}
        roles={roles}
        form={form}
        loading={loading}
      />

      {isPermissionsModalVisible && (
        <UserPermissionSelectorModal
          visible={isPermissionsModalVisible}
          onCancel={handlePermissionModalClose}
          user={selectedUserForPermissions}
          action={permissionAction}
        />
      )}
    </Card>
  );
};

export default UserManagement;