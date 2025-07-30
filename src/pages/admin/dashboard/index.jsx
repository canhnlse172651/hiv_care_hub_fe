import React from 'react';
import { Row, Col, Typography, Spin, Alert } from 'antd';
import { useAdminDashboard } from '@/hooks/admin';
import {
  StatsCards,
  RecentUsersTable,
  RecentActivity,
  EngagementCharts
} from '@/components/admin/dashboard';

const { Title } = Typography;

const Dashboard = () => {
  const { userStats, loading, error, refetch } = useAdminDashboard();

  if (loading) {
    return <Spin size="large" className="flex justify-center items-center h-screen" />;
  }

  if (error) {
    return (
      <Alert 
        message="Error" 
        description={error} 
        type="error" 
        showIcon 
        action={
          <button onClick={refetch} className="text-blue-500 underline">
            Retry
          </button>
        }
      />
    );
  }

  return (
    <div>
      <Title level={2}>Dashboard</Title>
      
      <StatsCards userStats={userStats} />
      
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} lg={16}>
          <RecentUsersTable recentUsers={userStats.recent} hideStatus />
        </Col>
        <Col xs={24} lg={8}>
          <RecentActivity />
        </Col>
      </Row>
      
      <EngagementCharts />
    </div>
  );
};

export default Dashboard;
