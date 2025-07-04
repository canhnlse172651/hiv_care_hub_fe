import React from 'react';
import { Typography, Button } from 'antd';
import { MedicineBoxOutlined, RightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

// Slot generator function
function generateSlotsForService(service) {
  if (!service?.duration || !service?.startTime || !service?.endTime) return [];
  const slots = [];
  const durationParts = service.duration.split(':');
  const durationMinutes = parseInt(durationParts[0], 10) * 60 + parseInt(durationParts[1], 10);
  // Helper to generate slots for a shift
  function generateShiftSlots(shiftStart, shiftEnd, shiftName) {
    let current = dayjs(`2024-01-01T${shiftStart}:00`);
    const end = dayjs(`2024-01-01T${shiftEnd}:00`);
    while (true) {
      const slotStart = current;
      const slotEnd = slotStart.add(durationMinutes, 'minute');
      if (slotEnd.isAfter(end)) break;
      slots.push({
        start: slotStart.format('HH:mm'),
        end: slotEnd.format('HH:mm'),
        shift: shiftName
      });
      // Add 5 minutes break
      current = slotEnd.add(5, 'minute');
    }
  }
  // MORNING: 07:00 - 11:00
  generateShiftSlots('07:00', '11:00', 'MORNING');
  // AFTERNOON: 13:00 - 17:00
  generateShiftSlots('13:00', '17:00', 'AFTERNOON');
  return slots;
}

const ServiceSelection = ({ 
  services, 
  selectedService, 
  setSelectedService, 
  setAvailableSlots, 
  setCurrentStep 
}) => {
  const handleServiceSelect = (service) => {
    setSelectedService(service);
    const slots = generateSlotsForService(service);
    setAvailableSlots(slots);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-center mb-12">
        <Title level={2} className="text-gray-900 mb-4">
          Chọn dịch vụ khám
        </Title>
        <Text className="text-lg text-gray-600">
          Vui lòng chọn dịch vụ bạn muốn đặt lịch
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {services.map(service => (
          <div
            key={service.id}
            className={`relative group cursor-pointer transition-all duration-300 ${
              selectedService?.id === service.id 
                ? 'transform -translate-y-2' 
                : 'hover:transform hover:-translate-y-1'
            }`}
            onClick={() => handleServiceSelect(service)}
          >
            <div className={`
              relative bg-white rounded-2xl shadow-lg border-2 p-8 h-full flex flex-col
              ${selectedService?.id === service.id 
                ? 'border-blue-500 shadow-blue-100 shadow-2xl' 
                : 'border-gray-100 hover:border-gray-200 hover:shadow-xl'
              }
            `}>
              {/* Selection indicator */}
              {selectedService?.id === service.id && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircleOutlined className="text-white text-lg" />
                </div>
              )}

              {/* Service icon */}
              <div className="flex justify-center mb-6">
                <div className={`
                  w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300
                  ${selectedService?.id === service.id 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-blue-50 text-blue-500 group-hover:bg-blue-100'
                  }
                `}>
                  <MedicineBoxOutlined className="text-3xl" />
                </div>
              </div>

              {/* Service info */}
              <div className="flex-1 text-center">
                <Title level={4} className="text-gray-900 mb-3 line-clamp-2">
                  {service.name}
                </Title>
                
                {service.description && (
                  <Text className="text-gray-600 text-sm mb-4 block line-clamp-3">
                    {service.description}
                  </Text>
                )}

                {service.price && (
                  <div className="mb-4">
                    <Text className="text-2xl font-bold text-blue-600">
                      {service.price?.toLocaleString('vi-VN')}₫
                    </Text>
                  </div>
                )}

                <div className="flex justify-center items-center text-sm text-gray-500 mb-6">
                  <span>Thời gian: {service.startTime} - {service.endTime}</span>
                </div>
              </div>

              {/* Action button */}
              {selectedService?.id === service.id && (
                <Button 
                  type="primary" 
                  size="large"
                  className="w-full bg-blue-500 hover:bg-blue-600 border-none rounded-xl h-12 font-semibold"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentStep(1);
                  }}
                >
                  Tiếp tục <RightOutlined className="ml-2" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelection;
