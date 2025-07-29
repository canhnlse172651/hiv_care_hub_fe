import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, Empty, Card, Typography, Row, Col, Avatar, Tooltip, Space, Tag, Button } from "antd";
import { CalendarOutlined, UserOutlined, ClockCircleOutlined, CheckOutlined, ExclamationOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useNavigate, Link } from 'react-router-dom';
import dayjs from "dayjs";
import { ensureDoctorId } from '@/utils/doctorId';

// Import components and hooks from new location
import { StatisticCard, FilterPanel } from '@/components/doctor/appointments';
import { useDoctorAppointments } from '@/hooks/doctor';

const { Title, Text } = Typography;

const AppointmentDoctorPage = () => {
  const [doctorId, setDoctorId] = useState(undefined); // undefined = loading, null = not found
  const navigate = useNavigate();

  useEffect(() => {
    ensureDoctorId().then(id => setDoctorId(id));
  }, []);

  const {
    appointments: rawAppointments,
    allAppointments: rawAllAppointments,
    services,
    loading,
    servicesLoading,
    error,
    searchText,
    setSearchText,
    selectedDate,
    setSelectedDate,
    selectedService,
    setSelectedService,
    selectedStatus,
    setSelectedStatus,
    selectedType,
    setSelectedType,
    pagination,
    clearFilters,
    handleTableChange
  } = useDoctorAppointments(doctorId);

  // Filter and sort appointments for table
  const allowedStatuses = ['PENDING', 'PAID', 'COMPLETED'];
  const appointments = (rawAppointments || [])
    .filter(apt => allowedStatuses.includes((apt.status || '').toUpperCase()))
    .sort((a, b) => dayjs(a.appointmentTime).valueOf() - dayjs(b.appointmentTime).valueOf());
  const allAppointments = (rawAllAppointments || [])
    .filter(apt => allowedStatuses.includes((apt.status || '').toUpperCase()));

  const getStatusTag = (status, type) => {
    const statusConfig = {
      'PENDING': { color: 'gold', text: 'Đang chờ xác nhận', icon: <ClockCircleOutlined />, bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' },
      'PAID': { color: 'cyan', text: 'Đã thanh toán', icon: <CheckOutlined />, bgColor: 'bg-cyan-50', textColor: 'text-cyan-700' },
      'CONFIRMED': { color: 'blue', text: 'Đã xác nhận', icon: <CheckOutlined />, bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
      'COMPLETED': { color: 'green', text: 'Hoàn thành', icon: <CheckOutlined />, bgColor: 'bg-green-50', textColor: 'text-green-700' },
      'CANCELLED': { color: 'red', text: 'Đã hủy', icon: <ExclamationOutlined />, bgColor: 'bg-red-50', textColor: 'text-red-700' }
    };

    const typeConfig = {
      'OFFLINE': { color: 'orange', text: 'Tại phòng khám', bgColor: 'bg-orange-50', textColor: 'text-orange-700' },
      'ONLINE': { color: 'purple', text: 'Trực tuyến', bgColor: 'bg-purple-50', textColor: 'text-purple-700' }
    };

    const statusInfo = statusConfig[status] || { color: 'default', text: status, icon: null };
    const typeInfo = typeConfig[type] || { color: 'default', text: type };

    return (
      <Space direction="vertical" size="small">
        <Tag color={statusInfo.color} className="rounded-full px-3 py-1 font-medium">
          {statusInfo.icon} {statusInfo.text}
        </Tag>
        <Tag color={typeInfo.color} className="rounded-full px-3 py-1 font-medium">
          {typeInfo.text}
        </Tag>
      </Space>
    );
  };

  const formatAppointmentTime = (appointmentTime) => {
    return dayjs.utc(appointmentTime).format('HH:mm DD/MM/YYYY');
  };

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
      title: 'Bệnh nhân',
      key: 'patient',
      width: 250,
      render: (_, record) => (
        <Link 
          to={`/doctor/medical-records/${record.user?.id}`}
          className="flex items-center space-x-3 hover:bg-blue-50 rounded-lg p-2 -m-2 transition-colors duration-200"
        >
          <Avatar
            src={record.user?.avatar}
            icon={<UserOutlined />}
            size={48}
            className="bg-gradient-to-r from-blue-400 to-blue-600 shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200"
          />
          <div>
            <div className="font-semibold text-gray-900 text-base hover:text-blue-600 transition-colors duration-200">
              {record.user?.name || 'Không có tên'}
            </div>
            <div className="text-gray-500 text-sm">
              {record.user?.email || 'Không có email'}
            </div>
            {record.user?.phoneNumber && (
              <div className="text-gray-400 text-xs">
                {record.user.phoneNumber}
              </div>
            )}
          </div>
        </Link>
      ),
    },
    {
      title: 'Dịch vụ',
      key: 'service',
      width: 200,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="font-semibold text-gray-900">
            {record.service?.name || 'Không có tên dịch vụ'}
          </div>
          <div className="text-green-600 font-medium text-sm">
            {record.service?.price ? `${parseInt(record.service.price).toLocaleString()} VNĐ` : 'Liên hệ'}
          </div>
          {record.service?.description && (
            <div className="text-gray-500 text-xs line-clamp-2">
              {record.service.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Thời gian hẹn',
      key: 'appointmentTime',
      width: 180,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <CalendarOutlined className="text-blue-500" />
            <span className="font-semibold text-gray-900">
              {dayjs.utc(record.appointmentTime).format('DD/MM/YYYY')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <ClockCircleOutlined className="text-orange-500" />
            <span className="text-gray-700">
              {dayjs.utc(record.appointmentTime).format('HH:mm')}
            </span>
          </div>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 140,
      render: (_, record) => getStatusTag(record.status, record.type)
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      width: 180,
      render: (text) => (
        <Tooltip title={text || 'Không có ghi chú'}>
          <div className="text-gray-600 text-sm line-clamp-2">
            {text || <span className="text-gray-400 italic">Không có ghi chú</span>}
          </div>
        </Tooltip>
      ),
      ellipsis: true,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (text) => (
        <div className="text-gray-600 text-sm">
          {text ? dayjs.utc(text).format('DD/MM/YYYY') : '-'}
        </div>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          {/* Only show "Khám ngay" for PAID appointments */}
          {record.status && record.status.toUpperCase() === 'PAID' && (
            <Button
              type="primary"
              size="small"
              icon={<InfoCircleOutlined />}
              onClick={() => navigate(`/doctor/consultation/${record.id}`)}
              className="bg-blue-500 hover:bg-blue-600 border-none rounded-lg font-medium"
            >
              Khám ngay
            </Button>
          )}
          {record.status && record.status.toUpperCase() === 'COMPLETED' && (
            <Button
              size="small"
              icon={<InfoCircleOutlined />}
              onClick={() => navigate(`/doctor/consultation/${record.id}`)}
              className="border-gray-300 rounded-lg hover:border-blue-400 hover:text-blue-600"
            >
              Xem chi tiết
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Only render conditionally, do not skip hooks!
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center items-center">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4 text-gray-600 text-lg">Đang tải lịch hẹn...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center items-center p-6">
        <Alert type="error" message="Có lỗi xảy ra" description={error} className="max-w-md shadow-lg rounded-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Statistics Cards */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="Tổng lịch hẹn"
              value={allAppointments.length}
              icon={<CalendarOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="Đang chờ"
              value={allAppointments.filter(apt => apt.status === 'PENDING').length}
              icon={<ClockCircleOutlined />}
              color="#f59e0b"
              bgGradient="from-yellow-50 to-yellow-100"
              iconBgColor="bg-yellow-100"
              iconColor="text-yellow-600"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="Hoàn thành"
              value={allAppointments.filter(apt => apt.status === 'COMPLETED').length}
              icon={<CheckOutlined />}
              color="#10b981"
              bgGradient="from-green-50 to-green-100"
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="Đã hủy"
              value={allAppointments.filter(apt => apt.status === 'CANCELLED').length}
              icon={<ExclamationOutlined />}
              color="#ef4444"
              bgGradient="from-red-50 to-red-100"
              iconBgColor="bg-red-100"
              iconColor="text-red-600"
            />
          </Col>
        </Row>

        {/* Main Content Card */}
        <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
          {/* Filters */}
          <FilterPanel
            searchText={searchText}
            onSearchChange={setSearchText}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            selectedService={selectedService}
            onServiceChange={setSelectedService}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            services={services}
            servicesLoading={servicesLoading}
            onClearFilters={clearFilters}
            // Only allow PENDING, PAID, COMPLETED in status filter
            statusOptions={[
              { value: 'PENDING', label: 'Đang chờ xác nhận' },
              { value: 'PAID', label: 'Đã thanh toán' },
              { value: 'COMPLETED', label: 'Hoàn thành' }
            ]}
          />

          {/* Table Section */}
          <div className="p-6">
            <Table
              columns={columns}
              dataSource={appointments}
              rowKey="id"
              pagination={{
                ...pagination,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} lịch hẹn`,
                pageSizeOptions: ['10', '20', '50', '100'],
              }}
              onChange={handleTableChange}
              scroll={{ x: 'max-content' }}
              locale={{
                emptyText: (
                  <Empty
                    description={
                      <div className="text-center py-8">
                        <CalendarOutlined className="text-6xl text-gray-300 mb-4" />
                        <div className="text-gray-500 text-lg mb-2">Không có lịch hẹn nào</div>
                        <div className="text-gray-400">Lịch hẹn sẽ xuất hiện tại đây khi có bệnh nhân đặt lịch</div>
                      </div>
                    }
                    image={null}
                    className="py-12"
                  />
                ),
              }}
              rowClassName="hover:bg-blue-50 transition-colors duration-200"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentDoctorPage;