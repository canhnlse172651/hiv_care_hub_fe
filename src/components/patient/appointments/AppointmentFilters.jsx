import React from 'react';
import { Card, Input, Select, DatePicker, Button, Typography } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';

const { Text } = Typography;

const AppointmentFilters = ({
  searchText,
  setSearchText,
  selectedService,
  setSelectedService,
  selectedDoctor,
  setSelectedDoctor,
  selectedStatus,
  setSelectedStatus,
  selectedType,
  setSelectedType,
  dateRange,
  setDateRange,
  uniqueServices,
  uniqueDoctors,
  onClearFilters
}) => {
  return (
    <Card 
      className="shadow-lg rounded-xl border-0 overflow-hidden mb-8"
      title={
        <div className="flex items-center space-x-2">
          <FilterOutlined className="text-blue-600" />
          <span className="text-gray-900 font-semibold">Tìm kiếm và lọc</span>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Search Text */}
        <div>
          <Text strong className="block mb-2 text-gray-700">Tìm kiếm</Text>
          <Input
            placeholder="Tìm theo dịch vụ, bác sĩ..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500"
          />
        </div>

        {/* Service Filter */}
        <div>
          <Text strong className="block mb-2 text-gray-700">Dịch vụ</Text>
          <Select
            placeholder="Chọn dịch vụ"
            value={selectedService}
            onChange={setSelectedService}
            allowClear
            style={{ width: '100%' }}
            className="rounded-lg"
          >
            {uniqueServices.map(service => (
              <Select.Option key={service} value={service}>
                {service}
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* Doctor Filter */}
        <div>
          <Text strong className="block mb-2 text-gray-700">Bác sĩ</Text>
          <Select
            placeholder="Chọn bác sĩ"
            value={selectedDoctor}
            onChange={setSelectedDoctor}
            allowClear
            style={{ width: '100%' }}
            className="rounded-lg"
          >
            {uniqueDoctors.map(doctor => (
              <Select.Option key={doctor} value={doctor}>
                {doctor}
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* Status Filter */}
        <div>
          <Text strong className="block mb-2 text-gray-700">Trạng thái</Text>
          <Select
            placeholder="Chọn trạng thái"
            value={selectedStatus}
            onChange={setSelectedStatus}
            allowClear
            style={{ width: '100%' }}
            className="rounded-lg"
          >
            <Select.Option value="PENDING">Đang chuẩn bị</Select.Option>
            <Select.Option value="CONFIRMED">Đã xác nhận</Select.Option>
            <Select.Option value="COMPLETED">Đã hoàn thành</Select.Option>
            <Select.Option value="PAID">Đã thanh toán</Select.Option>
            <Select.Option value="CANCELLED">Đã hủy</Select.Option>
          </Select>
        </div>

        {/* Type Filter */}
        <div>
          <Text strong className="block mb-2 text-gray-700">Loại khám</Text>
          <Select
            placeholder="Chọn loại"
            value={selectedType}
            onChange={setSelectedType}
            allowClear
            style={{ width: '100%' }}
            className="rounded-lg"
          >
            <Select.Option value="ONLINE">Trực tuyến</Select.Option>
            <Select.Option value="OFFLINE">Tại phòng khám</Select.Option>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div>
          <Text strong className="block mb-2 text-gray-700">Thời gian</Text>
          <DatePicker.RangePicker
            value={dateRange}
            onChange={setDateRange}
            format="DD/MM/YYYY"
            placeholder={['Từ ngày', 'Đến ngày']}
            style={{ width: '100%' }}
            className="rounded-lg border-gray-200 hover:border-blue-400"
          />
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="mt-4 flex justify-end">
        <Button 
          onClick={onClearFilters}
          icon={<ClearOutlined />}
          className="rounded-lg border-gray-300 hover:border-blue-400 hover:text-blue-600"
        >
          Xóa bộ lọc
        </Button>
      </div>
    </Card>
  );
};

export default AppointmentFilters;
