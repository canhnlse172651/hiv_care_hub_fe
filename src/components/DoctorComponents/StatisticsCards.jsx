import React from 'react';
import { Card, Statistic } from 'antd';
import { 
  CalendarOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  FileTextOutlined 
} from '@ant-design/icons';

const StatisticsCards = ({ statistics }) => {
  const cards = [
    {
      title: 'Tổng lịch hẹn',
      value: statistics.totalAppointments,
      icon: <CalendarOutlined />,
      color: '#1890ff',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Đã hoàn thành',
      value: statistics.completed,
      icon: <CheckCircleOutlined />,
      color: '#52c41a',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Đang chờ khám',
      value: statistics.waiting,
      icon: <ClockCircleOutlined />,
      color: '#faad14',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'Đã hủy',
      value: statistics.cancelled,
      icon: <FileTextOutlined />,
      color: '#cf1322',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <Card 
          key={index}
          className={`shadow-sm hover:shadow-md transition-shadow ${card.bgColor} ${card.borderColor}`}
        >
          <Statistic 
            title={card.title} 
            value={card.value} 
            valueStyle={{ color: card.color }}
            prefix={card.icon} 
          />
        </Card>
      ))}
    </div>
  );
};

export default StatisticsCards; 