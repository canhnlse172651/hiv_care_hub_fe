import React from 'react';
import { Button, Typography, Row, Col, Form, Input, Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

const CustomMedications = ({ customMedications, medicines, onUpdateMedication, onRemoveMedication }) => {
  if (!customMedications || customMedications.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <Text strong className="text-orange-600">Thuốc tùy chỉnh thêm:</Text>
      {customMedications.map((med, index) => (
        <div key={index} className="border rounded p-3 mb-3 bg-orange-50">
          <div className="flex items-center justify-between mb-2">
            <Text strong>Thuốc {index + 1}</Text>
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
              onClick={() => onRemoveMedication?.(index)}
            />
          </div>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Tên thuốc">
                <Select
                  placeholder="Chọn thuốc"
                  value={med.name}
                  onChange={(value) => {
                    onUpdateMedication?.(index, 'name', value);
                    const selectedMedicine = medicines.find(m => m.name === value);
                    if (selectedMedicine) {
                      onUpdateMedication?.(index, 'unit', selectedMedicine.unit);
                    }
                  }}
                  showSearch
                  filterOption={(input, option) =>
                    option?.value?.toLowerCase().includes(input.toLowerCase())
                  }
                  // Only show the name in the input, not the description
                  optionLabelProp="value"
                >
                  {medicines.map((medicine) => (
                    <Option key={medicine.name} value={medicine.name}>
                      <div>
                        <div><strong>{medicine.name}</strong></div>
                        <div className="text-xs text-gray-500">
                          {medicine.description} - {medicine.dose} {medicine.unit}
                        </div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Liều lượng">
                <Input
                  placeholder="VD: 2"
                  value={med.dosage}
                  onChange={(e) => onUpdateMedication?.(index, 'dosage', e.target.value)}
                  // onChange={(e) => {console.log(e.target.value);}}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Đơn vị">
                <Select
                  placeholder="Chọn đơn vị"
                  value={med.unit}
                  onChange={(value) => onUpdateMedication?.(index, 'unit', value)}
                >
                  <Option value="viên nén">viên nén</Option>
                  <Option value="viên nang">viên nang</Option>
                  <Option value="lọ dung dịch">lọ dung dịch</Option>
                  <Option value="thuốc tiêm">thuốc tiêm</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Thời gian">
                <Input
                  placeholder="VD: 10"
                  value={med.durationValue || ''}
                  onChange={(e) => onUpdateMedication?.(index, 'durationValue', parseInt(e.target.value) || 0)}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Đơn vị thời gian">
                <Select
                  value={med.durationUnit || 'DAY'}
                  onChange={(value) => onUpdateMedication?.(index, 'durationUnit', value)}
                >
                  <Option value="DAY">Ngày</Option>
                  <Option value="WEEK">Tuần</Option>
                  <Option value="MONTH">Tháng</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Lịch uống">
                <Select
                  value={med.schedule || 'DAILY'}
                  onChange={(value) => onUpdateMedication?.(index, 'schedule', value)}
                >
                  <Option value="MORNING">Buổi sáng</Option>
                  <Option value="AFTERNOON">Buổi chiều</Option>
                  <Option value="EVENING">Buổi tối</Option>
                  <Option value="DAILY">Hàng ngày</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Ghi chú">
                <Input
                  placeholder="VD: Uống sau ăn cơm"
                  value={med.notes || ''}
                  onChange={(e) => onUpdateMedication?.(index, 'notes', e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          
          {med.name && (
            <div className="mt-2 p-2 bg-blue-50 rounded">
              <Text strong>Thông tin thuốc đã chọn:</Text>
              <div className="text-sm text-gray-600 mt-1">
                <div><strong>Mô tả:</strong> {medicines.find(m => m.name === med.name)?.description || 'Không có mô tả'}</div>
                <div><strong>Liều lượng chuẩn:</strong> {medicines.find(m => m.name === med.name)?.dose} {medicines.find(m => m.name === med.name)?.unit}</div>
                <div><strong>Giá:</strong> {medicines.find(m => m.name === med.name)?.price ? `${medicines.find(m => m.name === med.name)?.price} VNĐ` : 'Chưa có giá'}</div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CustomMedications;