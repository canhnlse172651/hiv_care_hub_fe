import React, { useState } from 'react';
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
import { useDoctorSchedule } from '@/hooks';

const { Title, Text } = Typography;
const { Option } = Select;

const DoctorSchedulePage = () => {
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [form] = Form.useForm();
  
  const {
    loading,
    events,
    selectedEvent,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    handleEventClick,
    handleDateSelect,
    clearSelectedEvent
  } = useDoctorSchedule();

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      const scheduleData = {
        date: values.date.format('YYYY-MM-DD'),
        shift: values.shift,
        startTime: values.startTime.format('HH:mm'),
        endTime: values.endTime.format('HH:mm')
      };

      if (selectedEvent?.id) {
        // Update existing schedule
        await updateSchedule(selectedEvent.id, scheduleData);
      } else {
        // Create new schedule
        await createSchedule(scheduleData);
      }

      setEventModalVisible(false);
      form.resetFields();
      clearSelectedEvent();
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent?.id) return;
    
    try {
      await deleteSchedule(selectedEvent.id);
      setEventModalVisible(false);
      form.resetFields();
      clearSelectedEvent();
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const handleModalCancel = () => {
    setEventModalVisible(false);
    form.resetFields();
    clearSelectedEvent();
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
          onClick={() => setEventModalVisible(true)}
        >
          Add Schedule
        </Button>
      </div>

      <Card className="shadow-md">
        <Spin spinning={loading}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView="timeGridWeek"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={events}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            height="auto"
            slotMinTime="06:00:00"
            slotMaxTime="18:00:00"
            allDaySlot={false}
          />
        </Spin>
      </Card>

      {/* Schedule Modal */}
      <Modal
        title={selectedEvent?.id ? "Edit Schedule" : "Add Schedule"}
        open={eventModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={loading}
        width={600}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Cancel
          </Button>,
          selectedEvent?.id && (
            <Button key="delete" danger onClick={handleDeleteEvent} loading={loading}>
              Delete
            </Button>
          ),
          <Button key="submit" type="primary" onClick={handleModalOk} loading={loading}>
            {selectedEvent?.id ? "Update" : "Create"}
          </Button>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            date: selectedEvent?.start ? dayjs(selectedEvent.start) : dayjs(),
            shift: selectedEvent?.shift || 'MORNING',
            startTime: selectedEvent?.start ? dayjs(selectedEvent.start) : dayjs().hour(7).minute(0),
            endTime: selectedEvent?.end ? dayjs(selectedEvent.end) : dayjs().hour(12).minute(0)
          }}
        >
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="shift"
            label="Shift"
            rules={[{ required: true, message: 'Please select a shift' }]}
          >
            <Select>
              <Option value="MORNING">Morning (07:00 - 12:00)</Option>
              <Option value="AFTERNOON">Afternoon (12:00 - 17:00)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="startTime"
            label="Start Time"
            rules={[
              { required: true, message: 'Please select start time' },
              {
                validator: (_, value) => {
                  if (value && (value.hour() < 7 || value.hour() >= 17)) {
                    return Promise.reject(new Error('Start time must be between 07:00 and 17:00'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <TimePicker 
              format="HH:mm" 
              style={{ width: '100%' }}
              minuteStep={15}
              hideDisabledOptions={true}
              disabledHours={() => {
                const hours = [];
                for (let i = 0; i < 24; i++) {
                  if (i < 7 || i >= 17) {
                    hours.push(i);
                  }
                }
                return hours;
              }}
            />
          </Form.Item>

          <Form.Item
            name="endTime"
            label="End Time"
            rules={[
              { required: true, message: 'Please select end time' },
              {
                validator: (_, value) => {
                  if (value && (value.hour() < 7 || value.hour() >= 17)) {
                    return Promise.reject(new Error('End time must be between 07:00 and 17:00'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <TimePicker 
              format="HH:mm" 
              style={{ width: '100%' }}
              minuteStep={15}
              hideDisabledOptions={true}
              disabledHours={() => {
                const hours = [];
                for (let i = 0; i < 24; i++) {
                  if (i < 7 || i >= 17) {
                    hours.push(i);
                  }
                }
                return hours;
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorSchedulePage;
