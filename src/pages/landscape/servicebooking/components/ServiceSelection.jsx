import React, { useState, useMemo } from 'react';
import { Typography, Button, Tag, Input, Select, Pagination, Row, Col, Card, Space } from 'antd';
import { MedicineBoxOutlined, RightOutlined, CheckCircleOutlined, SearchOutlined, FilterOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

// Helper function to convert service type to Vietnamese
const getServiceTypeLabel = (type) => {
  switch (type) {
    case 'TEST':
      return 'Xét nghiệm';
    case 'CONSULT':
      return 'Tư vấn';
    case 'TREATMENT':
      return 'Điều trị';
    default:
      return type;
  }
};

// Helper function to get service type color
const getServiceTypeColor = (type) => {
  switch (type) {
    case 'TEST':
      return 'blue';
    case 'CONSULT':
      return 'green';
    case 'TREATMENT':
      return 'orange';
    default:
      return 'default';
  }
};

const PAGE_SIZE = 6;

const ServiceSelection = ({ 
  services, 
  selectedService, 
  setSelectedService, 
  setAvailableSlots, 
  setCurrentStep 
}) => {
  // Search, filter, sort, and paging state
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState(undefined);
  const [sort, setSort] = useState('default');
  const [page, setPage] = useState(1);

  // Unique types for filter dropdown
  const uniqueTypes = useMemo(
    () => Array.from(new Set(services.map(s => s.type).filter(Boolean))),
    [services]
  );

  // Filtered and sorted services
  const filteredServices = useMemo(() => {
    let result = [...services];
    if (search) {
      result = result.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(search.toLowerCase()))
      );
    }
    if (typeFilter) {
      result = result.filter(s => s.type === typeFilter);
    }
    if (sort === 'asc') {
      result = result.sort((a, b) => (parseInt(a.price) || 0) - (parseInt(b.price) || 0));
    } else if (sort === 'desc') {
      result = result.sort((a, b) => (parseInt(b.price) || 0) - (parseInt(a.price) || 0));
    }
    return result;
  }, [services, search, typeFilter, sort]);

  // Paging
  const total = filteredServices.length;
  const pagedServices = filteredServices.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    const slots = generateSlotsForService(service);
    setAvailableSlots(slots);
  };

  // Reset page when filter/search changes
  React.useEffect(() => {
    setPage(1);
  }, [search, typeFilter, sort]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-center mb-10">
        <Title level={2} className="text-gray-900 mb-4">
          Chọn dịch vụ khám
        </Title>
        <Text className="text-lg text-gray-600">
          Vui lòng chọn dịch vụ bạn muốn đặt lịch
        </Text>
      </div>

      {/* Filter/Search/Sort Controls */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm dịch vụ..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-72 rounded-lg border border-gray-200"
        />
        <Select
          allowClear
          placeholder="Lọc theo loại"
          value={typeFilter}
          onChange={setTypeFilter}
          className="w-full md:w-48 rounded-lg"
        >
          {uniqueTypes.map(type => (
            <Option key={type} value={type}>
              <Tag color={getServiceTypeColor(type)}>{getServiceTypeLabel(type)}</Tag>
            </Option>
          ))}
        </Select>
        <Select
          value={sort}
          onChange={setSort}
          className="w-full md:w-48 rounded-lg"
        >
          <Option value="default">
            <SortAscendingOutlined /> Mặc định
          </Option>
          <Option value="asc">
            <SortAscendingOutlined /> Giá tăng dần
          </Option>
          <Option value="desc">
            <SortDescendingOutlined /> Giá giảm dần
          </Option>
        </Select>
      </div>

      {/* Service Cards */}
      <Row gutter={[24, 24]}>
        {pagedServices.length === 0 ? (
          <Col span={24}>
            <Card className="text-center py-12">
              <Text className="text-gray-500 text-lg">Không tìm thấy dịch vụ phù hợp.</Text>
            </Card>
          </Col>
        ) : (
          pagedServices.map(service => (
            <Col xs={24} sm={12} md={8} key={service.id}>
              <Card
                hoverable
                className={`relative rounded-2xl shadow-lg border-2 p-0 transition-all duration-300 h-full
                  ${selectedService?.id === service.id ? 'border-blue-500 shadow-blue-100 shadow-2xl' : 'border-gray-100 hover:border-blue-400'}
                `}
                bodyStyle={{ padding: 0 }}
                onClick={() => handleServiceSelect(service)}
              >
                {/* Selection indicator */}
                {selectedService?.id === service.id && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg z-10">
                    <CheckCircleOutlined className="text-white text-lg" />
                  </div>
                )}

                <div className="flex flex-col items-center px-6 pt-8 pb-6">
                  {/* Service icon */}
                  <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center mb-4
                    ${selectedService?.id === service.id ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-500'}
                  `}>
                    <MedicineBoxOutlined className="text-2xl" />
                  </div>

                  {/* Service type badge */}
                  {service.type && (
                    <Tag 
                      color={getServiceTypeColor(service.type)}
                      className="text-xs font-medium px-3 py-1 rounded-full mb-2"
                    >
                      {getServiceTypeLabel(service.type)}
                    </Tag>
                  )}

                  <Title level={5} className="text-gray-900 mb-2 text-center line-clamp-2">
                    {service.name}
                  </Title>
                  {service.description && (
                    <Text className="text-gray-600 text-sm mb-2 block text-center line-clamp-3">
                      {service.description}
                    </Text>
                  )}
                  {service.price && (
                    <Text className="text-xl font-bold text-blue-600 mb-2 block">
                      {service.price?.toLocaleString('vi-VN')}₫
                    </Text>
                  )}
                  <div className="flex justify-center items-center text-xs text-gray-500 mb-2">
                    <span>Thời gian: {service.startTime} - {service.endTime}</span>
                  </div>
                  {selectedService?.id === service.id && (
                    <Button 
                      type="primary" 
                      size="large"
                      className="w-full bg-blue-500 hover:bg-blue-600 border-none rounded-xl h-10 font-semibold mt-2"
                      onClick={e => {
                        e.stopPropagation();
                        setCurrentStep(1);
                      }}
                    >
                      Tiếp tục <RightOutlined className="ml-2" />
                    </Button>
                  )}
                </div>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Pagination */}
      {total > PAGE_SIZE && (
        <div className="flex justify-center mt-10">
          <Pagination
            current={page}
            pageSize={PAGE_SIZE}
            total={total}
            showSizeChanger={false}
            onChange={setPage}
            className="rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;
