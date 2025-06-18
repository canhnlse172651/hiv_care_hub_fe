import React, { useState, useEffect } from 'react';
import { 
  Calendar, Badge, Card, Typography, Select, 
  Button, Modal, Form, Input, TimePicker, message, 
  Radio, Divider, Tooltip, DatePicker, Spin
} from 'antd';
import { 
  PlusOutlined, CalendarOutlined, 
  ClockCircleOutlined, UserOutlined,
  ScheduleOutlined, TeamOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { doctorService } from '@/services/doctorService';
import { localToken } from '@/utils/token';

// Extend dayjs with plugins
dayjs.extend(weekday);
dayjs.extend(weekOfYear);

const { Title, Text } = Typography;
const { Option } = Select;

const DoctorSchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [calendarMode, setCalendarMode] = useState('week');
  const [form] = Form.useForm();
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(false);
  
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
    } catch (error) {
      console.error('Error fetching schedule:', error);
      message.error('Failed to fetch schedule');
      setScheduleData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [doctorId]);

  // Convert API schedule data to events format
  const convertScheduleToEvents = (schedules) => {
    return schedules.map(schedule => {
      // Convert API schedule format to your event format
      const date = dayjs(schedule.date).format('YYYY-MM-DD');
      
      // Define time slots based on shift
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

      return {
        id: schedule.id,
        date: date,
        startTime: startTime,
        endTime: endTime,
        type: 'scheduled_shift',
        shift: schedule.shift,
        dayOfWeek: schedule.dayOfWeek,
        isBooked: true,
        title: `${schedule.shift} Shift`
      };
    });
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateString = date.format('YYYY-MM-DD');
    const events = convertScheduleToEvents(scheduleData);
    return events.filter(event => event.date === dateString);
  };
  
  // Calendar cell renderer
  const dateCellRender = (value) => {
    const dateEvents = getEventsForDate(value);
    
    if (dateEvents.length === 0) return null;
    
    return (
      <ul className="p-0 list-none">
        {dateEvents.map(event => {
          let badgeStatus = 'processing'; // Blue for scheduled shifts
          
          return (
            <li key={event.id} className="overflow-hidden mb-1 text-truncate">
              <Tooltip 
                title={`${event.shift} Shift (${event.startTime} - ${event.endTime})`}
              >
                <Badge 
                  status={badgeStatus} 
                  text={
                    <span className="text-xs">
                      {event.startTime} - {event.endTime}
                      <div className="font-medium">{event.shift} Shift</div>
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
    const weekStart = selectedDate.startOf('week');
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(weekStart.add(i, 'day'));
    }

    const timeSlots = [];
    for (let hour = 8; hour < 22; hour++) {
      timeSlots.push({
        time: `${hour}:00`,
        format: hour < 10 ? `0${hour}:00` : `${hour}:00`
      });
    }

    const calculateEventPosition = (event) => {
      const startParts = event.startTime.split(':');
      const startHour = parseInt(startParts[0]);
      const startMinute = parseInt(startParts[1]);
      
      const endParts = event.endTime.split(':');
      const endHour = parseInt(endParts[0]);
      const endMinute = parseInt(endParts[1]);
      
      const startOffset = (startHour - 8) * 60 + startMinute;
      const endOffset = (endHour - 8) * 60 + endMinute;
      
      const slotHeight = 40;
      const top = (startOffset / 60) * slotHeight;
      const height = ((endOffset - startOffset) / 60) * slotHeight;
      
      return { top, height };
    };

    const events = convertScheduleToEvents(scheduleData);

    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      );
    }

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
          {timeSlots.map((slot, index) => (
            <div key={index} className="grid grid-cols-8 border-b" style={{ height: '40px' }}>
              <div className="p-2 text-center border-r text-sm">{slot.time}</div>
              {days.map(day => (
                <div 
                  key={day.format('YYYY-MM-DD')} 
                  className="border-r relative"
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
                  const badgeColor = 'bg-blue-100 border-blue-300 text-blue-800';
                  const { top, height } = calculateEventPosition(event);
                  
                  return (
                    <div 
                      key={event.id} 
                      className={`absolute text-xs p-1 rounded border ${badgeColor} cursor-pointer overflow-hidden`}
                      style={{
                        top: `${top}px`,
                        height: `${height - 2}px`,
                        left: `calc(${(dayIndex + 1) * 12.5}%)`,
                        width: 'calc(12.5% - 2px)',
                        zIndex: 10,
                      }}
                    >
                      <div className="flex flex-col h-full">
                        <div className="font-medium">{event.startTime} - {event.endTime}</div>
                        <span className="font-medium truncate">{event.shift} Shift</span>
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
    message.info('Schedule management will be implemented based on your requirements');
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
        <Title level={2}>Doctor Schedule</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => message.info('Schedule generation will be implemented')}
        >
          Generate Schedule
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
          <>
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
          </>
        )}
      </Card>
    </div>
  );
};

export default DoctorSchedulePage;
