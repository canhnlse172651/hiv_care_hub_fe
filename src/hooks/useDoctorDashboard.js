import { useState, useEffect } from 'react';
import { message } from 'antd';
import { doctorService } from '@/services/doctorService';
import { localToken } from '@/utils/auth';

export const useDoctorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    statistics: {
      totalAppointments: 0,
      completed: 0,
      waiting: 0,
      cancelled: 0
    },
    todayAppointments: [],
    completedAppointments: [],
    notifications: []
  });
  const [searchText, setSearchText] = useState('');

  // Get current doctor ID from auth
  const auth = localToken.get();
  const doctorId = auth?.user?.id;

  const fetchDashboardData = async () => {
    if (!doctorId) {
      message.error('Doctor ID not found');
      return;
    }

    setLoading(true);
    try {
      // Fetch dashboard statistics
      const dashboardResponse = await doctorService.getDoctorDashboard(doctorId);
      
      // Fetch today's appointments
      const todayResponse = await doctorService.getTodayAppointments(doctorId);
      
      // Fetch completed appointments
      const completedResponse = await doctorService.getCompletedAppointments(doctorId);

      setDashboardData({
        statistics: dashboardResponse.data?.statistics || {
          totalAppointments: 0,
          completed: 0,
          waiting: 0,
          cancelled: 0
        },
        todayAppointments: todayResponse.data?.data || [],
        completedAppointments: completedResponse.data?.data || [],
        notifications: dashboardResponse.data?.notifications || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      message.error('Failed to load dashboard data');
      
      // Fallback to mock data if API fails
      setDashboardData({
        statistics: {
          totalAppointments: 8,
          completed: 2,
          waiting: 4,
          cancelled: 2
        },
        todayAppointments: [
          {
            id: 'PT-10001',
            appointmentId: 'AP-2024060001',
            name: 'Nguyễn Văn A',
            age: 35,
            gender: 'Nam',
            checkInTime: '08:45',
            appointmentTime: '09:00',
            reason: 'Khám định kỳ HIV',
            status: 'waiting',
            priority: 'normal'
          }
        ],
        completedAppointments: [],
        notifications: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [doctorId]);

  const filteredAppointments = dashboardData.todayAppointments.filter(appointment => 
    appointment.name.toLowerCase().includes(searchText.toLowerCase()) ||
    appointment.id.toLowerCase().includes(searchText.toLowerCase()) ||
    appointment.reason.toLowerCase().includes(searchText.toLowerCase())
  );

  const refreshData = () => {
    fetchDashboardData();
  };

  return {
    loading,
    dashboardData,
    searchText,
    setSearchText,
    filteredAppointments,
    refreshData
  };
}; 