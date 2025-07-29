import React from 'react';
import { Table, Button, Space, Tag, Avatar, Tooltip } from 'antd';
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CheckOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const AppointmentTable = ({ 
  appointments, 
  loading, 
  pagination, 
  onEdit, 
  onDelete, 
  onGenerateInvoice,
  onMarkAsPaid,
  onConfirmAppointment,
  getStatusTag
}) => {
  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_, __, index) => (
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
          {index + 1}
        </div>
      ),
    },
    {
      title: 'Bệnh nhân',
      key: 'patient',
      width: 200,
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            src={record.avatar} 
            icon={<UserOutlined />} 
            size={40}
            className="bg-gradient-to-r from-blue-400 to-blue-600 shadow-md"
          />
          <div>
            <div className="font-semibold text-gray-900">{record.patientName}</div>
            <div className="text-gray-500 text-sm">{record.phone}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Thời gian',
      key: 'datetime',
      width: 150,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <CalendarOutlined className="text-blue-500 text-xs" />
            <span className="font-medium text-gray-900">
              {dayjs.utc(record.appointmentTime).format('DD/MM/YYYY')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <ClockCircleOutlined className="text-orange-500 text-xs" />
            <span className="text-gray-700">{dayjs.utc(record.appointmentTime).format('HH:mm')}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Bác sĩ',
      dataIndex: 'doctor',
      key: 'doctor',
      width: 150,
      render: (text) => (
        <div className="flex items-center space-x-2">
          <Avatar icon={<UserOutlined />} size="small" className="bg-purple-500" />
          <span className="font-medium text-gray-900">{text}</span>
        </div>
      ),
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'department',
      key: 'department',
      width: 150,
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 180, // Increased width for better appearance
      align: 'center', // Center the content
      render: (_, record) => getStatusTag(record.status),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {/* Move "Thanh toán" button to PENDING status */}
          {record.status === 'PENDING' && (
            <Button 
              type="primary" 
              size="small"
              onClick={() => onGenerateInvoice(record)}
              className="bg-blue-500 hover:bg-blue-600 border-none rounded-lg"
            >
              Thanh toán
            </Button>
          )}
          {/* Remove "Thanh toán" button from COMPLETED status */}
          {/* Remove Mark as paid and View invoice buttons */}
        </Space>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={appointments}
      loading={loading}
      pagination={{ 
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} lịch hẹn`
      }}
      rowKey="id"
      scroll={{ x: 'max-content' }}
      rowClassName="hover:bg-blue-50 transition-colors duration-200"
    />
  );
};

export default AppointmentTable;