import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Switch
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import PermissionSelector from './PermissionSelector';

const RoleFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingRole, 
  permissions,
  form
}) => {
  useEffect(() => {
    // Reset form when modal opens/closes or editing role changes
    if (!isOpen) {
      form.resetFields();
    }
  }, [isOpen, form]);

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
      width={600}
      className="top-8"
      maskClosable={true}
    >
      <div className="pt-4">
        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          className="space-y-4"
        >
          <Form.Item
            name="name"
            label={<span className="text-gray-700 font-medium">Role Name</span>}
            rules={[{ required: true, message: 'Please enter role name' }]}
          >
            <Input 
              placeholder="Enter role name" 
              className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className="text-gray-700 font-medium">Description</span>}
            rules={[{ required: true, message: 'Please enter role description' }]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Enter role description" 
              className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </Form.Item>

          <Form.Item
            name="isActive"
            valuePropName="checked"
            className="mb-4"
          >
            <div className="flex items-center">
              <Switch 
                defaultChecked 
                className="mr-2"
              />
              <span className="text-gray-700 font-medium">Active</span>
            </div>
          </Form.Item>

          <Form.Item
            name="permissionIds"
            label={<span className="text-gray-700 font-medium">Permissions</span>}
            rules={[{ required: true, message: 'Please select at least one permission' }]}
          >
            <PermissionSelector
              permissions={permissions}
              value={form.getFieldValue('permissionIds') || []}
              onChange={ids => form.setFieldsValue({ permissionIds: ids })}
            />
          </Form.Item>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button 
              onClick={onClose}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              className="rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              {editingRole ? 'Update Role' : 'Create Role'}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default RoleFormModal;
