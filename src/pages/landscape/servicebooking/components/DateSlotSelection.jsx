import React from 'react';
import { Typography, Button, DatePicker } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, ArrowLeftOutlined, RightOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { ServiceType } from '@/constant/general';

const { Title, Text } = Typography;

const DateSlotSelection = ({ 
  selectedDate, 
  setSelectedDate, 
  availableSlots, 
  selectedSlot, 
  setSelectedSlot, 
  setCurrentStep,
  selectedService,
  handleConfirmBooking
}) => {
  const today = dayjs();
  const maxDate = dayjs().add(30, 'day');

  const handleNext = () => {
    if (selectedService?.type === ServiceType.CONSULT) {
      handleConfirmBooking();
    } else {
      setCurrentStep(2);
    }
  };

  // Define static slots
  const slots = [
    { start: '07:00', end: '07:30' },
    { start: '07:35', end: '08:05' },
    { start: '08:10', end: '08:40' },
    { start: '08:45', end: '09:15' },
    { start: '09:20', end: '09:50' },
    { start: '09:55', end: '10:25' },
    { start: '10:30', end: '11:00' },
    { start: '13:00', end: '13:30' },
    { start: '13:35', end: '14:05' },
    { start: '14:10', end: '14:40' },
    { start: '14:45', end: '15:15' },
    { start: '15:20', end: '15:50' },
    { start: '15:55', end: '16:25' },
    { start: '16:30', end: '17:00' },
  ];

  // Helper to check if a time is in the morning or afternoon
  const isMorning = (start) => {
    const hour = parseInt(start.split(':')[0], 10);
    return hour >= 7 && hour < 12;
  };
  const isAfternoon = (start) => {
    const hour = parseInt(start.split(':')[0], 10);
    return hour >= 13 && hour < 18;
  };

  // Group slots by time
  const morningSlots = slots.filter(slot => isMorning(slot.start));
  const afternoonSlots = slots.filter(slot => isAfternoon(slot.start));

  const SlotGroup = ({ title, icon, slots, bgColor, iconColor }) => (
    <div className={`${bgColor} rounded-2xl p-6 border border-gray-100`}>
      <div className="flex items-center mb-6">
        <div className={`${iconColor} text-2xl mr-3`}>
          {icon}
        </div>
        <Title level={4} className="text-gray-800 mb-0">
          {title}
        </Title>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {slots.map(slot => {
          const isSelected = selectedSlot && selectedSlot.start === slot.start && selectedSlot.end === slot.end;
          return (
            <button
              key={slot.start + slot.end}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-300 text-center group
                ${isSelected
                  ? 'border-blue-500 bg-blue-500 text-white shadow-lg transform scale-105' 
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md hover:transform hover:scale-102'
                }
              `}
              onClick={() => setSelectedSlot(slot)}
            >
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              
              <div className={`font-bold text-lg mb-1 ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                {slot.start} - {slot.end}
              </div>
              
              <div className={`text-sm ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                Khả dụng
              </div>
            </button>
          );
        })}
      </div>
      
      {slots.length === 0 && (
        <div className="text-center py-8">
          <ClockCircleOutlined className="text-3xl text-gray-300 mb-2" />
          <Text className="text-gray-400">Không có khung giờ khả dụng</Text>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <Title level={2} className="text-gray-900 mb-4">
          Chọn ngày và khung giờ
        </Title>
        <Text className="text-lg text-gray-600">
          Vui lòng chọn ngày và khung giờ phù hợp với lịch của bạn
        </Text>
      </div>

      <div className="space-y-8">
        {/* Date Selection */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-center mb-8">
            <CalendarOutlined className="text-blue-500 text-2xl mr-4" />
            <Title level={3} className="text-gray-900 mb-0">
              Chọn ngày khám
            </Title>
          </div>
          
          <div className="flex justify-center">
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              disabledDate={(current) => current && (current < today || current > maxDate)}
              size="large"
              placeholder="Chọn ngày khám"
              format="DD/MM/YYYY"
              className="w-full max-w-xs h-14 text-lg rounded-xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500"
              suffixIcon={<CalendarOutlined className="text-blue-500" />}
            />
          </div>
          
          <div className="text-center mt-4">
            <Text className="text-sm text-gray-500">
              Có thể đặt lịch trong vòng 30 ngày tới
            </Text>
          </div>
        </div>

        {/* Time Slot Selection */}
        {selectedDate && (
          <div className="space-y-6">
            <div className="text-center">
              <Title level={3} className="text-gray-900 mb-2">
                Chọn khung giờ
              </Title>
              <Text className="text-gray-600">
                Ngày đã chọn: <span className="font-semibold text-blue-600">{selectedDate.format('DD/MM/YYYY')}</span>
              </Text>
            </div>

            {/* Morning Slots */}
            <SlotGroup
              title="Buổi sáng"
              icon={<SunOutlined />}
              slots={morningSlots}
              bgColor="bg-gradient-to-br from-yellow-50 to-orange-50"
              iconColor="text-orange-500"
            />

            {/* Afternoon Slots */}
            <SlotGroup
              title="Buổi chiều"
              icon={<MoonOutlined />}
              slots={afternoonSlots}
              bgColor="bg-gradient-to-br from-blue-50 to-indigo-50"
              iconColor="text-indigo-500"
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-12">
        <Button 
          size="large" 
          onClick={() => setCurrentStep(0)}
          className="flex items-center px-6 py-3 h-12 rounded-xl border-gray-300 hover:border-blue-400 hover:text-blue-500"
        >
          <ArrowLeftOutlined className="mr-2" /> Quay lại
        </Button>
        
        <Button
          type="primary"
          size="large"
          disabled={!selectedDate || !selectedSlot}
          onClick={handleNext}
          className="flex items-center px-8 py-3 h-12 bg-blue-500 hover:bg-blue-600 border-none rounded-xl font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {selectedService?.type === ServiceType.CONSULT ? 'Xác nhận đặt lịch' : 'Tiếp tục'} 
          <RightOutlined className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default DateSlotSelection;
