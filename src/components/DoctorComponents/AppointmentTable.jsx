import React from 'react';
import { Table, Button, Space, Avatar, Tag } from 'antd';
import { UserOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const AppointmentTable = ({ 
  dataSource, 
  loading = false, 
  showActions = true, 
  actionType = 'consultation' 
}) => {
  const getStatusTag = (status, priority) => {
    if (status === 'waiting') {
      return priority === 'high' ? 
        <Tag color="orange" icon={<ClockCircleOutlined />}>Ưu tiên</Tag> :
        <Tag color="blue" icon={<ClockCircleOutlined />}>Đang chờ</Tag>;
    }
    return <Tag color="green" icon={<CheckCircleOutlined />}>Hoàn thành</Tag>;
  };

  const getActionButton = (record) => {
    if (!showActions) return null;
    return null; // No actions needed since we removed consultation and medical-records routes
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Bệnh nhân',
      key: 'patient',
      width: 220,
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} className="bg-blue-500" />
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-gray-500 text-xs">
              {record.age} tuổi | {record.gender} | Mã: {record.id}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Giờ hẹn',
      dataIndex: 'appointmentTime',
      key: 'appointmentTime',
      width: 100,
      render: (time) => <span className="text-gray-600">{time}</span>
    },
    {
      title: 'Lý do khám',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 120,
      render: (_, record) => getStatusTag(record.status, record.priority)
    },
    ...(showActions ? [{
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_, record) => getActionButton(record),
    }] : [])
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey="id"
      loading={loading}
      pagination={false}
      scroll={{ x: 'max-content' }}
      className="border rounded-lg overflow-hidden"
    />
  );
};

export default AppointmentTable; 