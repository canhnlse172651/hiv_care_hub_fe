import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Layout,
  Menu,
  Button,
  theme,
  Avatar,
  Dropdown,
  Space,
  Badge,
  Breadcrumb
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  BellOutlined,
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileDoneOutlined,
  LogoutOutlined,
  SettingOutlined,
  KeyOutlined,
  SafetyCertificateOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  BookOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { handleLogout } from '@/store/Reducer/authReducer';
import { 
  USER_MENU_ITEMS, 
  SIDEBAR_MENU_ITEMS, 
  BREADCRUMB_CONFIG, 
  LAYOUT_CONFIG 
} from '@/constant/layoutConfig';

const { Header, Sider, Content } = Layout;

// Icon mapping - create this in the component file
const ICON_MAPPING = {
  DashboardOutlined: <DashboardOutlined />,
  TeamOutlined: <TeamOutlined />,
  CalendarOutlined: <CalendarOutlined />,
  FileDoneOutlined: <FileDoneOutlined />,
  LogoutOutlined: <LogoutOutlined />,
  SettingOutlined: <SettingOutlined />,
  BellOutlined: <BellOutlined />,
  KeyOutlined: <KeyOutlined />,
  SafetyCertificateOutlined: <SafetyCertificateOutlined />,
  MedicineBoxOutlined: <MedicineBoxOutlined />,
  FileTextOutlined: <FileTextOutlined />,
  BookOutlined: <BookOutlined />,
  DollarOutlined: <DollarOutlined />,
  UserOutlined: <UserOutlined />,
};

// Helper function to get icon component
const getIcon = (iconName) => {
  return ICON_MAPPING[iconName] || null;
};

const BaseLayout = ({ role }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);

  const config = LAYOUT_CONFIG[role];
  const menuItems = SIDEBAR_MENU_ITEMS[role];
  const userMenuItems = USER_MENU_ITEMS[role];
  const breadcrumbConfig = BREADCRUMB_CONFIG[role];

  const onSignOut = () => {
    dispatch(handleLogout());
    if (role === 'staff') {
      localStorage.removeItem('auth');
      localStorage.removeItem('token');
    }
    navigate("/");
  };

  // Transform menu items to include Link components and icons
  const transformedMenuItems = menuItems.map(item => ({
    ...item,
    label: <Link to={item.path}>{item.label}</Link>,
    icon: getIcon(item.icon),
  }));

  // Transform user menu items to include Link components, icons, and onClick handlers
  const transformedUserMenuItems = userMenuItems.map(item => ({
    ...item,
    label: item.path ? <Link to={item.path}>{item.label}</Link> : item.label,
    icon: getIcon(item.icon),
    onClick: item.key === "3" ? onSignOut : undefined,
  }));

  const getActiveMenuKey = (pathname) => {
    const path = pathname.split('/');
    if (path.length > 2) {
      if (role === 'doctor') {
        if (path[2] === 'consultation' && path.length > 3) return 'consultation';
        if (path[2] === 'medical-records' && path.length > 3) return 'medical-records';
      }
      return path[2];
    }
    return 'dashboard';
  };

  const activeKey = getActiveMenuKey(location.pathname);

  const getBreadcrumbItems = () => {
    const path = location.pathname.split('/').filter((i) => i);
    const breadcrumbItems = [{ 
      title: <Link to={breadcrumbConfig.basePath}>{breadcrumbConfig.baseTitle}</Link> 
    }];
    
    if (path.length > 1) {
      const section = path[1];
      const title = breadcrumbConfig.mappings[section];
      if (title) {
        breadcrumbItems.push({ title });
        if (role === 'doctor' && (section === 'consultation' || section === 'medical-records') && path.length > 2) {
          breadcrumbItems.push({ title: `ID: ${path[2]}` });
        }
      }
    }
    return breadcrumbItems;
  };

  return (
    <Layout className="min-h-screen">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className="overflow-auto h-screen fixed left-0 top-0 bottom-0 shadow-lg"
        theme="light"
        style={{
          background: token.colorBgContainer,
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div className="flex justify-center items-center p-4 h-16">
          <Link to={breadcrumbConfig.basePath} className="flex items-center justify-center">
            <img 
              src="/assets/logo.png" 
              alt="Logo" 
              className={`transition-all duration-300 ${collapsed ? "max-h-[40px]" : "max-h-[60px]"}`}
            />
          </Link>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[activeKey]}
          items={transformedMenuItems}
          className="border-t border-gray-100"
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s ease' }}>
        <Header className="p-0 bg-white shadow-sm flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="w-16 h-16 text-xl flex justify-center items-center"
            />
            <Breadcrumb items={getBreadcrumbItems()} className="ml-2 hidden md:block" />
          </div>
          <div className="flex items-center mr-6">
            <Badge count={config.notificationCount} className="mr-4">
              <Button shape="circle" icon={<BellOutlined />} className="flex items-center justify-center" />
            </Badge>
            <Dropdown menu={{ items: transformedUserMenuItems }} trigger={["click"]}>
              <a onClick={(e) => e.preventDefault()} className="ant-dropdown-link flex items-center">
                <Space>
                  <Avatar 
                    icon={<UserOutlined />} 
                    className="bg-blue-500"
                    style={{ backgroundColor: token.colorPrimary, verticalAlign: 'middle' }}
                  />
                  <span className="hidden md:inline">{profile?.name || config.defaultName}</span>
                </Space>
              </a>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: token.colorBgContainer,
            borderRadius: token.borderRadius,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default BaseLayout; 