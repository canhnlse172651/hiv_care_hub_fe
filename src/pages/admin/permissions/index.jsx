 import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Space, 
  Typography, 
  Tag,
  Input,
  Popconfirm,
  message,
  Form
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  WarningOutlined,
  FileTextOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { adminService } from '@/services/adminService';

// Import components
import PermissionFormModal from './components/PermissionFormModal';
import PermissionDetailsDrawer from './components/PermissionDetailsDrawer';

const { Title, Text } = Typography;

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
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [editingPermission, setEditingPermission] = useState(null);
  const [form] = Form.useForm();
  // Fetch permissions list
  const fetchPermissions = async (params = {}) => {
    setLoading(true);
    try {
      console.log('Fetching permissions with params:', params);
      const response = await adminService.getPermissions({
        limit: 100,
        ...params
      });
      
      console.log('Permissions API Response:', response);
      
      // Handle different API response structures
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
      
      setPermissions(permissionsData);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      message.error('Failed to fetch permissions');
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);
  // Filter permissions by search text
  const filteredPermissions = searchText
    ? permissions.filter(permission => 
        (permission.name && permission.name.toLowerCase().includes(searchText.toLowerCase())) ||
        (permission.path && permission.path.toLowerCase().includes(searchText.toLowerCase())) ||
        (permission.description && permission.description.toLowerCase().includes(searchText.toLowerCase()))
      )
    : permissions;
  // Handle permission creation
  const handleCreate = async (values) => {
    try {
      console.log('Creating permission with values:', values);
      const response = await adminService.createPermission({
        ...values,
        createdById: 1, // This should be the current user's ID
      });
      
      console.log('Create permission response:', response);
      message.success('Permission created successfully');
      fetchPermissions();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating permission:', error);
      message.error(error.response?.data?.message || 'Failed to create permission');
    }
  };
  // Handle permission update
  const handleUpdate = async (id, values) => {
    try {
      console.log('Updating permission with id:', id, 'and values:', values);
      const response = await adminService.updatePermission(id, {
        ...values,
        updatedById: 1, // This should be the current user's ID
      });
      
      console.log('Update permission response:', response);
      message.success('Permission updated successfully');
      fetchPermissions();
      setIsModalOpen(false);
      setEditingPermission(null);
    } catch (error) {
      console.error('Error updating permission:', error);
      message.error(error.response?.data?.message || 'Failed to update permission');
    }
  };
  // Handle permission deletion
  const handleDelete = async (id) => {
    try {
      console.log('Deleting permission with id:', id);
      const response = await adminService.deletePermission(id);
      console.log('Delete permission response:', response);
      message.success('Permission deleted successfully');
      fetchPermissions();
    } catch (error) {
      console.error('Error deleting permission:', error);
      message.error(error.response?.data?.message || 'Failed to delete permission');
    }
  };
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
  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <a onClick={() => showDrawer(record)}>{text || 'N/A'}</a>,
      sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
    },
    {
      title: 'Path',
      dataIndex: 'path',
      key: 'path',
      render: (text) => <Text code>{text || 'N/A'}</Text>,
      sorter: (a, b) => (a.path || '').localeCompare(b.path || ''),
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      render: (text) => (
        text ? <Tag color={getMethodColor(text)}>{text}</Tag> : <Tag>N/A</Tag>
      ),
      sorter: (a, b) => (a.method || '').localeCompare(b.method || ''),
      filters: [
        {value: 'GET', text: 'GET'},
        {value: 'POST', text: 'POST'},
        {value: 'PUT', text: 'PUT'},
        {value: 'DELETE', text: 'DELETE'}
      ],
      onFilter: (value, record) => record.method === value,
    },    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => text || 'No description',
      sorter: (a, b) => (a.description || '').localeCompare(b.description || ''),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 220,
      render: (_, record) => (
        <Space size="small">
          <Button 
            icon={<CheckOutlined />} 
            onClick={() => showDrawer(record)}
            size="small"
          />
          <Button 
            icon={<EditOutlined />} 
            onClick={() => showModal(record)} 
            size="small"
            type="primary"
          />
          <Popconfirm
            title="Delete this permission?"
            description="Are you sure you want to delete this permission? This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              icon={<DeleteOutlined />} 
              danger
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    }
  ];

  // Form submit handler
  const handleFormSubmit = (values) => {
    if (editingPermission) {
      handleUpdate(editingPermission.id, values);
    } else {
      handleCreate(values);
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

        <Table 
          dataSource={filteredPermissions} 
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} permissions`
          }}
          size="middle"
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
