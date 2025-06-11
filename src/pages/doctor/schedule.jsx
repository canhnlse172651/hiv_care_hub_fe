import React, { useState } from 'react';
import { 
  Calendar, Badge, Card, Typography, Select, 
  Button, Modal, Form, Input, TimePicker, message, 
  Radio, Divider, Tooltip, DatePicker
} from 'antd';
import { 
  PlusOutlined, CalendarOutlined, 
  ClockCircleOutlined, UserOutlined,
  ScheduleOutlined, TeamOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';

// Extend dayjs with plugins
dayjs.extend(weekday);
dayjs.extend(weekOfYear);

const { Title, Text } = Typography;
const { Option } = Select;

const DoctorSchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [calendarMode, setCalendarMode] = useState('week'); // Default to week view
  const [form] = Form.useForm();
  
  // Sample calendar data with individual appointments and available slots
  const events = [
    // Doctor availability slots (green)
    {
      id: 'avail-1',
      date: '2025-06-01',
      startTime: '08:00',
      endTime: '09:00',
      type: 'availability',
      isBooked: false
    },
    {
      id: 'avail-2',
      date: '2025-06-01',
      startTime: '09:00',
      endTime: '10:00',
      type: 'availability',
      isBooked: false
    },
    {
      id: 'avail-3',
      date: '2025-06-01',
      startTime: '10:00',
      endTime: '11:00',
      type: 'availability',
      isBooked: false
    },
    {
      id: 'avail-4',
      date: '2025-06-01',
      startTime: '11:00',
      endTime: '12:00',
      type: 'availability',
      isBooked: false
    },
    {
      id: 'avail-5',
      date: '2025-06-01',
      startTime: '13:30',
      endTime: '14:30',
      type: 'availability',
      isBooked: false
    },
    {
      id: 'avail-6',
      date: '2025-06-01',
      startTime: '14:30',
      endTime: '15:30',
      type: 'availability',
      isBooked: false
    },
    
    // Booked appointments (blue)
    {
      id: 'appt-1',
      title: 'Phác đồ TDF+3TC+DTG',
      date: '2025-06-01',
      startTime: '15:30',
      endTime: '16:30',
      type: 'appointment',
      patientName: 'Nguyễn Văn A',
      patientId: 'PT-10001',
      reason: 'Khám định kỳ HIV',
      isBooked: true,
      protocol: 'Phác đồ TDF+3TC+DTG'
    },
    {
      id: 'appt-2',
      title: 'Phác đồ AZT+3TC+EFV',
      date: '2025-06-01',
      startTime: '16:30',
      endTime: '17:00',
      type: 'appointment',
      patientName: 'Trần Thị B',
      patientId: 'PT-10002',
      reason: 'Tư vấn điều trị',
      isBooked: true,
      protocol: 'Phác đồ AZT+3TC+EFV'
    },
    
    // Meeting
    {
      id: 'meeting-1',
      title: 'Hội chẩn ca khó',
      date: '2025-06-01',
      startTime: '17:00',
      endTime: '17:30',
      type: 'meeting',
      isBooked: true
    },
    
    // Next day events
    {
      id: 'appt-3',
      title: 'Phác đồ ABC+3TC+DTG',
      date: '2025-06-02',
      startTime: '08:00',
      endTime: '09:00',
      type: 'appointment',
      patientName: 'Lê Văn C',
      patientId: 'PT-10003',
      reason: 'Tư vấn kết quả xét nghiệm',
      isBooked: true,
      protocol: 'Phác đồ ABC+3TC+DTG'
    },
    {
      id: 'avail-7',
      date: '2025-06-02',
      startTime: '09:00',
      endTime: '10:00',
      type: 'availability',
      isBooked: false
    },
    {
      id: 'avail-8',
      date: '2025-06-02',
      startTime: '10:00',
      endTime: '11:00',
      type: 'availability',
      isBooked: false
    },
    {
      id: 'appt-4',
      title: 'Phác đồ TDF+3TC+EFV',
      date: '2025-06-02',
      startTime: '11:00',
      endTime: '12:00',
      type: 'appointment',
      patientName: 'Phạm Thị D',
      patientId: 'PT-10004',
      reason: 'Tư vấn tâm lý',
      isBooked: true,
      protocol: 'Phác đồ TDF+3TC+EFV'
    },
    // More events for other days of the week
  ];
  
  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateString = date.format('YYYY-MM-DD');
    return events.filter(event => event.date === dateString);
  };
  
  // Calendar cell renderer
  const dateCellRender = (value) => {
    const dateEvents = getEventsForDate(value);
    
    if (dateEvents.length === 0) return null;
    
    return (
      <ul className="p-0 list-none">
        {dateEvents.map(event => {
          // Determine badge color based on event type
          let badgeStatus = 'default';
          if (event.type === 'appointment') {
            badgeStatus = 'processing'; // Blue for appointments
          } else if (event.type === 'availability') {
            badgeStatus = 'success'; // Green for available slots
          } else if (event.type === 'meeting') {
            badgeStatus = 'warning'; // Orange for meetings
          }
          
          return (
            <li key={event.id} className="overflow-hidden mb-1 text-truncate">
              <Tooltip 
                title={
                  event.type === 'appointment' 
                    ? `${event.protocol || event.title} - ${event.patientName} - ${event.reason}`
                    : event.type === 'meeting'
                    ? event.title
                    : `Ca trống ${event.startTime} - ${event.endTime}`
                }
              >
                <Badge 
                  status={badgeStatus} 
                  text={
                    <span className="text-xs">
                      {event.startTime} - {event.endTime}{' '}
                      {event.type === 'appointment' && (
                        <div className="flex flex-col">
                          <span className="font-medium">{event.protocol || event.title}</span>
                          <span className="text-gray-500">{event.patientName}</span>
                        </div>
                      )}
                      {event.type === 'meeting' && event.title}
                    </span>
                  } 
                />
              </Tooltip>
            </li>
          );
        })}
      </ul>
    );
  };
  
  // Create custom weekly view for calendar
  const weekViewContent = () => {
    // Get week dates based on selectedDate instead of current date
    const weekStart = selectedDate.startOf('week');
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(weekStart.add(i, 'day'));
    }

    // Define time slots - start and end time for grid layout
    const timeSlots = [];
    for (let hour = 8; hour < 18; hour++) {
      timeSlots.push({
        time: `${hour}:00`,
        format: hour < 10 ? `0${hour}:00` : `${hour}:00`
      });
      if (hour !== 17) {
        timeSlots.push({
          time: `${hour}:30`,
          format: hour < 10 ? `0${hour}:30` : `${hour}:30`
        });
      }
    }

    // Helper function to calculate top position and height for events
    const calculateEventPosition = (event) => {
      const startParts = event.startTime.split(':');
      const startHour = parseInt(startParts[0]);
      const startMinute = parseInt(startParts[1]);
      
      const endParts = event.endTime.split(':');
      const endHour = parseInt(endParts[0]);
      const endMinute = parseInt(endParts[1]);
      
      // Calculate start and end in minutes since 8:00 (our first slot)
      const startOffset = (startHour - 8) * 60 + startMinute;
      const endOffset = (endHour - 8) * 60 + endMinute;
      
      // Each 30 min slot is 40px (adjust this value based on your design)
      const slotHeight = 40;
      const top = (startOffset / 30) * slotHeight;
      const height = ((endOffset - startOffset) / 30) * slotHeight;
      
      return { top, height };
    };

    return (
      <div className="weekly-calendar">
        {/* Day headers */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-2 font-bold text-center border-r">Time</div>
          {days.map(day => (
            <div
              key={day.format('YYYY-MM-DD')}
              className={`p-2 font-bold text-center border-r ${
                day.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD') ? 'bg-blue-50' : ''
              }`}
            >
              {day.format('ddd DD/MM')}
            </div>
          ))}
        </div>

        {/* Time slots grid */}
        <div className="relative">
          {/* Time indicators */}
          {timeSlots.map((slot, index) => (
            <div key={index} className="grid grid-cols-8 border-b" style={{ height: '40px' }}>
              <div className="p-2 text-center border-r text-sm">{slot.time}</div>
              {days.map(day => (
                <div 
                  key={day.format('YYYY-MM-DD')} 
                  className="border-r relative"
                  onClick={() => handleDateSelect(day)}
                />
              ))}
            </div>
          ))}
          
          {/* Events overlay */}
          {days.map((day, dayIndex) => {
            const dayEvents = events.filter(event => event.date === day.format('YYYY-MM-DD'));
            
            return (
              <React.Fragment key={day.format('YYYY-MM-DD')}>
                {dayEvents.map(event => {
                  // Determine badge color based on event type
                  let badgeColor = '';
                  if (event.type === 'appointment') {
                    badgeColor = 'bg-blue-100 border-blue-300 text-blue-800'; // Blue for appointments
                  } else if (event.type === 'availability') {
                    badgeColor = 'bg-green-100 border-green-300 text-green-800'; // Green for available slots
                  } else if (event.type === 'meeting') {
                    badgeColor = 'bg-yellow-100 border-yellow-300 text-yellow-800'; // Yellow for meetings
                  }
                  
                  const { top, height } = calculateEventPosition(event);
                  
                  return (
                    <div 
                      key={event.id} 
                      className={`absolute text-xs p-1 rounded border ${badgeColor} cursor-pointer overflow-hidden`}
                      style={{
                        top: `${top}px`,
                        height: `${height - 2}px`, // Subtract for borders
                        left: `calc(${(dayIndex + 1) * 12.5}%)`,
                        width: 'calc(12.5% - 2px)',
                        zIndex: 10,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDateSelect(day);
                      }}
                    >
                      <div className="flex flex-col h-full">
                        <div className="font-medium">{event.startTime} - {event.endTime}</div>
                        {event.type === 'appointment' && height > 50 && (
                          <>
                            <span className="font-medium truncate">{event.protocol || event.title}</span>
                            <span className="text-xs truncate">{event.patientName}</span>
                          </>
                        )}
                        {event.type === 'meeting' && height > 50 && (
                          <span className="truncate">{event.title}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Handle calendar date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    
    // Show modal with form for adding new event
    form.setFieldsValue({
      date: date.format('YYYY-MM-DD'),
      title: '',
      startTime: null,
      endTime: null,
      type: 'availability'
    });
    
    setEventModalVisible(true);
  };
  
  // Handle adding a new event
  const handleAddEvent = (values) => {
    console.log('Add new event:', values);
    message.success('Lịch làm việc đã được thêm mới');
    setEventModalVisible(false);
  };
  
  // Create custom header with week selector
  const customHeader = ({ value, onChange }) => {
    const start = value.startOf('week');
    const end = value.endOf('week');
    
    return (
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex items-center">
          <Button 
            onClick={() => {
              const newDate = value.subtract(1, calendarMode);
              setSelectedDate(newDate);
              onChange(newDate);
            }}
          >
            Trước
          </Button>
          <Button 
            onClick={() => {
              const newDate = value.add(1, calendarMode);
              setSelectedDate(newDate);
              onChange(newDate);
            }}
            className="ml-2"
          >
            Sau
          </Button>
          <Button 
            onClick={() => {
              const today = dayjs();
              setSelectedDate(today);
              onChange(today);
            }}
            className="ml-2"
            type="primary"
          >
            Hôm nay
          </Button>
        </div>
        
        <div className="flex items-center">
          <span className="mr-2">Chọn ngày:</span>
          <DatePicker 
            value={value} 
            onChange={(date) => {
              if (date) {
                setSelectedDate(date);
                onChange(date);
              }
            }}
            allowClear={false}
            format="DD/MM/YYYY"
          />
        </div>
        
        <div className="flex items-center">
          <span className="text-lg font-medium mr-4">
            {calendarMode === 'week' 
              ? `${start.format('DD/MM/YYYY')} - ${end.format('DD/MM/YYYY')}`
              : value.format('MM/YYYY')
            }
          </span>
          <Radio.Group 
            value={calendarMode} 
            onChange={(e) => setCalendarMode(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="week">Tuần</Radio.Button>
            <Radio.Button value="month">Tháng</Radio.Button>
          </Radio.Group>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Lịch làm việc</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => handleDateSelect(dayjs())}
        >
          Thêm lịch làm việc
        </Button>
      </div>
      
      <div className="mb-4 pb-3 border-b">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Badge status="success" className="mr-2" />
            <Text>Ca trống</Text>
          </div>
          <div className="flex items-center">
            <Badge status="processing" className="mr-2" />
            <Text>Lịch hẹn đã đặt</Text>
          </div>
          <div className="flex items-center">
            <Badge status="warning" className="mr-2" />
            <Text>Họp/Hội thảo</Text>
          </div>
        </div>
      </div>
      
      <Card className="shadow-md">
        {calendarMode === 'week' ? (
          <>
            {customHeader({ value: selectedDate, onChange: setSelectedDate })}
            {weekViewContent()}
          </>
        ) : (
          <Calendar 
            dateCellRender={dateCellRender}
            onSelect={handleDateSelect}
            mode="month"
            headerRender={customHeader}
            validRange={[dayjs().startOf('year'), dayjs().endOf('year')]}
            value={selectedDate}
            onChange={setSelectedDate}
          />
        )}
      </Card>
      
      {/* Add Event Modal */}
      <Modal
        title="Thêm lịch làm việc mới"
        open={eventModalVisible}
        onCancel={() => setEventModalVisible(false)}
        footer={null}
        width={720}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddEvent}
          initialValues={{
            type: 'availability',
            date: selectedDate ? selectedDate.format('YYYY-MM-DD') : null
          }}
        > 
          <Form.Item
            name="type"
            label="Loại lịch"
            rules={[{ required: true, message: 'Vui lòng chọn loại lịch!' }]}
          >
            <Select>
              <Option value="availability">Ca làm việc trống</Option>
              <Option value="meeting">Họp/Hội thảo</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="startTime"
            label="Thời gian bắt đầu"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu!' }]}
          >
            <TimePicker
              format="HH:mm" 
              className="w-full"
              minuteStep={30}
              disabledHours={() => {
                const currentHour = dayjs().hour();
                const currentMinute = dayjs().minute();
                const disabledHours = [];
                
                // Disable past hours
                for (let hour = 0; hour < currentHour; hour++) {
                  disabledHours.push(hour);
                }
                
                // Disable current hour if minutes > 30
                if (currentMinute >= 30) {
                  disabledHours.push(currentHour);
                }
                
                return disabledHours;
              }}
              onChange={(time) => {
                if (time) {
                  const newTime = time.format('HH:mm');
                  // Set end time automatically 30 minutes later
                  form.setFieldsValue({
                    endTime: dayjs(`2000-01-01 ${newTime}`).add(30, 'minute').format('HH:mm')
                  });
                }
              }}
            />
          </Form.Item>
          
          <Form.Item
            name="endTime"
            label="Thời gian kết thúc"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc!' }]}
          >
            <TimePicker format="HH:mm" className="w-full" />
          </Form.Item>
          
          <Form.Item
            name="title"
            label="Tiêu đề (chỉ áp dụng cho họp/hội thảo)"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (getFieldValue('type') !== 'meeting' || value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Vui lòng nhập tiêu đề cho họp/hội thảo!'));
                },
              }),
            ]}
          >
            <Input placeholder="Nhập tiêu đề" />
          </Form.Item>
          
          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <Input.TextArea rows={3} placeholder="Ghi chú thêm về lịch làm việc" />
          </Form.Item>
          
          <div className="flex justify-end">
            <Button 
              onClick={() => setEventModalVisible(false)} 
              className="mr-2"
            >
              Hủy
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
            >
              Lưu lịch
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorSchedulePage;
