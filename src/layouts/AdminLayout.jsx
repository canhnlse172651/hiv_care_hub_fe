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
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileDoneOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
  KeyOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { handleLogout } from '@/store/Reducer/authReducer';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);

  const onSignOut = () => {
    dispatch(handleLogout());
    navigate("/");
  };
  
  const userMenuItems = [
    {
      key: "1",
      label: <Link to="/admin/profile">Thông tin cá nhân</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "2",
      label: <Link to="/admin/settings">Thiết lập tài khoản</Link>,
      icon: <SettingOutlined />,
    },
    {
      key: "3",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      onClick: onSignOut,
      danger: true,
    },
  ];

  const sidebarMenuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/admin/dashboard">Bảng điều khiển</Link>,
    },
    {
      key: 'users',
      icon: <TeamOutlined />,
      label: <Link to="/admin/users">Quản lý người dùng</Link>,
    },
    {
      key: 'roles',
      icon: <KeyOutlined />,
      label: <Link to="/admin/roles">Quản lý vai trò</Link>,
    },
    {
        key: 'permissions',
        icon: <SafetyCertificateOutlined />,
        label: <Link to="/admin/permissions">Quản lý quyền</Link>,
    },
    {
      key: 'appointments',
      icon: <CalendarOutlined />,
      label: <Link to="/admin/appointments">Quản lý lịch hẹn</Link>,
    },
    {
      key: 'treatment-tracking',
      icon: <FileDoneOutlined />,
      label: <Link to="/admin/treatment-tracking">Theo dõi điều trị</Link>,
    }
  ];

  const getActiveMenuKey = (pathname) => {
    const path = pathname.split('/');
    if (path.length > 2) return path[2];
    return 'dashboard';
  };

  const activeKey = getActiveMenuKey(location.pathname);

  const getBreadcrumbItems = () => {
    const path = location.pathname.split('/').filter((i) => i);
    const breadcrumbItems = [{ title: <Link to="/admin/dashboard">Trang chủ</Link> }];
    
    if (path.length > 1) {
      switch (path[1]) {
        case 'dashboard':
          breadcrumbItems.push({ title: 'Bảng điều khiển' });
          break;
        case 'users':
          breadcrumbItems.push({ title: 'Quản lý người dùng' });
          break;
        case 'roles':
          breadcrumbItems.push({ title: 'Quản lý vai trò' });
          break;
        case 'permissions':
            breadcrumbItems.push({ title: 'Quản lý quyền' });
            break;
        case 'appointments':
          breadcrumbItems.push({ title: 'Quản lý lịch hẹn' });
          break;
        case 'treatment-tracking':
          breadcrumbItems.push({ title: 'Theo dõi điều trị' });
          break;
        default:
          break;
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
      >
        <div className="flex justify-center items-center p-4 h-16">
            <Link to="/admin/dashboard">
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
          items={sidebarMenuItems}
          className="border-t border-gray-100"
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s ease' }}>
        <Header 
          className="p-0 bg-white shadow-sm flex justify-between items-center sticky top-0 z-10"
        >
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
            <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
              <a
                onClick={(e) => e.preventDefault()}
                className="ant-dropdown-link flex items-center"
              >
                <Space>
                  <Avatar icon={<UserOutlined />} className="bg-blue-500" />
                  <span className="hidden md:inline">{profile?.name || "Admin"}</span>
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

export default AdminLayout;
