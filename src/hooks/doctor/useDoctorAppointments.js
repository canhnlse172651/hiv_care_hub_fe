import { useState, useEffect } from 'react';
import { appointmentService } from '@/services/appointmentService';
import { servicesService } from '@/services/servicesService';
import { message } from 'antd';
import dayjs from 'dayjs';

export const useDoctorAppointments = (doctorId) => {
  const [appointments, setAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters state
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Fetch services for dropdown
  const fetchServices = async () => {
    setServicesLoading(true);
    try {
      const response = await servicesService.getAllServices();
      setServices(response.data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setServicesLoading(false);
    }
  };

  // Fetch appointments for the current doctor
  const fetchAppointments = async () => {
    if (!doctorId) {
      message.error('Không thể xác định thông tin bác sĩ');
      setAppointments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Pass limit: 1000 if supported by your API/service
      const response = await appointmentService.getAppointmentsByDoctorId(doctorId, { limit: 1000 });
      const appointmentsData = response.data?.data || [];
      setAllAppointments(appointmentsData);
      setPagination(prev => ({ ...prev, total: appointmentsData.length }));
      applyFilters(appointmentsData);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      if (err?.response?.status === 404) {
        setAllAppointments([]);
        setAppointments([]);
      } else {
        setError("Không thể tải danh sách lịch hẹn.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to appointments
  const applyFilters = (data = allAppointments) => {
    let filteredData = [...data];

    // Search text filter
    if (searchText) {
      filteredData = filteredData.filter(appointment =>
        appointment.user?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        appointment.service?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        appointment.id?.toString().includes(searchText) ||
        appointment.user?.email?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Date filter
    if (selectedDate) {
      const selectedDateStr = selectedDate.format('YYYY-MM-DD');
      filteredData = filteredData.filter(appointment =>
        dayjs(appointment.appointmentTime).format('YYYY-MM-DD') === selectedDateStr
      );
    }

    // Service filter
    if (selectedService) {
      filteredData = filteredData.filter(appointment =>
        appointment.serviceId === selectedService
      );
    }

    // Status filter
    if (selectedStatus) {
      filteredData = filteredData.filter(appointment =>
        appointment.status === selectedStatus
      );
    }

    // Type filter
    if (selectedType) {
      filteredData = filteredData.filter(appointment =>
        appointment.type === selectedType
      );
    }

    setAppointments(filteredData);
    setPagination(prev => ({ ...prev, total: filteredData.length, current: 1 }));
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchText("");
    setSelectedDate(null);
    setSelectedService(null);
    setSelectedStatus(null);
    setSelectedType(null);
    setAppointments(allAppointments);
    setPagination(prev => ({ ...prev, total: allAppointments.length, current: 1 }));
  };

  // Handle pagination change
  const handleTableChange = (paginationInfo) => {
    setPagination(prev => ({
      ...prev,
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize,
    }));
  };

  useEffect(() => {
    if (doctorId) {
      fetchAppointments();
      fetchServices();
    }
    // eslint-disable-next-line
  }, [doctorId]);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line
  }, [searchText, selectedDate, selectedService, selectedStatus, selectedType]);

  return {
    appointments,
    allAppointments,
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
    handleTableChange,
    fetchAppointments
  };
};
