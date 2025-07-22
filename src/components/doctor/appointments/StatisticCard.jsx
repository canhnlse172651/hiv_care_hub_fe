import React from 'react';
import { Card, Statistic } from 'antd';

const StatisticCard = ({ 
  title, 
  value, 
  icon, 
  color = '#3b82f6', 
  bgGradient = 'from-blue-50 to-blue-100',
  iconBgColor = 'bg-blue-100',
  iconColor = 'text-blue-600'
}) => {
  return (
    <Card className={`shadow-lg border-0 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${bgGradient}`}>
      <Statistic 
        title={<span className="text-gray-600 font-medium">{title}</span>}
        value={value} 
        valueStyle={{ color: color, fontSize: '28px', fontWeight: 'bold' }}
        prefix={
          <div className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}>
            <span className={iconColor}>{icon}</span>
          </div>
        }
      />
    </Card>
  );
};

export default StatisticCard;
