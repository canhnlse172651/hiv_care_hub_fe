import React from 'react';
import { Modal, Form, Select, InputNumber, Button } from 'antd';

const { Option } = Select;

const ManualAssignModal = ({ 
  open, 
  onCancel, 
  onSubmit, 
  loading, 
  shift, 
  doctors 
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const success = await onSubmit(shift, values);
    if (success) {
      form.resetFields();
      onCancel();
    }
  };

  return (
    <Modal
      title="Manual Assign Shift"
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item 
          label="Doctors" 
          name="doctorIds" 
          rules={[{ required: true, message: 'Select doctors' }]}
        > 
          <Select
            mode="multiple"
            placeholder="Select doctors"
            optionFilterProp="children"
            showSearch
          >
            {doctors.map(doc => (
              <Option key={doc.id} value={doc.id}>{doc.user?.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item 
          label="Doctors Per Shift" 
          name="doctorsPerShift" 
          rules={[{ required: true, message: 'Enter doctors per shift' }]}
        > 
          <InputNumber min={1} max={100} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Assign
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ManualAssignModal;
