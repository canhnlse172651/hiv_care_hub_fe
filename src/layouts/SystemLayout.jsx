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
  Breadcrumb,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  FileDoneOutlined,
  DollarOutlined,
  BookOutlined,
  KeyOutlined,
  ExperimentOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { handleLogout } from '@/store/Reducer/authReducer';
import { sidebarMenuItems, userMenuItems } from '@/constant/menuLayout';

const { Header, Sider, Content } = Layout;

// Helper to map icon string to component
const iconMap = {
  UserOutlined: <UserOutlined />,
  SettingOutlined: <SettingOutlined />,
  LogoutOutlined: <LogoutOutlined />,
  DashboardOutlined: <DashboardOutlined />,
  FileTextOutlined: <FileTextOutlined />,
  SafetyCertificateOutlined: <SafetyCertificateOutlined />,
  MedicineBoxOutlined: <MedicineBoxOutlined />,
  CalendarOutlined: <CalendarOutlined />,
  FileDoneOutlined: <FileDoneOutlined />,
  DollarOutlined: <DollarOutlined />,
  BookOutlined: <BookOutlined />,
  KeyOutlined: <KeyOutlined />,
  ExperimentOutlined: <ExperimentOutlined />,
  AppstoreOutlined: <AppstoreOutlined />,
};

const MainLayout = ({ role }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);

  const onSignOut = () => {
    dispatch(handleLogout());
    navigate("/");
  };

  // Get menu items from constant
  const menuItems = (sidebarMenuItems[role] || []).map(item => ({
    key: item.key,
    icon: iconMap[item.icon] || null,
    label: <Link to={item.path}>{item.label}</Link>,
  }));

  // Generate dropdown items for user menu
  const dropdownItems = userMenuItems.map(item => ({
    key: item.key,
    icon: iconMap[item.icon] || null,
    label: item.path
      ? <Link to={`/${role}/${item.path}`}>{item.label}</Link>
      : (
        <span
          style={item.danger ? { color: 'red' } : {}}
          onClick={item.key === 'logout' ? onSignOut : undefined}
        >
          {item.label}
        </span>
      ),
    danger: item.danger,
  }));

  // Get active key from location
  const getActiveMenuKey = (pathname) => {
    const path = pathname.split('/');
    if (path.length > 2) return path[2];
    return 'dashboard';
  };
  const activeKey = getActiveMenuKey(location.pathname);

  // Breadcrumbs (customize as needed)
  const getBreadcrumbItems = () => {
    const path = location.pathname.split('/').filter((i) => i);
    const homePath = `/${role}/dashboard`;
    const breadcrumbItems = [{ title: <Link to={homePath}>Trang chủ</Link> }];
    if (path.length > 1) {
      breadcrumbItems.push({ title: menuItems.find(i => i.key === path[1])?.label?.props?.children || '' });
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
      >
        <div className="flex justify-center items-center p-4 h-16">
          <Link to={`/${role}/dashboard`}>
            <img
              src="/assets/logo.png"
              alt="Logo"
              className={`transition-all duration-300 ${collapsed ? "max-h-[40px]" : "max-h-[60px]"}`}
            />
          </Link>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          items={menuItems}
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
              className="w-16 h-16 text-xl"
            />
            <Breadcrumb items={getBreadcrumbItems()} className="ml-2 hidden md:block" />
          </div>
          <div className="flex items-center mr-6">
            <Badge count={5} className="mr-4">
              <Button shape="circle" icon={<BellOutlined />} />
            </Badge>
            <Dropdown menu={{ items: dropdownItems }} trigger={["click"]}>
              <a
                onClick={(e) => e.preventDefault()}
                className="ant-dropdown-link flex items-center"
              >
                <Space>
                  <Avatar icon={<UserOutlined />} className="bg-blue-500" />
                  <span className="hidden md:inline">{profile?.name || role}</span>
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
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;