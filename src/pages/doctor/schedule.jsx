import React, { useState, useEffect } from 'react';
import { 
  Card, Typography, Button, Modal, Form, Input, 
  TimePicker, message, Radio, Divider, Tooltip, 
  DatePicker, Spin, Badge, Select
} from 'antd';
import { 
  PlusOutlined, CalendarOutlined, 
  ClockCircleOutlined, UserOutlined,
  ScheduleOutlined, TeamOutlined,
  EditOutlined, DeleteOutlined
} from '@ant-design/icons';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayjs from 'dayjs';
import { doctorService } from '@/services/doctorService';
import { localToken } from '@/utils/token';

const { Title, Text } = Typography;
const { Option } = Select;

const DoctorSchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form] = Form.useForm();
  
  // Get current doctor ID from auth
  const auth = localToken.get();
  const doctorId = auth?.user?.id;

  // Fetch doctor schedule
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
            startTime = '08:00';
            endTime = '12:00';
            break;
          case 'AFTERNOON':
            startTime = '13:00';
            endTime = '17:00';
            break;
          case 'EVENING':
            startTime = '17:00';
            endTime = '21:00';
            break;
          default:
            startTime = '08:00';
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

  useEffect(() => {
    fetchSchedule();
  }, [doctorId]);

  const handleEventClick = (info) => {
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      shift: info.event.extendedProps.shift
    });
    setEventModalVisible(true);
  };

  const handleDateSelect = (selectInfo) => {
    setSelectedEvent({
      start: selectInfo.start,
      end: selectInfo.end,
      title: 'New Shift'
    });
    setEventModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      setLoading(true);
      
      // Simulate API call to create/update schedule
      setTimeout(() => {
        const newEvent = {
          id: selectedEvent.id || Date.now().toString(),
          title: values.shift + ' Shift',
          start: values.date.format('YYYY-MM-DD') + 'T' + values.startTime.format('HH:mm') + ':00',
          end: values.date.format('YYYY-MM-DD') + 'T' + values.endTime.format('HH:mm') + ':00',
          backgroundColor: '#1890ff',
          borderColor: '#1890ff',
          extendedProps: {
            shift: values.shift,
            dayOfWeek: values.date.format('dddd'),
            isBooked: false
          }
        };

        if (selectedEvent.id) {
          // Update existing event
          setEvents(prev => prev.map(event => 
            event.id === selectedEvent.id ? newEvent : event
          ));
          message.success('Schedule updated successfully!');
        } else {
          // Add new event
          setEvents(prev => [...prev, newEvent]);
          message.success('Schedule created successfully!');
        }

        setEventModalVisible(false);
        form.resetFields();
        setLoading(false);
      }, 1000);
    });
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent?.id) return;
    
    setLoading(true);
    setTimeout(() => {
      setEvents(prev => prev.filter(event => event.id !== selectedEvent.id));
      setEventModalVisible(false);
      form.resetFields();
      message.success('Schedule deleted successfully!');
      setLoading(false);
    }, 500);
  };

  const renderEventContent = (eventInfo) => (
    <div className="fc-event-content-wrapper">
      <div className="fc-event-time-icon">
        <ClockCircleOutlined className="event-icon" />
        <span className="event-time">
          {dayjs(eventInfo.event.start).format('HH:mm')} - {dayjs(eventInfo.event.end).format('HH:mm')}
        </span>
      </div>
      <div className="fc-event-title-container">
        <b>{eventInfo.event.title}</b>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Doctor Schedule</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedEvent(null);
            setEventModalVisible(true);
          }}
        >
          Add Schedule
        </Button>
      </div>
      
      <div className="mb-4 pb-3 border-b">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Badge status="processing" className="mr-2" />
            <Text>Scheduled Shifts</Text>
          </div>
        </div>
      </div>
      
      <Card className="shadow-md">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <div className="calendar-wrapper">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              eventClick={handleEventClick}
              select={handleDateSelect}
              events={events}
              eventContent={renderEventContent}
              height={600}
              locale="vi"
              slotMinTime="08:00:00"
              slotMaxTime="21:00:00"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'timeGridWeek,timeGridDay,dayGridMonth'
              }}
              allDaySlot={false}
              slotLabelFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              editable={false}
            />
          </div>
        )}
      </Card>

      {/* Schedule Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <CalendarOutlined className="mr-2 text-blue-600" />
            <span>{selectedEvent?.id ? 'Edit Schedule' : 'Add New Schedule'}</span>
          </div>
        }
        open={eventModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setEventModalVisible(false);
          form.resetFields();
        }}
        okText={selectedEvent?.id ? "Update" : "Create"}
        cancelText="Cancel"
        centered
        okButtonProps={{ loading: loading }}
        footer={[
          <Button key="cancel" onClick={() => {
            setEventModalVisible(false);
            form.resetFields();
          }}>
            Cancel
          </Button>,
          selectedEvent?.id && (
            <Button 
              key="delete" 
              danger 
              onClick={handleDeleteEvent}
              loading={loading}
            >
              Delete
            </Button>
          ),
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleModalOk}
            loading={loading}
          >
            {selectedEvent?.id ? "Update" : "Create"}
          </Button>
        ]}
      >
        <Form form={form} layout="vertical" initialValues={{
          shift: selectedEvent?.extendedProps?.shift || 'MORNING',
          date: selectedEvent?.start ? dayjs(selectedEvent.start) : dayjs(),
          startTime: selectedEvent?.start ? dayjs(selectedEvent.start) : dayjs().hour(8).minute(0),
          endTime: selectedEvent?.end ? dayjs(selectedEvent.end) : dayjs().hour(12).minute(0)
        }}>
          <Form.Item
            name="shift"
            label="Shift"
            rules={[{ required: true, message: 'Please select a shift' }]}
          >
            <Select>
              <Option value="MORNING">Morning (08:00 - 12:00)</Option>
              <Option value="AFTERNOON">Afternoon (13:00 - 17:00)</Option>
              <Option value="EVENING">Evening (17:00 - 21:00)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker 
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            name="startTime"
            label="Start Time"
            rules={[{ required: true, message: 'Please select start time' }]}
          >
            <TimePicker 
              style={{ width: '100%' }}
              format="HH:mm"
            />
          </Form.Item>

          <Form.Item
            name="endTime"
            label="End Time"
            rules={[{ required: true, message: 'Please select end time' }]}
          >
            <TimePicker 
              style={{ width: '100%' }}
              format="HH:mm"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorSchedulePage;
