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
  message
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
  ExclamationCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const StaffDashboard = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  
  // Mock data for appointments
  const mockAppointments = [
    {
      id: 'AP-2024060001',
      patientId: 'PT-10001',
      patientName: 'Nguyễn Văn A',
      phone: '0912345678',
      email: 'nguyenvana@example.com',
      date: '2024-06-01',
      time: '09:00 AM',
      doctor: 'Dr. Sarah Johnson',
      department: 'Khoa HIV',
      status: 'upcoming',
      reason: 'Khám định kỳ',
      notes: 'Bệnh nhân đã dùng thuốc 3 tháng',
      paymentStatus: 'unpaid'
    },
    {
      id: 'AP-2024060002',
      patientId: 'PT-10002',
      patientName: 'Trần Thị B',
      phone: '0923456789',
      email: 'tranthib@example.com',
      date: '2024-06-01',
      time: '09:30 AM',
      doctor: 'Dr. Michael Brown',
      department: 'Khoa Tư vấn',
      status: 'checked-in',
      reason: 'Tư vấn điều trị',
      notes: 'Bệnh nhân mới',
      checkInTime: '09:25 AM',
      paymentStatus: 'unpaid'
    },
    {
      id: 'AP-2024060003',
      patientId: 'PT-10003',
      patientName: 'Lê Văn C',
      phone: '0934567890',
      email: 'levanc@example.com',
      date: '2024-06-01',
      time: '10:00 AM',
      doctor: 'Dr. Sarah Johnson',
      department: 'Khoa HIV',
      status: 'completed',
      reason: 'Kết quả xét nghiệm',
      notes: 'Xác nhận tình trạng và điều chỉnh liệu pháp',
      checkInTime: '09:55 AM',
      completedTime: '10:25 AM',
      paymentStatus: 'paid'
    },
    {
      id: 'AP-2024060004',
      patientId: 'PT-10004',
      patientName: 'Phạm Thị D',
      phone: '0945678901',
      email: 'phamthid@example.com',
      date: '2024-06-01',
      time: '10:30 AM',
      doctor: 'Dr. David Lee',
      department: 'Khoa Tư vấn tâm lý',
      status: 'upcoming',
      reason: 'Tư vấn tâm lý',
      notes: '',
      paymentStatus: 'unpaid'
    },
    {
      id: 'AP-2024060005',
      patientId: 'PT-10005',
      patientName: 'Hoàng Văn E',
      phone: '0956789012',
      email: 'hoangvane@example.com',
      date: '2024-06-01',
      time: '11:00 AM',
      doctor: 'Dr. Emily Chen',
      department: 'Khoa Dinh dưỡng',
      status: 'canceled',
      reason: 'Tư vấn dinh dưỡng',
      notes: 'Bệnh nhân hủy lịch',
      paymentStatus: 'unpaid'
    },
  ];
  
  // Filter appointments based on search text
  const filteredAppointments = mockAppointments.filter(appointment => {
    return (
      appointment.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
      appointment.phone.includes(searchText) ||
      appointment.id.toLowerCase().includes(searchText.toLowerCase()) ||
      appointment.patientId.toLowerCase().includes(searchText.toLowerCase())
    );
  });
  
  // Filter appointments by status
  const upcomingAppointments = filteredAppointments.filter(a => a.status === 'upcoming');
  const checkedInAppointments = filteredAppointments.filter(a => a.status === 'checked-in');
  const completedAppointments = filteredAppointments.filter(a => a.status === 'completed');
  const canceledAppointments = filteredAppointments.filter(a => a.status === 'canceled');
  
  const getStatusTag = (status) => {
    switch (status) {
      case 'upcoming':
        return <Tag icon={<ClockCircleOutlined />} color="processing">Chờ khám</Tag>;
      case 'checked-in':
        return <Tag icon={<CheckCircleOutlined />} color="warning">Đã check-in</Tag>;
      case 'completed':
        return <Tag icon={<CheckOutlined />} color="success">Hoàn thành</Tag>;
      case 'canceled':
        return <Tag icon={<ExclamationCircleOutlined />} color="error">Đã hủy</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };
  
  const getPaymentTag = (paymentStatus) => {
    if (paymentStatus === 'paid') {
      return <Tag color="green">Đã thanh toán</Tag>;
    }
    return <Tag color="red">Chưa thanh toán</Tag>;
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
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: 'Bệnh nhân',
      dataIndex: 'patientName',
      key: 'patientName',
    },
    {
      title: 'Thời gian',
      key: 'time',
      render: (_, record) => `${record.time}`,
    },
    {
      title: 'Bác sĩ',
      dataIndex: 'doctor',
      key: 'doctor',
    },
    {
      title: 'Khoa phòng',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => getStatusTag(record.status),
    },
    {
      title: 'Thanh toán',
      key: 'paymentStatus',
      render: (_, record) => getPaymentTag(record.paymentStatus),
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" onClick={() => showDrawer(record)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Lịch hẹn hôm nay</Title>
        <div className="text-right">
          <Text className="block text-lg">{dayjs().format('DD/MM/YYYY')}</Text>
          <Text type="secondary">Tổng số: {filteredAppointments.length} cuộc hẹn</Text>
        </div>
      </div>
      
      <div className="mb-6">
        <Input.Search
          placeholder="Tìm kiếm bệnh nhân, SĐT, mã hẹn..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className="max-w-lg"
        />
      </div>
      
      <Card>
        <Tabs defaultActiveKey="upcoming" type="card">
          <TabPane 
            tab={
              <span>
                <ClockCircleOutlined />
                Chờ khám ({upcomingAppointments.length})
              </span>
            } 
            key="upcoming"
          >
            <Table 
              columns={columns} 
              dataSource={upcomingAppointments}
              pagination={false}
              rowKey="id"
            />
          </TabPane>
          <TabPane 
            tab={
              <span>
                <CheckCircleOutlined />
                Đã check-in ({checkedInAppointments.length})
              </span>
            } 
            key="checkedIn"
          >
            <Table 
              columns={columns} 
              dataSource={checkedInAppointments}
              pagination={false}
              rowKey="id"
            />
          </TabPane>
          <TabPane 
            tab={
              <span>
                <CheckOutlined />
                Đã hoàn thành ({completedAppointments.length})
              </span>
            } 
            key="completed"
          >
            <Table 
              columns={columns} 
              dataSource={completedAppointments}
              pagination={false}
              rowKey="id"
            />
          </TabPane>
        </Tabs>
      </Card>
      
      {/* Appointment Detail Drawer */}
      <Drawer
        title={
          <Space size="middle">
            <span className="text-xl font-bold">Chi tiết cuộc hẹn</span>
            {selectedAppointment && getStatusTag(selectedAppointment.status)}
          </Space>
        }
        width={600}
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
                <Text type="secondary">Mã bệnh nhân: {selectedAppointment.patientId}</Text>
              </div>
            </div>
            
            <Descriptions title="Thông tin lịch hẹn" bordered column={1} className="mb-6">
              <Descriptions.Item label="Mã lịch hẹn">{selectedAppointment.id}</Descriptions.Item>
              <Descriptions.Item label="Ngày hẹn">{dayjs(selectedAppointment.date).format('DD/MM/YYYY')}</Descriptions.Item>
              <Descriptions.Item label="Giờ hẹn">{selectedAppointment.time}</Descriptions.Item>
              <Descriptions.Item label="Bác sĩ khám">{selectedAppointment.doctor}</Descriptions.Item>
              <Descriptions.Item label="Khoa phòng">{selectedAppointment.department}</Descriptions.Item>
              <Descriptions.Item label="Lý do khám">{selectedAppointment.reason}</Descriptions.Item>
              <Descriptions.Item label="Ghi chú">{selectedAppointment.notes}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái thanh toán">{getPaymentTag(selectedAppointment.paymentStatus)}</Descriptions.Item>
            </Descriptions>
            
            <Descriptions title="Thông tin liên hệ" bordered column={1} className="mb-6">
              <Descriptions.Item label="Số điện thoại">{selectedAppointment.phone}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedAppointment.email}</Descriptions.Item>
            </Descriptions>
            
            {selectedAppointment.status === 'checked-in' || selectedAppointment.status === 'completed' ? (
              <Timeline className="mb-6">
                <Timeline.Item>Đặt lịch hẹn lúc {dayjs(selectedAppointment.date).format('HH:mm DD/MM/YYYY')}</Timeline.Item>
                <Timeline.Item>Bệnh nhân check-in lúc {selectedAppointment.checkInTime}</Timeline.Item>
                {selectedAppointment.status === 'completed' && (
                  <Timeline.Item>Hoàn thành khám lúc {selectedAppointment.completedTime}</Timeline.Item>
                )}
              </Timeline>
            ) : null}
            
            <div className="flex space-x-4 mt-6">
              {selectedAppointment.status === 'upcoming' && (
                <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleCheckIn}>
                  Check-in
                </Button>
              )}
              
              <Button icon={<EditOutlined />} onClick={showEditModal}>
                Cập nhật thông tin
              </Button>
              
              {selectedAppointment.paymentStatus === 'unpaid' && (
                <Button type="default" icon={<DollarOutlined />}>
                  Tạo hóa đơn
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
  );
};

export default StaffDashboard;