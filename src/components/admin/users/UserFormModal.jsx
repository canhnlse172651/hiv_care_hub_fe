import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Option } = Select;

const UserFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingUser,
  roles,
  form,
  loading
}) => {
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
          {editingUser ? 'Edit User' : 'Add New User'}
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email", message: "Please input a valid email!" }]}
        >
          <Input placeholder="Enter email address" />
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
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {editingUser ? "Update" : "Create"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UserFormModal;
