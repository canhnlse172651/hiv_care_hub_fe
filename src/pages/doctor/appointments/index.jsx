import React, { useState, useEffect } from 'react';
import { 
  Card, Typography, Button, Space, Tabs, 
  Input, Badge, Table, Avatar, Tag, Select,
  DatePicker, Row, Col, Statistic, Divider,
  Modal, Form, message, Tooltip, Dropdown
} from 'antd';
import { 
  SearchOutlined, CalendarOutlined, CheckCircleOutlined,
  ClockCircleOutlined, UserOutlined, FilterOutlined,
  MoreOutlined, PhoneOutlined, MailOutlined,
  FileTextOutlined, MedicineBoxOutlined, EyeOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDoctorDashboard } from '@/hooks';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const DoctorAppointments = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  const [appointments, setAppointments] = useState([
    {
      id: 'AP-2024060001',
      appointmentId: 'AP-2024060001',
      name: 'Nguyễn Văn A',
      age: 35,
      gender: 'Nam',
      phone: '0912345678',
      email: 'nguyenvana@email.com',
      checkInTime: '08:45',
      appointmentTime: '09:00',
      reason: 'Khám định kỳ HIV',
      status: 'waiting',
      priority: 'normal',
      bloodType: 'A+',
      allergies: 'Không',
      chronicConditions: 'Tăng huyết áp',
      lastVisit: '2024-05-15',
      doctorNotes: 'Bệnh nhân tuân thủ điều trị tốt',
      isHivPositive: true,
      startedTreatment: '2022-03-10',
      currentRegimen: 'TDF + 3TC + DTG'
    },
    {
      id: 'AP-2024060002',
      appointmentId: 'AP-2024060002',
      name: 'Trần Thị B',
      age: 28,
      gender: 'Nữ',
      phone: '0987654321',
      email: 'tranthib@email.com',
      checkInTime: '09:15',
      appointmentTime: '09:30',
      reason: 'Kiểm tra tác dụng phụ thuốc',
      status: 'waiting',
      priority: 'high',
      bloodType: 'O+',
      allergies: 'Penicillin',
      chronicConditions: 'Không',
      lastVisit: '2024-06-01',
      doctorNotes: 'Cần theo dõi chặt chẽ tác dụng phụ',
      isHivPositive: true,
      startedTreatment: '2023-08-20',
      currentRegimen: 'TDF + 3TC + EFV'
    },
    {
      id: 'AP-2024060003',
      appointmentId: 'AP-2024060003',
      name: 'Lê Văn C',
      age: 42,
      gender: 'Nam',
      phone: '0123456789',
      email: 'levanc@email.com',
      checkInTime: '10:00',
      appointmentTime: '10:15',
      reason: 'Tư vấn thay đổi phác đồ',
      status: 'completed',
      priority: 'normal',
      bloodType: 'B+',
      allergies: 'Không',
      chronicConditions: 'Tiểu đường',
      lastVisit: '2024-05-20',
      doctorNotes: 'Cần thay đổi phác đồ do tương tác thuốc',
      isHivPositive: true,
      startedTreatment: '2021-11-05',
      currentRegimen: 'TDF + 3TC + DTG'
    }
  ]);

  const getStatusTag = (status, priority) => {
    if (status === 'waiting') {
      return priority === 'high' ? 
        <Tag color="orange" icon={<ClockCircleOutlined />}>Ưu tiên</Tag> :
        <Tag color="blue" icon={<ClockCircleOutlined />}>Đang chờ</Tag>;
    }
    return <Tag color="green" icon={<CheckCircleOutlined />}>Hoàn thành</Tag>;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'normal': return 'blue';
      default: return 'green';
    }
  };

  const handleStatusChange = (appointmentId, newStatus) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: newStatus }
          : apt
      )
    );
    message.success(`Cập nhật trạng thái thành công`);
  };

  const showAppointmentDetail = (appointment) => {
    setSelectedAppointment(appointment);
    setDetailModalVisible(true);
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.name.toLowerCase().includes(searchText.toLowerCase()) ||
      appointment.id.toLowerCase().includes(searchText.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    const matchesDate = !dateRange || !dateRange[0] || !dateRange[1] || 
      dayjs(appointment.lastVisit).isBetween(dateRange[0], dateRange[1], 'day', '[]');
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const statistics = {
    total: appointments.length,
    waiting: appointments.filter(a => a.status === 'waiting').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    highPriority: appointments.filter(a => a.priority === 'high').length
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Bệnh nhân',
      key: 'patient',
      width: 250,
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} className="bg-blue-500" />
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-gray-500 text-xs">
              {record.age} tuổi | {record.gender} | Mã: {record.id}
            </div>
            <div className="text-gray-400 text-xs">
              <PhoneOutlined /> {record.phone}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Thời gian',
      key: 'time',
      width: 120,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.appointmentTime}</div>
          <div className="text-xs text-gray-500">Check-in: {record.checkInTime}</div>
        </div>
      )
    },
    {
      title: 'Lý do khám',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
      width: 200
    },
    {
      title: 'Thông tin y tế',
      key: 'medical',
      width: 180,
      render: (_, record) => (
        <div className="text-xs">
          <div>Nhóm máu: {record.bloodType}</div>
          <div>Dị ứng: {record.allergies}</div>
          <div>Phác đồ: {record.currentRegimen}</div>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 120,
      render: (_, record) => getStatusTag(record.status, record.priority)
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              onClick={() => showAppointmentDetail(record)}
            />
          </Tooltip>
          {record.status === 'waiting' && (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'start',
                    label: 'Bắt đầu khám',
                    icon: <MedicineBoxOutlined />,
                    onClick: () => handleStatusChange(record.id, 'in-progress')
                  },
                  {
                    key: 'complete',
                    label: 'Hoàn thành',
                    icon: <CheckCircleOutlined />,
                    onClick: () => handleStatusChange(record.id, 'completed')
                  }
                ]
              }}
            >
              <Button type="primary" icon={<MoreOutlined />}>
                Hành động
              </Button>
            </Dropdown>
          )}
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: 'all',
      label: `Tất cả (${statistics.total})`,
      children: (
        <Table
          columns={columns}
          dataSource={filteredAppointments}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} lịch hẹn`
          }}
          scroll={{ x: 'max-content' }}
          className="border rounded-lg overflow-hidden"
        />
      )
    },
    {
      key: 'waiting',
      label: `Đang chờ (${statistics.waiting})`,
      children: (
        <Table
          columns={columns}
          dataSource={filteredAppointments.filter(a => a.status === 'waiting')}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true
          }}
          scroll={{ x: 'max-content' }}
          className="border rounded-lg overflow-hidden"
        />
      )
    },
    {
      key: 'completed',
      label: `Hoàn thành (${statistics.completed})`,
      children: (
        <Table
          columns={columns}
          dataSource={filteredAppointments.filter(a => a.status === 'completed')}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true
          }}
          scroll={{ x: 'max-content' }}
          className="border rounded-lg overflow-hidden"
        />
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <Title level={2} className="mb-2">Quản lý lịch hẹn</Title>
          <Text className="text-gray-500">Quản lý danh sách bệnh nhân và lịch hẹn khám</Text>
        </div>
        <Space>
          <Button type="primary" icon={<CalendarOutlined />}>
            Tạo lịch hẹn mới
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng lịch hẹn"
              value={statistics.total}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang chờ"
              value={statistics.waiting}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={statistics.completed}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Ưu tiên cao"
              value={statistics.highPriority}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-6">
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Input
              placeholder="Tìm kiếm bệnh nhân, mã lịch hẹn..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Trạng thái"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">Tất cả</Option>
              <Option value="waiting">Đang chờ</Option>
              <Option value="completed">Hoàn thành</Option>
            </Select>
          </Col>
          <Col span={6}>
            <RangePicker
              placeholder={['Từ ngày', 'Đến ngày']}
              value={dateRange}
              onChange={setDateRange}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={6}>
            <Button icon={<FilterOutlined />}>
              Lọc
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Appointments Table */}
      <Card>
        <Tabs defaultActiveKey="all" items={tabItems} />
      </Card>

      {/* Appointment Detail Modal */}
      <Modal
        title="Chi tiết lịch hẹn"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
          selectedAppointment?.status === 'waiting' && (
            <Button key="start" type="primary" icon={<MedicineBoxOutlined />}>
              Bắt đầu khám
            </Button>
          )
        ]}
        width={800}
      >
        {selectedAppointment && (
          <div className="space-y-4">
            <Row gutter={16}>
              <Col span={12}>
                <div className="font-medium">Thông tin bệnh nhân</div>
                <div className="text-sm text-gray-600">
                  <div>Tên: {selectedAppointment.name}</div>
                  <div>Tuổi: {selectedAppointment.age} tuổi</div>
                  <div>Giới tính: {selectedAppointment.gender}</div>
                  <div>Số điện thoại: {selectedAppointment.phone}</div>
                  <div>Email: {selectedAppointment.email}</div>
                </div>
              </Col>
              <Col span={12}>
                <div className="font-medium">Thông tin y tế</div>
                <div className="text-sm text-gray-600">
                  <div>Nhóm máu: {selectedAppointment.bloodType}</div>
                  <div>Dị ứng: {selectedAppointment.allergies}</div>
                  <div>Bệnh mạn tính: {selectedAppointment.chronicConditions}</div>
                  <div>Phác đồ hiện tại: {selectedAppointment.currentRegimen}</div>
                </div>
              </Col>
            </Row>
            <Divider />
            <Row gutter={16}>
              <Col span={12}>
                <div className="font-medium">Thông tin lịch hẹn</div>
                <div className="text-sm text-gray-600">
                  <div>Mã lịch hẹn: {selectedAppointment.appointmentId}</div>
                  <div>Giờ hẹn: {selectedAppointment.appointmentTime}</div>
                  <div>Check-in: {selectedAppointment.checkInTime}</div>
                  <div>Lý do khám: {selectedAppointment.reason}</div>
                </div>
              </Col>
              <Col span={12}>
                <div className="font-medium">Lịch sử</div>
                <div className="text-sm text-gray-600">
                  <div>Lần khám cuối: {selectedAppointment.lastVisit}</div>
                  <div>Bắt đầu điều trị: {selectedAppointment.startedTreatment}</div>
                  <div>Ghi chú bác sĩ: {selectedAppointment.doctorNotes}</div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DoctorAppointments; 