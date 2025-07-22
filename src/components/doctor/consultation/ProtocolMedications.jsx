import React from 'react';
import { Button, Typography, Row, Col, Form, Input, Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

const ProtocolMedications = ({ selectedProtocol, onUpdateMedication, onRemoveMedication }) => {
  if (!selectedProtocol || !selectedProtocol.medications || selectedProtocol.medications.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <Text strong className="text-blue-600">Thuốc có sẵn trong phác đồ:</Text>
      {selectedProtocol.medications.map((med, index) => (
        <div key={`protocol-${index}`} className="border rounded p-3 mb-3 bg-green-50">
          <div className="flex items-center justify-between mb-2">
            <Text strong>{med.name}</Text>
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
              onClick={() => onRemoveMedication?.(index)}
            />
          </div>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Liều lượng">
                <Input
                  placeholder="VD: 1 tablet"
                  defaultValue={med.dosage}
                  onChange={(e) => onUpdateMedication?.(index, 'dosage', e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Thời gian">
                <Input
                  placeholder="VD: 30"
                  defaultValue={med.durationValue}
                  onChange={(e) => onUpdateMedication?.(index, 'durationValue', parseInt(e.target.value) || 0)}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Đơn vị thời gian">
                <Select
                  defaultValue={med.durationUnit}
                  onChange={(value) => onUpdateMedication?.(index, 'durationUnit', value)}
                >
                  <Option value="DAY">Ngày</Option>
                  <Option value="WEEK">Tuần</Option>
                  <Option value="MONTH">Tháng</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Lịch uống">
                <Select
                  defaultValue={med.schedule}
                  onChange={(value) => onUpdateMedication?.(index, 'schedule', value)}
                >
                  <Option value="MORNING">Buổi sáng</Option>
                  <Option value="AFTERNOON">Buổi chiều</Option>
                  <Option value="EVENING">Buổi tối</Option>
                  <Option value="DAILY">Hàng ngày</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ghi chú">
                <Input
                  placeholder="VD: Uống sau ăn"
                  defaultValue={med.notes}
                  onChange={(e) => onUpdateMedication?.(index, 'notes', e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <div className="mt-2 p-2 bg-blue-50 rounded">
            <div className="text-sm text-gray-600">
              <div><strong>Mô tả:</strong> {med.description}</div>
              <div><strong>Liều lượng chuẩn:</strong> {med.dose} {med.unit}</div>
              <div><strong>Giá:</strong> {med.price ? `${med.price} VNĐ` : 'Chưa có giá'}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProtocolMedications;
