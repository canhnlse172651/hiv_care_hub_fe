import React, { useState } from 'react';
import { 
  Table, Card, Button, Avatar, Space, Tag, Tabs, 
  Typography, Badge, Input, Statistic, Timeline, Tooltip 
} from 'antd';
import { 
  UserOutlined, SearchOutlined, ClockCircleOutlined, 
  CheckCircleOutlined, MedicineBoxOutlined, CalendarOutlined,
  FileTextOutlined, ScheduleOutlined, RightOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const DoctorDashboard = () => {
  const [searchText, setSearchText] = useState('');
  const today = dayjs().format('DD/MM/YYYY');
  
  // Sample data
  const patientList = [
    {
      id: 'PT-10001',
      appointmentId: 'AP-2024060001',
      name: 'Nguyễn Văn A',
      age: 35,
      gender: 'Nam',
      checkInTime: '08:45',
      appointmentTime: '09:00',
      reason: 'Khám định kỳ HIV',
      status: 'waiting',
      priority: 'normal'
    },
    {
      id: 'PT-10022',
      appointmentId: 'AP-2024060012',
      name: 'Trần Thị B',
      age: 28,
      gender: 'Nữ',
      checkInTime: '08:50',
      appointmentTime: '09:15',
      reason: 'Theo dõi phản ứng phụ thuốc ARV',
      status: 'waiting',
      priority: 'high'
    },
    {
      id: 'PT-10035',
      appointmentId: 'AP-2024060024',
      name: 'Lê Văn C',
      age: 42,
      gender: 'Nam',
      checkInTime: '09:10',
      appointmentTime: '09:30',
      reason: 'Tư vấn kết quả xét nghiệm mới',
      status: 'waiting',
      priority: 'normal'
    },
    {
      id: 'PT-10047',
      appointmentId: 'AP-2024060031',
      name: 'Phạm Thị D',
      age: 32,
      gender: 'Nữ',
      checkInTime: '09:25',
      appointmentTime: '09:45',
      reason: 'Đánh giá hiệu quả điều trị',
      status: 'waiting',
      priority: 'normal'
    },
  ];

  const filteredPatients = patientList.filter(patient => 
    patient.name.toLowerCase().includes(searchText.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchText.toLowerCase()) ||
    patient.reason.toLowerCase().includes(searchText.toLowerCase())
  );
  
  const completedPatients = [
    {
      id: 'PT-10005',
      appointmentId: 'AP-2024060005',
      name: 'Hoàng Văn E',
      age: 45,
      gender: 'Nam',
      appointmentTime: '08:00',
      consultationTime: '08:10-08:35',
      diagnosis: 'Nhiễm HIV ổn định',
      status: 'completed'
    },
    {
      id: 'PT-10008',
      appointmentId: 'AP-2024060008',
      name: 'Mai Thị F',
      age: 29,
      gender: 'Nữ',
      appointmentTime: '08:30',
      consultationTime: '08:40-09:05',
      diagnosis: 'Tác dụng phụ của thuốc ARV - điều chỉnh liều',
      status: 'completed'
    }
  ];

  const statistics = {
    totalAppointments: 8,
    completed: 2,
    waiting: 4,
    cancelled: 2
  };

  const getStatusTag = (status, priority) => {
    if (status === 'waiting') {
      return priority === 'high' ? 
        <Tag color="orange" icon={<ClockCircleOutlined />}>Ưu tiên</Tag> :
        <Tag color="blue" icon={<ClockCircleOutlined />}>Đang chờ</Tag>;
    }
    return <Tag color="green" icon={<CheckCircleOutlined />}>Hoàn thành</Tag>;
  };

  const patientColumns = [
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
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} className="bg-blue-500" />
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-gray-500 text-xs">
              {record.age} tuổi | {record.gender} | Mã: {record.id}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Giờ hẹn',
      dataIndex: 'appointmentTime',
      key: 'appointmentTime',
      width: 100,
      render: (time) => <span className="text-gray-600">{time}</span>
    },
    {
      title: 'Lý do khám',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true
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
      width: 120, // Increased width to prevent button from being cut off
      render: (_, record) => (
        <Link to={`/doctor/consultation/${record.appointmentId}`}>
          <Button type="primary">
            Khám ngay
          </Button>
        </Link>
      ),
    },
  ];

  const completedColumns = [
    {
      title: 'Bệnh nhân',
      key: 'patient',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} className="bg-blue-500" />
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-gray-500 text-xs">
              {record.age} tuổi | {record.gender} | Mã: {record.id}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Thời gian khám',
      dataIndex: 'consultationTime',
      key: 'consultationTime',
      width: 150,
    },
    {
      title: 'Chẩn đoán',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      ellipsis: true
    },
    {
      title: '',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Link to={`/doctor/medical-records/${record.id}`}>
          <Button type="link">Xem chi tiết</Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <Title level={2} className="mb-2">Bảng điều khiển bác sĩ</Title>
          <Text className="text-gray-500">Ngày hôm nay: {today}</Text>
        </div>
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 mt-4 md:mt-0">
          <div className="text-lg font-semibold mb-1">Chào mừng, Bác sĩ Nguyễn</div>
          <div className="text-blue-100">Chúc một ngày làm việc hiệu quả</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="shadow-sm hover:shadow-md transition-shadow bg-blue-50 border-blue-200">
          <Statistic 
            title="Tổng lịch hẹn" 
            value={statistics.totalAppointments} 
            valueStyle={{ color: '#1890ff' }}
            prefix={<CalendarOutlined />} 
          />
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow bg-green-50 border-green-200">
          <Statistic 
            title="Đã hoàn thành" 
            value={statistics.completed} 
            valueStyle={{ color: '#52c41a' }}
            prefix={<CheckCircleOutlined />} 
          />
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow bg-yellow-50 border-yellow-200">
          <Statistic 
            title="Đang chờ khám" 
            value={statistics.waiting} 
            valueStyle={{ color: '#faad14' }}
            prefix={<ClockCircleOutlined />} 
          />
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow bg-gray-50 border-gray-200">
          <Statistic 
            title="Đã hủy" 
            value={statistics.cancelled} 
            valueStyle={{ color: '#cf1322' }}
            prefix={<FileTextOutlined />} 
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="col-span-1 xl:col-span-2 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <Title level={4} className="mb-0">Danh sách chờ khám</Title>
            <Input
              placeholder="Tìm kiếm bệnh nhân..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
          </div>

          <Table
            columns={patientColumns}
            dataSource={filteredPatients}
            rowKey="id"
            pagination={false}
            className="border rounded-lg overflow-hidden"
          />
        </Card>

        <Card className="shadow-md">
          <Tabs defaultActiveKey="completed" className="mb-4">
            <TabPane 
              tab={<span><CheckCircleOutlined /> Đã hoàn thành</span>} 
              key="completed"
            >
              <Table
                columns={completedColumns}
                dataSource={completedPatients}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </TabPane>
          </Tabs>

          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <Title level={5} className="mb-0">Lịch làm việc</Title>
              <Link to="/doctor/schedule">
                <Button type="primary" icon={<CalendarOutlined />}>
                  Xem lịch đầy đủ
                </Button>
              </Link>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                <Badge status="processing" className="mr-2" />
                <div>
                  <div>Ca sáng: 08:00 - 12:00</div>
                  <div className="text-xs text-gray-500">4 lịch hẹn đã đặt</div>
                </div>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                <Badge status="success" className="mr-2" />
                <div>
                  <div>Ca chiều: 13:30 - 17:00</div>
                  <div className="text-xs text-gray-500">2 lịch hẹn đã đặt</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <Title level={5}>Thông báo mới</Title>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                <Badge status="processing" className="mr-2" />
                <div>
                  <div>Hội thảo cập nhật phác đồ điều trị HIV mới</div>
                  <div className="text-xs text-gray-500">14:00, 15/06/2024</div>
                </div>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                <Badge status="success" className="mr-2" />
                <div>
                  <div>Kết quả xét nghiệm của bệnh nhân Nguyễn Văn A đã có</div>
                  <div className="text-xs text-gray-500">Cập nhật 30 phút trước</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;
