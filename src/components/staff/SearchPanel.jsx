import React from 'react';
import { Card, Typography, Input, DatePicker, Select, Space, Row, Col } from 'antd';
import { SearchOutlined, CalendarOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const SearchPanel = ({ 
  searchText, 
  onSearchChange, 
  selectedDateRange, 
  onDateRangeChange,
  selectedService,
  onServiceChange,
  services = []
}) => {
  return (
    <Card className="shadow-lg rounded-xl border-0 mb-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <Title level={4} className="mb-1">Tìm kiếm lịch hẹn</Title>
            <Text className="text-gray-500">Tìm theo tên bệnh nhân, số điện thoại, mã lịch hẹn, ngày hoặc dịch vụ</Text>
          </div>
        </div>

        {/* Search and Filters */}
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <div className="flex items-center space-x-2 mb-2">
              <SearchOutlined className="text-blue-500" />
              <span className="text-gray-600 font-medium">Tìm kiếm:</span>
            </div>
            <Input.Search
              placeholder="Tìm kiếm bệnh nhân, SĐT, mã hẹn..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchText}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full"
            />
          </Col>
          
          <Col xs={24} md={8}>
            <div className="flex items-center space-x-2 mb-2">
              <CalendarOutlined className="text-blue-500" />
              <span className="text-gray-600 font-medium">Khoảng thời gian:</span>
            </div>
            <RangePicker
              size="large"
              className="w-full"
              placeholder={['Từ ngày', 'Đến ngày']}
              value={selectedDateRange}
              onChange={onDateRangeChange}
              format="DD/MM/YYYY"
              allowClear
            />
          </Col>
          
          <Col xs={24} md={8}>
            <div className="flex items-center space-x-2 mb-2">
              <FilterOutlined className="text-green-500" />
              <span className="text-gray-600 font-medium">Dịch vụ:</span>
            </div>
            <Select
              size="large"
              className="w-full"
              placeholder="Chọn dịch vụ"
              value={selectedService}
              onChange={onServiceChange}
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={services.map(service => ({
                value: service.id,
                label: service.name
              }))}
            />
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default SearchPanel; 