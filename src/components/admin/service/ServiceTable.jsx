import React from 'react';
import { Table, Button, Space, Tooltip, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ServiceType } from '@/constant/general';

const serviceTypeOptions = [
  { value: ServiceType.TEST, label: 'Xét nghiệm' },
  { value: ServiceType.CONSULT, label: 'Tư vấn' },
  { value: ServiceType.TREATMENT, label: 'Điều trị' },
];

const ServiceTable = ({ 
  services, 
  loading, 
  onEdit, 
  onDelete 
}) => {
  const columns = [
    {
      title: 'Tên dịch vụ',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      filters: serviceTypeOptions,
      onFilter: (value, record) => record.type === value,
      render: (type) => {
        const found = serviceTypeOptions.find(opt => opt.value === type);
        return found ? found.label : type;
      },
    },
    {
      title: 'Giá (USD)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <span>{price}</span>,
      sorter: (a, b) => parseFloat(a.price) - parseFloat(b.price),
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: 'Thời lượng',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Hành động',
      key: 'actions',
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              icon={<EditOutlined />}
              shape="circle"
              size="middle"
              style={{ border: '1px solid #1890ff', color: '#1890ff', background: '#fff' }}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc muốn xóa dịch vụ này?"
            onConfirm={() => onDelete(record.id || record._id)}
            okText="Xác nhận"
            cancelText="Hủy"
            placement="left"
          >
            <Tooltip title="Xóa">
              <Button
                icon={<DeleteOutlined />}
                shape="circle"
                size="middle"
                style={{ border: '1px solid #ff4d4f', color: '#ff4d4f', background: '#fff' }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={services.map(svc => ({ ...svc, key: svc.id || svc._id }))}
      loading={loading}
      pagination={{ pageSize: 10 }}
      rowKey="key"
      scroll={{ x: 'max-content' }}
      locale={{ emptyText: 'Không có dịch vụ nào' }}
    />
  );
};

export default ServiceTable;
