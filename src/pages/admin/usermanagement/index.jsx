import React, { useState, useEffect } from 'react';
import { 
  Table, Card, Button, Space, Typography, Tag,
  Input, Modal, Form, Select, Popconfirm, message
} from 'antd';
import { 
  UserAddOutlined, SearchOutlined, EditOutlined, DeleteOutlined,
  LockOutlined, UnlockOutlined, EyeOutlined, EyeInvisibleOutlined
} from '@ant-design/icons';
import { adminService } from '@/services/adminService';
import dayjs from 'dayjs';
import useDebounce from '@/hooks/useDebounce';

const { Title } = Typography;
const { Option } = Select;

const UserManagement = () => {
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [sorter, setSorter] = useState({ field: 'createdAt', order: 'descend' });

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
          ? data.map((user) => ({ ...user, key: user.id }))
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
        ...user,
        roleId: user.role?.id || null, // Assuming role is an object
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      if (editingUser) {
        await adminService.updateUser(editingUser.id, values);
        message.success('User updated successfully');
      } else {
        await adminService.createUser(values);
        message.success('User added successfully');
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'An unexpected error occurred.';
      message.error(`Failed: ${errorMsg}`);
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

  const columns = [
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
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        if (!role || !role.name) return <Tag>N/A</Tag>;
        const roleColor = role.name.toLowerCase() === 'admin' ? 'magenta' : 'blue';
        return <Tag color={roleColor}>{role.name.toUpperCase()}</Tag>;
      },
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
          <Button type="primary" icon={<UserAddOutlined />} onClick={() => showModal()}>
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
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter the user\'s full name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email Address"
            rules={[{ required: true, message: 'Please enter a valid email' }, { type: 'email' }]}
          >
            <Input />
          </Form.Item>
          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Password is required' }]}
            >
              <Input.Password
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
          )}
          <Form.Item
            name="roleId"
            label="Role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select placeholder="Select a role">
              <Option value={1}>Admin</Option>
              <Option value={2}>Doctor</Option>
              <Option value={3}>Staff</Option>
              <Option value={4}>Patient</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default UserManagement;