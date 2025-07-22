import React from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  Button, 
  Switch,
  Typography,
  Divider
} from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const RoleFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingRole,
  permissions,
  form,
  loading
}) => {
  // Group permissions by resource/category for better organization
  const groupPermissionsByResource = (permissions) => {
    const grouped = {};
    permissions.forEach(permission => {
      const resource = permission.name.split('_')[1] || permission.path.split('/')[1] || 'other';
      if (!grouped[resource]) {
        grouped[resource] = [];
      }
      grouped[resource].push(permission);
    });
    return grouped;
  };

  const handleSubmit = async (values) => {
    const success = await onSubmit(values);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <UserOutlined className="text-blue-500" />
          {editingRole ? 'Edit Role' : 'Create New Role'}
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={700}
      className="top-8"
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        <Form.Item
          name="name"
          label="Role Name"
          rules={[
            { required: true, message: 'Please enter a role name' },
            { min: 3, message: 'Name must be at least 3 characters' }
          ]}
        >
          <Input placeholder="e.g., Admin, User, Moderator" />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: 'Please enter a description' }
          ]}
        >
          <TextArea 
            rows={3}
            placeholder="Describe the role and its responsibilities..."
          />
        </Form.Item>

        <Form.Item
          name="isActive"
          label="Status"
          valuePropName="checked"
        >
          <Switch 
            checkedChildren="Active" 
            unCheckedChildren="Inactive" 
            defaultChecked 
          />
        </Form.Item>
        
        <Form.Item
          name="permissionIds"
          label="Permissions"
          rules={[
            { required: true, message: 'Please select at least one permission' }
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select permissions for this role"
            optionFilterProp="children"
            showSearch
            style={{ width: '100%' }}
            maxTagCount="responsive"
          >
            {Object.entries(groupPermissionsByResource(permissions)).map(([resource, perms]) => (
              <Select.OptGroup key={resource} label={resource.toUpperCase()}>
                {perms.map(permission => (
                  <Option key={permission.id} value={permission.id}>
                    {permission.name} - {permission.method} {permission.path}
                  </Option>
                ))}
              </Select.OptGroup>
            ))}
          </Select>
        </Form.Item>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {editingRole ? 'Update Role' : 'Create Role'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default RoleFormModal;
