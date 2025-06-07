import React, { useState } from 'react';
import { Layout, Menu, Button, theme, Avatar, Dropdown, message } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  DashboardOutlined, 
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { PATHS } from '../constant/path';
import { authenService } from '@/services/authenService';
import { localToken } from '@/utils/token';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate(PATHS.ADMIN.DASHBOARD)
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'User Management',
      onClick: () => navigate(PATHS.ADMIN.USER_MANAGEMENT)
    },
    {
      key: 'appointments',
      icon: <CalendarOutlined />,
      label: 'Appointments',
      onClick: () => navigate(PATHS.ADMIN.APPOINTMENT_MANAGEMENT)
    },
    {
      key: 'doctors',
      icon: <MedicineBoxOutlined />,
      label: 'Doctor Management',
      onClick: () => navigate(PATHS.ADMIN.DOCTOR_MANAGEMENT)
    },
    {
      key: 'treatment',
      icon: <ExperimentOutlined />,
      label: 'Treatment Tracking',
      onClick: () => navigate(PATHS.ADMIN.TREATMENT_TRACKING)
    }
  ];
  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      await authenService.logout();
      
      // Clear local tokens
      localToken.remove();
      
      // Navigate to home page
      message.success("Logout successful");
      navigate(PATHS.HOME);
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, remove local token and redirect
      localToken.remove();
      navigate(PATHS.HOME);
    }
  };

  const userDropdownItems = {
    items: [
      {
        key: '1',
        icon: <SettingOutlined />,
        label: 'Settings',
      },
      {
        key: '2',
        icon: <LogoutOutlined />,
        label: 'Logout',
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="light"
        style={{
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        }}
      >
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <img 
            src="/assets/logo.png" 
            alt="HIV Care Hub" 
            style={{
              height: collapsed ? '32px' : '40px',
              maxWidth: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          style={{ borderRight: 0 }}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          padding: '0 16px',
          background: colorBgContainer, 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button 
              type="text" 
              icon={<BellOutlined />} 
              style={{ fontSize: '16px' }}
              shape="circle"
            />
            <Dropdown menu={userDropdownItems} placement="bottomRight">
              <Avatar 
                style={{ backgroundColor: '#1890ff', cursor: 'pointer' }} 
                icon={<UserOutlined />}
              />
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
