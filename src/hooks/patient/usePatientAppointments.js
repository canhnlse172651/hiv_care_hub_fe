import { useState, useEffect } from 'react';
import { appointmentService } from '@/services/appointmentService';
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { confirm } = Modal;

export const usePatientAppointments = (userId) => {
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

  const fetchData = async () => {
    if (!userId) {
      setError('Không tìm thấy người dùng. Vui lòng đăng nhập.');
      setLoading(false);
      return;
    }

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

  // Calculate statistics
  const upcomingAppointments = filteredAppointments.filter(apt => 
    dayjs().isBefore(dayjs(apt.appointmentTime)) && 
    ['PENDING', 'CONFIRMED'].includes(apt.status.toUpperCase())
  ).length;

  const completedAppointments = filteredAppointments.filter(apt => 
    ['COMPLETED', 'PAID'].includes(apt.status.toUpperCase())
  ).length;

  useEffect(() => {
    fetchData();
  }, [userId]);

  return {
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
    completedAppointments,
    fetchData
  };
};
