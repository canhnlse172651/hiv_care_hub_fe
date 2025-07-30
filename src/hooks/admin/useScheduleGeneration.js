import { useState } from 'react';
import { doctorService } from '@/services/doctorService';
import { message } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export const useScheduleGeneration = () => {
  const [generateLoading, setGenerateLoading] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);
  const [generateResult, setGenerateResult] = useState(null);

  const handleGenerateSchedule = async (values) => {
    setGenerateLoading(true);
    try {
      const payload = {
        startDate: dayjs(values.startDate).utc().format(),
        doctorsPerShift: values.doctorsPerShift,
      };
      const response = await doctorService.generateSchedule(payload);
      setGenerateResult(response);
      message.success('Schedule generated successfully');
      return true;
    } catch (error) {
      setGenerateResult(null);
      message.error('Failed to generate schedule');
      return false;
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleManualAssign = async (assignData) => {
    setManualLoading(true);
    try {
      await doctorService.manualAssign(assignData);
      message.success('Manual assignment successful');
      return true;
    } catch (error) {
      message.error('Manual assignment failed');
      return false;
    } finally {
      setManualLoading(false);
    }
  };

  const resetGenerateResult = () => setGenerateResult(null);

  return {
    generateLoading,
    generateResult,
    manualLoading,
    handleGenerateSchedule,
    handleManualAssign,
    resetGenerateResult,
  };
};