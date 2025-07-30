import React from 'react';
import { Form, Select, Card, Typography, Button, Row, Col, DatePicker, Input } from 'antd';
import { CheckOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import ProtocolMedications from './ProtocolMedications';
import CustomMedications from './CustomMedications';

const { Title } = Typography;
const { Option } = Select;

const TreatmentForm = ({ 
  form,
  protocols,
  medicines,
  loadingData,
  selectedProtocol,
  customMedications,
  onProtocolChange,
  onAddCustomMedication,
  onFinish,
  onUpdateCustomMedication,
  onRemoveCustomMedication
}) => {
  return (
    <Card className="lg:col-span-2 shadow-md">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          startDate: dayjs(),
          notes: ''
        }}
      >
        {/* Protocol Selection */}
        <div className="mb-6">
          <Title level={4}>Chọn phác đồ điều trị</Title>
          <Form.Item 
            name="protocolId" 
            rules={[{ required: true, message: 'Vui lòng chọn phác đồ điều trị' }]}
          >
            <Select
              placeholder="Chọn phác đồ điều trị"
              style={{ width: '100%' }}
              options={protocols}
              loading={loadingData}
              showSearch
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={onProtocolChange}
            />
          </Form.Item>
        </div>

        {/* Medications Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <Title level={4}>Thuốc trong phác đồ</Title>
            <Button 
              type="dashed" 
              icon={<PlusOutlined />} 
              onClick={onAddCustomMedication}
            >
              Thêm thuốc mới
            </Button>
          </div>
          
          <ProtocolMedications 
            selectedProtocol={selectedProtocol}
          />
          
          <CustomMedications 
            customMedications={customMedications}
            medicines={medicines}
            onUpdateMedication={onUpdateCustomMedication}
            onRemoveMedication={onRemoveCustomMedication}
          />
        </div>

        {/* Treatment Dates */}
        <div className="mb-6">
          <Title level={4}>Thời gian điều trị</Title>
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
                  placeholder="Chọn ngày bắt đầu"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="Ngày kết thúc (tùy chọn)"
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày kết thúc"
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <Form.Item 
            name="notes" 
            label="Ghi chú"
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Nhập ghi chú về phác đồ điều trị" 
            />
          </Form.Item>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button 
            type="primary" 
            size="large"
            htmlType="submit"
            icon={<CheckOutlined />}
            disabled={!selectedProtocol}
          >
            Tạo phác đồ điều trị
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default TreatmentForm;
