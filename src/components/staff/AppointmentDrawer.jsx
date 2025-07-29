import React from 'react';
import { Drawer, Space, Descriptions, Avatar, Timeline, Button, Tag, Card } from 'antd';
import { 
  UserOutlined, 
  DollarOutlined, 
  EditOutlined,
  CheckCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { Typography } from 'antd';
import dayjs from 'dayjs';

const { Text } = Typography;

const AppointmentDrawer = ({ 
  visible, 
  onClose, 
  appointment, 
  getStatusTag, 
  onEdit,
  onGenerateInvoice,
  onMarkAsPaid
}) => {
  if (!appointment) return null;

  return (
    <Drawer
      title={
        <Space size="middle">
          <span className="text-xl font-bold">Chi tiết cuộc hẹn</span>
          {getStatusTag(appointment.status)}
        </Space>
      }
      width={700}
      placement="right"
      onClose={onClose}
      open={visible}
    >
      <div className="mb-6 flex items-center">
        <Avatar size={64} icon={<UserOutlined />} className="bg-blue-500 mr-4" />
        <div>
          <Text className="text-xl font-medium block">{appointment.patientName}</Text>
          <Text type="secondary">Mã bệnh nhân: {appointment.id}</Text>
        </div>
      </div>
      
      <Descriptions title="Thông tin lịch hẹn" bordered column={1} className="mb-6">
        <Descriptions.Item label="Mã lịch hẹn">{appointment.id}</Descriptions.Item>
        <Descriptions.Item label="Ngày hẹn">{dayjs.utc(appointment.appointmentTime).format('DD/MM/YYYY')}</Descriptions.Item>
        <Descriptions.Item label="Giờ hẹn">{dayjs.utc(appointment.appointmentTime).format('HH:mm')}</Descriptions.Item>
        <Descriptions.Item label="Bác sĩ khám">{appointment.doctor}</Descriptions.Item>
        <Descriptions.Item label="Dịch vụ">{appointment.department}</Descriptions.Item>
        <Descriptions.Item label="Lý do khám">{appointment.reason}</Descriptions.Item>
        <Descriptions.Item label="Chi phí">
          {appointment.price ? `${appointment.price.toLocaleString()} VNĐ` : 'Chưa xác định'}
        </Descriptions.Item>
        <Descriptions.Item label="Ghi chú">{appointment.notes || 'Không có'}</Descriptions.Item>
      </Descriptions>
      
      <Descriptions title="Thông tin liên hệ" bordered column={1} className="mb-6">
        <Descriptions.Item label="Số điện thoại">{appointment.phone}</Descriptions.Item>
        <Descriptions.Item label="Email">{appointment.email}</Descriptions.Item>
      </Descriptions>

      {/* Timeline for completed appointments */}
      {appointment.status === 'COMPLETED' && (
        <Timeline className="mb-6">
          <Timeline.Item color="blue">
            Đặt lịch hẹn lúc {dayjs.utc(appointment.appointmentTime).format('HH:mm DD/MM/YYYY')}
          </Timeline.Item>
          <Timeline.Item color="green">
            Hoàn thành khám lúc {appointment.completedTime || 'N/A'}
          </Timeline.Item>
        </Timeline>
      )}

      {/* Timeline for cancelled appointments */}
      {appointment.status === 'CANCELLED' && (
        <Timeline className="mb-6">
          <Timeline.Item color="blue">
            Đặt lịch hẹn lúc {dayjs.utc(appointment.appointmentTime).format('HH:mm DD/MM/YYYY')}
          </Timeline.Item>
          <Timeline.Item color="red">
            Đã hủy lịch hẹn
          </Timeline.Item>
        </Timeline>
      )}

      {/* Timeline for pending/paid appointments */}
      {['PENDING', 'PAID'].includes(appointment.status) && (
        <Timeline className="mb-6">
          <Timeline.Item color="blue">
            Đặt lịch hẹn lúc {dayjs.utc(appointment.appointmentTime).format('HH:mm DD/MM/YYYY')}
          </Timeline.Item>
        </Timeline>
      )}
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mt-6">
        <Button icon={<EditOutlined />} onClick={onEdit}>
          Cập nhật thông tin
        </Button>
        
        {/* Only show payment button for PENDING */}
        {appointment.status === 'PENDING' && (
          <Button 
            type="primary" 
            icon={<DollarOutlined />}
            onClick={() => onGenerateInvoice(appointment)}
            className="bg-green-500 hover:bg-green-600 border-none"
          >
            Thanh toán
          </Button>
        )}
      </div>
    </Drawer>
  );
};

export default AppointmentDrawer;