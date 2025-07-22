import React, { useState } from 'react';
import { Card, Typography, Button, Modal, Form, DatePicker, TimePicker, Select, Badge, Alert, Spin } from 'antd';
import { ScheduleOutlined, ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const ScheduleCalendar = ({ 
  events, 
  loading, 
  onEventClick, 
  onDateSelect, 
  onEventUpdate, 
  onEventDelete 
}) => {
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form] = Form.useForm();

  // Handle clicking on an event in the calendar
  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setEventModalVisible(true);
    form.setFieldsValue({
      shift: info.event.extendedProps?.shift || 'MORNING',
      date: dayjs(info.event.start),
      startTime: dayjs(info.event.start),
      endTime: dayjs(info.event.end)
    });
    onEventClick?.(info);
  };

  // Handle selecting a date/time slot in the calendar
  const handleDateSelect = (selectInfo) => {
    setSelectedEvent(null);
    setEventModalVisible(true);
    form.setFieldsValue({
      shift: 'MORNING',
      date: dayjs(selectInfo.start),
      startTime: dayjs(selectInfo.start),
      endTime: dayjs(selectInfo.end)
    });
    onDateSelect?.(selectInfo);
  };

  // Handle OK button in modal (create/update event)
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (selectedEvent) {
        await onEventUpdate?.(selectedEvent, values);
      } else {
        await onEventUpdate?.(null, values);
      }
      setEventModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  // Handle delete event
  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      await onEventDelete?.(selectedEvent);
      setEventModalVisible(false);
      form.resetFields();
    }
  };

  const renderEventContent = (eventInfo) => (
    <div className="rounded-full px-3 py-1 bg-blue-500 text-white flex items-center gap-2 min-h-[36px]">
      <span style={{ color: '#fff', fontWeight: 600 }}>Lịch làm việc</span>
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
          <Form form={form} layout="vertical">
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

export default ScheduleCalendar;
