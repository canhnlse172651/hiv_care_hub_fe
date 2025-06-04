import React from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Table, 
  Typography, 
  Progress,
  Space,
  Avatar
} from 'antd';
import { 
  UserOutlined, 
  ShoppingCartOutlined, 
  DollarOutlined, 
  RiseOutlined,
  MessageOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const Dashboard = () => {
  // Example data - in a real app, this would come from API
  const recentUsers = [
    {
      key: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      registered: '2025-05-28',
      status: 'active',
    },
    {
      key: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      registered: '2025-05-26',
      status: 'active',
    },
    {
      key: '3',
      name: 'Robert Johnson',
      email: 'robert@example.com',
      registered: '2025-05-25',
      status: 'inactive',
    },
    {
      key: '4',
      name: 'Emily Wilson',
      email: 'emily@example.com',
      registered: '2025-05-24',
      status: 'active',
    },
  ];

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

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Registered Date',
      dataIndex: 'registered',
      key: 'registered',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',      render: (status) => (
        <span className={`font-bold ${status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Dashboard</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>            <Statistic
              title="Total Users"
              value={1458}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>            <Statistic
              title="Forum Posts"
              value={582}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>            <Statistic
              title="Test Appointments"
              value={92}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>            <Statistic
              title="User Growth"
              value={12.3}
              precision={1}
              valueStyle={{ color: '#3f8600' }}
              prefix={<RiseOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} lg={16}>
          <Card title="Recent Users">
            <Table 
              dataSource={recentUsers} 
              columns={columns} 
              pagination={false} 
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>          <Card title="Recent Activity">
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
        </Col>
      </Row>      
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} md={12}>
          <Card title="User Engagement">
            <div className="mb-4">
              <div className="flex justify-between">
                <span>Forum Activity</span>
                <span>78%</span>
              </div>
              <Progress percent={78} status="active" />
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between">
                <span>Test Appointments</span>
                <span>45%</span>
              </div>
              <Progress percent={45} status="active" />
            </div>
            
            <div>
              <div className="flex justify-between">
                <span>Pharmacy Orders</span>
                <span>32%</span>
              </div>
              <Progress percent={32} status="active" />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="User Distribution">
            <div className="mb-4">
              <div className="flex justify-between">
                <span>New Users</span>
                <span>24%</span>
              </div>
              <Progress percent={24} strokeColor="#1890ff" />
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between">
                <span>Returning Users</span>
                <span>56%</span>
              </div>
              <Progress percent={56} strokeColor="#52c41a" />
            </div>
            
            <div>
              <div className="flex justify-between">
                <span>Healthcare Providers</span>
                <span>20%</span>
              </div>
              <Progress percent={20} strokeColor="#722ed1" />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
