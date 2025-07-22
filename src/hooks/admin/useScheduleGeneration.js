import { useState } from 'react';
import { doctorService } from '@/services/doctorService';
import { message } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export const useScheduleGeneration = () => {
  const [loading, setLoading] = useState(false);

  const generateSchedule = async (doctorId, date) => {
    setLoading(true);
    try {
      const response = await doctorService.generateSchedule(doctorId, dayjs(date).utc().format());
      message.success('Schedule generated successfully');
      return response;
    } catch (error) {
      message.error('Failed to generate schedule');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    generateSchedule,
  };
};