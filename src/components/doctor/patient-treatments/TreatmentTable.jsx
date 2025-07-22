import React from 'react';
import { Table, Space, Button, Tooltip, Popconfirm, Badge, Tag } from 'antd';
import { InfoCircleOutlined, CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const TreatmentTable = ({ 
  treatments, 
  loading, 
  pagination, 
  onPaginationChange,
  onViewTreatment,
  onEndTreatment,
  onDeleteTreatment
}) => {
  const columns = [
    {
      title: 'Mã điều trị',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id) => `PT-${id.toString().padStart(6, '0')}`
    },
    {
      title: 'Bệnh nhân',
      dataIndex: 'patient',
      key: 'patient',
      render: (patient) => (
        <div>
          <div className="font-medium">{patient?.name}</div>
          <div className="text-sm text-gray-500">ID: {patient?.id}</div>
        </div>
      )
    },
    {
      title: 'Phác đồ',
      dataIndex: 'protocol',
      key: 'protocol',
      render: (protocol) => (
        <div>
          <div className="font-medium">{protocol?.name}</div>
          <div className="text-sm text-gray-500">ID: {protocol?.id}</div>
        </div>
      )
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        const isActive = !record.endDate || dayjs(record.endDate).isAfter(dayjs());
        return (
          <Badge 
            status={isActive ? 'processing' : 'default'} 
            text={isActive ? 'Đang điều trị' : 'Đã kết thúc'} 
          />
        );
      }
    },
    {
      title: 'Thuốc tùy chỉnh',
      dataIndex: 'customMedications',
      key: 'customMedications',
      render: (customMeds) => {
        if (!customMeds || (Array.isArray(customMeds) && customMeds.length === 0)) {
          return <Tag color="default">Không có</Tag>;
        }
        return <Tag color="blue">Có</Tag>;
      }
    },
    {
      title: 'Chi phí',
      dataIndex: 'total',
      key: 'total',
      render: (total) => (
        <span className="font-medium">
          {total ? `${total.toLocaleString()} VNĐ` : 'Chưa tính'}
        </span>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<InfoCircleOutlined />} 
              onClick={() => onViewTreatment(record.id)}
            />
          </Tooltip>
          {(!record.endDate || dayjs(record.endDate).isAfter(dayjs())) && (
            <Tooltip title="Kết thúc điều trị">
              <Button 
                type="text" 
                icon={<CheckCircleOutlined />} 
                onClick={() => onEndTreatment(record.id)}
              />
            </Tooltip>
          )}
          <Popconfirm
            title="Bạn có chắc muốn xóa phác đồ điều trị này?"
            onConfirm={() => onDeleteTreatment(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Xóa">
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={treatments}
      rowKey="id"
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => 
          `${range[0]}-${range[1]} của ${total} bản ghi`
      }}
      onChange={(paginationInfo) => onPaginationChange(paginationInfo)}
    />
  );
};

export default TreatmentTable;
