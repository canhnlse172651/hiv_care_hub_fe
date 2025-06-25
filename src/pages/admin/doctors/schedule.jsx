import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, Typography, Spin, message, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { doctorService } from '@/services/doctorService';
import { DOCTOR_SHIFT_TIME } from '@/constant/general';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const DoctorScheduleAdminPage = () => {
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [doctorName, setDoctorName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const res = await doctorService.getDoctorSchedule(userId);
        const schedules = res.data?.data || [];
        // Optionally fetch doctor name if available in response
        if (schedules.length && schedules[0].doctorName) {
          setDoctorName(schedules[0].doctorName);
        }
        // Map schedule to calendar events
        const calendarEvents = schedules.map(item => {
          const date = dayjs(item.date).format('YYYY-MM-DD');
          let startTime = '07:00', endTime = '11:00';
          if (item.shift === 'AFTERNOON') {
            startTime = '13:00';
            endTime = '17:00';
          }
          return {
            id: item.id,
            title: `${item.shift} (${DOCTOR_SHIFT_TIME[item.shift]?.time || ''})` + (item.isOff ? ' (Off)' : ''),
            start: `${date}T${startTime}:00`,
            end: `${date}T${endTime}:00`,
            backgroundColor: item.isOff ? '#f5222d' : '#1890ff',
            borderColor: item.isOff ? '#f5222d' : '#1890ff',
            extendedProps: {
              dayOfWeek: item.dayOfWeek,
              isOff: item.isOff,
              shift: item.shift,
            },
          };
        });
        setEvents(calendarEvents);
      } catch (e) {
        message.error('Failed to fetch doctor schedule');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchSchedule();
  }, [userId]);

  return (
    <div className="p-6">
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        Back
      </Button>
      <Card>
        <Title level={3} className="mb-4">
          Doctor Schedule {doctorName ? `- ${doctorName}` : ''}
        </Title>
        {loading ? (
          <Spin />
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={events}
            height={600}
            eventContent={renderEventContent}
          />
        )}
      </Card>
    </div>
  );
};

function renderEventContent(eventInfo) {
  return (
    <div>
      <b>{eventInfo.event.title}</b>
      <div style={{ fontSize: 12 }}>
        {eventInfo.event.extendedProps.dayOfWeek}
      </div>
    </div>
  );
}

export default DoctorScheduleAdminPage; 