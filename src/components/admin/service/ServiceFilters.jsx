import React from 'react';
import { Card, Input, Select } from 'antd';
import { ServiceType } from '@/constant/general';

const serviceTypeOptions = [
  { value: ServiceType.TEST, label: 'Xét nghiệm' },
  { value: ServiceType.CONSULT, label: 'Tư vấn' },
  { value: ServiceType.TREATMENT, label: 'Điều trị' },
];

const ServiceFilters = ({ 
  search, 
  onSearchChange, 
  filterType, 
  onFilterTypeChange 
}) => {
  return (
    <Card className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <Input
          placeholder="Tìm kiếm theo tên"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          allowClear
        />
        <Select
          placeholder="Lọc theo loại"
          value={filterType || undefined}
          onChange={value => onFilterTypeChange(value)}
          allowClear
          style={{ width: '100%' }}
          options={serviceTypeOptions}
        />
      </div>
    </Card>
  );
};

export default ServiceFilters;
