import React from 'react';
import { Table, Tag, Button, Space, Popconfirm, Typography, Pagination } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Paragraph } = Typography;

const RegimensTable = ({ 
  protocols, 
  loading, 
  pagination,
  onPaginationChange,
  onViewProtocol,
  onEditProtocol,
  onDeleteProtocol
}) => {
  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_, __, index) => (
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
          {(pagination.current - 1) * pagination.pageSize + index + 1}
        </div>
      ),
    },
    {
      title: 'Tên phác đồ',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="font-semibold text-gray-900">{text}</span>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      render: (text) => (
        <div className="text-gray-600">
          <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'xem thêm' }}>
            {text}
          </Paragraph>
        </div>
      )
    },
    {
      title: 'Bệnh điều trị',
      dataIndex: 'targetDisease',
      key: 'targetDisease',
      render: (text) => (
        <Tag color="blue" className="rounded-full px-3 py-1 font-medium">
          {text}
        </Tag>
      ),
    },
    {
      title: 'Thuốc',
      key: 'medicines',
      render: (_, record) => (
        <div className="space-y-1">
          {record.medicines && record.medicines.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {record.medicines.slice(0, 3).map((item) => (
                <Tag color="purple" key={item.medicine.id} className="rounded-full text-xs">
                  {item.medicine.name}
                </Tag>
              ))}
              {record.medicines.length > 3 && (
                <Tag className="rounded-full text-xs bg-gray-100 text-gray-600">
                  +{record.medicines.length - 3} thuốc khác
                </Tag>
              )}
            </div>
          ) : (
            <Text type="secondary" className="italic">Không có thuốc</Text>
          )}
        </div>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => (
        <div className="text-gray-600">
          {dayjs(text).format('DD/MM/YYYY')}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small"
            onClick={() => onViewProtocol(record)}
            className="bg-blue-500 hover:bg-blue-600 border-none rounded-lg"
          >
            Chi tiết
          </Button>
          <Button 
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEditProtocol(record)}
            className="border-gray-300 rounded-lg hover:border-blue-400 hover:text-blue-600"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa phác đồ"
            description="Bạn có chắc chắn muốn xóa phác đồ này không?"
            onConfirm={() => onDeleteProtocol(record.id)}
            okText="Có"
            cancelText="Không"
            okButtonProps={{ className: 'bg-red-500 hover:bg-red-600 border-red-500' }}
          >
            <Button 
              danger 
              size="small"
              icon={<DeleteOutlined />}
              className="rounded-lg"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={protocols}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{ x: 'max-content' }}
        rowClassName="hover:bg-blue-50 transition-colors duration-200"
        className="custom-table"
      />
      
      <div className="mt-6 flex justify-center">
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          showSizeChanger={pagination.showSizeChanger}
          showQuickJumper={pagination.showQuickJumper}
          showTotal={pagination.showTotal}
          onChange={onPaginationChange}
          onShowSizeChange={onPaginationChange}
          className="custom-pagination"
        />
      </div>
    </>
  );
};

export default RegimensTable;
