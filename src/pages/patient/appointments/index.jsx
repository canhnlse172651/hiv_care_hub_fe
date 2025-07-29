import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Spin, Alert, Tag, Button, Empty } from 'antd';
import { 
  CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, 
  ExclamationCircleOutlined, PlusOutlined 
} from '@ant-design/icons';
import { localToken } from '@/utils/token';
import { PATHS } from '@/constant/path';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

// Import components and hooks
import { 
  AppointmentCard, 
  AppointmentFilters, 
  AppointmentStats 
} from '@/components/patient/appointments';
import { usePatientAppointments } from '@/hooks/patient';

dayjs.extend(utc);

const { Title, Text } = Typography;

const AppointmentListPage = () => {
  const navigate = useNavigate();
  const auth = localToken.get();
  const userId = auth?.user?.id;

  const {
    appointments,
    filteredAppointments,
    loading,
    error,
    searchText,
    setSearchText,
    selectedService,
    setSelectedService,
    selectedDoctor,
    setSelectedDoctor,
    selectedStatus,
    setSelectedStatus,
    selectedType,
    setSelectedType,
    dateRange,
    setDateRange,
    uniqueServices,
    uniqueDoctors,
    clearFilters,
    handleCancelAppointment,
    upcomingAppointments,
    completedAppointments
  } = usePatientAppointments(userId);

  const getStatusTag = (status) => {
    const statusConfig = {
      PENDING: { color: 'orange', text: 'Đang chuẩn bị', icon: <ClockCircleOutlined /> },
      CONFIRMED: { color: 'blue', text: 'Đã xác nhận', icon: <CheckCircleOutlined /> },
      COMPLETED: { color: 'green', text: 'Đã hoàn thành', icon: <CheckCircleOutlined /> },
      PAID: { color: 'cyan', text: 'Đã thanh toán', icon: <CheckCircleOutlined /> },
      CANCELLED: { color: 'red', text: 'Đã hủy', icon: <ExclamationCircleOutlined /> },
    };
    
    const config = statusConfig[status?.toUpperCase()] || { color: 'default', text: status, icon: null };
    
    return (
      <Tag 
        color={config.color} 
        className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 w-fit"
      >
        {config.icon}
        {config.text}
      </Tag>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Alert message="Lỗi" description={error} type="error" showIcon className="max-w-md" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <Title level={2} className="text-gray-900 mb-2">
              Lịch hẹn của tôi
            </Title>
            <Text className="text-gray-600 text-lg">
              Quản lý và theo dõi các cuộc hẹn của bạn
            </Text>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate(PATHS.SERVICE_BOOKING)}
            className="bg-blue-500 hover:bg-blue-600 border-none rounded-xl h-12 px-6 font-semibold shadow-lg"
          >
            Đặt lịch hẹn mới
          </Button>
        </div>

        {/* Search and Filter Section */}
        <AppointmentFilters
          searchText={searchText}
          setSearchText={setSearchText}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          selectedDoctor={selectedDoctor}
          setSelectedDoctor={setSelectedDoctor}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          dateRange={dateRange}
          setDateRange={setDateRange}
          uniqueServices={uniqueServices}
          uniqueDoctors={uniqueDoctors}
          onClearFilters={clearFilters}
        />

        {/* Statistics */}
        <AppointmentStats 
          upcomingAppointments={upcomingAppointments}
          completedAppointments={completedAppointments}
        />
        
        {/* Appointments List */}
        <Card 
          bordered={false} 
          className="shadow-lg rounded-xl border-0 overflow-hidden"
          title={
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CalendarOutlined className="text-blue-600" />
                <span className="text-gray-900 font-semibold">Danh sách lịch hẹn</span>
              </div>
              <Text className="text-gray-500">
                {filteredAppointments.length} / {appointments.length} lịch hẹn
              </Text>
            </div>
          }
          bodyStyle={{ padding: '24px' }}
        >
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" />
            </div>
          ) : filteredAppointments.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="text-center">
                  <Text className="text-gray-500 text-lg block mb-2">
                    {appointments.length === 0 ? 'Chưa có lịch hẹn nào' : 'Không tìm thấy lịch hẹn phù hợp'}
                  </Text>
                  <Text className="text-gray-400">
                    {appointments.length === 0 ? 'Hãy đặt lịch hẹn đầu tiên của bạn' : 'Thử thay đổi bộ lọc để xem kết quả khác'}
                  </Text>
                </div>
              }
              className="py-12"
            >
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                size="large"
                onClick={() => navigate(PATHS.SERVICE_BOOKING)}
                className="bg-blue-500 hover:bg-blue-600 border-none rounded-xl h-12 px-6 font-semibold"
              >
                {appointments.length === 0 ? 'Đặt lịch hẹn ngay' : 'Đặt lịch hẹn mới'}
              </Button>
            </Empty>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map(appointment => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment}
                  onCancel={handleCancelAppointment}
                  getStatusTag={getStatusTag}
                  appointmentTime={dayjs.utc(appointment.appointmentTime).local()}
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AppointmentListPage;