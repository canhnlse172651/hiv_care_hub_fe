import React from 'react';
import { Space, DatePicker, Select, Input, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const { RangePicker } = DatePicker;
const { Option } = Select;

const TableFilters = ({
  filters = [],
  onFilterChange,
  onReset,
  className = "",
  ...props
}) => {
  const renderFilter = (filter) => {
    const { type, key, placeholder, options, ...filterProps } = filter;

    switch (type) {
      case 'dateRange':
        return (
          <RangePicker
            key={key}
            placeholder={placeholder || ['Start date', 'End date']}
            onChange={(dates) => onFilterChange(key, dates)}
            className="w-64"
            {...filterProps}
          />
        );
      
      case 'select':
        return (
          <Select
            key={key}
            placeholder={placeholder}
            allowClear
            className="w-48"
            onChange={(value) => onFilterChange(key, value)}
            {...filterProps}
          >
            {options?.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );
      
      case 'input':
        return (
          <Input
            key={key}
            placeholder={placeholder}
            allowClear
            className="w-48"
            onChange={(e) => onFilterChange(key, e.target.value)}
            {...filterProps}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`} {...props}>
      <Space wrap>
        {filters.map(renderFilter)}
        {onReset && (
          <Button
            icon={<ReloadOutlined />}
            onClick={onReset}
            size="small"
          >
            Reset
          </Button>
        )}
      </Space>
    </div>
  );
};

TableFilters.propTypes = {
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['dateRange', 'select', 'input']).isRequired,
      key: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.any.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
    })
  ),
  onFilterChange: PropTypes.func,
  onReset: PropTypes.func,
  className: PropTypes.string,
};

export default TableFilters; 