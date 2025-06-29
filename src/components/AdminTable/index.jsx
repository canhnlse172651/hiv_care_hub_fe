import React from 'react';
import { Table, Input, Space, Button, Tag, Tooltip } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const { Search } = Input;

const AdminTable = ({
  title,
  columns,
  dataSource,
  loading,
  pagination,
  onTableChange,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  onSearch,
  extraActions,
  showSearch = true,
  showRefresh = true,
  onRefresh,
  rowKey = "id",
  scroll = { x: 'max-content' },
  className = "",
  ...tableProps
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-0">{title}</h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search */}
            {showSearch && (
              <Search
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                onSearch={onSearch}
                allowClear
                className="w-full sm:w-64"
                prefix={<SearchOutlined className="text-gray-400" />}
              />
            )}
            
            {/* Extra Actions */}
            {extraActions && (
              <Space>
                {extraActions}
              </Space>
            )}
            
            {/* Refresh Button */}
            {showRefresh && onRefresh && (
              <Button
                icon={<ReloadOutlined />}
                onClick={onRefresh}
                loading={loading}
                className="flex-shrink-0"
              >
                Refresh
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={pagination}
          onChange={onTableChange}
          rowKey={rowKey}
          scroll={scroll}
          className="admin-table"
          {...tableProps}
        />
      </div>
    </div>
  );
};

AdminTable.propTypes = {
  title: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  pagination: PropTypes.object,
  onTableChange: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func,
  onSearch: PropTypes.func,
  extraActions: PropTypes.node,
  showSearch: PropTypes.bool,
  showRefresh: PropTypes.bool,
  onRefresh: PropTypes.func,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  scroll: PropTypes.object,
  className: PropTypes.string,
};

export default AdminTable; 