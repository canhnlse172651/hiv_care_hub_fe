import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Table,
  Tag,
  Button,
  Space,
  Drawer,
  Descriptions,
  Tabs,
  List,
  Badge,
  Empty,
  Input,
  Modal,
  Form,
  Select,
  message,
  Divider,
  Popconfirm
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  MedicineBoxOutlined,
  UserOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const TreatmentProtocolPage = () => {
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [currentProtocol, setCurrentProtocol] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [form] = Form.useForm();

  // Fetch protocols from API (mocked here)
  useEffect(() => {
    // Simulate API fetch
    fetchProtocols();
  }, []);

  const fetchProtocols = () => {
    setLoading(true);
    // Mock data to simulate API response
    const mockResponse = {
      "data": {
        "data": [
          {
            "id": 1,
            "name": "First-line ART",
            "description": "Standard first-line antiretroviral therapy",
            "targetDisease": "HIV",
            "createdById": 5,
            "updatedById": 5,
            "createdAt": "2025-06-11T00:23:03.741Z",
            "updatedAt": "2025-06-11T00:23:03.741Z",
            "medicines": [
              {
                "id": 1,
                "protocolId": 1,
                "medicineId": 1,
                "dosage": "1 tablet",
                "duration": "MORNING",
                "notes": null,
                "createdAt": "2025-06-11T00:23:04.161Z",
                "updatedAt": "2025-06-11T00:23:04.161Z",
                "medicine": {
                  "id": 1,
                  "name": "Tenofovir",
                  "description": "Antiretroviral medication",
                  "unit": "tablet",
                  "dose": "300mg",
                  "price": "25",
                  "createdAt": "2025-06-11T00:23:01.865Z",
                  "updatedAt": "2025-06-11T00:23:01.865Z"
                }
              },
              {
                "id": 2,
                "protocolId": 1,
                "medicineId": 2,
                "dosage": "1 tablet",
                "duration": "MORNING",
                "notes": null,
                "createdAt": "2025-06-11T00:23:04.570Z",
                "updatedAt": "2025-06-11T00:23:04.570Z",
                "medicine": {
                  "id": 2,
                  "name": "Emtricitabine",
                  "description": "Antiretroviral medication",
                  "unit": "tablet",
                  "dose": "200mg",
                  "price": "20",
                  "createdAt": "2025-06-11T00:23:02.493Z",
                  "updatedAt": "2025-06-11T00:23:02.493Z"
                }
              },
              {
                "id": 3,
                "protocolId": 1,
                "medicineId": 3,
                "dosage": "1 tablet",
                "duration": "MORNING",
                "notes": null,
                "createdAt": "2025-06-11T00:23:04.758Z",
                "updatedAt": "2025-06-11T00:23:04.758Z",
                "medicine": {
                  "id": 3,
                  "name": "Dolutegravir",
                  "description": "Antiretroviral medication",
                  "unit": "tablet",
                  "dose": "50mg",
                  "price": "30",
                  "createdAt": "2025-06-11T00:23:02.930Z",
                  "updatedAt": "2025-06-11T00:23:02.930Z"
                }
              }
            ],
            "createdBy": {
              "id": 5,
              "name": "Doctor User",
              "email": "doctor@example.com"
            },
            "updatedBy": {
              "id": 5,
              "name": "Doctor User",
              "email": "doctor@example.com"
            },
            "patientTreatments": []
          },
          {
            "id": 2,
            "name": "Second-line ART",
            "description": "For patients who have developed resistance to first-line therapy",
            "targetDisease": "HIV",
            "createdById": 5,
            "updatedById": 5,
            "createdAt": "2025-06-11T00:23:03.741Z",
            "updatedAt": "2025-06-11T00:23:03.741Z",
            "medicines": [
              {
                "id": 4,
                "protocolId": 2,
                "medicineId": 4,
                "dosage": "1 tablet",
                "duration": "MORNING",
                "notes": null,
                "medicine": {
                  "id": 4,
                  "name": "Abacavir",
                  "description": "Antiretroviral medication",
                  "unit": "tablet",
                  "dose": "300mg",
                  "price": "28",
                }
              },
              {
                "id": 5,
                "protocolId": 2,
                "medicineId": 2,
                "dosage": "1 tablet",
                "duration": "MORNING",
                "notes": null,
                "medicine": {
                  "id": 2,
                  "name": "Emtricitabine",
                  "description": "Antiretroviral medication",
                  "unit": "tablet",
                  "dose": "200mg",
                  "price": "20",
                }
              },
              {
                "id": 6,
                "protocolId": 2,
                "medicineId": 5,
                "dosage": "1 tablet",
                "duration": "MORNING",
                "notes": null,
                "medicine": {
                  "id": 5,
                  "name": "Raltegravir",
                  "description": "Integrase inhibitor",
                  "unit": "tablet",
                  "dose": "400mg",
                  "price": "35",
                }
              }
            ],
            "createdBy": {
              "id": 5,
              "name": "Doctor User",
              "email": "doctor@example.com"
            },
            "updatedBy": {
              "id": 5,
              "name": "Doctor User",
              "email": "doctor@example.com"
            },
            "patientTreatments": [
              { patientId: 'PT-10001', patientName: 'Nguyễn Văn A', startDate: '2025-01-15' },
              { patientId: 'PT-10003', patientName: 'Lê Văn C', startDate: '2025-03-20' },
            ]
          }
        ]
      }
    };
    
    // Set protocols from the mock response
    setTimeout(() => {
      setProtocols(mockResponse.data.data);
      setLoading(false);
    }, 500);
  };

  // Handle protocol view
  const handleViewProtocol = (protocol) => {
    setCurrentProtocol(protocol);
    setDrawerVisible(true);
  };

  // Handle create new protocol
  const handleCreateProtocol = () => {
    form.resetFields();
    setModalVisible(true);
  };

  // Handle protocol submission (create/update)
  const handleSubmitProtocol = (values) => {
    console.log('Protocol values:', values);
    message.success(`Phác đồ "${values.name}" đã được ${currentProtocol ? 'cập nhật' : 'tạo'} thành công!`);
    setModalVisible(false);
    // In a real app, you would save the protocol to the server
  };

  // Format medicine list to display
  const getMedicineList = (medicines) => {
    if (!medicines || medicines.length === 0) return 'Không có thuốc';
    
    return medicines.map(item => item.medicine.name).join(' + ');
  };

  // Filter protocols based on search text
  const filteredProtocols = protocols.filter(protocol => 
    protocol.name.toLowerCase().includes(searchText.toLowerCase()) ||
    protocol.description.toLowerCase().includes(searchText.toLowerCase()) ||
    protocol.targetDisease.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns
  const columns = [
    {
      title: 'Tên phác đồ',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Bệnh điều trị',
      dataIndex: 'targetDisease',
      key: 'targetDisease',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Thuốc',
      key: 'medicines',
      render: (_, record) => getMedicineList(record.medicines),
      ellipsis: true,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => dayjs(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleViewProtocol(record)}>
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Phác đồ điều trị</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleCreateProtocol}
        >
          Tạo phác đồ mới
        </Button>
      </div>
      
      <div className="mb-6">
        <Input
          placeholder="Tìm kiếm phác đồ..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>
      
      <Card className="shadow-md">
        <Table
          columns={columns}
          dataSource={filteredProtocols}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
      
      {/* Protocol Detail Drawer */}
      <Drawer
        title={
          <div className="flex items-center">
            <MedicineBoxOutlined className="text-blue-500 text-xl mr-2" />
            <span className="text-xl">Chi tiết phác đồ</span>
          </div>
        }
        width={700}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        extra={
          <Space>
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={() => {
                // Pre-populate form
                form.setFieldsValue({
                  name: currentProtocol?.name,
                  description: currentProtocol?.description,
                  targetDisease: currentProtocol?.targetDisease,
                });
                setDrawerVisible(false);
                setModalVisible(true);
              }}
            >
              Chỉnh sửa
            </Button>
          </Space>
        }
      >
        {currentProtocol && (
          <div>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane 
                tab={<span><InfoCircleOutlined /> Thông tin</span>}
                key="info"
              >
                <Descriptions title="Thông tin phác đồ" bordered column={1} className="mb-6">
                  <Descriptions.Item label="Tên phác đồ">{currentProtocol.name}</Descriptions.Item>
                  <Descriptions.Item label="Mô tả">{currentProtocol.description}</Descriptions.Item>
                  <Descriptions.Item label="Bệnh điều trị">
                    <Tag color="blue">{currentProtocol.targetDisease}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Người tạo">{currentProtocol.createdBy?.name}</Descriptions.Item>
                  <Descriptions.Item label="Ngày tạo">
                    {dayjs(currentProtocol.createdAt).format('DD/MM/YYYY HH:mm')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cập nhật lần cuối">
                    {dayjs(currentProtocol.updatedAt).format('DD/MM/YYYY HH:mm')}
                  </Descriptions.Item>
                </Descriptions>
              </TabPane>
              
              <TabPane 
                tab={<span><MedicineBoxOutlined /> Thuốc ({currentProtocol.medicines?.length || 0})</span>}
                key="medicines"
              >
                <List
                  itemLayout="horizontal"
                  dataSource={currentProtocol.medicines || []}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Badge count={item.medicine?.dose} className="mt-2" />}
                        title={
                          <div className="flex justify-between">
                            <span className="font-medium">{item.medicine?.name}</span>
                            <span className="text-gray-500">{item.dosage}</span>
                          </div>
                        }
                        description={
                          <div>
                            <div>{item.medicine?.description}</div>
                            <div className="mt-1">
                              <Tag color="green">{item.duration}</Tag>
                              {item.notes && <Text type="secondary"> - {item.notes}</Text>}
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                  locale={{
                    emptyText: <Empty description="Không có thuốc nào trong phác đồ này" />
                  }}
                />
              </TabPane>
              
              <TabPane 
                tab={<span><UserOutlined /> Bệnh nhân</span>}
                key="patients"
              >
                {currentProtocol.patientTreatments && currentProtocol.patientTreatments.length > 0 ? (
                  <List
                    itemLayout="horizontal"
                    dataSource={currentProtocol.patientTreatments}
                    renderItem={patient => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <UserOutlined className="text-blue-500" />
                            </div>
                          }
                          title={patient.patientName}
                          description={
                            <div>
                              <div>Mã bệnh nhân: {patient.patientId}</div>
                              <div>Bắt đầu sử dụng: {dayjs(patient.startDate).format('DD/MM/YYYY')}</div>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty description="Chưa có bệnh nhân nào sử dụng phác đồ này" />
                )}
              </TabPane>
            </Tabs>
          </div>
        )}
      </Drawer>
      
      {/* Create/Edit Protocol Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <FileTextOutlined className="text-blue-500 text-lg mr-2" />
            {currentProtocol ? 'Chỉnh sửa phác đồ' : 'Tạo phác đồ mới'}
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={720}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitProtocol}
        >
          <Form.Item
            name="name"
            label="Tên phác đồ"
            rules={[{ required: true, message: 'Vui lòng nhập tên phác đồ' }]}
          >
            <Input placeholder="Nhập tên phác đồ" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea rows={3} placeholder="Nhập mô tả chi tiết về phác đồ" />
          </Form.Item>
          
          <Form.Item
            name="targetDisease"
            label="Bệnh điều trị"
            rules={[{ required: true, message: 'Vui lòng chọn bệnh điều trị' }]}
          >
            <Select placeholder="Chọn bệnh điều trị">
              <Option value="HIV">HIV</Option>
              <Option value="AIDS">AIDS</Option>
              <Option value="HIV/AIDS">HIV/AIDS</Option>
            </Select>
          </Form.Item>
          
          <Divider>Danh sách thuốc</Divider>
          
          <Form.List name="medicines">
            {(fields, { add, remove }) => (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.key} className="border rounded-md p-3 bg-gray-50 relative">
                    <div className="absolute top-3 right-3">
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => remove(field.name)}
                      />
                    </div>
                    
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'medicineId']}
                          label="Thuốc"
                          rules={[{ required: true, message: 'Vui lòng chọn thuốc' }]}
                        >
                          <Select placeholder="Chọn thuốc">
                            <Option value={1}>Tenofovir (300mg)</Option>
                            <Option value={2}>Emtricitabine (200mg)</Option>
                            <Option value={3}>Dolutegravir (50mg)</Option>
                            <Option value={4}>Abacavir (300mg)</Option>
                            <Option value={5}>Raltegravir (400mg)</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'dosage']}
                          label="Liều dùng"
                          rules={[{ required: true, message: 'Vui lòng nhập liều dùng' }]}
                        >
                          <Input placeholder="VD: 1 viên" />
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'duration']}
                          label="Thời điểm dùng"
                          rules={[{ required: true, message: 'Vui lòng chọn thời điểm dùng' }]}
                        >
                          <Select placeholder="Chọn thời điểm">
                            <Option value="MORNING">Buổi sáng</Option>
                            <Option value="NOON">Buổi trưa</Option>
                            <Option value="EVENING">Buổi tối</Option>
                            <Option value="BEDTIME">Trước khi ngủ</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'notes']}
                          label="Ghi chú"
                        >
                          <Input placeholder="Ghi chú thêm (nếu có)" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                ))}
                
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm thuốc
                </Button>
              </div>
            )}
          </Form.List>
          
          <div className="flex justify-end mt-6">
            <Button className="mr-2" onClick={() => setModalVisible(false)}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {currentProtocol ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TreatmentProtocolPage;
