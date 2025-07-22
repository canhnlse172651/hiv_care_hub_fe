import React from 'react';
import { Modal, Form, Input, Button } from 'antd';

const AddDoctorModal = ({ open, onCancel, onSubmit, loading }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const success = await onSubmit(values);
    if (success) {
      form.resetFields();
      onCancel();
    }
  };

  return (
    <Modal
      title="Add New Doctor"
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="userId"
          label="User ID"
          rules={[{ required: true, message: 'Please enter user ID' }]}
        >
          <Input placeholder="Enter user ID" />
        </Form.Item>
        <Form.Item
          name="specialization"
          label="Specialization"
          rules={[{ required: true, message: 'Please enter specialization' }]}
        >
          <Input placeholder="Enter specialization" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Add Doctor
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDoctorModal;
