import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Card, Typography, Spin, Alert, Tag, message, Button, Modal, Row, Col, Statistic } from 'antd';
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { patientService } from '@/services/patientService';
import { servicesService } from '@/services/servicesService';
import { doctorService } from '@/services/doctorService';
import { localToken } from '@/utils/auth';
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
    const [services, setServices] = useState({});
    const [doctors, setDoctors] = useState({});
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
                const [appointmentRes, serviceRes, doctorRes] = await Promise.all([
                    patientService.getAppointmentsByUserId(userId),
                    servicesService.getPublicServices({ limit: 1000 }),
                    doctorService.getDoctors({ limit: 1000 })
                ]);

                if (appointmentRes.data?.data) {
                    setAppointments(appointmentRes.data.data.sort((a, b) => dayjs(b.appointmentTime).diff(dayjs(a.appointmentTime))));
                }

                if (serviceRes.data?.data?.data) {
                    const serviceMap = serviceRes.data.data.data.reduce((acc, service) => {
                        acc[service.id] = service.name;
                        return acc;
                    }, {});
                    setServices(serviceMap);
                }

                if (doctorRes.data?.data?.data) {
                    const doctorMap = doctorRes.data.data.data.reduce((acc, doctor) => {
                        acc[doctor.id] = {
                            name: doctor.user.name,
                            specialization: doctor.specialization
                        };
                        return acc;
                    }, {});
                    setDoctors(doctorMap);
                }

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
                    await patientService.cancelAppointment(appointmentId);
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
            dataIndex: 'serviceId',
            key: 'service',
            render: (serviceId) => <Text strong>{services[serviceId] || `Mã dịch vụ: ${serviceId}`}</Text>,
        },
        {
            title: 'Bác sĩ',
            dataIndex: 'doctorId',
            key: 'doctor',
            render: (doctorId) => {
                const doctor = doctors[doctorId];
                if (doctor) {
                    return (
                        <div>
                            <Text strong>{doctor.name}</Text>
                            <div className="text-xs text-gray-500">{doctor.specialization}</div>
                        </div>
                    )
                }
                return `Mã bác sĩ: ${doctorId}`;
            }
        },
        {
            title: 'Thời gian hẹn',
            dataIndex: 'appointmentTime',
            key: 'appointmentTime',
            render: (text) => dayjs(text).format('ddd, DD/MM/YYYY HH:mm'),
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
                    {record.status.toUpperCase() === 'PENDING' && (
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

    const upcomingAppointments = appointments.filter(apt => dayjs().isBefore(dayjs(apt.appointmentTime)) && apt.status.toUpperCase() === 'PENDING').length;
    const completedAppointments = appointments.filter(apt => apt.status.toUpperCase() === 'COMPLETED').length;
    
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