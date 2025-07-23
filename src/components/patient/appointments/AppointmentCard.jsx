import React from 'react';
import { Card, Typography, Button, Row, Col, Avatar, Divider, Tag } from 'antd';
import { 
  CalendarOutlined, UserOutlined, MedicineBoxOutlined, 
  PhoneOutlined, VideoCameraOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const AppointmentCard = ({ appointment, onCancel, getStatusTag }) => (
  <Card 
    className="mb-4 shadow-md hover:shadow-lg transition-all duration-300 border-0 rounded-xl overflow-hidden"
    bodyStyle={{ padding: 0 }}
  >
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <MedicineBoxOutlined className="text-blue-600 text-xl" />
          </div>
          <div>
            <Title level={5} className="mb-1 text-gray-900">
              {appointment.service?.name || 'N/A'}
            </Title>
            <Text className="text-gray-500 text-sm">
              {appointment.service?.description}
            </Text>
          </div>
        </div>
        {getStatusTag(appointment.status)}
      </div>

      <Divider className="my-4" />

      {/* Content */}
      <Row gutter={[16, 16]}>
        {/* Date & Time */}
        <Col xs={24} sm={12}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CalendarOutlined className="text-green-600" />
            </div>
            <div>
              <Text className="text-xs text-gray-500 block">Thời gian</Text>
              <Text strong className="text-gray-900">
                {dayjs(appointment.appointmentTime).format('ddd, DD/MM/YYYY')}
              </Text>
              <Text className="text-gray-600 block text-sm">
                {dayjs(appointment.appointmentTime).format('HH:mm')}
              </Text>
            </div>
          </div>
        </Col>

        {/* Doctor */}
        <Col xs={24} sm={12}>
          <div className="flex items-center space-x-3">
            <Avatar 
              size={40} 
              icon={<UserOutlined />}
              className="bg-purple-100 text-purple-600"
            />
            <div>
              <Text className="text-xs text-gray-500 block">Bác sĩ</Text>
              {appointment.doctor ? (
                <>
                  <Text strong className="text-gray-900 block">
                    {appointment.doctor.user.name}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    {appointment.doctor.user.email}
                  </Text>
                </>
              ) : (
                <Text className="text-gray-500">
                  {appointment.isAnonymous ? 'Tư vấn ẩn danh' : 'N/A'}
                </Text>
              )}
            </div>
          </div>
        </Col>
      </Row>

      {/* Appointment Type */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {appointment.type === 'ONLINE' ? (
            <VideoCameraOutlined className="text-blue-600" />
          ) : (
            <PhoneOutlined className="text-green-600" />
          )}
          <Text className="font-medium">
            {appointment.type === 'ONLINE' ? 'Tư vấn trực tuyến' : 'Khám tại phòng khám'}
          </Text>
        </div>
        <Tag 
          color={appointment.type === 'ONLINE' ? 'blue' : 'green'} 
          className="rounded-full"
        >
          {appointment.type === 'ONLINE' ? 'Online' : 'Offline'}
        </Tag>
      </div>

      {/* Actions */}
      {['PENDING', 'CONFIRMED'].includes(appointment.status.toUpperCase()) && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Button
            danger
            onClick={() => onCancel(appointment.id)}
            className="rounded-lg"
          >
            Hủy lịch hẹn
          </Button>
        </div>
      )}
    </div>
  </Card>
);

export default AppointmentCard;
