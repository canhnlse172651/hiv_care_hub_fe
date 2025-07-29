import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { PhoneOutlined, MailOutlined } from '@ant-design/icons';

const EditPatientModal = ({ 
  visible, 
  onCancel, 
  onFinish, 
  form, 
  loading = false 
}) => {
  return (
    <Modal
      title="Cập nhật thông tin bệnh nhân"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
        </Form.Item>
        
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { type: 'email', message: 'Email không hợp lệ!' },
            { required: true, message: 'Vui lòng nhập email!' }
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>
        
        <Form.Item
          name="notes"
          label="Ghi chú"
        >
          <Input.TextArea rows={4} placeholder="Ghi chú về bệnh nhân..." />
        </Form.Item>
        
        <Form.Item className="mb-0 text-right">
          <Button type="default" className="mr-2" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPatientModal; 