import React, { useState } from 'react';
import { Card, Typography, Button, Space, Drawer, Descriptions, Tabs, List, Badge, Empty, Form } from 'antd';
import { PlusOutlined, EditOutlined, MedicineBoxOutlined, UserOutlined, InfoCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

// Import components and hooks
import { 
  ProtocolModal, 
  RegimensTable, 
  RegimensFilter, 
  RegimensStats 
} from '@/components/doctor/regimens';
import { useRegimens } from '@/hooks/doctor';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const TreatmentProtocolPage = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [form] = Form.useForm();

  const {
    protocols,
    loading,
    searchText,
    currentProtocol,
    setCurrentProtocol,
    pagination,
    filters,
    fetchProtocols,
    handleSearch,
    handleFilterChange,
    handlePaginationChange,
    handleSubmitProtocol,
    handleDeleteProtocol
  } = useRegimens();

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

  // Handle edit protocol
  const handleEditProtocol = (protocol) => {
    form.setFieldsValue({
      name: protocol.name,
      description: protocol.description,
      targetDisease: protocol.targetDisease,
    });
    setCurrentProtocol(protocol);
    setModalVisible(true);
  };

  // Handle modal submit
  const onModalSubmit = async (values) => {
    const success = await handleSubmitProtocol(values);
    if (success) {
      setModalVisible(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        
        {/* Filter Section */}
        <RegimensFilter
          searchText={searchText}
          filters={filters}
          onSearchChange={handleSearch}
          onFilterChange={handleFilterChange}
        />
        
        {/* Statistics Cards */}
        <RegimensStats protocols={protocols} />
        
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
              <div className="flex items-center space-x-3">
                <Badge count={protocols.length} className="bg-blue-500" />
                <Space>
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={fetchProtocols}
                    loading={loading}
                    className="rounded-xl"
                  >
                    Làm mới
                  </Button>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={handleCreateProtocol}
                    className="bg-blue-500 hover:bg-blue-600 border-none rounded-xl"
                  >
                    Tạo phác đồ mới
                  </Button>
                </Space>
              </div>
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
              <RegimensTable
                protocols={protocols}
                loading={loading}
                pagination={pagination}
                onPaginationChange={handlePaginationChange}
                onViewProtocol={handleViewProtocol}
                onEditProtocol={handleEditProtocol}
                onDeleteProtocol={handleDeleteProtocol}
              />
            )}
          </div>
        </Card>
        
        {/* Protocol Modal */}
        <ProtocolModal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onSubmit={onModalSubmit}
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
                  handleEditProtocol(currentProtocol);
                  setDrawerVisible(false);
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