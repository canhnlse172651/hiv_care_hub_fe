import React from 'react';
import { Card, Avatar, Button, Typography } from 'antd';
import { CheckCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title } = Typography;

const CompletedAppointments = ({ appointments }) => {
  return (
    <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircleOutlined className="text-green-600" />
          </div>
          <Title level={5} className="mb-0 text-gray-900">
            Đã hoàn thành hôm nay
          </Title>
        </div>

        <div className="space-y-2">
          {appointments.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              Chưa có lịch hẹn nào hoàn thành
            </div>
          ) : (
            appointments.map(appointment => (
              <div key={appointment.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                <Link to={`/doctor/medical-records/${appointment.user?.id}`}>
                  <Avatar 
                    src={appointment.user?.avatar} 
                    icon={<UserOutlined />} 
                    size={32}
                    className="bg-gradient-to-r from-blue-400 to-blue-600 shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200" 
                  />
                </Link>
                <div className="flex-1">
                  <Link 
                    to={`/doctor/medical-records/${appointment.user?.id}`}
                    className="text-sm font-medium hover:text-blue-600 transition-colors duration-200"
                  >
                    {appointment.user?.name || 'Không có tên'}
                  </Link>
                  <div className="text-xs text-gray-500">
                    {dayjs(appointment.appointmentTime).format('HH:mm')} - {appointment.service?.name}
                  </div>
                </div>
                <Link to={`/doctor/medical-records/${appointment.user?.id}`}>
                  <Button type="link" size="small" className="hover:text-blue-600">Chi tiết</Button>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};

export default CompletedAppointments;
