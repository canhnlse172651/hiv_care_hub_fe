import { useState, useEffect } from 'react';
import { message } from 'antd';
import { doctorService } from '@/services/doctorService';
import { localToken } from '@/utils/auth';
import dayjs from 'dayjs';

export const useDoctorSchedule = () => {
  const [loading, setLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Get current doctor ID from auth
  const auth = localToken.get();
  const doctorId = auth?.user?.id;

  const fetchSchedule = async () => {
    if (!doctorId) {
      message.error('Doctor ID not found');
      return;
    }

    setLoading(true);
    try {
      const response = await doctorService.getDoctorSchedule(doctorId);
      console.log('Schedule API Response:', response.data);
      
      const schedules = response.data?.data || [];
      setScheduleData(schedules);
      
      // Convert to FullCalendar events format
      const calendarEvents = schedules.map(schedule => {
        const date = dayjs(schedule.date);
        let startTime, endTime;
        
        switch (schedule.shift) {
          case 'MORNING':
            startTime = '07:00';
            endTime = '12:00';
            break;
          case 'AFTERNOON':
            startTime = '12:00';
            endTime = '17:00';
            break;
          default:
            startTime = '07:00';
            endTime = '17:00';
        }

        const startDateTime = date.format('YYYY-MM-DD') + 'T' + startTime + ':00';
        const endDateTime = date.format('YYYY-MM-DD') + 'T' + endTime + ':00';

        return {
          id: schedule.id,
          title: `${schedule.shift} Shift`,
          start: startDateTime,
          end: endDateTime,
          backgroundColor: '#1890ff',
          borderColor: '#1890ff',
          extendedProps: {
            shift: schedule.shift,
            dayOfWeek: schedule.dayOfWeek,
            isBooked: schedule.isBooked || false
          }
        };
      });
      
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      message.error('Failed to fetch schedule');
      setScheduleData([]);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const createSchedule = async (scheduleData) => {
    setLoading(true);
    try {
      const response = await doctorService.createSchedule(scheduleData);
      message.success('Schedule created successfully!');
      await fetchSchedule(); // Refresh the list
      return response.data;
    } catch (error) {
      console.error('Error creating schedule:', error);
      message.error('Failed to create schedule');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (scheduleId, scheduleData) => {
    setLoading(true);
    try {
      const response = await doctorService.updateSchedule(scheduleId, scheduleData);
      message.success('Schedule updated successfully!');
      await fetchSchedule(); // Refresh the list
      return response.data;
    } catch (error) {
      console.error('Error updating schedule:', error);
      message.error('Failed to update schedule');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (scheduleId) => {
    setLoading(true);
    try {
      await doctorService.deleteSchedule(scheduleId);
      message.success('Schedule deleted successfully!');
      await fetchSchedule(); // Refresh the list
    } catch (error) {
      console.error('Error deleting schedule:', error);
      message.error('Failed to delete schedule');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (info) => {
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      shift: info.event.extendedProps.shift
    });
  };

  const handleDateSelect = (selectInfo) => {
    setSelectedEvent({
      start: selectInfo.start,
      end: selectInfo.end,
      title: 'New Shift'
    });
  };

  const clearSelectedEvent = () => {
    setSelectedEvent(null);
  };

  useEffect(() => {
    fetchSchedule();
  }, [doctorId]);

  return {
    loading,
    scheduleData,
    events,
    selectedEvent,
    fetchSchedule,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    handleEventClick,
    handleDateSelect,
    clearSelectedEvent
  };
}; 