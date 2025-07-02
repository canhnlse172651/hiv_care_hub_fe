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
import { DOCTOR_SHIFT_TIME } from '@/constant/general';

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

  useEffect(() => {
    fetchSchedule();
    // eslint-disable-next-line
  }, [doctorId]);

  // Handle clicking on an event in the calendar
  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setEventModalVisible(true);
    // Optionally, set form fields here if you want to edit
  };

  // Handle selecting a date/time slot in the calendar
  const handleDateSelect = (selectInfo) => {
    setSelectedEvent(null);
    setEventModalVisible(true);
    // Optionally, set form fields here for new event
  };

  // Handle OK button in modal (create/update event)
  const handleModalOk = async () => {
    // You can implement create/update logic here
    setEventModalVisible(false);
    form.resetFields();
    // Optionally, refetch schedule
    fetchSchedule();
  };

  // Handle delete event
  const handleDeleteEvent = async () => {
    // You can implement delete logic here
    setEventModalVisible(false);
    form.resetFields();
    // Optionally, refetch schedule
    fetchSchedule();
  };

  const renderEventContent = (eventInfo) => (
  <div className="rounded-lg px-2 py-1 bg-blue-500 text-white shadow-md flex flex-col items-center justify-center min-h-[40px]">
    <span className="font-semibold tracking-wide text-base">
      Lịch trống
    </span>
  </div>
);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Title level={2} className="!mb-0 text-blue-700">Lịch làm việc của bác sĩ</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedEvent(null);
              setEventModalVisible(true);
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Thêm lịch làm việc
          </Button>
        </div>
        <div className="mb-4 pb-3 border-b">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Badge status="processing" className="mr-2" />
              <Text className="text-gray-600">Ca làm việc đã lên lịch</Text>
            </div>
          </div>
        </div>
        <Card className="shadow-lg rounded-xl border-0">
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
                slotMinTime="07:00:00"
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
                <Option value="MORNING">Sáng (07:00 - 11:00)</Option>
                <Option value="AFTERNOON">Chiều (13:00 - 17:00)</Option>
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
    </div>
  );
};

export default DoctorSchedulePage;