import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Select, 
  Space, 
  Tag, 
  Badge, 
  Tooltip, 
  Modal, 
  Form, 
  Alert, 
  Typography,
  Row,
  Col,
  Statistic,
  Divider,
  Card,
  Popconfirm,
  message
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  UnlockOutlined, 
  InfoCircleOutlined,
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  CheckOutlined, 
  WarningOutlined, 
  FileTextOutlined, 
  PrinterOutlined, 
  ShareAltOutlined,
  MinusCircleOutlined
} from '@ant-design/icons';
import { adminService } from '@/services/adminService';
import dayjs from 'dayjs';
import useDebounce from '@/hooks/useDebounce';
import useQuery from "@/hooks/useQuery";
import UserPermissionSelectorModal from './components/UserPermissionSelectorModal';

const { Title } = Typography;
const { Option } = Select;

const UserManagement = () => {
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, 500);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [sorter, setSorter] = useState({ field: 'createdAt', order: 'descend' });
  const [isPermissionsModalVisible, setIsPermissionsModalVisible] = useState(false);
  const [selectedUserForPermissions, setSelectedUserForPermissions] = useState(null);
  const [permissionAction, setPermissionAction] = useState(null);

  const {
    data: userData,
    loading: queryLoading,
    error,
    refetch: refetchUsers,
  } = useQuery(() => adminService.getUsers());

  const usersData = userData?.data?.data || [];

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

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [debouncedSearch, pagination.current, pagination.pageSize, sorter]);

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
    try {
      if (editingUser) {
        await adminService.updateUser(editingUser.id, {
          email: values.email,
          roleId: values.roleId,
        });
        message.success("User updated successfully!");
      } else {
        await adminService.createUser({
          email: values.email,
          roleId: values.roleId,
        });
        message.success("User created successfully!");
      }
      fetchUsers();
      handleCancel();
    } catch (err) {
      message.error(err.response?.data?.message || "An error occurred.");
    }
  };

  const handleDelete = async (userId) => {
    try {
      await adminService.deleteUser(userId);
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to delete user.';
      message.error(errorMsg);
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await adminService.updateUser(user.id, { status: newStatus });
      message.success(`User status updated to ${newStatus.toLowerCase()}`);
      fetchUsers();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update status.';
      message.error(errorMsg);
    }
  };

  const handleTableChange = (pagination, filters, newSorter) => {
    setPagination({
      ...pagination,
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
    setSorter({
      field: newSorter.field || 'createdAt',
      order: newSorter.order || 'descend',
    });
  };

  const handlePermissionModalClose = (refresh) => {
    setIsPermissionsModalVisible(false);
    setSelectedUserForPermissions(null);
    setPermissionAction(null);
    if (refresh) {
      fetchUsers();
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
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
      render: (status) => {
        let color;
        if (status === 'ACTIVE') color = 'green';
        else if (status === 'INACTIVE') color = 'volcano';
        else color = 'red';
        return <Tag color={color}>{status ? status.toUpperCase() : 'N/A'}</Tag>;
      },
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
      render: (_, record) => (
        <Space size="small">
          <Button icon={<EditOutlined />} size="small" type="primary" ghost onClick={() => showModal(record)} />
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            placement="left"
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
          <Button
            icon={record.status === 'ACTIVE' ? <LockOutlined /> : <UnlockOutlined />}
            size="small"
            onClick={() => handleToggleStatus(record)}
          />
        </Space>
      ),
    },
    {
      title: 'Edit Permission',
      key: 'edit-permission',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<PlusOutlined />}
            size="small"
            onClick={() => {
              setSelectedUserForPermissions(record);
              setPermissionAction('add');
              setIsPermissionsModalVisible(true);
            }}
          />
          <Button
            icon={<MinusCircleOutlined />}
            size="small"
            danger
            onClick={() => {
              setSelectedUserForPermissions(record);
              setPermissionAction('remove');
              setIsPermissionsModalVisible(true);
            }}
          />
        </Space>
      ),
    },
  ];

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

      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="id"
        scroll={{ x: 'max-content' }}
      />

      <Modal
        title={editingUser ? 'Edit User' : 'Add New User'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
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
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              {editingUser ? "Update" : "Create"}
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>
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