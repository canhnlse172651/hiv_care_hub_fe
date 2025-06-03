import React, { useState } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Space, 
  Typography, 
  Tag,
  Input,
  Modal,
  Form,
  Select,
  Popconfirm,
  message
} from 'antd';
import { 
  UserAddOutlined, 
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined
} from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const UserManagement = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);

  // Example data - in a real app, this would come from API
  const [users, setUsers] = useState([
    {
      key: '1',
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'user',
      status: 'active',
      lastLogin: '2025-06-01 10:23:45',
      createdAt: '2025-01-15',
    },
    {
      key: '2',
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'user',
      status: 'active',
      lastLogin: '2025-05-30 08:12:22',
      createdAt: '2025-02-20',
    },
    {
      key: '3',
      id: 3,
      name: 'Robert Johnson',
      email: 'robert@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2025-06-02 09:45:11',
      createdAt: '2025-01-05',
    },
    {
      key: '4',
      id: 4,
      name: 'Emily Wilson',
      email: 'emily@example.com',
      role: 'user',
      status: 'inactive',
      lastLogin: '2025-05-15 14:30:00',
      createdAt: '2025-03-10',
    },
    {
      key: '5',
      id: 5,
      name: 'Michael Brown',
      email: 'michael@example.com',
      role: 'user',
      status: 'locked',
      lastLogin: '2025-05-01 11:20:33',
      createdAt: '2025-02-28',
    },
  ]);

  const showModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      setEditingUser(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    if (editingUser) {
      // Update existing user
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === editingUser.id ? { ...user, ...values } : user
        )
      );
      message.success('User updated successfully');
    } else {
      // Add new user
      const newUser = {
        key: String(users.length + 1),
        id: users.length + 1,
        ...values,
        lastLogin: '-',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUsers([...users, newUser]);
      message.success('User added successfully');
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDelete = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    message.success('User deleted successfully');
  };

  const handleToggleStatus = (user) => {
    const newStatus = user.status === 'active' ? 'locked' : 'active';
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u.id === user.id ? { ...u, status: newStatus } : u
      )
    );
    message.success(`User ${newStatus === 'active' ? 'unlocked' : 'locked'} successfully`);
  };

  const filteredUsers = users.filter(user => {
    return (
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.role.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'magenta' : 'blue'}>
          {role.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'User', value: 'user' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        if (status === 'inactive') color = 'volcano';
        if (status === 'locked') color = 'red';
        
        return (
          <Tag color={color}>
            {status.toUpperCase()}
          </Tag>
        );
      },
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
        { text: 'Locked', value: 'locked' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            type="primary"
            ghost
            onClick={() => showModal(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              icon={<DeleteOutlined />} 
              size="small" 
              danger
            />
          </Popconfirm>
          <Button
            icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
            size="small"
            type={record.status === 'active' ? 'default' : 'dashed'}
            onClick={() => handleToggleStatus(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>User Management</Title>
        <Button 
          type="primary" 
          icon={<UserAddOutlined />}
          onClick={() => showModal()}
        >
          Add User
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search by name, email or role"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </div>

        <Table 
          columns={columns} 
          dataSource={filteredUsers}
          pagination={{ pageSize: 10 }}
          rowKey="key"
        />
      </Card>

      <Modal
        title={editingUser ? 'Edit User' : 'Add New User'}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter user name' }]}
          >
            <Input placeholder="Enter user name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select user role' }]}
          >
            <Select placeholder="Select role">
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>

          {editingUser && (
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select status' }]}
            >
              <Select placeholder="Select status">
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
                <Option value="locked">Locked</Option>
              </Select>
            </Form.Item>
          )}

          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter password' }]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          )}

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Update' : 'Add'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
