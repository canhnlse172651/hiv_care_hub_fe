import React from 'react';
import { Card, Space, Avatar } from 'antd';

const RecentActivity = () => {
  const recentActivities = [
    {
      key: '1',
      user: 'John Doe',
      activity: 'Posted new forum topic',
      time: '2 hours ago',
      avatar: 'J'
    },
    {
      key: '2',
      user: 'Jane Smith',
      activity: 'Submitted new question',
      time: '3 hours ago',
      avatar: 'S'
    },
    {
      key: '3',
      user: 'Robert Johnson',
      activity: 'Updated profile information',
      time: '5 hours ago',
      avatar: 'R'
    },
  ];

  return (
    <Card title="Recent Activity">
      <Space direction="vertical" className="w-full">
        {recentActivities.map(item => (
          <Card key={item.key} size="small" className="mb-2">
            <Space>
              <Avatar className="bg-blue-500">{item.avatar}</Avatar>
              <div>
                <div><strong>{item.user}</strong></div>
                <div>{item.activity}</div>
                <div className="text-xs text-gray-500">{item.time}</div>
              </div>
            </Space>
          </Card>
        ))}
      </Space>
    </Card>
  );
};

export default RecentActivity;
