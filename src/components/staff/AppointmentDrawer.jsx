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
  getPaymentTag,
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

      {/* Payment Information */}
      {appointment.hasInvoice && (
        <div className="mb-6">
          <Card className="bg-gray-50 border border-gray-200">
            <div className="flex items-center mb-4">
              <DollarOutlined className="text-green-500 mr-2" />
              <Text strong>Thông tin thanh toán</Text>
            </div>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Trạng thái thanh toán">
                {getPaymentTag(appointment.paymentStatus, appointment.invoiceGenerated)}
              </Descriptions.Item>
              <Descriptions.Item label="Số tiền">
                <Text strong className="text-green-600">
                  {appointment.price ? `${appointment.price.toLocaleString()} VNĐ` : 'Chưa xác định'}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Hóa đơn">
                {appointment.invoiceGenerated ? (
                  <Tag color="green">Đã tạo hóa đơn</Tag>
                ) : (
                  <Tag color="orange">Chưa tạo hóa đơn</Tag>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      )}
      
                    {/* Timeline for completed appointments */}
              {['COMPLETED', 'PAID'].includes(appointment.status) && (
                <Timeline className="mb-6">
                  <Timeline.Item color="blue">
                    Đặt lịch hẹn lúc {dayjs.utc(appointment.appointmentTime).format('HH:mm DD/MM/YYYY')}
                  </Timeline.Item>
          <Timeline.Item color="green">
            Hoàn thành khám lúc {appointment.completedTime || 'N/A'}
          </Timeline.Item>
          {appointment.invoiceGenerated && (
            <Timeline.Item color="orange">
              Đã tạo hóa đơn
            </Timeline.Item>
          )}
          {appointment.status === 'PAID' && (
            <Timeline.Item color="green">
              Đã thanh toán
            </Timeline.Item>
          )}
        </Timeline>
      )}
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mt-6">
        <Button icon={<EditOutlined />} onClick={onEdit}>
          Cập nhật thông tin
        </Button>
        
        {/* Invoice generation - only for completed appointments */}
        {appointment.status === 'COMPLETED' && !appointment.invoiceGenerated && (
          <Button 
            type="primary" 
            icon={<DollarOutlined />}
            onClick={() => onGenerateInvoice(appointment)}
            className="bg-green-500 hover:bg-green-600 border-none"
          >
            Tạo hóa đơn
          </Button>
        )}
        
        {/* Mark as paid - only for completed appointments with invoice */}
        {appointment.status === 'COMPLETED' && 
         appointment.invoiceGenerated && 
         appointment.paymentStatus === 'pending_payment' && (
          <Button 
            type="primary" 
            icon={<CheckCircleOutlined />}
            onClick={() => onMarkAsPaid(appointment)}
            className="bg-blue-500 hover:bg-blue-600 border-none"
          >
            Đánh dấu đã thanh toán
          </Button>
        )}
        
        {/* View invoice - for appointments with invoices */}
        {appointment.invoiceGenerated && (
          <Button 
            icon={<FileTextOutlined />}
            className="border-green-500 text-green-600 hover:bg-green-50"
          >
            Xem hóa đơn
          </Button>
        )}
      </div>
    </Drawer>
  );
};

export default AppointmentDrawer; 