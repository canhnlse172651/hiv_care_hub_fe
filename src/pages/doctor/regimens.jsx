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
  Popconfirm,
  Row,
  Col,
  Pagination
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
  ClockCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { regimenService } from '@/services/regimenService';

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
  
  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} phác đồ`,
  });

  // Filter state
  const [filters, setFilters] = useState({
    targetDisease: '',
    sortBy: '',
    sortOrder: ''
  });

  // Fetch protocols from API
  useEffect(() => {
    fetchProtocols();
  }, [pagination.current, pagination.pageSize, searchText, filters]);

  const fetchProtocols = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText,
        targetDisease: filters.targetDisease,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      };

      const response = await regimenService.getAllRegimens(params);
      
      if (response.statusCode === 200) {
        setProtocols(response.data.data);
        setPagination(prev => ({
          ...prev,
          total: response.data.meta.total,
          current: response.data.meta.page,
          pageSize: response.data.meta.limit
        }));
      } else {
        message.error('Có lỗi xảy ra khi tải danh sách phác đồ');
      }
    } catch (error) {
      console.error('Error fetching protocols:', error);
      message.error('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search with debounce
  const handleSearch = (value) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    setPagination(prev => ({ ...prev, current: page, pageSize }));
  };

  // Handle protocol view
  const handleViewProtocol = (protocol) => {
    setCurrentProtocol(protocol);
    setDrawerVisible(true);
  };

  // Handle create new protocol
  const handleCreateProtocol = () => {
    form.resetFields();
    setCurrentProtocol(null);
    setModalVisible(true);
  };

  // Handle protocol submission (create/update)
  const handleSubmitProtocol = async (values) => {
    try {
      if (currentProtocol) {
        // Update existing protocol
        await regimenService.updateRegimen(currentProtocol.id, values);
        message.success(`Phác đồ "${values.name}" đã được cập nhật thành công!`);
      } else {
        // Create new protocol
        await regimenService.createRegimen(values);
        message.success(`Phác đồ "${values.name}" đã được tạo thành công!`);
      }
      setModalVisible(false);
      fetchProtocols(); // Refresh the list
    } catch (error) {
      console.error('Error saving protocol:', error);
      message.error('Có lỗi xảy ra khi lưu phác đồ. Vui lòng thử lại.');
    }
  };

  // Handle delete protocol
  const handleDeleteProtocol = async (protocolId) => {
    try {
      await regimenService.deleteRegimen(protocolId);
      message.success('Phác đồ đã được xóa thành công!');
      fetchProtocols(); // Refresh the list
    } catch (error) {
      console.error('Error deleting protocol:', error);
      message.error('Có lỗi xảy ra khi xóa phác đồ. Vui lòng thử lại.');
    }
  };

  // Format medicine list to display
  const getMedicineList = (medicines) => {
    if (!medicines || medicines.length === 0) return 'Không có thuốc';
    
    return medicines.map(item => item.medicine.name).join(' + ');
  };

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
      width: 300,
      render: (text) => (
        <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}>
          {text}
        </Paragraph>
      )
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
      render: (_, record) => (
        <Space size={[0, 8]} wrap>
          {record.medicines && record.medicines.length > 0 ? (
            record.medicines.map((item) => (
              <Tag color="purple" key={item.medicine.id}>
                {item.medicine.name}
              </Tag>
            ))
          ) : (
            <Text type="secondary">Không có thuốc</Text>
          )}
        </Space>
      ),
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
          <Popconfirm
            title="Xóa phác đồ"
            description="Bạn có chắc chắn muốn xóa phác đồ này không?"
            onConfirm={() => handleDeleteProtocol(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Phác đồ điều trị</Title>
        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchProtocols}
            loading={loading}
          >
            Làm mới
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleCreateProtocol}
          >
            Tạo phác đồ mới
          </Button>
        </Space>
      </div>
      
      <div className="mb-6">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} lg={8}>
            <Input
              placeholder="Tìm kiếm phác đồ..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="Bệnh điều trị"
              value={filters.targetDisease}
              onChange={(value) => handleFilterChange('targetDisease', value)}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="HIV">HIV</Option>
              <Option value="AIDS">AIDS</Option>
              <Option value="HIV/AIDS">HIV/AIDS</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="Sắp xếp theo"
              value={filters.sortBy}
              onChange={(value) => handleFilterChange('sortBy', value)}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="name">Tên phác đồ</Option>
              <Option value="createdAt">Ngày tạo</Option>
              <Option value="updatedAt">Ngày cập nhật</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="Thứ tự"
              value={filters.sortOrder}
              onChange={(value) => handleFilterChange('sortOrder', value)}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="asc">Tăng dần</Option>
              <Option value="desc">Giảm dần</Option>
            </Select>
          </Col>
        </Row>
      </div>
      
      <Card className="shadow-md">
        <Table
          columns={columns}
          dataSource={protocols}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
        
        <div className="mt-4 flex justify-end">
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            showSizeChanger={pagination.showSizeChanger}
            showQuickJumper={pagination.showQuickJumper}
            showTotal={pagination.showTotal}
            onChange={handlePaginationChange}
            onShowSizeChange={handlePaginationChange}
          />
        </div>
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
