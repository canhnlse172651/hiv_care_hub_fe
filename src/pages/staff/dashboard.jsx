import React, { useState } from 'react';
import { 
  Typography, 
  Table, 
  Input, 
  Button, 
  Space, 
  Tag, 
  Tabs, 
  Card,
  Tooltip,
  Drawer,
  Descriptions,
  Avatar,
  Timeline,
  Form,
  Select,
  Modal,
  message,
  Row,
  Col,
  Statistic,
  Empty,
  Spin
} from 'antd';
import { 
  SearchOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CheckOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  DollarOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  ReloadOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { appointmentService } from '@/services/appointmentService';
import { useEffect } from 'react';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const StaffDashboard = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]); // Track invoices
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // Try to get all appointments instead of staff-specific endpoint
      const res = await appointmentService.getStaffAppointments();
      console.log('Fetched appointments:', res);
      
      // Handle different response structures
      const appointmentsData = res?.data?.data || res?.data || res || [];
      
      // Map API data to table format
      const data = appointmentsData.map(item => ({
        id: item.id,
        patientName: item.user?.name || 'N/A',
        phone: item.user?.phone || item.user?.phoneNumber || 'N/A',
        email: item.user?.email || 'N/A',
        date: item.appointmentTime ? dayjs(item.appointmentTime).format('YYYY-MM-DD') : '',
        time: item.appointmentTime ? dayjs(item.appointmentTime).format('HH:mm') : '',
        doctor: item.doctor?.name || item.doctor?.user?.name || 'N/A',
        department: item.service?.name || 'N/A',
        status: item.status || 'PENDING',
        reason: item.service?.description || item.notes || '',
        notes: item.notes || '',
        // Updated payment status logic
        paymentStatus: item.status === 'PAID' ? 'paid' : 
                     item.status === 'COMPLETED' ? 'pending_payment' : 'not_applicable',
        hasInvoice: item.status === 'COMPLETED' || item.status === 'PAID',
        invoiceGenerated: invoices.some(inv => inv.appointmentId === item.id),
        avatar: item.user?.avatar || '',
        appointmentTime: item.appointmentTime,
        service: item.service,
        user: item.user,
        price: item.service?.price || 0
      }));
      
      setAppointments(data);
      console.log('Processed appointments:', data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      message.error('Không thể tải danh sách lịch hẹn. Vui lòng thử lại.');
      
      // Set mock data for development
      const mockData = [
        {
          id: 'APT001',
          patientName: 'Nguyễn Văn A',
          phone: '0901234567',
          email: 'nguyenvana@email.com',
          date: dayjs().format('YYYY-MM-DD'),
          time: '09:00',
          doctor: 'BS. Trần Văn B',
          department: 'Tư vấn HIV',
          status: 'COMPLETED',
          reason: 'Khám định kỳ',
          notes: 'Bệnh nhân cần tư vấn về điều trị ARV',
          paymentStatus: 'pending_payment',
          hasInvoice: true,
          invoiceGenerated: false,
          avatar: '',
          price: 500000
        },
        {
          id: 'APT002',
          patientName: 'Lê Thị C',
          phone: '0912345678',
          email: 'lethic@email.com',
          date: dayjs().format('YYYY-MM-DD'),
          time: '10:30',
          doctor: 'BS. Phạm Văn D',
          department: 'Xét nghiệm',
          status: 'PAID',
          reason: 'Xét nghiệm CD4',
          notes: 'Cần xét nghiệm tải lượng virus',
          paymentStatus: 'paid',
          hasInvoice: true,
          invoiceGenerated: true,
          avatar: '',
          price: 800000
        }
      ];
      setAppointments(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Filter appointments based on search text
  const filteredAppointments = appointments.filter(appointment => {
    return (
      appointment.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
      appointment.phone.includes(searchText) ||
      String(appointment.id).toLowerCase().includes(searchText.toLowerCase())
    );
  });

  // Filter appointments by status
  const pendingAppointments = filteredAppointments.filter(a => a.status === 'PENDING');
  const confirmedAppointments = filteredAppointments.filter(a => a.status === 'CONFIRMED');
  const completedAppointments = filteredAppointments.filter(a => ['COMPLETED', 'PAID'].includes(a.status));
  
  const getStatusTag = (status) => {
    const statusConfig = {
      'PENDING': { color: 'orange', text: 'Chờ khám', icon: <ClockCircleOutlined /> },
      'CONFIRMED': { color: 'blue', text: 'Đã xác nhận', icon: <CheckCircleOutlined /> },
      'COMPLETED': { color: 'green', text: 'Hoàn thành', icon: <CheckOutlined /> },
      'PAID': { color: 'cyan', text: 'Đã thanh toán', icon: <CheckOutlined /> },
      'CANCELLED': { color: 'red', text: 'Đã hủy', icon: <ExclamationCircleOutlined /> },
    };
    
    const config = statusConfig[status?.toUpperCase()] || { color: 'default', text: status, icon: null };
    
    return (
      <Tag 
        color={config.color}
        icon={config.icon}
        className="rounded-full px-3 py-1 font-medium"
      >
        {config.text}
      </Tag>
    );
  };
  
  const getPaymentTag = (paymentStatus, invoiceGenerated) => {
    switch(paymentStatus) {
      case 'paid':
        return <Tag color="green" className="rounded-full">Đã thanh toán</Tag>;
      case 'pending_payment':
        return invoiceGenerated ? 
          <Tag color="orange" className="rounded-full">Chờ thanh toán</Tag> :
          <Tag color="blue" className="rounded-full">Chưa tạo hóa đơn</Tag>;
      case 'not_applicable':
        return <Tag color="gray" className="rounded-full">Chưa áp dụng</Tag>;
      default:
        return <Tag color="default" className="rounded-full">{paymentStatus}</Tag>;
    }
  };
  
  const showDrawer = (appointment) => {
    setSelectedAppointment(appointment);
    setDrawerVisible(true);
  };
  
  const closeDrawer = () => {
    setDrawerVisible(false);
  };
  
  const showEditModal = () => {
    form.setFieldsValue({
      phone: selectedAppointment.phone,
      email: selectedAppointment.email,
      notes: selectedAppointment.notes,
    });
    setEditModalVisible(true);
  };
  
  const handleUpdatePatient = (values) => {
    // In a real app, you would update the patient info here
    console.log('Updated patient info:', values);
    message.success('Thông tin bệnh nhân đã được cập nhật');
    
    // Update selected appointment with new values
    setSelectedAppointment({
      ...selectedAppointment,
      ...values
    });
    
    setEditModalVisible(false);
  };
  
  const handleCheckIn = () => {
    // In a real app, you would update the appointment status here
    setSelectedAppointment({
      ...selectedAppointment,
      status: 'checked-in',
      checkInTime: dayjs().format('HH:mm A')
    });
    
    message.success('Bệnh nhân đã được check-in thành công');
  };
  
  const handleGenerateInvoice = async (appointment) => {
    try {
      // In real app, call API to generate invoice
      const newInvoice = {
        id: `INV-${Date.now()}`,
        appointmentId: appointment.id,
        amount: appointment.price,
        patientName: appointment.patientName,
        service: appointment.department,
        generatedAt: new Date().toISOString(),
        status: 'pending'
      };
      
      setInvoices(prev => [...prev, newInvoice]);
      
      // Update appointment to show invoice generated
      setAppointments(prev => prev.map(apt => 
        apt.id === appointment.id 
          ? { ...apt, invoiceGenerated: true, paymentStatus: 'pending_payment' }
          : apt
      ));
      
      message.success('Hóa đơn đã được tạo thành công!');
      
    } catch (error) {
      message.error('Tạo hóa đơn thất bại. Vui lòng thử lại.');
    }
  };
  
  const handleMarkAsPaid = async (appointment) => {
    try {
      // In real app, call API to update payment status
      setAppointments(prev => prev.map(apt => 
        apt.id === appointment.id 
          ? { ...apt, status: 'PAID', paymentStatus: 'paid' }
          : apt
      ));
      
      // Update invoice status
      setInvoices(prev => prev.map(inv => 
        inv.appointmentId === appointment.id 
          ? { ...inv, status: 'paid', paidAt: new Date().toISOString() }
          : inv
      ));
      
      message.success('Đã cập nhật trạng thái thanh toán!');
      
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại. Vui lòng thử lại.');
    }
  };

  // Add this function to handle status update
  const handleConfirmAppointment = async (appointmentId) => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, { status: 'CONFIRMED' });
      message.success('Đã xác nhận lịch hẹn thành công!');
      fetchAppointments();
    } catch (error) {
      message.error('Không thể cập nhật trạng thái.');
    }
  };
  
  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_, __, index) => (
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
          {index + 1}
        </div>
      ),
    },
    {
      title: 'Bệnh nhân',
      key: 'patient',
      width: 200,
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            src={record.avatar} 
            icon={<UserOutlined />} 
            size={40}
            className="bg-gradient-to-r from-blue-400 to-blue-600 shadow-md"
          />
          <div>
            <div className="font-semibold text-gray-900">{record.patientName}</div>
            <div className="text-gray-500 text-sm">{record.phone}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Thời gian',
      key: 'datetime',
      width: 150,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <CalendarOutlined className="text-blue-500 text-xs" />
            <span className="font-medium text-gray-900">
              {dayjs(record.date).format('DD/MM/YYYY')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <ClockCircleOutlined className="text-orange-500 text-xs" />
            <span className="text-gray-700">{record.time}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Bác sĩ',
      dataIndex: 'doctor',
      key: 'doctor',
      width: 150,
      render: (text) => (
        <div className="flex items-center space-x-2">
          <Avatar icon={<UserOutlined />} size="small" className="bg-purple-500" />
          <span className="font-medium text-gray-900">{text}</span>
        </div>
      ),
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'department',
      key: 'department',
      width: 150,
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 120,
      render: (_, record) => getStatusTag(record.status),
    },
    {
      title: 'Thanh toán',
      key: 'paymentStatus',
      width: 140,
      render: (_, record) => getPaymentTag(record.paymentStatus, record.invoiceGenerated),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small"
            onClick={() => showDrawer(record)}
            className="bg-blue-500 hover:bg-blue-600 border-none rounded-lg"
          >
            Chi tiết
          </Button>
          {record.status === 'PENDING' && (
            <Button type="primary" onClick={() => handleConfirmAppointment(record.id)}>
              Xác nhận
            </Button>
          )}
          {/* Invoice generation - only for completed appointments */}
          {record.status === 'COMPLETED' && !record.invoiceGenerated && (
            <Button 
              type="primary" 
              icon={<DollarOutlined />}
              onClick={() => handleGenerateInvoice(record)}
              className="bg-green-500 hover:bg-green-600 border-none"
            >
              Tạo hóa đơn
            </Button>
          )}
          
          {/* Mark as paid - only for completed appointments with invoice */}
          {record.status === 'COMPLETED' && 
           record.invoiceGenerated && 
           record.paymentStatus === 'pending_payment' && (
            <Button 
              type="primary" 
              icon={<CheckCircleOutlined />}
              onClick={() => handleMarkAsPaid(record)}
              className="bg-blue-500 hover:bg-blue-600 border-none"
            >
              Đánh dấu đã thanh toán
            </Button>
          )}
          
          {/* View invoice - for appointments with invoices */}
          {record.invoiceGenerated && (
            <Button 
              icon={<FileTextOutlined />}
              className="border-green-500 text-green-600 hover:bg-green-50"
            >
              Xem hóa đơn
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">

        {/* Statistics */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-lg border-0 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100">
              <Statistic
                title={<span className="text-gray-600 font-medium">Chờ khám</span>}
                value={pendingAppointments.length}
                valueStyle={{ color: '#f59e0b', fontSize: '28px', fontWeight: 'bold' }}
                prefix={<div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"><ClockCircleOutlined className="text-orange-600" /></div>}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-lg border-0 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
              <Statistic
                title={<span className="text-gray-600 font-medium">Đã xác nhận</span>}
                value={confirmedAppointments.length}
                valueStyle={{ color: '#3b82f6', fontSize: '28px', fontWeight: 'bold' }}
                prefix={<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><CheckCircleOutlined className="text-blue-600" /></div>}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-lg border-0 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100">
              <Statistic
                title={<span className="text-gray-600 font-medium">Hoàn thành</span>}
                value={completedAppointments.length}
                valueStyle={{ color: '#10b981', fontSize: '28px', fontWeight: 'bold' }}
                prefix={<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><CheckOutlined className="text-green-600" /></div>}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-lg border-0 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100">
              <Statistic
                title={<span className="text-gray-600 font-medium">Tổng lịch hẹn</span>}
                value={filteredAppointments.length}
                valueStyle={{ color: '#8b5cf6', fontSize: '28px', fontWeight: 'bold' }}
                prefix={<div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><CalendarOutlined className="text-purple-600" /></div>}
              />
            </Card>
          </Col>
        </Row>

        {/* Search */}
        <Card className="shadow-lg rounded-xl border-0 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <Title level={4} className="mb-1">Tìm kiếm lịch hẹn</Title>
              <Text className="text-gray-500">Tìm theo tên bệnh nhân, số điện thoại hoặc mã lịch hẹn</Text>
            </div>
            <Input.Search
              placeholder="Tìm kiếm bệnh nhân, SĐT, mã hẹn..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="max-w-lg"
              style={{ width: 400 }}
            />
          </div>
        </Card>
        
        {/* Main Content */}
        <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
          <Tabs 
            defaultActiveKey="pending" 
            type="card" 
            className="custom-tabs"
            items={[
              {
                key: 'pending',
                label: (
                  <span className="flex items-center space-x-2">
                    <ClockCircleOutlined />
                    <span>Chờ khám ({pendingAppointments.length})</span>
                  </span>
                ),
                children: (
                  <div>
                    {loading ? (
                      <div className="flex justify-center items-center py-12">
                        <Spin size="large" />
                      </div>
                    ) : pendingAppointments.length === 0 ? (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                          <div className="text-center py-8">
                            <ClockCircleOutlined className="text-6xl text-gray-300 mb-4" />
                            <div className="text-gray-500 text-lg mb-2">Không có lịch hẹn chờ khám</div>
                            <div className="text-gray-400">Tất cả lịch hẹn đã được xử lý</div>
                          </div>
                        }
                        className="py-12"
                      />
                    ) : (
                      <Table 
                        columns={columns} 
                        dataSource={pendingAppointments}
                        loading={loading}
                        pagination={{ 
                          pageSize: 10,
                          showSizeChanger: true,
                          showQuickJumper: true,
                          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} lịch hẹn`
                        }}
                        rowKey="id"
                        scroll={{ x: 'max-content' }}
                        rowClassName="hover:bg-blue-50 transition-colors duration-200"
                      />
                    )}
                  </div>
                )
              },
              {
                key: 'confirmed',
                label: (
                  <span className="flex items-center space-x-2">
                    <CheckCircleOutlined />
                    <span>Đã xác nhận ({confirmedAppointments.length})</span>
                  </span>
                ),
                children: (
                  <Table 
                    columns={columns} 
                    dataSource={confirmedAppointments}
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    rowKey="id"
                    scroll={{ x: 'max-content' }}
                    rowClassName="hover:bg-blue-50 transition-colors duration-200"
                  />
                )
              },
              {
                key: 'completed',
                label: (
                  <span className="flex items-center space-x-2">
                    <CheckOutlined />
                    <span>Hoàn thành ({completedAppointments.length})</span>
                  </span>
                ),
                children: (
                  <Table 
                    columns={columns} 
                    dataSource={completedAppointments}
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    rowKey="id"
                    scroll={{ x: 'max-content' }}
                    rowClassName="hover:bg-blue-50 transition-colors duration-200"
                  />
                )
              }
            ]}
          />
        </Card>
        
        {/* Appointment Detail Drawer */}
        <Drawer
          title={
            <Space size="middle">
              <span className="text-xl font-bold">Chi tiết cuộc hẹn</span>
              {selectedAppointment && getStatusTag(selectedAppointment.status)}
            </Space>
          }
          width={700}
          placement="right"
          onClose={closeDrawer}
          open={drawerVisible}
        >
          {selectedAppointment && (
            <>
              <div className="mb-6 flex items-center">
                <Avatar size={64} icon={<UserOutlined />} className="bg-blue-500 mr-4" />
                <div>
                  <Text className="text-xl font-medium block">{selectedAppointment.patientName}</Text>
                  <Text type="secondary">Mã bệnh nhân: {selectedAppointment.id}</Text>
                </div>
              </div>
              
              <Descriptions title="Thông tin lịch hẹn" bordered column={1} className="mb-6">
                <Descriptions.Item label="Mã lịch hẹn">{selectedAppointment.id}</Descriptions.Item>
                <Descriptions.Item label="Ngày hẹn">{dayjs(selectedAppointment.date).format('DD/MM/YYYY')}</Descriptions.Item>
                <Descriptions.Item label="Giờ hẹn">{selectedAppointment.time}</Descriptions.Item>
                <Descriptions.Item label="Bác sĩ khám">{selectedAppointment.doctor}</Descriptions.Item>
                <Descriptions.Item label="Dịch vụ">{selectedAppointment.department}</Descriptions.Item>
                <Descriptions.Item label="Lý do khám">{selectedAppointment.reason}</Descriptions.Item>
                <Descriptions.Item label="Chi phí">
                  {selectedAppointment.price ? `${selectedAppointment.price.toLocaleString()} VNĐ` : 'Chưa xác định'}
                </Descriptions.Item>
                <Descriptions.Item label="Ghi chú">{selectedAppointment.notes || 'Không có'}</Descriptions.Item>
              </Descriptions>
              
              <Descriptions title="Thông tin liên hệ" bordered column={1} className="mb-6">
                <Descriptions.Item label="Số điện thoại">{selectedAppointment.phone}</Descriptions.Item>
                <Descriptions.Item label="Email">{selectedAppointment.email}</Descriptions.Item>
              </Descriptions>

              {/* Payment Information */}
              {selectedAppointment.hasInvoice && (
                <Card className="mb-6 bg-gray-50 border border-gray-200">
                  <Title level={5} className="mb-4 flex items-center">
                    <DollarOutlined className="text-green-500 mr-2" />
                    Thông tin thanh toán
                  </Title>
                  <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label="Trạng thái thanh toán">
                      {getPaymentTag(selectedAppointment.paymentStatus, selectedAppointment.invoiceGenerated)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số tiền">
                      <Text strong className="text-green-600">
                        {selectedAppointment.price ? `${selectedAppointment.price.toLocaleString()} VNĐ` : 'Chưa xác định'}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Hóa đơn">
                      {selectedAppointment.invoiceGenerated ? (
                        <Tag color="green">Đã tạo hóa đơn</Tag>
                      ) : (
                        <Tag color="orange">Chưa tạo hóa đơn</Tag>
                      )}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              )}
              
              {/* Timeline for completed appointments */}
              {['COMPLETED', 'PAID'].includes(selectedAppointment.status) && (
                <Timeline className="mb-6">
                  <Timeline.Item color="blue">
                    Đặt lịch hẹn lúc {dayjs(selectedAppointment.date).format('HH:mm DD/MM/YYYY')}
                  </Timeline.Item>
                  <Timeline.Item color="green">
                    Hoàn thành khám lúc {selectedAppointment.completedTime || 'N/A'}
                  </Timeline.Item>
                  {selectedAppointment.invoiceGenerated && (
                    <Timeline.Item color="orange">
                      Đã tạo hóa đơn
                    </Timeline.Item>
                  )}
                  {selectedAppointment.status === 'PAID' && (
                    <Timeline.Item color="green">
                      Đã thanh toán
                    </Timeline.Item>
                  )}
                </Timeline>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                <Button icon={<EditOutlined />} onClick={showEditModal}>
                  Cập nhật thông tin
                </Button>
                
                {/* Invoice generation - only for completed appointments */}
                {selectedAppointment.status === 'COMPLETED' && !selectedAppointment.invoiceGenerated && (
                  <Button 
                    type="primary" 
                    icon={<DollarOutlined />}
                    onClick={() => handleGenerateInvoice(selectedAppointment)}
                    className="bg-green-500 hover:bg-green-600 border-none"
                  >
                    Tạo hóa đơn
                  </Button>
                )}
                
                {/* Mark as paid - only for completed appointments with invoice */}
                {selectedAppointment.status === 'COMPLETED' && 
                 selectedAppointment.invoiceGenerated && 
                 selectedAppointment.paymentStatus === 'pending_payment' && (
                  <Button 
                    type="primary" 
                    icon={<CheckCircleOutlined />}
                    onClick={() => handleMarkAsPaid(selectedAppointment)}
                    className="bg-blue-500 hover:bg-blue-600 border-none"
                  >
                    Đánh dấu đã thanh toán
                  </Button>
                )}
                
                {/* View invoice - for appointments with invoices */}
                {selectedAppointment.invoiceGenerated && (
                  <Button 
                    icon={<FileTextOutlined />}
                    className="border-green-500 text-green-600 hover:bg-green-50"
                  >
                    Xem hóa đơn
                  </Button>
                )}
              </div>
            </>
          )}
        </Drawer>
        
        {/* Edit Patient Info Modal */}
        <Modal
          title="Cập nhật thông tin bệnh nhân"
          open={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdatePatient}
          >
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
            </Form.Item>
            
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { type: 'email', message: 'Email không hợp lệ!' },
                { required: true, message: 'Vui lòng nhập email!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
            
            <Form.Item
              name="notes"
              label="Ghi chú"
            >
              <Input.TextArea rows={4} placeholder="Ghi chú về bệnh nhân..." />
            </Form.Item>
            
            <Form.Item className="mb-0 text-right">
              <Button type="default" className="mr-2" onClick={() => setEditModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default StaffDashboard;