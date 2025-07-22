import { useState, useEffect } from 'react';
import { doctorService } from '@/services/doctorService';
import { message } from 'antd';
import dayjs from 'dayjs';
import { DOCTOR_SHIFT_TIME } from '@/constant/general';

export const useDoctorSchedule = (doctorId) => {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [weeklySchedule, setWeeklySchedule] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [weekRange, setWeekRange] = useState({
    startDate: dayjs().day(1), // Monday
    endDate: dayjs().day(7),   // Sunday
  });

  // Fetch doctor schedule
  const fetchSchedule = async () => {
    if (!doctorId) {
      message.error('Doctor ID not found');
      return;
    }

    setLoading(true);
    try {
      const response = await doctorService.getDoctorSchedule(doctorId);
      const schedules = response.data?.data || [];
      setScheduleData(schedules);

      // Convert to FullCalendar events format using DOCTOR_SHIFT_TIME
      const calendarEvents = schedules.map(schedule => {
        const date = dayjs(schedule.date);
        const shiftInfo = DOCTOR_SHIFT_TIME[schedule.shift] || {};
        // Default fallback if shift not found
        const startHour = shiftInfo.start ?? 8;
        const endHour = shiftInfo.end ?? 17;
        const startTime = String(startHour).padStart(2, '0') + ':00';
        const endTime = String(endHour).padStart(2, '0') + ':00';

        const startDateTime = date.format('YYYY-MM-DD') + 'T' + startTime + ':00';
        const endDateTime = date.format('YYYY-MM-DD') + 'T' + endTime + ':00';

        return {
          id: schedule.id,
          title: `${shiftInfo.label ? shiftInfo.label.toUpperCase() : schedule.shift} (${shiftInfo.time || ''})`,
          start: startDateTime,
          end: endDateTime,
          backgroundColor: '#3b82f6',
          borderColor: '#3b82f6',
          extendedProps: {
            shift: schedule.shift,
            dayOfWeek: schedule.dayOfWeek,
            isBooked: schedule.isBooked || false,
            isOff: schedule.isOff,
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

  // Fetch weekly schedule
  const fetchWeeklySchedule = async (startDate, endDate) => {
    setScheduleLoading(true);
    try {
      const res = await doctorService.getWeeklySchedule({
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
      });
      setWeeklySchedule(res.data?.data || null);
    } catch (e) {
      message.error('Không thể tải lịch làm việc tuần');
      setWeeklySchedule(null);
    } finally {
      setScheduleLoading(false);
    }
  };

  // Week navigation
  const handlePrevWeek = () => {
    setWeekRange(prev => {
      const monday = prev.startDate.subtract(7, 'day').day(1);
      const sunday = monday.add(6, 'day');
      return {
        startDate: monday,
        endDate: sunday,
      };
    });
  };

  const handleNextWeek = () => {
    setWeekRange(prev => {
      const monday = prev.startDate.add(7, 'day').day(1);
      const sunday = monday.add(6, 'day');
      return {
        startDate: monday,
        endDate: sunday,
      };
    });
  };

  const handleCurrentWeek = () => {
    const monday = dayjs().day(1);
    const sunday = monday.add(6, 'day');
    setWeekRange({
      startDate: monday,
      endDate: sunday,
    });
  };

  useEffect(() => {
    if (doctorId) {
      fetchSchedule();
    }
    // eslint-disable-next-line
  }, [doctorId]);

  useEffect(() => {
    fetchWeeklySchedule(weekRange.startDate, weekRange.endDate);
    // eslint-disable-next-line
  }, [weekRange]);

  return {
    scheduleData,
    loading,
    events,
    weeklySchedule,
    scheduleLoading,
    weekRange,
    fetchSchedule,
    fetchWeeklySchedule,
    handlePrevWeek,
    handleNextWeek,
    handleCurrentWeek
  };
};