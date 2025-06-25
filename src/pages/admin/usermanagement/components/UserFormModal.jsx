import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';

const { Option } = Select;

const UserFormModal = ({ visible, onCancel, onOk, editingUser, form, roles }) => {
  return (
    <Modal
      title={editingUser ? 'Edit User' : 'Add New User'}
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose
    >
      <Form form={form} layout="vertical" name="userForm">
        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[{ required: true, message: 'Please input the full name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
        >
          <Input />
        </Form.Item>
        {!editingUser && (
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input a password!' }]}
          >
            <Input.Password />
          </Form.Item>
        )}
        <Form.Item
          name="roleId"
          label="Role"
          rules={[{ required: true, message: 'Please select a role!' }]}
        >
          <Select placeholder="Select a role">
            {roles.map((role) => (
              <Option key={role.id} value={role.id}>
                {role.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserFormModal; 