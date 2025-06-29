import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Space, 
  Typography, 
  Tag,
  Modal, 
  Form, 
  Select, 
  message, 
  Avatar,
  Input
} from 'antd';
import { 
  UserAddOutlined, 
  EditOutlined, 
  DeleteOutlined,
  LockOutlined, 
  UnlockOutlined, 
  PlusOutlined, 
  MinusOutlined
} from '@ant-design/icons';
import { adminService } from '@/services/adminService';
import dayjs from 'dayjs';
import { useAdminTable } from '@/hooks/useAdminTable';
import AdminTable, { StatusTag, ActionButtons, ActionTypes } from '@/components/AdminTable';
import AdminModal from '@/components/AdminModal';
import UserPermissionSelectorModal from './components/UserPermissionSelectorModal';
import { useModalForm } from '@/hooks/useModalForm';

const { Title } = Typography;
const { Option } = Select;

const UserManagement = () => {
  const [roles, setRoles] = useState([]);
  const [isPermissionsModalVisible, setIsPermissionsModalVisible] = useState(false);
  const [selectedUserForPermissions, setSelectedUserForPermissions] = useState(null);
  const [permissionAction, setPermissionAction] = useState(null);

  // Use the custom hook for table operations
  const {
    data: allUsers,
    loading,
    pagination,
    handleTableChange,
    handleSearch,
    handleRefresh,
    fetchData,
  } = useAdminTable({
    fetchFunction: adminService.getUsers,
    searchField: 'search',
    defaultPageSize: 10,
  });

  // Filter out deleted users
  const users = allUsers.filter(user => !user.deletedAt);

  // Fetch roles for the form
  useEffect(() => {
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
    fetchRoles();
  }, []);

  const { isOpen, editingItem, openModal, closeModal } = useModalForm(Form.useForm());

  const handlePermissionModalClose = (refresh) => {
    setIsPermissionsModalVisible(false);
    setSelectedUserForPermissions(null);
    setPermissionAction(null);
    if (refresh) {
      fetchData();
    }
  };

  const handlePermissionAction = (user, action) => {
    setSelectedUserForPermissions(user);
    setPermissionAction(action);
    setIsPermissionsModalVisible(true);
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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <StatusTag status={status} type="user" />,
    },
    {
      title: 'Role',
      dataIndex: ['role', 'name'],
      key: 'role',
      render: (roleName) => <Tag color="blue">{roleName}</Tag>,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      render: (date) => (date ? dayjs(date).format('DD/MM/YYYY HH:mm') : ''),
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
              ...ActionTypes.EDIT,
              onClick: openModal,
            },
            {
              ...ActionTypes.DELETE,
              onClick: handleDelete,
              confirmTitle: "Are you sure you want to delete this user?",
            },
            {
              type: 'toggle_status',
              icon: record.status === 'ACTIVE' ? <LockOutlined /> : <UnlockOutlined />,
              onClick: handleToggleStatus,
              tooltip: record.status === 'ACTIVE' ? 'Deactivate' : 'Activate',
            },
          ]}
        />
      ),
    },
    {
      title: 'Permissions',
      key: 'permissions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<PlusOutlined />}
            size="small"
            onClick={() => handlePermissionAction(record, 'add')}
            tooltip="Add Permission"
          />
          <Button
            icon={<MinusOutlined />}
            size="small"
            danger
            onClick={() => handlePermissionAction(record, 'remove')}
            tooltip="Remove Permission"
          />
        </Space>
      ),
    },
  ];

  const extraActions = (
    <Button 
      type="primary" 
      icon={<UserAddOutlined />} 
      onClick={() => openModal()}
    >
      Add User
    </Button>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminTable
        title="User Management"
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        searchPlaceholder="Search by name or email..."
        searchValue=""
        onSearchChange={handleSearch}
        onRefresh={handleRefresh}
        extraActions={extraActions}
        rowKey="id"
      />

      {/* User Form Modal */}
      <AdminModal
        title={editingItem ? 'Edit User' : 'Add New User'}
        open={isOpen}
        onCancel={closeModal}
        onOk={() => Form.useForm().submit()}
        showFooter={false}
      >
        <Form form={Form.useForm()} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email", message: "Please input a valid email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="roleId"
            label="Role"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Select placeholder="Select a role">
              {roles.map((role) => (
                <Option key={role.id} value={role.id}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingItem ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </AdminModal>

      {/* Permission Modal - Keep existing component */}
      {isPermissionsModalVisible && (
        <UserPermissionSelectorModal
          visible={isPermissionsModalVisible}
          onCancel={handlePermissionModalClose}
          user={selectedUserForPermissions}
          action={permissionAction}
        />
      )}
    </div>
  );
};

export default UserManagement;