import React from 'react';
import { Table, Button, Space, Tooltip, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const MedicineTable = ({ 
  medicines, 
  loading, 
  onEdit, 
  onDelete, 
  uniqueUnits, 
  uniqueDoses 
}) => {
  // Debug: log medicines to verify data passed in
  console.log('MedicineTable medicines:', medicines);

  const columns = [
    {
      title: 'Tên thuốc',
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
      title: 'Đơn vị',
      dataIndex: 'unit',
      key: 'unit',
      filters: uniqueUnits.map(unit => ({ text: unit, value: unit })),
      onFilter: (value, record) => record.unit === value,
    },
    {
      title: 'Liều lượng',
      dataIndex: 'dose',
      key: 'dose',
      filters: uniqueDoses.map(dose => ({ text: dose, value: dose })),
      onFilter: (value, record) => record.dose === value,
    },
    {
      title: 'Giá (USD)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <span>{price}</span>,
      sorter: (a, b) => parseFloat(a.price) - parseFloat(b.price),
    },
    {
      title: 'Hành động',
      key: 'actions',
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
            title="Bạn có chắc muốn xóa thuốc này?"
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
      dataSource={
        Array.isArray(medicines)
          ? medicines.map(med => ({
              ...med,
              key: med.id || med._id // Ensure key is present
            }))
          : []
      }
      loading={loading}
      pagination={{ pageSize: 10 }}
      rowKey="key"
      scroll={{ x: 'max-content' }}
      locale={{ emptyText: 'Không có thuốc nào' }}
    />
  );
};

export default MedicineTable;
