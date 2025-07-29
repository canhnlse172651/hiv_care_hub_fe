import React from 'react';
import { Input, Select, DatePicker, Button, Typography, Row, Col } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

const FilterPanel = ({ 
  searchText, 
  onSearchChange,
  selectedDate,
  onDateChange,
  selectedService,
  onServiceChange,
  selectedStatus,
  onStatusChange,
  selectedType,
  onTypeChange,
  services = [],
  servicesLoading = false,
  onClearFilters
}) => {
  return (
    <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
      <div className="flex items-center space-x-2 mb-4">
        <FilterOutlined className="text-blue-600" />
        <Text strong className="text-gray-900 text-lg">Bộ lọc tìm kiếm</Text>
      </div>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={5}>
          <Text strong className="block mb-2 text-gray-700">Tìm kiếm</Text>
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Tên, email, dịch vụ..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            allowClear
            className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500"
          />
        </Col>

        <Col xs={24} md={12} lg={4}>
          <Text strong className="block mb-2 text-gray-700">Ngày hẹn</Text>
          <DatePicker
            placeholder="Chọn ngày"
            value={selectedDate}
            onChange={onDateChange}
            format="DD/MM/YYYY"
            style={{ width: '100%' }}
            allowClear
            className="rounded-lg border-gray-200 hover:border-blue-400"
          />
        </Col>

        <Col xs={24} md={12} lg={4}>
          <Text strong className="block mb-2 text-gray-700">Dịch vụ</Text>
          <Select
            placeholder="Chọn dịch vụ"
            value={selectedService}
            onChange={onServiceChange}
            style={{ width: '100%' }}
            allowClear
            loading={servicesLoading}
            className="rounded-lg"
          >
            {services.map(service => (
              <Option key={service.id} value={service.id}>
                {service.name}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} md={12} lg={4}>
          <Text strong className="block mb-2 text-gray-700">Trạng thái</Text>
          <Select
            placeholder="Chọn trạng thái"
            value={selectedStatus}
            onChange={onStatusChange}
            style={{ width: '100%' }}
            allowClear
            className="rounded-lg"
          >
            <Option value="PENDING">Đang chờ</Option>
            <Option value="PAID">Đã thanh toán</Option>
            <Option value="COMPLETED">Hoàn thành</Option>
          </Select>
        </Col>

        <Col xs={24} md={12} lg={4}>
          <Text strong className="block mb-2 text-gray-700">Loại khám</Text>
          <Select
            placeholder="Chọn loại"
            value={selectedType}
            onChange={onTypeChange}
            style={{ width: '100%' }}
            allowClear
            className="rounded-lg"
          >
            <Option value="OFFLINE">Tại phòng khám</Option>
            <Option value="ONLINE">Trực tuyến</Option>
          </Select>
        </Col>

        <Col xs={24} lg={3}>
          <Text strong className="block mb-2 text-gray-700">&nbsp;</Text>
          <Button 
            onClick={onClearFilters} 
            icon={<ClearOutlined />}
            className="w-full rounded-lg border-gray-300 hover:border-blue-400 hover:text-blue-600"
          >
            Xóa bộ lọc
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default FilterPanel;