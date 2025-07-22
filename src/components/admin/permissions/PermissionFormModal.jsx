import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  Button, 
  Space, 
  Alert, 
  Typography,
  Row,
  Col,
  Divider
} from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const PermissionFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingPermission,
  form
}) => {
  useEffect(() => {
    // Reset form when modal opens/closes or editing permission changes
    if (!isOpen) {
      form.resetFields();
    }
  }, [isOpen, form]);

  // HTTP methods for dropdown
  const httpMethods = ['GET', 'POST', 'PUT', 'DELETE'];

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <FileTextOutlined className="text-blue-500" />
          {editingPermission ? 'Edit Permission' : 'Create New Permission'}
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
      className="top-8"
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={editingPermission || {}}
        className="mt-4"
      >
        <Form.Item
          name="name"
          label="Permission Name"
          rules={[
            { required: true, message: 'Please enter a permission name' },
            { min: 3, message: 'Name must be at least 3 characters' }
          ]}
        >
          <Input placeholder="e.g., user:create" />
        </Form.Item>
        
        <Form.Item
          name="path"
          label="API Path"
          rules={[
            { required: true, message: 'Please enter an API path' }
          ]}
        >
          <Input placeholder="e.g., /api/users" />
        </Form.Item>
        
        <Form.Item
          name="method"
          label="HTTP Method"
          rules={[
            { required: true, message: 'Please select an HTTP method' }
          ]}
        >
          <Select placeholder="Select HTTP method">
            {httpMethods.map(method => (
              <Option key={method} value={method}>
                {method}
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item
          name="description"
          label="Description"
        >
          <TextArea 
            rows={4}
            placeholder="Describe what this permission allows..."
          />
        </Form.Item>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            {editingPermission ? 'Update' : 'Create'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default PermissionFormModal;
