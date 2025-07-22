import React from 'react';
import { Modal, Form, Input, DatePicker, Button, Row, Col } from 'antd';

const { TextArea } = Input;

const CreateTreatmentModal = ({ 
  visible, 
  onCancel, 
  onSubmit, 
  form, 
  loading 
}) => {
  const handleSubmit = async (values) => {
    const success = await onSubmit(values);
    if (success) {
      form.resetFields();
      onCancel();
    }
  };

  return (
    <Modal
      title="Tạo phác đồ điều trị mới"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="patientId"
              label="ID Bệnh nhân"
              rules={[{ required: true, message: 'Vui lòng nhập ID bệnh nhân' }]}
            >
              <Input placeholder="Nhập ID bệnh nhân" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="protocolId"
              label="ID Phác đồ"
              rules={[{ required: true, message: 'Vui lòng nhập ID phác đồ' }]}
            >
              <Input placeholder="Nhập ID phác đồ" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="startDate"
              label="Ngày bắt đầu"
              rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="endDate"
              label="Ngày kết thúc"
            >
              <DatePicker 
                style={{ width: '100%' }} 
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="notes"
          label="Ghi chú"
        >
          <TextArea rows={3} placeholder="Nhập ghi chú về phác đồ điều trị" />
        </Form.Item>

        <Form.Item
          name="total"
          label="Chi phí (VNĐ)"
        >
          <Input placeholder="Nhập chi phí điều trị" />
        </Form.Item>

        <div className="flex justify-end">
          <Button className="mr-2" onClick={onCancel}>
            Hủy bỏ
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Tạo phác đồ
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateTreatmentModal;
