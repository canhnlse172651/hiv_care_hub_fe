import React, { useState, useEffect } from 'react';
import { Card, Typography, Table, Tag, Button, Space, Drawer, Descriptions, Tabs, List, Badge, Empty, Input, Select, message, Divider, Popconfirm, Row, Col, Pagination, Form } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, MedicineBoxOutlined, UserOutlined, InfoCircleOutlined, ReloadOutlined, TeamOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { regimenService } from '@/services/regimenService';

// Import components
import ProtocolModal from './components/ProtocolModal';

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

  const actions = (
    <Space>
      <Button 
        icon={<ReloadOutlined />} 
        onClick={fetchProtocols}
        loading={loading}
        className="rounded-xl border-white/30 text-white hover:bg-white/20"
      >
        Làm mới
      </Button>
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={handleCreateProtocol}
        className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-xl"
      >
        Tạo phác đồ mới
      </Button>
    </Space>
  );

  // Enhanced table columns with better styling
  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_, __, index) => (
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
          {(pagination.current - 1) * pagination.pageSize + index + 1}
        </div>
      ),
    },
    {
      title: 'Tên phác đồ',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="font-semibold text-gray-900">{text}</span>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      render: (text) => (
        <div className="text-gray-600">
          <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'xem thêm' }}>
            {text}
          </Paragraph>
        </div>
      )
    },
    {
      title: 'Bệnh điều trị',
      dataIndex: 'targetDisease',
      key: 'targetDisease',
      render: (text) => (
        <Tag color="blue" className="rounded-full px-3 py-1 font-medium">
          {text}
        </Tag>
      ),
    },
    {
      title: 'Thuốc',
      key: 'medicines',
      render: (_, record) => (
        <div className="space-y-1">
          {record.medicines && record.medicines.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {record.medicines.slice(0, 3).map((item) => (
                <Tag color="purple" key={item.medicine.id} className="rounded-full text-xs">
                  {item.medicine.name}
                </Tag>
              ))}
              {record.medicines.length > 3 && (
                <Tag className="rounded-full text-xs bg-gray-100 text-gray-600">
                  +{record.medicines.length - 3} thuốc khác
                </Tag>
              )}
            </div>
          ) : (
            <Text type="secondary" className="italic">Không có thuốc</Text>
          )}
        </div>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => (
        <div className="text-gray-600">
          {dayjs(text).format('DD/MM/YYYY')}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small"
            onClick={() => handleViewProtocol(record)}
            className="bg-blue-500 hover:bg-blue-600 border-none rounded-lg"
          >
            Chi tiết
          </Button>
          <Button 
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              form.setFieldsValue({
                name: record.name,
                description: record.description,
                targetDisease: record.targetDisease,
              });
              setCurrentProtocol(record);
              setModalVisible(true);
            }}
            className="border-gray-300 rounded-lg hover:border-blue-400 hover:text-blue-600"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa phác đồ"
            description="Bạn có chắc chắn muốn xóa phác đồ này không?"
            onConfirm={() => handleDeleteProtocol(record.id)}
            okText="Có"
            cancelText="Không"
            okButtonProps={{ className: 'bg-red-500 hover:bg-red-600 border-red-500' }}
          >
            <Button 
              danger 
              size="small"
              icon={<DeleteOutlined />}
              className="rounded-lg"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        
        {/* Filter Section */}
        <Card className="shadow-lg mb-8 rounded-2xl border-0 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <SearchOutlined className="text-blue-600" />
              <Text strong className="text-gray-900 text-lg">Tìm kiếm và lọc phác đồ</Text>
            </div>
            
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={24} lg={8}>
                <Text strong className="block mb-2 text-gray-700">Tìm kiếm</Text>
                <Input
                  placeholder="Tìm kiếm theo tên phác đồ..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  value={searchText}
                  onChange={e => handleSearch(e.target.value)}
                  allowClear
                  className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500"
                />
              </Col>
              <Col xs={24} sm={8} lg={4}>
                <Text strong className="block mb-2 text-gray-700">Bệnh điều trị</Text>
                <Select
                  placeholder="Chọn bệnh"
                  value={filters.targetDisease}
                  onChange={(value) => handleFilterChange('targetDisease', value)}
                  allowClear
                  style={{ width: '100%' }}
                  className="rounded-lg"
                >
                  <Option value="HIV">HIV</Option>
                  <Option value="AIDS">AIDS</Option>
                  <Option value="HIV/AIDS">HIV/AIDS</Option>
                </Select>
              </Col>
              <Col xs={24} sm={8} lg={4}>
                <Text strong className="block mb-2 text-gray-700">Sắp xếp theo</Text>
                <Select
                  placeholder="Chọn tiêu chí"
                  value={filters.sortBy}
                  onChange={(value) => handleFilterChange('sortBy', value)}
                  allowClear
                  style={{ width: '100%' }}
                  className="rounded-lg"
                >
                  <Option value="name">Tên phác đồ</Option>
                  <Option value="createdAt">Ngày tạo</Option>
                  <Option value="updatedAt">Ngày cập nhật</Option>
                </Select>
              </Col>
              <Col xs={24} sm={8} lg={4}>
                <Text strong className="block mb-2 text-gray-700">Thứ tự</Text>
                <Select
                  placeholder="Chọn thứ tự"
                  value={filters.sortOrder}
                  onChange={(value) => handleFilterChange('sortOrder', value)}
                  allowClear
                  style={{ width: '100%' }}
                  className="rounded-lg"
                >
                  <Option value="asc">Tăng dần</Option>
                  <Option value="desc">Giảm dần</Option>
                </Select>
              </Col>
            </Row>
          </div>
        </Card>
        
        {/* Statistics Cards */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={8}>
            <Card className="shadow-lg border-0 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MedicineBoxOutlined className="text-blue-600 text-xl" />
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">{protocols.length}</div>
                <div className="text-gray-600 font-medium">Tổng phác đồ</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="shadow-lg border-0 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TeamOutlined className="text-green-600 text-xl" />
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {protocols.filter(p => p.targetDisease === 'HIV').length}
                </div>
                <div className="text-gray-600 font-medium">Phác đồ HIV</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="shadow-lg border-0 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MedicineBoxOutlined className="text-purple-600 text-xl" />
                </div>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {protocols.filter(p => p.targetDisease === 'AIDS').length}
                </div>
                <div className="text-gray-600 font-medium">Phác đồ AIDS</div>
              </div>
            </Card>
          </Col>
        </Row>
        
        {/* Main Table */}
        <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MedicineBoxOutlined className="text-blue-600" />
                </div>
                <Title level={4} className="mb-0 text-gray-900">
                  Danh sách phác đồ điều trị
                </Title>
              </div>
              <Badge count={protocols.length} className="bg-blue-500" />
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <Text className="text-gray-500">Đang tải danh sách phác đồ...</Text>
              </div>
            ) : protocols.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="text-center py-8">
                    <MedicineBoxOutlined className="text-6xl text-gray-300 mb-4" />
                    <div className="text-gray-500 text-lg mb-2">Chưa có phác đồ nào</div>
                    <div className="text-gray-400">Tạo phác đồ đầu tiên để bắt đầu</div>
                  </div>
                }
                className="py-12"
              >
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  size="large"
                  onClick={handleCreateProtocol}
                  className="bg-blue-500 hover:bg-blue-600 border-none rounded-xl h-12 px-6 font-semibold"
                >
                  Tạo phác đồ đầu tiên
                </Button>
              </Empty>
            ) : (
              <>
                <Table
                  columns={columns}
                  dataSource={protocols}
                  rowKey="id"
                  loading={loading}
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                  rowClassName="hover:bg-blue-50 transition-colors duration-200"
                  className="custom-table"
                />
                
                <div className="mt-6 flex justify-center">
                  <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    showSizeChanger={pagination.showSizeChanger}
                    showQuickJumper={pagination.showQuickJumper}
                    showTotal={pagination.showTotal}
                    onChange={handlePaginationChange}
                    onShowSizeChange={handlePaginationChange}
                    className="custom-pagination"
                  />
                </div>
              </>
            )}
          </div>
        </Card>
        
        {/* Protocol Modal */}
        <ProtocolModal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onSubmit={handleSubmitProtocol}
          form={form}
          currentProtocol={currentProtocol}
          loading={loading}
        />
        
        {/* Protocol Detail Drawer */}
        <Drawer
          title={
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MedicineBoxOutlined className="text-blue-600" />
              </div>
              <div>
                <div className="text-xl font-semibold text-gray-900">Chi tiết phác đồ</div>
                <div className="text-sm text-gray-500">{currentProtocol?.name}</div>
              </div>
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
                  form.setFieldsValue({
                    name: currentProtocol?.name,
                    description: currentProtocol?.description,
                    targetDisease: currentProtocol?.targetDisease,
                  });
                  setDrawerVisible(false);
                  setModalVisible(true);
                }}
                className="bg-blue-500 hover:bg-blue-600 border-none rounded-lg"
              >
                Chỉnh sửa
              </Button>
            </Space>
          }
          className="custom-drawer"
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
      </div>
    </div>
  );
};

export default TreatmentProtocolPage;