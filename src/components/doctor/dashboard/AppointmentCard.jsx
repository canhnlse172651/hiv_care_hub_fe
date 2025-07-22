import React from 'react';
import { Card, Avatar, Tag, Button, Space } from 'antd';
import { UserOutlined, CalendarOutlined, ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const AppointmentCard = ({ appointment, showActions = true, size = 'default', showMedicalRecordLink = false }) => {
  const getStatusTag = (status, type) => {
    const statusConfig = {
      'PENDING': { color: 'gold', text: 'Đang chờ', icon: <ClockCircleOutlined /> },
      'CONFIRMED': { color: 'blue', text: 'Đã xác nhận', icon: <CheckCircleOutlined /> },
      'COMPLETED': { color: 'green', text: 'Hoàn thành', icon: <CheckCircleOutlined /> },
      'CANCELLED': { color: 'red', text: 'Đã hủy', icon: <ExclamationCircleOutlined /> }
    };

    const typeConfig = {
      'OFFLINE': { color: 'orange', text: 'Tại phòng khám' },
      'ONLINE': { color: 'purple', text: 'Trực tuyến' }
    };

    const statusInfo = statusConfig[status] || { color: 'default', text: status, icon: null };
    const typeInfo = typeConfig[type] || { color: 'default', text: type };

    return (
      <Space direction="vertical" size="small">
        <Tag color={statusInfo.color} className="rounded-full px-3 py-1 font-medium">
          {statusInfo.icon} {statusInfo.text}
        </Tag>
        <Tag color={typeInfo.color} className="rounded-full px-3 py-1 font-medium">
          {typeInfo.text}
        </Tag>
      </Space>
    );
  };

  const isSmall = size === 'small';

  return (
    <Card 
      className={`shadow-md hover:shadow-lg transition-all duration-300 border-0 rounded-xl ${isSmall ? 'mb-2' : 'mb-4'}`}
      bodyStyle={{ padding: isSmall ? '12px' : '20px' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          {showMedicalRecordLink ? (
            <Link to={`/doctor/medical-records/${appointment.user?.id}`}>
              <Avatar 
                src={appointment.user?.avatar} 
                icon={<UserOutlined />} 
                size={isSmall ? 40 : 48}
                className="bg-gradient-to-r from-blue-400 to-blue-600 shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200" 
              />
            </Link>
          ) : (
            <Avatar 
              src={appointment.user?.avatar} 
              icon={<UserOutlined />} 
              size={isSmall ? 40 : 48}
              className="bg-gradient-to-r from-blue-400 to-blue-600 shadow-md" 
            />
          )}
          <div className="flex-1">
            {showMedicalRecordLink ? (
              <Link 
                to={`/doctor/medical-records/${appointment.user?.id}`}
                className={`font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 ${isSmall ? 'text-sm' : 'text-base'}`}
              >
                {appointment.user?.name || 'Không có tên'}
              </Link>
            ) : (
              <div className={`font-semibold text-gray-900 ${isSmall ? 'text-sm' : 'text-base'}`}>
                {appointment.user?.name || 'Không có tên'}
              </div>
            )}
            <div className={`text-gray-500 ${isSmall ? 'text-xs' : 'text-sm'}`}>
              {appointment.service?.name || 'Không có dịch vụ'}
            </div>
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center space-x-1">
                <CalendarOutlined className="text-blue-500 text-xs" />
                <span className={`text-gray-600 ${isSmall ? 'text-xs' : 'text-sm'}`}>
                  {dayjs(appointment.appointmentTime).format('DD/MM/YYYY')}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <ClockCircleOutlined className="text-orange-500 text-xs" />
                <span className={`text-gray-600 ${isSmall ? 'text-xs' : 'text-sm'}`}>
                  {dayjs(appointment.appointmentTime).format('HH:mm')}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {getStatusTag(appointment.status, appointment.type)}
          {showActions && appointment.status === 'PENDING' && (
            <Link to={`/doctor/consultation/${appointment.id}`}>
              <Button 
                type="primary" 
                size={isSmall ? 'small' : 'middle'}
                className="bg-blue-500 hover:bg-blue-600 border-none rounded-lg"
              >
                Khám ngay
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AppointmentCard;