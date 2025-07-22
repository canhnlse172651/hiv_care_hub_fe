import React, { useState, useEffect } from 'react';
import { Typography, Badge, Input, Row, Col, Card, Button, Spin, Alert } from 'antd';
import { 
  SearchOutlined, CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined,
  FileTextOutlined, ScheduleOutlined, RightOutlined, BellOutlined, TeamOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ensureDoctorId } from '@/utils/doctorId';

// Import components and hooks
import { StatisticCard, AppointmentCard, CompletedAppointments } from '@/components/doctor/dashboard';
import { useDoctorDashboard } from '@/hooks/doctor';

const { Title } = Typography;

const DoctorDashboard = () => {
  const [doctorId, setDoctorId] = useState(undefined);

  useEffect(() => {
    ensureDoctorId().then(id => setDoctorId(id));
  }, []);

  const {
    loading,
    statistics,
    searchText,
    setSearchText,
    filteredAppointments,
    todayCompletedAppointments,
    getShiftAppointments
  } = useDoctorDashboard(doctorId);

  // Only render conditionally, do not skip hooks!
  if (doctorId === undefined) {
    return <Spin className="flex justify-center items-center min-h-screen" size="large" />;
  }
  if (!doctorId) {
    return <Alert message="Doctor ID not found" type="error" showIcon className="m-8" />;
  }

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
                  <Link to="/doctor/appointment">
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
              <CompletedAppointments appointments={todayCompletedAppointments} />

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
                            {getShiftAppointments(8, 12)}
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
                            {getShiftAppointments(13, 17)}
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