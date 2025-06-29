import React from 'react';
import { Card, Avatar, Divider, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

const PatientInfoCard = ({ patient, appointmentInfo = null }) => {
  if (!patient) return null;

  return (
    <Card className="shadow-md">
      <div className="flex items-center mb-4">
        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
          <UserOutlined className="text-xl text-blue-500" />
        </div>
        <div>
          <div className="font-bold text-lg">{patient.name}</div>
          <div className="text-gray-500 text-sm">{patient.age} tuổi | {patient.gender}</div>
        </div>
      </div>

      <Divider className="my-3" />
      
      <div className="mb-3">
        <div className="font-medium mb-1">Thông tin cá nhân</div>
        <div className="text-sm space-y-1">
          <div><strong>Ngày sinh:</strong> {dayjs(patient.dob).format('DD/MM/YYYY')}</div>
          <div><strong>CMND/CCCD:</strong> {patient.idNumber}</div>
          <div><strong>SĐT:</strong> {patient.phone}</div>
          <div><strong>Email:</strong> {patient.email}</div>
          <div><strong>Địa chỉ:</strong> {patient.address}</div>
        </div>
      </div>
      
      {appointmentInfo && (
        <>
          <Divider className="my-3" />
          
          <div className="mb-3">
            <div className="font-medium mb-1">Thông tin buổi khám</div>
            <div className="text-sm space-y-1">
              <div><strong>Mã lịch hẹn:</strong> {appointmentInfo.appointmentId}</div>
              <div><strong>Giờ hẹn:</strong> {appointmentInfo.appointmentTime}</div>
              <div><strong>Check-in lúc:</strong> {appointmentInfo.checkInTime}</div>
              <div><strong>Lý do khám:</strong> {appointmentInfo.reason}</div>
            </div>
          </div>
        </>
      )}
      
      <Divider className="my-3" />
      
      <div className="mb-3">
        <div className="font-medium mb-1">Thông tin y tế</div>
        <div className="text-sm space-y-1">
          {patient.isHivPositive && (
            <>
              <div><strong>Bắt đầu điều trị:</strong> {dayjs(patient.startedTreatment).format('DD/MM/YYYY')}</div>
              <div><strong>Phác đồ hiện tại:</strong> {patient.currentRegimen}</div>
            </>
          )}
          <div><strong>Dị ứng:</strong> {patient.allergies}</div>
          <div><strong>Bệnh mạn tính:</strong> {patient.chronicConditions}</div>
        </div>
      </div>
    </Card>
  );
};

export default PatientInfoCard; 