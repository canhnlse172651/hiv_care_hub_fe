import React, { useState, useEffect } from 'react';
import { Alert, Spin } from 'antd';
import { ensureDoctorId } from '@/utils/doctorId';
import { useDoctorSchedule } from '@/hooks/admin';
import { ScheduleCalendar } from '@/components/admin/doctors';

const DoctorSchedulePage = () => {
  const [doctorId, setDoctorId] = useState(undefined); // undefined = loading, null = not found

  useEffect(() => {
    ensureDoctorId().then(id => setDoctorId(id));
  }, []);

  const {
    events,
    loading,
    fetchSchedule
  } = useDoctorSchedule(doctorId);

  // Handle clicking on an event in the calendar
  const handleEventClick = (info) => {
    console.log('Event clicked:', info.event);
  };

  // Handle selecting a date/time slot in the calendar
  const handleDateSelect = (selectInfo) => {
    console.log('Date selected:', selectInfo);
  };

  // Handle event update/create
  const handleEventUpdate = async (event, values) => {
    console.log('Event update:', event, values);
    // Implement create/update logic here
    fetchSchedule();
  };

  // Handle delete event
  const handleEventDelete = async (event) => {
    console.log('Event delete:', event);
    // Implement delete logic here
    fetchSchedule();
  };

  // Only render conditionally, do not skip hooks!
  if (doctorId === undefined) {
    return <Spin className="flex justify-center items-center min-h-screen" size="large" />;
  }
  if (!doctorId) {
    return <Alert message="Doctor ID not found" type="error" showIcon className="m-8" />;
  }

  return (
    <ScheduleCalendar
      events={events}
      loading={loading}
      onEventClick={handleEventClick}
      onDateSelect={handleDateSelect}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
    />
  );
};

export default DoctorSchedulePage;