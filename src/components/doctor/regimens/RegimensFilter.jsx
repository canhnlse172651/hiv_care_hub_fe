import React from 'react';
import { Card, Input, Select, Typography, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

const RegimensFilter = ({ 
  searchText, 
  filters,
  onSearchChange,
  onFilterChange
}) => {
  return (
    <Card className="shadow-lg mb-8 rounded-2xl border-0 overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <SearchOutlined className="text-blue-600" />
          <Text strong className="text-gray-900 text-lg">Tìm kiếm và lọc phác đồ</Text>
        </div>
        
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} lg={8}>
            <Text strong className="block mb-2 text-gray-700">Tìm kiếm</Text>
            <Input
              placeholder="Tìm kiếm theo tên phác đồ..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={e => onSearchChange(e.target.value)}
              allowClear
              className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500"
            />
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Text strong className="block mb-2 text-gray-700">Bệnh điều trị</Text>
            <Select
              placeholder="Chọn bệnh"
              value={filters.targetDisease}
              onChange={(value) => onFilterChange('targetDisease', value)}
              allowClear
              style={{ width: '100%' }}
              className="rounded-lg"
            >
              <Option value="HIV">HIV</Option>
              <Option value="AIDS">AIDS</Option>
              <Option value="HIV/AIDS">HIV/AIDS</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Text strong className="block mb-2 text-gray-700">Sắp xếp theo</Text>
            <Select
              placeholder="Chọn tiêu chí"
              value={filters.sortBy}
              onChange={(value) => onFilterChange('sortBy', value)}
              allowClear
              style={{ width: '100%' }}
              className="rounded-lg"
            >
              <Option value="name">Tên phác đồ</Option>
              <Option value="createdAt">Ngày tạo</Option>
              <Option value="updatedAt">Ngày cập nhật</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Text strong className="block mb-2 text-gray-700">Thứ tự</Text>
            <Select
              placeholder="Chọn thứ tự"
              value={filters.sortOrder}
              onChange={(value) => onFilterChange('sortOrder', value)}
              allowClear
              style={{ width: '100%' }}
              className="rounded-lg"
            >
              <Option value="asc">Tăng dần</Option>
              <Option value="desc">Giảm dần</Option>
            </Select>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default RegimensFilter;
