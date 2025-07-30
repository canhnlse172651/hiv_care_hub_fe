import { useState, useEffect } from 'react';
import { appointmentService } from '@/services/appointmentService';
import { message } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const useDoctorDashboard = (doctorId) => {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [statistics, setStatistics] = useState({
    totalAppointments: 0,
    completed: 0,
    waiting: 0,
    cancelled: 0
  });
  const [searchText, setSearchText] = useState('');

  const todayDate = dayjs().utc().format('YYYY-MM-DD');

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

      // Show all today's appointments, not just pending/offline
      setAllAppointments(allAppointmentsData);
      setAppointments(todayAppointments);

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

  // Get shift appointments count
  const getShiftAppointments = (startHour, endHour) => {
    return allAppointments.filter(apt => {
      const hour = dayjs.utc(apt.appointmentTime).hour();
      const date = dayjs.utc(apt.appointmentTime).format('YYYY-MM-DD');
      return hour >= startHour && hour < endHour && date === todayDate;
    }).length;
  };

  useEffect(() => {
    if (doctorId) {
      fetchAppointments();
    }
  }, [doctorId]);

  return {
    loading,
    appointments,
    allAppointments,
    statistics,
    searchText,
    setSearchText,
    filteredAppointments,
    todayCompletedAppointments,
    getShiftAppointments,
    fetchAppointments
  };
};