import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Space, 
  Typography, 
  Tag,
  Input,
  Form,
  Popconfirm,
  message,
  Badge,
  Drawer,
  Row,
  Col,
  Statistic,
  Divider,
  Select,
  Tooltip,
  Modal,
  Alert
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  CheckOutlined,
  WarningOutlined,
  FileTextOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { adminService } from '@/services/adminService';

// Import components
import RoleFormModal from './components/RoleFormModal';
import RoleDetailsDrawer from './components/RoleDetailsDrawer';

const { Title, Text } = Typography;

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 100, total: 0 });
  const [loading, setLoading] = useState({
    table: false,
    create: false,
    update: false,
    delete: null, // will store the ID of the role being deleted
  });
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [form] = Form.useForm();
  const [editingRole, setEditingRole] = useState(null);

  // Fetch roles list
  const fetchRoles = async (params = {}) => {
    setLoading(prev => ({ ...prev, table: true }));
    try {
      console.log('Fetching roles with params:', params);
      
      // Default to 100 roles
      const response = await adminService.getRoles({
        limit: 100,
        search: searchText,
        ...params,
      });
      
      console.log('Roles API Response:', response);
      
      // Handle different API response structures
      let rolesData;
      if (response.data?.data?.data) {
        rolesData = response.data.data.data;
      } else if (response.data?.data) {
        rolesData = response.data.data;
      } else if (Array.isArray(response.data)) {
        rolesData = response.data;
      } else {
        rolesData = [];
        console.warn('Unexpected roles data format:', response.data);
      }
      
      const metaData = { page: 1, limit: rolesData.length, total: rolesData.length };
      
      console.log('Extracted roles data:', rolesData);
      
      // Ensure rolesData is always an array
      if (Array.isArray(rolesData)) {
        setRoles(rolesData);
      } else {
        console.warn('Roles data is not an array:', rolesData);
        setRoles([]);
      }
      setMeta(metaData);
    } catch (error) {
      console.error('Error fetching roles:', error);
      console.error('Error response:', error.response);
      message.error('Failed to fetch roles');
      setRoles([]);
      setMeta({ page: 1, limit: 0, total: 0 });
    } finally {
      setLoading(prev => ({ ...prev, table: false }));
    }
  };

  // Fetch permissions list for role creation/editing
  const fetchPermissions = async () => {
    try {
      console.log('Fetching permissions');
      
      // Default to 100 permissions
      const response = await adminService.getPermissions({ limit: 100 });
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
      
      console.log('Extracted permissions data:', permissionsData);
      
      // Ensure it's an array
      if (Array.isArray(permissionsData)) {
        setPermissions(permissionsData);
      } else {
        console.warn('Permissions data is not an array:', permissionsData);
        setPermissions([]);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      console.error('Error response:', error.response);
      message.error('Failed to fetch permissions');
      setPermissions([]);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []); // Only fetch on component mount, not when meta changes

  // Handle search text changes
  useEffect(() => {
    if (searchText !== undefined) {
      fetchRoles();
    }
  }, [searchText]);

  // Handle form submission
  const handleFormSubmit = (values) => {
    if (editingRole) {
      handleUpdateRole(values);
    } else {
      handleCreateRole(values);
    }
  };

  // Handle role creation
  const handleCreateRole = async (values) => {
    setLoading(prev => ({ ...prev, create: true }));
    try {
      // Create payload according to API requirements
      const payload = {
        name: values.name,
        description: values.description,
        permissions: values.permissionIds || [], // Send as array of permission IDs
        isActive: values.isActive !== false // Default to true unless explicitly set to false
      };
      
      console.log('Creating role with payload:', payload);
      
      await adminService.createRole(payload);
      message.success('Role created successfully');
      setIsModalOpen(false);
      form.resetFields();
      fetchRoles();
    } catch (error) {
      console.error('Error creating role:', error);
      message.error(error.response?.data?.message || 'Failed to create role');
    } finally {
      setLoading(prev => ({ ...prev, create: false }));
    }
  };

  // Handle role update
  const handleUpdateRole = async (values) => {
    if (!editingRole) return;
    setLoading(prev => ({ ...prev, update: true }));
    try {
      // Create payload according to API requirements
      const payload = {
        name: values.name,
        description: values.description,
        permissions: values.permissionIds || [],  // Send as array of permission IDs
        isActive: values.isActive !== false, // Default to true unless explicitly set to false
        updatedById: 1 // Use logged-in user ID if available
      };
      
      console.log('Updating role with payload:', payload);
      
      await adminService.updateRole(editingRole.id, payload);
      message.success('Role updated successfully');
      setIsModalOpen(false);
      form.resetFields();
      setEditingRole(null);
      fetchRoles();
    } catch (error) {
      console.error('Error updating role:', error);
      message.error(error.response?.data?.message || 'Failed to update role');
    } finally {
      setLoading(prev => ({ ...prev, update: false }));
    }
  };

  // Handle role deletion
  const handleDeleteRole = async (roleId) => {
    setLoading(prev => ({ ...prev, delete: roleId }));
    try {
      console.log('Deleting role with ID:', roleId);
      
      // Show loading message
      const hide = message.loading('Deleting role...', 0);
      
      await adminService.deleteRole(roleId);
      
      // Hide loading message
      hide();
      
      message.success('Role deleted successfully');
      // Close drawer if the deleted role was being viewed
      if (selectedRole && selectedRole.id === roleId) {
        setIsDrawerOpen(false);
        setSelectedRole(null);
      }
      // Refresh roles list
      fetchRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
      console.error('Error response:', error.response);
      message.error(error.response?.data?.message || 'Failed to delete role');
    } finally {
      setLoading(prev => ({ ...prev, delete: null }));
    }
  };

  // Show role details in drawer
  const showRoleDetails = async (role) => {
    try {
      // Fetch detailed role information including permissions
      const response = await adminService.getRoleById(role.id);
      const detailedRole = response.data?.data || role;
      
      console.log('Detailed role with permissions:', detailedRole);
      
      setSelectedRole(detailedRole);
      setIsDrawerOpen(true);
    } catch (error) {
      console.error('Error fetching role details:', error);
      // Fallback to basic role data if API call fails
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
        isActive: role.isActive !== false, // Default to true if not specified
      });
    } else {
      setEditingRole(null);
      form.resetFields();
      
      // Set defaults for new role
      form.setFieldsValue({
        isActive: true,
        permissionIds: [],
      });
    }
    setIsModalOpen(true);
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

  // Group permissions by resource/category for better organization
  const groupPermissionsByResource = (permissions) => {
    const grouped = {};
    permissions.forEach(permission => {
      // Extract resource name from permission name (e.g., "manage_users" -> "users")
      const resource = permission.name.split('_')[1] || permission.path.split('/')[1] || 'other';
      if (!grouped[resource]) {
        grouped[resource] = [];
      }
      grouped[resource].push(permission);
    });
    return grouped;
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
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
      render: (isActive) => (
        <Tag color={isActive !== false ? 'success' : 'error'}>
          {isActive !== false ? 'Active' : 'Inactive'}
        </Tag>
      ),
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
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<InfoCircleOutlined />}
            size="small"
            onClick={() => showRoleDetails(record)}
          />
          <Button
            icon={<EditOutlined />}
            size="small"
            type="primary"
            ghost
            onClick={() => showModal(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this role?"
            onConfirm={() => handleDeleteRole(record.id)}
            okText="Yes"
            cancelText="No"
            disabled={loading.delete === record.id}
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              loading={loading.delete === record.id}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

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

        <div className="overflow-hidden rounded-lg border border-gray-200">
          <Table
            columns={columns}
            dataSource={Array.isArray(roles) ? roles : []}
            loading={loading.table}
            rowKey={record => record.id}
            pagination={{
              current: meta.page,
              pageSize: meta.limit,
              total: meta.total,
              onChange: (page, pageSize) => setMeta(m => ({ ...m, page, limit: pageSize })),
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} roles`,
              className: "px-4 py-3"
            }}
            className="w-full"
            rowClassName="hover:bg-gray-50 transition-colors"
          />
        </div>
      </Card>      {/* Role Form Modal - Extracted to component */}
      <RoleFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditingRole(null);
        }}
        onSubmit={editingRole ? handleUpdateRole : handleCreateRole}
        editingRole={editingRole}
        permissions={permissions}
        form={form}
        loading={editingRole ? loading.update : loading.create}
      />

      {/* Role Details Drawer - Extracted to component */}
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
