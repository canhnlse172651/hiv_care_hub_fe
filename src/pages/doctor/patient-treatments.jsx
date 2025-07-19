import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Button, Space, Tag, Modal, Form, Input, 
  Select, DatePicker, message, Spin, Row, Col, Typography,
  Tabs, Statistic, Progress, Alert, Tooltip, Popconfirm,
  Drawer, Timeline, Descriptions, Badge, Divider
} from 'antd';
import {
  PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined,
  MedicineBoxOutlined, UserOutlined, CalendarOutlined,
  DollarOutlined, CheckCircleOutlined, WarningOutlined, InfoCircleOutlined,
  FileTextOutlined, BarChartOutlined, SettingOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { patientTreatmentService } from '@/services/patientTreatmentService';
import { useSelector } from 'react-redux';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const PatientTreatmentsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [treatments, setTreatments] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [form] = Form.useForm();
  const [stats, setStats] = useState({});
  const [businessRulesCheck, setBusinessRulesCheck] = useState(null);

  const currentUser = useSelector(state => state.auth.user);

  useEffect(() => {
    fetchTreatments();
    fetchStats();
  }, [activeTab, pagination.current, pagination.pageSize]);

  const fetchTreatments = async () => {
    setLoading(true);
    try {
      let response;
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText
      };

      if (activeTab === 'active') {
        response = await patientTreatmentService.getActivePatientTreatments(params);
      } else if (activeTab === 'custom') {
        response = await patientTreatmentService.getTreatmentsWithCustomMedications(params);
      } else {
        response = await patientTreatmentService.getAllPatientTreatments(params);
      }

      setTreatments(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.meta?.total || 0
      }));
    } catch (error) {
      message.error('Không thể tải danh sách điều trị');
      console.error('Error fetching treatments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      if (currentUser?.id) {
        const doctorStats = await patientTreatmentService.getDoctorWorkloadStats(currentUser.id);
        setStats(doctorStats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreateTreatment = async (values) => {
    setLoading(true);
    try {
      const treatmentData = {
        patientId: values.patientId,
        doctorId: currentUser?.id,
        protocolId: values.protocolId,
        startDate: values.startDate?.toISOString(),
        endDate: values.endDate?.toISOString(),
        notes: values.notes,
        customMedications: values.customMedications || null,
        total: values.total || 0
      };

      await patientTreatmentService.createPatientTreatment(treatmentData, currentUser?.id);
      message.success('Tạo phác đồ điều trị thành công');
      setCreateModalVisible(false);
      form.resetFields();
      fetchTreatments();
    } catch (error) {
      message.error('Không thể tạo phác đồ điều trị');
      console.error('Error creating treatment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTreatment = async (treatmentId) => {
    try {
      const treatment = await patientTreatmentService.getPatientTreatmentById(treatmentId);
      setSelectedTreatment(treatment);
      setViewModalVisible(true);
    } catch (error) {
      message.error('Không thể tải thông tin điều trị');
    }
  };

  const handleDeleteTreatment = async (treatmentId) => {
    try {
      await patientTreatmentService.deletePatientTreatment(treatmentId);
      message.success('Xóa phác đồ điều trị thành công');
      fetchTreatments();
    } catch (error) {
      message.error('Không thể xóa phác đồ điều trị');
    }
  };

  const handleEndTreatment = async (treatmentId) => {
    try {
      await patientTreatmentService.updatePatientTreatment(treatmentId, {
        endDate: new Date().toISOString()
      });
      message.success('Kết thúc điều trị thành công');
      fetchTreatments();
    } catch (error) {
      message.error('Không thể kết thúc điều trị');
    }
  };

  const handleBusinessRulesCheck = async (patientId) => {
    try {
      const check = await patientTreatmentService.quickBusinessRulesCheck(patientId);
      setBusinessRulesCheck(check);
    } catch (error) {
      message.error('Không thể kiểm tra quy tắc kinh doanh');
    }
  };

  const columns = [
    {
      title: 'Mã điều trị',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id) => `PT-${id.toString().padStart(6, '0')}`
    },
    {
      title: 'Bệnh nhân',
      dataIndex: 'patient',
      key: 'patient',
      render: (patient) => (
        <div>
          <div className="font-medium">{patient?.name}</div>
          <div className="text-sm text-gray-500">ID: {patient?.id}</div>
        </div>
      )
    },
    {
      title: 'Phác đồ',
      dataIndex: 'protocol',
      key: 'protocol',
      render: (protocol) => (
        <div>
          <div className="font-medium">{protocol?.name}</div>
          <div className="text-sm text-gray-500">ID: {protocol?.id}</div>
        </div>
      )
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        const isActive = !record.endDate || dayjs(record.endDate).isAfter(dayjs());
        return (
          <Badge 
            status={isActive ? 'processing' : 'default'} 
            text={isActive ? 'Đang điều trị' : 'Đã kết thúc'} 
          />
        );
      }
    },
    {
      title: 'Thuốc tùy chỉnh',
      dataIndex: 'customMedications',
      key: 'customMedications',
      render: (customMeds) => {
        if (!customMeds || (Array.isArray(customMeds) && customMeds.length === 0)) {
          return <Tag color="default">Không có</Tag>;
        }
        return <Tag color="blue">Có</Tag>;
      }
    },
    {
      title: 'Chi phí',
      dataIndex: 'total',
      key: 'total',
      render: (total) => (
        <span className="font-medium">
          {total ? `${total.toLocaleString()} VNĐ` : 'Chưa tính'}
        </span>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<InfoCircleOutlined />} 
              onClick={() => handleViewTreatment(record.id)}
            />
          </Tooltip>
          {(!record.endDate || dayjs(record.endDate).isAfter(dayjs())) && (
            <Tooltip title="Kết thúc điều trị">
              <Button 
                type="text" 
                icon={<CheckCircleOutlined />} 
                onClick={() => handleEndTreatment(record.id)}
              />
            </Tooltip>
          )}
          <Popconfirm
            title="Bạn có chắc muốn xóa phác đồ điều trị này?"
            onConfirm={() => handleDeleteTreatment(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Xóa">
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const tabItems = [
    {
      key: 'all',
      label: 'Tất cả',
      icon: <FileTextOutlined />
    },
    {
      key: 'active',
      label: 'Đang điều trị',
      icon: <MedicineBoxOutlined />
    },
    {
      key: 'custom',
      label: 'Có thuốc tùy chỉnh',
      icon: <SettingOutlined />
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="mb-0">Quản lý phác đồ điều trị</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setCreateModalVisible(true)}
        >
          Tạo phác đồ mới
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số điều trị"
              value={stats.totalTreatments || 0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang điều trị"
              value={stats.activeTreatments || 0}
              prefix={<MedicineBoxOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Bệnh nhân"
              value={stats.uniquePatients || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="TB điều trị/bệnh nhân"
              value={stats.averageTreatmentsPerPatient || 0}
              precision={1}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Business Rules Alert */}
      {businessRulesCheck && (
        <Alert
          message="Kiểm tra quy tắc kinh doanh"
          description={
            <div>
              <p><strong>Bệnh nhân ID:</strong> {businessRulesCheck.patientId}</p>
              <p><strong>Vi phạm:</strong> {businessRulesCheck.hasActiveViolations ? 'Có' : 'Không'}</p>
              <p><strong>Khuyến nghị:</strong> {businessRulesCheck.recommendation}</p>
            </div>
          }
          type={businessRulesCheck.hasActiveViolations ? 'warning' : 'info'}
          showIcon
          className="mb-4"
        />
      )}

      {/* Search and Filters */}
      <Card className="mb-4">
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Input
              placeholder="Tìm kiếm theo tên bệnh nhân, mã điều trị..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={() => fetchTreatments()}
            />
          </Col>
          <Col span={8}>
            <Button 
              type="primary" 
              onClick={() => fetchTreatments()}
            >
              Tìm kiếm
            </Button>
          </Col>
          <Col span={8}>
            <Button 
              onClick={() => {
                setSearchText('');
                setPagination(prev => ({ ...prev, current: 1 }));
              }}
            >
              Làm mới
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Treatments Table */}
      <Card>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={tabItems}
          className="mb-4"
        />
        
        <Table
          columns={columns}
          dataSource={treatments}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} bản ghi`
          }}
          onChange={(pagination) => setPagination(pagination)}
        />
      </Card>

      {/* Create Treatment Modal */}
      <Modal
        title="Tạo phác đồ điều trị mới"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateTreatment}
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
            <Button className="mr-2" onClick={() => setCreateModalVisible(false)}>
              Hủy bỏ
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Tạo phác đồ
            </Button>
          </div>
        </Form>
      </Modal>

      {/* View Treatment Modal */}
      <Drawer
        title="Chi tiết phác đồ điều trị"
        placement="right"
        width={600}
        open={viewModalVisible}
        onClose={() => setViewModalVisible(false)}
      >
        {selectedTreatment && (
          <div>
            <Descriptions title="Thông tin cơ bản" bordered column={1}>
              <Descriptions.Item label="Mã điều trị">
                PT-{selectedTreatment.id.toString().padStart(6, '0')}
              </Descriptions.Item>
              <Descriptions.Item label="Bệnh nhân">
                {selectedTreatment.patient?.name} (ID: {selectedTreatment.patientId})
              </Descriptions.Item>
              <Descriptions.Item label="Phác đồ">
                {selectedTreatment.protocol?.name} (ID: {selectedTreatment.protocolId})
              </Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu">
                {dayjs(selectedTreatment.startDate).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày kết thúc">
                {selectedTreatment.endDate ? dayjs(selectedTreatment.endDate).format('DD/MM/YYYY') : 'Chưa kết thúc'}
              </Descriptions.Item>
              <Descriptions.Item label="Chi phí">
                {selectedTreatment.total ? `${selectedTreatment.total.toLocaleString()} VNĐ` : 'Chưa tính'}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú">
                {selectedTreatment.notes || 'Không có'}
              </Descriptions.Item>
            </Descriptions>

            {selectedTreatment.customMedications && (
              <div className="mt-4">
                <Title level={5}>Thuốc tùy chỉnh</Title>
                <Timeline>
                  {Array.isArray(selectedTreatment.customMedications) ? 
                    selectedTreatment.customMedications.map((med, index) => (
                      <Timeline.Item key={index}>
                        <div className="font-medium">{med.name || `Thuốc ${index + 1}`}</div>
                        <div className="text-sm text-gray-500">
                          Liều: {med.dose} | Tần suất: {med.frequency}
                        </div>
                      </Timeline.Item>
                    )) : 
                    Object.entries(selectedTreatment.customMedications).map(([key, med]) => (
                      <Timeline.Item key={key}>
                        <div className="font-medium">{med.name || key}</div>
                        <div className="text-sm text-gray-500">
                          Liều: {med.dose} | Tần suất: {med.frequency}
                        </div>
                      </Timeline.Item>
                    ))
                  }
                </Timeline>
              </div>
            )}

            <div className="mt-4">
              <Button 
                type="primary" 
                onClick={() => handleBusinessRulesCheck(selectedTreatment.patientId)}
              >
                Kiểm tra quy tắc kinh doanh
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default PatientTreatmentsPage; 