import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Card, Typography, Spin, Alert, Tag, message, Button, Modal, Row, Col, Statistic } from 'antd';
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
                const data = Array.isArray(appointmentRes.data) ? appointmentRes.data : [];
                setAppointments(data.sort((a, b) => dayjs(b.appointmentTime).diff(dayjs(a.appointmentTime))));
                console.log('Appointments for table:', data);
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
        switch (status?.toUpperCase()) {
            case 'PENDING':
                return <Tag color="gold" className="text-sm px-2 py-1">Đang chờ</Tag>;
            case 'CONFIRMED':
                return <Tag color="blue" className="text-sm px-2 py-1">Đã xác nhận</Tag>;
            case 'COMPLETED':
                return <Tag color="green" className="text-sm px-2 py-1">Đã hoàn thành</Tag>;
            case 'CANCELLED':
                return <Tag color="red" className="text-sm px-2 py-1">Đã hủy</Tag>;
            default:
                return <Tag className="text-sm px-2 py-1">{status}</Tag>;
        }
    };

    const columns = [
        {
            title: 'Dịch vụ',
            key: 'service',
            render: (_, record) => (
                <div>
                    <Text strong>{record.service?.name || 'N/A'}</Text>
                    {record.service?.description && (
                        <div className="text-xs text-gray-500 mt-1">{record.service.description}</div>
                    )}
                </div>
            ),
        },
        {
            title: 'Bác sĩ',
            key: 'doctor',
            render: (_, record) => {
                if (record.doctor) {
                    return (
                        <div>
                            <Text strong>{record.doctor.name}</Text>
                            <div className="text-xs text-gray-500">{record.doctor.email}</div>
                        </div>
                    );
                }
                return record.isAnonymous ? <Text className="text-gray-500">Tư vấn ẩn danh</Text> : 'N/A';
            }
        },
        {
            title: 'Thời gian hẹn',
            dataIndex: 'appointmentTime',
            key: 'appointmentTime',
            render: (text) => dayjs(text).format('ddd, DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Loại hình',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (
                <Tag color={type === 'ONLINE' ? 'blue' : 'green'}>
                    {type === 'ONLINE' ? 'Trực tuyến' : 'Tại phòng khám'}
                </Tag>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: getStatusTag,
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <div className="flex gap-2">
                    {['PENDING', 'CONFIRMED'].includes(record.status.toUpperCase()) && (
                        <Button
                            danger
                            size="small"
                            onClick={() => handleCancelAppointment(record.id)}
                        >
                            Hủy
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    const upcomingAppointments = appointments.filter(apt => 
        dayjs().isBefore(dayjs(apt.appointmentTime)) && 
        ['PENDING', 'CONFIRMED'].includes(apt.status.toUpperCase())
    ).length;
    const completedAppointments = appointments.filter(apt => 
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
        return <div className="p-6"><Alert message="Lỗi" description={error} type="error" showIcon /></div>;
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <Title level={2} className="text-gray-800 mb-2 md:mb-0">Lịch hẹn </Title>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={() => navigate(PATHS.SERVICE_BOOKING)}
                    >
                        Đặt lịch hẹn mới
                    </Button>
                </div>

                <Row gutter={[16, 16]} className="mb-6">
                    <Col xs={24} sm={12}>
                        <Card bordered={false} className="shadow-sm">
                            <Statistic
                                title="Lịch hẹn sắp tới"
                                value={upcomingAppointments}
                                prefix={<ClockCircleOutlined />}
                                valueStyle={{ color: '#faad14' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Card bordered={false} className="shadow-sm">
                            <Statistic
                                title="Lịch hẹn đã hoàn thành"
                                value={completedAppointments}
                                prefix={<CheckCircleOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                </Row>
                
                <Card bordered={false} className="shadow-md rounded-lg">
                    <Table
                        dataSource={appointments}
                        columns={columns}
                        rowKey="id"
                        pagination={{ pageSize: 10, hideOnSinglePage: true }}
                        scroll={{ x: 'max-content' }}
                        className="custom-table"
                    />
                </Card>
            </div>
        </div>
    );
};

export default AppointmentListPage;