import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  className = "",
  allowClear = true,
  size = "middle"
}) => {
  const handleChange = (e) => {
    onSearch?.(e.target.value);
  };

  return (
    <div className={`flex-1 w-full max-w-[800px] mx-0 md:mx-6 ${className}`}>
      <Input
        placeholder={placeholder}
        prefix={<SearchOutlined className="text-gray-400" />}
        onChange={handleChange}
        allowClear={allowClear}
        size={size}
        className="rounded-full border-gray-300 focus:border-blue-500"
      />
    </div>
  );
};

export default SearchBar; 