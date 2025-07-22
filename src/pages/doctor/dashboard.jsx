import React, { useState, useEffect } from 'react';
import { Typography, Badge, Input, message, Row, Col, Card, Button, Avatar, Space, Spin, Alert } from 'antd';
import { 
  SearchOutlined, CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined,
  FileTextOutlined, ScheduleOutlined, RightOutlined, BellOutlined, TeamOutlined, UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Link } from 'react-router-dom';
import { appointmentService } from '@/services/appointmentService';
import { localToken } from '@/utils/token';
import { ensureDoctorId } from '@/utils/doctorId';

// Import components
import StatisticCard from './components/StatisticCard';
import AppointmentCard from './components/AppointmentCard';

dayjs.extend(utc);

const { Title, Text } = Typography;

const DoctorDashboard = () => {
  // All hooks at the top!
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [statistics, setStatistics] = useState({
    totalAppointments: 0,
    completed: 0,
    waiting: 0,
    cancelled: 0
  });
  const [doctorId, setDoctorId] = useState(undefined); // undefined = loading, null = not found
  const today = dayjs().format('DD/MM/YYYY');
  const todayDate = dayjs().utc().format('YYYY-MM-DD');

  useEffect(() => {
    ensureDoctorId().then(id => setDoctorId(id));
  }, []);

  useEffect(() => {
    if (doctorId) {
      fetchAppointments();
    }
    // eslint-disable-next-line
  }, [doctorId]);

  // Only render conditionally, do not skip hooks!
  if (doctorId === undefined) {
    return <Spin className="flex justify-center items-center min-h-screen" size="large" />;
  }
  if (!doctorId) {
    return <Alert message="Doctor ID not found" type="error" showIcon className="m-8" />;
  }

  // Fetch appointments for the current doctor
  const fetchAppointments = async () => {
    if (!doctorId) {
      message.error('Không thể xác định thông tin bác sĩ');
      return;
    }

    setLoading(true);
    try {
      const response = await appointmentService.getAppointmentsByDoctorId(doctorId);
      const allAppointmentsData = response.data?.data || [];
      
      // Filter for today's appointments only (use UTC)
      const todayAppointments = allAppointmentsData.filter(appointment => 
        dayjs.utc(appointment.appointmentTime).format('YYYY-MM-DD') === todayDate
      );
      
      // Filter for offline appointments with PENDING status (for waiting list)
      const offlinePendingAppointments = todayAppointments.filter(appointment => 
        appointment.type === 'OFFLINE' && appointment.status === 'PENDING'
      );

      setAllAppointments(allAppointmentsData);
      setAppointments(offlinePendingAppointments);
      
      // Calculate statistics for today only
      const stats = {
        totalAppointments: todayAppointments.length,
        completed: todayAppointments.filter(apt => apt.status === 'COMPLETED').length,
        waiting: todayAppointments.filter(apt => apt.status === 'PENDING').length,
        cancelled: todayAppointments.filter(apt => apt.status === 'CANCELLED').length
      };
      setStatistics(stats);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      message.error('Không thể tải danh sách lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  // Filter appointments based on search text
  const filteredAppointments = appointments.filter(appointment => 
    appointment.user?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    appointment.service?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    appointment.id?.toString().includes(searchText)
  );

  // Get today's completed appointments (use UTC)
  const todayCompletedAppointments = allAppointments.filter(appointment => 
    dayjs.utc(appointment.appointmentTime).format('YYYY-MM-DD') === todayDate &&
    appointment.status === 'COMPLETED'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">

        {/* Statistics Cards */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="Lịch hẹn hôm nay"
              value={statistics.totalAppointments}
              icon={<CalendarOutlined />}
              color="#3b82f6"
              bgGradient="from-blue-50 to-blue-100"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="Đã hoàn thành"
              value={statistics.completed}
              icon={<CheckCircleOutlined />}
              color="#10b981"
              bgGradient="from-green-50 to-green-100"
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="Đang chờ khám"
              value={statistics.waiting}
              icon={<ClockCircleOutlined />}
              color="#f59e0b"
              bgGradient="from-yellow-50 to-yellow-100"
              iconBgColor="bg-yellow-100"
              iconColor="text-yellow-600"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="Đã hủy"
              value={statistics.cancelled}
              icon={<FileTextOutlined />}
              color="#ef4444"
              bgGradient="from-red-50 to-red-100"
              iconBgColor="bg-red-100"
              iconColor="text-red-600"
            />
          </Col>
        </Row>

        {/* Main Content */}
        <Row gutter={[24, 24]}>
          {/* Patient Queue */}
          <Col xs={24} xl={16}>
            <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TeamOutlined className="text-blue-600" />
                    </div>
                    <Title level={4} className="mb-0 text-gray-900">
                      Danh sách chờ khám hôm nay
                    </Title>
                    <Badge count={filteredAppointments.length} className="ml-2" />
                  </div>
                  <Input
                    placeholder="Tìm kiếm bệnh nhân..."
                    prefix={<SearchOutlined className="text-gray-400" />}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    style={{ width: 280 }}
                    allowClear
                    className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="p-6">
                {filteredAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <TeamOutlined className="text-6xl text-gray-300 mb-4" />
                    <div className="text-gray-500 text-lg mb-2">Không có lịch hẹn nào đang chờ</div>
                    <div className="text-gray-400">Danh sách chờ khám sẽ xuất hiện tại đây</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredAppointments.map(appointment => (
                      <AppointmentCard 
                        key={appointment.id} 
                        appointment={appointment} 
                        size="small"
                        showMedicalRecordLink={true}
                      />
                    ))}
                  </div>
                )}

                <div className="mt-6 text-center border-t border-gray-100 pt-6">
                  <Link to="/doctor/appointments">
                    <Button 
                      type="primary" 
                      icon={<CalendarOutlined />}
                      size="large"
                      className="bg-blue-500 hover:bg-blue-600 border-none rounded-xl h-12 px-8 font-semibold"
                    >
                      Xem tất cả lịch hẹn
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col xs={24} xl={8}>
            <div className="space-y-6">
              {/* Completed Appointments */}
              <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircleOutlined className="text-green-600" />
                    </div>
                    <Title level={5} className="mb-0 text-gray-900">
                      Đã hoàn thành hôm nay
                    </Title>
                  </div>

                  <div className="space-y-2">
                    {todayCompletedAppointments.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        Chưa có lịch hẹn nào hoàn thành
                      </div>
                    ) : (
                      todayCompletedAppointments.map(appointment => (
                        <div key={appointment.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                          <Link to={`/doctor/medical-records/${appointment.user?.id}`}>
                            <Avatar 
                              src={appointment.user?.avatar} 
                              icon={<UserOutlined />} 
                              size={32}
                              className="bg-blue-500 cursor-pointer hover:shadow-md transition-shadow duration-200" 
                            />
                          </Link>
                          <div className="flex-1">
                            <Link 
                              to={`/doctor/medical-records/${appointment.user?.id}`}
                              className="text-sm font-medium hover:text-blue-600 transition-colors duration-200"
                            >
                              {appointment.user?.name || 'Không có tên'}
                            </Link>
                            <div className="text-xs text-gray-500">
                              {dayjs(appointment.appointmentTime).format('HH:mm')} - {appointment.service?.name}
                            </div>
                          </div>
                          <Link to={`/doctor/medical-records/${appointment.user?.id}`}>
                            <Button type="link" size="small" className="hover:text-blue-600">Chi tiết</Button>
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Card>

              {/* Schedule */}
              <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <ScheduleOutlined className="text-purple-600" />
                      </div>
                      <Title level={5} className="mb-0 text-gray-900">Lịch làm việc hôm nay</Title>
                    </div>
                    <Link to="/doctor/schedule">
                      <Button 
                        type="link" 
                        icon={<RightOutlined />}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Xem chi tiết
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge status="processing" />
                          <div>
                            <div className="font-semibold text-gray-900">Ca sáng</div>
                            <div className="text-sm text-gray-600">08:00 - 12:00</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-600">
                            {allAppointments.filter(apt => {
                              const hour = dayjs.utc(apt.appointmentTime).hour();
                              const date = dayjs.utc(apt.appointmentTime).format('YYYY-MM-DD');
                              return hour >= 8 && hour < 12 && date === todayDate;
                            }).length}
                          </div>
                          <div className="text-xs text-gray-500">lịch hẹn</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge status="success" />
                          <div>
                            <div className="font-semibold text-gray-900">Ca chiều</div>
                            <div className="text-sm text-gray-600">13:30 - 17:00</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">
                            {allAppointments.filter(apt => {
                              const hour = dayjs.utc(apt.appointmentTime).hour();
                              const date = dayjs.utc(apt.appointmentTime).format('YYYY-MM-DD');
                              return hour >= 13 && hour < 17 && date === todayDate;
                            }).length}
                          </div>
                          <div className="text-xs text-gray-500">lịch hẹn</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Notifications */}
              <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <BellOutlined className="text-orange-600" />
                    </div>
                    <Title level={5} className="mb-0 text-gray-900">Thông báo mới</Title>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                      <div className="flex items-start space-x-3">
                        <Badge status="processing" className="mt-1" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 mb-1">
                            Hội thảo cập nhật phác đồ điều trị HIV mới
                          </div>
                          <div className="text-sm text-gray-600">14:00, 15/06/2024</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                      <div className="flex items-start space-x-3">
                        <Badge status="success" className="mt-1" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 mb-1">
                            Kết quả xét nghiệm của bệnh nhân đã có
                          </div>
                          <div className="text-sm text-gray-600">Cập nhật 30 phút trước</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DoctorDashboard;