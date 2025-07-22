import React from 'react';
import { Card, Input } from 'antd';

const MedicineFilters = ({ 
  search, 
  onSearchChange, 
  filterUnit, 
  onFilterUnitChange, 
  filterDose, 
  onFilterDoseChange, 
  uniqueUnits, 
  uniqueDoses 
}) => {
  return (
    <Card className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <Input
          placeholder="Tìm kiếm theo tên"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          allowClear
        />
        <select
          value={filterUnit}
          onChange={e => onFilterUnitChange(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Tất cả đơn vị</option>
          {uniqueUnits.map(unit => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
        <select
          value={filterDose}
          onChange={e => onFilterDoseChange(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Tất cả liều lượng</option>
          {uniqueDoses.map(dose => (
            <option key={dose} value={dose}>{dose}</option>
          ))}
        </select>
      </div>
    </Card>
  );
};

export default MedicineFilters;
