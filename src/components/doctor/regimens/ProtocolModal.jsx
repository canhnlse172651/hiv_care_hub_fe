import React from 'react';
import { Modal, Form, Input, Select, Button, Row, Col, Divider, Typography, Card } from 'antd';
import { FileTextOutlined, PlusOutlined, DeleteOutlined, MedicineBoxOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;

const ProtocolModal = ({ 
  visible, 
  onCancel, 
  onSubmit, 
  form, 
  currentProtocol, 
  loading = false 
}) => {
  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      centered
      className="protocol-modal"
      destroyOnClose
    >
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileTextOutlined className="text-3xl text-blue-500" />
          </div>
          <Title level={3} className="text-gray-900 mb-2">
            {currentProtocol ? 'Chỉnh sửa phác đồ' : 'Tạo phác đồ mới'}
          </Title>
          <Text className="text-gray-600">
            {currentProtocol ? 'Cập nhật thông tin phác đồ điều trị' : 'Tạo phác đồ điều trị HIV/AIDS mới'}
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          className="space-y-6"
        >
          {/* Basic Information */}
          <Card className="border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <InfoCircleOutlined className="text-blue-500" />
              <Title level={5} className="mb-0">Thông tin cơ bản</Title>
            </div>
            
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  name="name"
                  label={<span className="font-semibold text-gray-700">Tên phác đồ</span>}
                  rules={[{ required: true, message: 'Vui lòng nhập tên phác đồ' }]}
                >
                  <Input 
                    placeholder="VD: Phác đồ điều trị HIV bậc 1"
                    className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500"
                    size="large"
                  />
                </Form.Item>
              </Col>
              
              <Col span={24}>
                <Form.Item
                  name="description"
                  label={<span className="font-semibold text-gray-700">Mô tả chi tiết</span>}
                  rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                >
                  <Input.TextArea 
                    rows={4} 
                    placeholder="Nhập mô tả chi tiết về phác đồ, chỉ định sử dụng, lưu ý đặc biệt..."
                    className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500"
                  />
                </Form.Item>
              </Col>
              
              <Col span={24}>
                <Form.Item
                  name="targetDisease"
                  label={<span className="font-semibold text-gray-700">Bệnh điều trị</span>}
                  rules={[{ required: true, message: 'Vui lòng chọn bệnh điều trị' }]}
                >
                  <Select 
                    placeholder="Chọn loại bệnh mà phác đồ này điều trị"
                    className="rounded-lg"
                    size="large"
                  >
                    <Option value="HIV">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>HIV - Virus gây suy giảm miễn dịch</span>
                      </div>
                    </Option>
                    <Option value="AIDS">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span>AIDS - Hội chứng suy giảm miễn dịch mắc phải</span>
                      </div>
                    </Option>
                    <Option value="HIV/AIDS">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>HIV/AIDS - Điều trị kết hợp</span>
                      </div>
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>
          
          {/* Medicine List */}
          <Card className="border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <MedicineBoxOutlined className="text-green-500" />
                <Title level={5} className="mb-0">Danh sách thuốc</Title>
              </div>
              <Text className="text-gray-500 text-sm">Thêm các loại thuốc trong phác đồ</Text>
            </div>
            
            <Form.List name="medicines">
              {(fields, { add, remove }) => (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.key} className="relative">
                      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl">
                        <div className="absolute top-3 right-3 z-10">
                          <Button 
                            type="text" 
                            danger 
                            icon={<DeleteOutlined />} 
                            onClick={() => remove(field.name)}
                            className="hover:bg-red-50 rounded-lg"
                            size="small"
                          />
                        </div>
                        
                        <div className="pr-12">
                          <div className="flex items-center space-x-2 mb-4">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {index + 1}
                            </div>
                            <Text strong className="text-gray-700">Thuốc {index + 1}</Text>
                          </div>
                          
                          <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'medicineId']}
                                label={<span className="font-medium text-gray-600">Tên thuốc</span>}
                                rules={[{ required: true, message: 'Vui lòng chọn thuốc' }]}
                              >
                                <Select 
                                  placeholder="Chọn loại thuốc"
                                  className="rounded-lg"
                                  size="large"
                                >
                                  <Option value={1}>
                                    <div>
                                      <div className="font-medium">Tenofovir (TDF)</div>
                                      <div className="text-xs text-gray-500">300mg - NRTI</div>
                                    </div>
                                  </Option>
                                  <Option value={2}>
                                    <div>
                                      <div className="font-medium">Emtricitabine (FTC)</div>
                                      <div className="text-xs text-gray-500">200mg - NRTI</div>
                                    </div>
                                  </Option>
                                  <Option value={3}>
                                    <div>
                                      <div className="font-medium">Dolutegravir (DTG)</div>
                                      <div className="text-xs text-gray-500">50mg - INSTI</div>
                                    </div>
                                  </Option>
                                  <Option value={4}>
                                    <div>
                                      <div className="font-medium">Abacavir (ABC)</div>
                                      <div className="text-xs text-gray-500">300mg - NRTI</div>
                                    </div>
                                  </Option>
                                  <Option value={5}>
                                    <div>
                                      <div className="font-medium">Raltegravir (RAL)</div>
                                      <div className="text-xs text-gray-500">400mg - INSTI</div>
                                    </div>
                                  </Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            
                            <Col xs={24} md={12}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'dosage']}
                                label={<span className="font-medium text-gray-600">Liều dùng</span>}
                                rules={[{ required: true, message: 'Vui lòng nhập liều dùng' }]}
                              >
                                <Input 
                                  placeholder="VD: 1 viên, 2 viên..."
                                  className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500"
                                  size="large"
                                />
                              </Form.Item>
                            </Col>
                            
                            <Col xs={24} md={12}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'duration']}
                                label={<span className="font-medium text-gray-600">Thời điểm dùng</span>}
                                rules={[{ required: true, message: 'Vui lòng chọn thời điểm dùng' }]}
                              >
                                <Select 
                                  placeholder="Chọn thời điểm trong ngày"
                                  className="rounded-lg"
                                  size="large"
                                >
                                  <Option value="MORNING">
                                    <div className="flex items-center space-x-2">
                                      <span>🌅</span>
                                      <span>Buổi sáng (6:00 - 12:00)</span>
                                    </div>
                                  </Option>
                                  <Option value="NOON">
                                    <div className="flex items-center space-x-2">
                                      <span>☀️</span>
                                      <span>Buổi trưa (12:00 - 18:00)</span>
                                    </div>
                                  </Option>
                                  <Option value="EVENING">
                                    <div className="flex items-center space-x-2">
                                      <span>🌆</span>
                                      <span>Buổi tối (18:00 - 22:00)</span>
                                    </div>
                                  </Option>
                                  <Option value="BEDTIME">
                                    <div className="flex items-center space-x-2">
                                      <span>🌙</span>
                                      <span>Trước khi ngủ (22:00 - 24:00)</span>
                                    </div>
                                  </Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            
                            <Col xs={24} md={12}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'notes']}
                                label={<span className="font-medium text-gray-600">Ghi chú đặc biệt</span>}
                              >
                                <Input 
                                  placeholder="VD: Uống sau khi ăn, tránh uống cùng sữa..."
                                  className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500"
                                  size="large"
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </div>
                      </Card>
                    </div>
                  ))}
                  
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    className="h-12 border-2 border-dashed border-blue-300 text-blue-600 hover:border-blue-500 hover:text-blue-700 rounded-xl font-medium transition-all duration-200"
                  >
                    Thêm thuốc vào phác đồ
                  </Button>
                </div>
              )}
            </Form.List>
          </Card>
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button 
              size="large"
              onClick={onCancel}
              className="px-8 rounded-xl border-gray-300 hover:border-blue-400 hover:text-blue-600"
            >
              Hủy bỏ
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              className="px-8 bg-blue-500 hover:bg-blue-600 border-none rounded-xl font-semibold"
            >
              {currentProtocol ? 'Cập nhật phác đồ' : 'Tạo phác đồ mới'}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default ProtocolModal;