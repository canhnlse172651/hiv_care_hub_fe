import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Spin, Alert, Tag, message, Button, Modal, Row, Col, Statistic, Avatar, Empty, Divider, Input, Select, DatePicker } from 'antd';
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, PlusOutlined, UserOutlined, MedicineBoxOutlined, PhoneOutlined, VideoCameraOutlined, SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { appointmentService } from '@/services/appointmentService';
import { localToken } from '@/utils/token';
import { PATHS } from '@/constant/path';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

dayjs.locale('vi');

const { Title, Text } = Typography;
const { confirm } = Modal;

const AppointmentListPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filter states
    const [searchText, setSearchText] = useState('');
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [dateRange, setDateRange] = useState(null);
    
    const navigate = useNavigate();

    const auth = localToken.get();
    const userId = auth?.user?.id;

    useEffect(() => {
        if (!userId) {
            setError('Không tìm thấy người dùng. Vui lòng đăng nhập.');
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const appointmentRes = await appointmentService.getAppointmentsByUserId(userId);
                console.log('API raw response:', appointmentRes.data);
                const appointmentsData = appointmentRes.data?.data || [];
                const data = Array.isArray(appointmentsData) ? appointmentsData : [];
                const sortedData = data.sort((a, b) => dayjs(b.appointmentTime).diff(dayjs(a.appointmentTime)));
                setAppointments(sortedData);
                setFilteredAppointments(sortedData);
                console.log('Appointments for table:', sortedData);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Tải lịch hẹn thất bại. Vui lòng thử lại sau.');
                message.error('Tải lịch hẹn thất bại.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    // Filter appointments based on search criteria
    useEffect(() => {
        let filtered = [...appointments];

        // Search text filter
        if (searchText) {
            filtered = filtered.filter(appointment =>
                appointment.service?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                appointment.doctor?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                appointment.id?.toString().includes(searchText)
            );
        }

        // Service filter
        if (selectedService) {
            filtered = filtered.filter(appointment =>
                appointment.service?.name === selectedService
            );
        }

        // Doctor filter
        if (selectedDoctor) {
            filtered = filtered.filter(appointment =>
                appointment.doctor?.name === selectedDoctor
            );
        }

        // Status filter
        if (selectedStatus) {
            filtered = filtered.filter(appointment =>
                appointment.status?.toUpperCase() === selectedStatus
            );
        }

        // Type filter
        if (selectedType) {
            filtered = filtered.filter(appointment =>
                appointment.type === selectedType
            );
        }

        // Date range filter
        if (dateRange && dateRange[0] && dateRange[1]) {
            filtered = filtered.filter(appointment => {
                const appointmentDate = dayjs(appointment.appointmentTime);
                return appointmentDate.isAfter(dateRange[0]) && appointmentDate.isBefore(dateRange[1]);
            });
        }

        setFilteredAppointments(filtered);
    }, [appointments, searchText, selectedService, selectedDoctor, selectedStatus, selectedType, dateRange]);

    // Clear all filters
    const clearFilters = () => {
        setSearchText('');
        setSelectedService(null);
        setSelectedDoctor(null);
        setSelectedStatus(null);
        setSelectedType(null);
        setDateRange(null);
    };

    // Get unique services for filter dropdown
    const uniqueServices = [...new Set(appointments.map(apt => apt.service?.name).filter(Boolean))];
    
    // Get unique doctors for filter dropdown
    const uniqueDoctors = [...new Set(appointments.map(apt => apt.doctor?.name).filter(Boolean))];

    const handleCancelAppointment = async (appointmentId) => {
        confirm({
            title: 'Bạn có chắc chắn muốn hủy lịch hẹn này không?',
            icon: <ExclamationCircleOutlined />,
            content: 'Hành động này không thể hoàn tác.',
            okText: 'Có, hủy lịch',
            okType: 'danger',
            cancelText: 'Không',
            onOk: async () => {
                try {
                    await appointmentService.updateAppointmentStatus(appointmentId, { status: 'CANCELLED' });
                    message.success('Hủy lịch hẹn thành công!');
                    setAppointments(prev => prev.map(apt =>
                        apt.id === appointmentId ? { ...apt, status: 'CANCELLED' } : apt
                    ));
                } catch (error) {
                    message.error('Hủy lịch hẹn thất bại.');
                    console.error('Cancel appointment error:', error);
                }
            },
        });
    };

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

    const AppointmentCard = ({ appointment }) => (
        <Card 
            className="mb-4 shadow-md hover:shadow-lg transition-all duration-300 border-0 rounded-xl overflow-hidden"
            bodyStyle={{ padding: 0 }}
        >
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <MedicineBoxOutlined className="text-blue-600 text-xl" />
                        </div>
                        <div>
                            <Title level={5} className="mb-1 text-gray-900">
                                {appointment.service?.name || 'N/A'}
                            </Title>
                            <Text className="text-gray-500 text-sm">
                                {appointment.service?.description}
                            </Text>
                        </div>
                    </div>
                    {getStatusTag(appointment.status)}
                </div>

                <Divider className="my-4" />

                {/* Content */}
                <Row gutter={[16, 16]}>
                    {/* Date & Time */}
                    <Col xs={24} sm={12}>
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <CalendarOutlined className="text-green-600" />
                            </div>
                            <div>
                                <Text className="text-xs text-gray-500 block">Thời gian</Text>
                                <Text strong className="text-gray-900">
                                    {dayjs(appointment.appointmentTime).format('ddd, DD/MM/YYYY')}
                                </Text>
                                <Text className="text-gray-600 block text-sm">
                                    {dayjs(appointment.appointmentTime).format('HH:mm')}
                                </Text>
                            </div>
                        </div>
                    </Col>

                    {/* Doctor */}
                    <Col xs={24} sm={12}>
                        <div className="flex items-center space-x-3">
                            <Avatar 
                                size={40} 
                                icon={<UserOutlined />}
                                className="bg-purple-100 text-purple-600"
                            />
                            <div>
                                <Text className="text-xs text-gray-500 block">Bác sĩ</Text>
                                {appointment.doctor ? (
                                    <>
                                        <Text strong className="text-gray-900 block">
                                            {appointment.doctor.name}
                                        </Text>
                                        <Text className="text-gray-600 text-sm">
                                            {appointment.doctor.email}
                                        </Text>
                                    </>
                                ) : (
                                    <Text className="text-gray-500">
                                        {appointment.isAnonymous ? 'Tư vấn ẩn danh' : 'N/A'}
                                    </Text>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Appointment Type */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {appointment.type === 'ONLINE' ? (
                            <VideoCameraOutlined className="text-blue-600" />
                        ) : (
                            <PhoneOutlined className="text-green-600" />
                        )}
                        <Text className="font-medium">
                            {appointment.type === 'ONLINE' ? 'Tư vấn trực tuyến' : 'Khám tại phòng khám'}
                        </Text>
                    </div>
                    <Tag 
                        color={appointment.type === 'ONLINE' ? 'blue' : 'green'} 
                        className="rounded-full"
                    >
                        {appointment.type === 'ONLINE' ? 'Online' : 'Offline'}
                    </Tag>
                </div>

                {/* Actions */}
                {['PENDING', 'CONFIRMED'].includes(appointment.status.toUpperCase()) && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <Button
                            danger
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="rounded-lg"
                        >
                            Hủy lịch hẹn
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );

    const upcomingAppointments = filteredAppointments.filter(apt => 
        dayjs().isBefore(dayjs(apt.appointmentTime)) && 
        ['PENDING', 'CONFIRMED'].includes(apt.status.toUpperCase())
    ).length;
    const completedAppointments = filteredAppointments.filter(apt => 
        ['COMPLETED', 'PAID'].includes(apt.status.toUpperCase())
    ).length;
    
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        )
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
                <Card 
                    className="shadow-lg rounded-xl border-0 overflow-hidden mb-8"
                    title={
                        <div className="flex items-center space-x-2">
                            <FilterOutlined className="text-blue-600" />
                            <span className="text-gray-900 font-semibold">Tìm kiếm và lọc</span>
                        </div>
                    }
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                        {/* Search Text */}
                        <div>
                            <Text strong className="block mb-2 text-gray-700">Tìm kiếm</Text>
                            <Input
                                placeholder="Tìm theo dịch vụ, bác sĩ..."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                allowClear
                                className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500"
                            />
                        </div>

                        {/* Service Filter */}
                        <div>
                            <Text strong className="block mb-2 text-gray-700">Dịch vụ</Text>
                            <Select
                                placeholder="Chọn dịch vụ"
                                value={selectedService}
                                onChange={setSelectedService}
                                allowClear
                                style={{ width: '100%' }}
                                className="rounded-lg"
                            >
                                {uniqueServices.map(service => (
                                    <Select.Option key={service} value={service}>
                                        {service}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>

                        {/* Doctor Filter */}
                        <div>
                            <Text strong className="block mb-2 text-gray-700">Bác sĩ</Text>
                            <Select
                                placeholder="Chọn bác sĩ"
                                value={selectedDoctor}
                                onChange={setSelectedDoctor}
                                allowClear
                                style={{ width: '100%' }}
                                className="rounded-lg"
                            >
                                {uniqueDoctors.map(doctor => (
                                    <Select.Option key={doctor} value={doctor}>
                                        {doctor}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <Text strong className="block mb-2 text-gray-700">Trạng thái</Text>
                            <Select
                                placeholder="Chọn trạng thái"
                                value={selectedStatus}
                                onChange={setSelectedStatus}
                                allowClear
                                style={{ width: '100%' }}
                                className="rounded-lg"
                            >
                                <Select.Option value="PENDING">Đang chuẩn bị</Select.Option>
                                <Select.Option value="CONFIRMED">Đã xác nhận</Select.Option>
                                <Select.Option value="COMPLETED">Đã hoàn thành</Select.Option>
                                <Select.Option value="PAID">Đã thanh toán</Select.Option>
                                <Select.Option value="CANCELLED">Đã hủy</Select.Option>
                            </Select>
                        </div>

                        {/* Type Filter */}
                        <div>
                            <Text strong className="block mb-2 text-gray-700">Loại khám</Text>
                            <Select
                                placeholder="Chọn loại"
                                value={selectedType}
                                onChange={setSelectedType}
                                allowClear
                                style={{ width: '100%' }}
                                className="rounded-lg"
                            >
                                <Select.Option value="ONLINE">Trực tuyến</Select.Option>
                                <Select.Option value="OFFLINE">Tại phòng khám</Select.Option>
                            </Select>
                        </div>

                        {/* Date Range Filter */}
                        <div>
                            <Text strong className="block mb-2 text-gray-700">Thời gian</Text>
                            <DatePicker.RangePicker
                                value={dateRange}
                                onChange={setDateRange}
                                format="DD/MM/YYYY"
                                placeholder={['Từ ngày', 'Đến ngày']}
                                style={{ width: '100%' }}
                                className="rounded-lg border-gray-200 hover:border-blue-400"
                            />
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    <div className="mt-4 flex justify-end">
                        <Button 
                            onClick={clearFilters}
                            icon={<ClearOutlined />}
                            className="rounded-lg border-gray-300 hover:border-blue-400 hover:text-blue-600"
                        >
                            Xóa bộ lọc
                        </Button>
                    </div>
                </Card>

                {/* Statistics */}
                <Row gutter={[24, 24]} className="mb-8">
                    <Col xs={24} sm={12}>
                        <Card 
                            bordered={false} 
                            className="shadow-lg rounded-xl border-0 overflow-hidden"
                            bodyStyle={{ padding: '24px' }}
                        >
                            <Statistic
                                title={<span className="text-gray-600 font-medium">Lịch hẹn sắp tới</span>}
                                value={upcomingAppointments}
                                prefix={<ClockCircleOutlined className="text-orange-500" />}
                                valueStyle={{ color: '#f59e0b', fontSize: '32px', fontWeight: 'bold' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Card 
                            bordered={false} 
                            className="shadow-lg rounded-xl border-0 overflow-hidden"
                            bodyStyle={{ padding: '24px' }}
                        >
                            <Statistic
                                title={<span className="text-gray-600 font-medium">Đã hoàn thành</span>}
                                value={completedAppointments}
                                prefix={<CheckCircleOutlined className="text-green-500" />}
                                valueStyle={{ color: '#10b981', fontSize: '32px', fontWeight: 'bold' }}
                            />
                        </Card>
                    </Col>
                </Row>
                
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
                                <AppointmentCard key={appointment.id} appointment={appointment} />
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default AppointmentListPage;