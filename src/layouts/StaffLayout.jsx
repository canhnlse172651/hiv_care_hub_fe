import React, { useState } from 'react';
import { Layout, Menu, Button, theme, Avatar, Dropdown, message, Badge } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  DashboardOutlined, 
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  CalendarOutlined,
  DollarOutlined,
  NotificationOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { PATHS } from '../constant/path';
import { authenService } from '@/services/authenService';
import { localToken } from '@/utils/token';

const { Header, Sider, Content } = Layout;

const StaffLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(3); // Example notification count
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Lịch hẹn hôm nay',
      onClick: () => navigate(PATHS.STAFF.DASHBOARD)
    },
    {
      key: 'payment',
      icon: <DollarOutlined />,
      label: 'Thanh toán',
      onClick: () => navigate(PATHS.STAFF.PAYMENT)
    },
    {
      key: 'patients',
      icon: <TeamOutlined />,
      label: 'Danh sách bệnh nhân',
      onClick: () => navigate(PATHS.STAFF.PATIENTS)
    }
  ];
  
  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      await authenService.logout();
      
      // Clear local tokens
      localToken.remove();
      
      // Navigate to home page
      message.success("Đăng xuất thành công");
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
        label: 'Cài đặt tài khoản',
      },
      {
        key: '2',
        icon: <LogoutOutlined />,
        label: 'Đăng xuất',
        onClick: handleLogout,
      },
    ],
  };
  
  const notificationItems = {
    items: [
      {
        key: '1',
        label: 'Bệnh nhân Nguyễn Văn A đã check-in',
      },
      {
        key: '2',
        label: 'Bệnh nhân Trần Thị B đã hủy lịch hẹn',
      },
      {
        key: '3',
        label: 'Thanh toán #123456 đã được xác nhận',
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
        className="shadow-md"
      >
        <div className="h-16 flex items-center justify-center p-4">
          <img 
            src="/assets/logo.png" 
            alt="HIV Care Hub" 
            className="h-full object-contain"
          />
        </div>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar size="large" className="bg-blue-500">S</Avatar>
            <div className={`transition-opacity duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
              <div className="font-medium">Nhân viên lễ tân</div>
              <div className="text-xs text-gray-500">Phòng khám Galant</div>
            </div>
          </div>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          className="border-r-0 pt-2"
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header className="p-0 px-4 bg-white flex items-center justify-between shadow-sm">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-base w-16 h-16"
          />
          <div className="flex items-center gap-4">
            <Dropdown menu={notificationItems} placement="bottomRight" trigger={['click']}>
              <Badge count={notifications} size="small">
                <Button 
                  type="text" 
                  icon={<BellOutlined />} 
                  className="text-base"
                  shape="circle"
                />
              </Badge>
            </Dropdown>
            <Dropdown menu={userDropdownItems} placement="bottomRight">
              <Avatar 
                className="bg-blue-500 cursor-pointer" 
                icon={<UserOutlined />}
              />
            </Dropdown>
          </div>
        </Header>
        <Content
          className="m-6 p-6 bg-white rounded-lg"
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default StaffLayout;
