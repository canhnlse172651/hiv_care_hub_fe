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
    <div className="rounded-full px-3 py-1 bg-blue-500 text-white flex items-center gap-2 min-h-[36px]">
    </div>
  );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Title level={2} className="!mb-0 text-blue-800 font-bold tracking-tight flex items-center gap-2">
            <ScheduleOutlined className="text-blue-500 text-3xl" />
            Lịch làm việc của bác sĩ
          </Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedEvent(null);
              setEventModalVisible(true);
            }}
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 rounded-full px-6 py-2 shadow-md text-base font-semibold"
          >
            Thêm lịch làm việc
          </Button>
        </div>
        <div className="mb-6 pb-3 border-b border-blue-200 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Badge status="processing" className="mr-2" />
            <Text className="text-blue-700 font-medium flex items-center gap-1">
              <ClockCircleOutlined className="text-blue-400" /> Ca làm việc đã lên lịch
            </Text>
          </div>
        </div>
        <Card className="shadow-xl rounded-2xl border-0 bg-white/90">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          ) : (
            <div className="calendar-wrapper p-2">
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
            <div className="flex items-center gap-2">
              <CalendarOutlined className="text-blue-600 text-xl" />
              <span className="font-semibold text-blue-800">{selectedEvent?.id ? 'Chỉnh sửa lịch' : 'Thêm lịch mới'}</span>
            </div>
          }
          open={eventModalVisible}
          onOk={handleModalOk}
          onCancel={() => {
            setEventModalVisible(false);
            form.resetFields();
          }}
          okText={selectedEvent?.id ? "Cập nhật" : "Tạo mới"}
          cancelText="Hủy"
          centered
          okButtonProps={{ loading: loading, className: "bg-blue-600 hover:bg-blue-700" }}
          footer={[
            <Button key="cancel" onClick={() => {
              setEventModalVisible(false);
              form.resetFields();
            }}>
              Hủy
            </Button>,
            selectedEvent?.id && (
              <Button 
                key="delete" 
                danger 
                onClick={handleDeleteEvent}
                loading={loading}
              >
                Xóa
              </Button>
            ),
            <Button 
              key="submit" 
              type="primary" 
              onClick={handleModalOk}
              loading={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {selectedEvent?.id ? "Cập nhật" : "Tạo mới"}
            </Button>
          ]}
          className="rounded-xl"
          bodyStyle={{ borderRadius: '1rem', background: '#f8fafc' }}
        >
          <Form form={form} layout="vertical" initialValues={{
            shift: selectedEvent?.extendedProps?.shift || 'MORNING',
            date: selectedEvent?.start ? dayjs(selectedEvent.start) : dayjs(),
            startTime: selectedEvent?.start ? dayjs(selectedEvent.start) : dayjs().hour(8).minute(0),
            endTime: selectedEvent?.end ? dayjs(selectedEvent.end) : dayjs().hour(12).minute(0)
          }}>
            <Form.Item
              name="shift"
              label={<span className="font-semibold text-blue-700">Ca làm việc</span>}
              rules={[{ required: true, message: 'Vui lòng chọn ca làm việc' }]}
            >
              <Select>
                <Option value="MORNING">Sáng (07:00 - 11:00)</Option>
                <Option value="AFTERNOON">Chiều (13:00 - 17:00)</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="date"
              label={<span className="font-semibold text-blue-700">Ngày</span>}
              rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
            >
              <DatePicker 
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
              />
            </Form.Item>

            <Form.Item
              name="startTime"
              label={<span className="font-semibold text-blue-700">Giờ bắt đầu</span>}
              rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu' }]}
            >
              <TimePicker 
                style={{ width: '100%' }}
                format="HH:mm"
              />
            </Form.Item>

            <Form.Item
              name="endTime"
              label={<span className="font-semibold text-blue-700">Giờ kết thúc</span>}
              rules={[{ required: true, message: 'Vui lòng chọn giờ kết thúc' }]}
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