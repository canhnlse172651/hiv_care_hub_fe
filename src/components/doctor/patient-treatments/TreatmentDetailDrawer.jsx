import React from 'react';
import { Drawer, Descriptions, Timeline, Button, Typography } from 'antd';
import dayjs from 'dayjs';

const { Title } = Typography;

const TreatmentDetailDrawer = ({ 
  visible, 
  onClose, 
  treatment, 
  onBusinessRulesCheck 
}) => {
  if (!treatment) return null;

  return (
    <Drawer
      title="Chi tiết phác đồ điều trị"
      placement="right"
      width={600}
      open={visible}
      onClose={onClose}
    >
      <Descriptions title="Thông tin cơ bản" bordered column={1}>
        <Descriptions.Item label="Mã điều trị">
          PT-{treatment.id.toString().padStart(6, '0')}
        </Descriptions.Item>
        <Descriptions.Item label="Bệnh nhân">
          {treatment.patient?.name} (ID: {treatment.patientId})
        </Descriptions.Item>
        <Descriptions.Item label="Phác đồ">
          {treatment.protocol?.name} (ID: {treatment.protocolId})
        </Descriptions.Item>
        <Descriptions.Item label="Ngày bắt đầu">
          {dayjs(treatment.startDate).format('DD/MM/YYYY')}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày kết thúc">
          {treatment.endDate ? dayjs(treatment.endDate).format('DD/MM/YYYY') : 'Chưa kết thúc'}
        </Descriptions.Item>
        <Descriptions.Item label="Chi phí">
          {treatment.total ? `${treatment.total.toLocaleString()} VNĐ` : 'Chưa tính'}
        </Descriptions.Item>
        <Descriptions.Item label="Ghi chú">
          {treatment.notes || 'Không có'}
        </Descriptions.Item>
      </Descriptions>

      {treatment.customMedications && (
        <div className="mt-4">
          <Title level={5}>Thuốc tùy chỉnh</Title>
          <Timeline>
            {Array.isArray(treatment.customMedications) ? 
              treatment.customMedications.map((med, index) => (
                <Timeline.Item key={index}>
                  <div className="font-medium">{med.name || `Thuốc ${index + 1}`}</div>
                  <div className="text-sm text-gray-500">
                    Liều: {med.dose} | Tần suất: {med.frequency}
                  </div>
                </Timeline.Item>
              )) : 
              Object.entries(treatment.customMedications).map(([key, med]) => (
                <Timeline.Item key={key}>
                  <div className="font-medium">{med.name || key}</div>
                  <div className="text-sm text-gray-500">
                    Liều: {med.dose} | Tần suất: {med.frequency}
                  </div>
                </Timeline.Item>
              ))
            }
          </Timeline>
        </div>
      )}

      <div className="mt-4">
        <Button 
          type="primary" 
          onClick={() => onBusinessRulesCheck(treatment.patientId)}
        >
          Kiểm tra quy tắc kinh doanh
        </Button>
      </div>
    </Drawer>
  );
};

export default TreatmentDetailDrawer;
