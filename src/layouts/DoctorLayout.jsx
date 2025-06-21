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
  Breadcrumb,
  Badge
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  DashboardOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  FileTextOutlined,
  LogoutOutlined,
  TeamOutlined,
  BookOutlined,
  SettingOutlined,
  BellOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { handleLogout } from '@/store/Reducer/authReducer';

const { Header, Sider, Content } = Layout;

const DoctorLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);

  const onSignOut = () => {
    dispatch(handleLogout());
    navigate("/");
  };

  const items = [
    {
      key: "1",
      label: <Link to="/doctor/profile">Thông tin cá nhân</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "2",
      label: <Link to="/doctor/settings">Thiết lập tài khoản</Link>,
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

  // Menu items for the sidebar
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/doctor/dashboard">Bảng điều khiển</Link>,
    },
    {
      key: 'patients',
      icon: <TeamOutlined />,
      label: <Link to="/doctor/patients">Danh sách bệnh nhân</Link>,
    },
    {
      key: 'appointments',
      icon: <CalendarOutlined />,
      label: <Link to="/doctor/appointments">Lịch hẹn</Link>,
    },
    {
      key: 'consultation',
      icon: <MedicineBoxOutlined />,
      label: <Link to="/doctor/consultation">Khám bệnh</Link>,
    },
    {
      key: 'medical-records',
      icon: <FileTextOutlined />,
      label: <Link to="/doctor/medical-records">Hồ sơ bệnh án</Link>,
    },
    {
      key: 'regimens',
      icon: <BookOutlined />,
      label: <Link to="/doctor/regimens">Phác đồ điều trị</Link>,
    }
  ];

  // Get active key from location
  const getActiveMenuKey = (pathname) => {
    const path = pathname.split('/');
    if (path.length > 2) {
      if (path[2] === 'consultation' && path.length > 3) {
        return 'consultation';
      }
      if (path[2] === 'medical-records' && path.length > 3) {
        return 'medical-records';
      }
      return path[2];
    }
    return 'dashboard';
  };

  const activeKey = getActiveMenuKey(location.pathname);

  // Generate breadcrumb items based on location
  const getBreadcrumbItems = () => {
    const path = location.pathname.split('/').filter((i) => i);
    const breadcrumbItems = [{ title: 'Trang chủ', href: '/doctor/dashboard' }];
    
    if (path.length > 1) {
      switch (path[1]) {
        case 'dashboard':
          breadcrumbItems.push({ title: 'Bảng điều khiển' });
          break;
        case 'patients':
          breadcrumbItems.push({ title: 'Bệnh nhân' });
          break;
        case 'appointments':
          breadcrumbItems.push({ title: 'Lịch hẹn' });
          break;
        case 'consultation':
          breadcrumbItems.push({ title: 'Khám bệnh' });
          if (path.length > 2) {
            breadcrumbItems.push({ title: `ID: ${path[2]}` });
          }
          break;
        case 'medical-records':
          breadcrumbItems.push({ title: 'Hồ sơ bệnh án' });
          if (path.length > 2) {
            breadcrumbItems.push({ title: `ID: ${path[2]}` });
          }
          break;
        case 'regimens':
          breadcrumbItems.push({ title: 'Phác đồ điều trị' });
          break;
        case 'schedule':
          breadcrumbItems.push({ title: 'Lịch làm việc' });
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
        className="overflow-auto h-screen fixed left-0 top-0 bottom-0"
        style={{
          background: token.colorBgContainer,
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div className="flex justify-center items-center p-4 h-16">
          <Link to="/doctor/dashboard" className="flex items-center justify-center">
            <img 
              src="/assets/logo.png" 
              alt="Logo" 
              className={collapsed ? "max-h-[40px]" : "max-h-[60px]"}
            />
          </Link>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[activeKey]}
          items={menuItems}
          className="border-t border-gray-100"
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header 
          className="p-0 bg-white shadow-sm flex justify-between items-center" 
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            width: '100%',
          }}
        >
          <div className="flex items-center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="w-16 h-16 flex justify-center items-center"
            />
            <Breadcrumb items={getBreadcrumbItems()} className="ml-2" />
          </div>
          <div className="flex items-center mr-6">
            <Badge count={3} className="mr-4">
              <Button 
                shape="circle" 
                icon={<BellOutlined />} 
                className="flex items-center justify-center"
              />
            </Badge>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <a
                onClick={(e) => e.preventDefault()}
                className="ant-dropdown-link"
              >
                <Space>
                  <Avatar 
                    icon={<UserOutlined />} 
                    style={{ 
                      backgroundColor: token.colorPrimary,
                      verticalAlign: 'middle',
                    }}
                  />
                  {!collapsed && (
                    <span className="ml-2">{profile?.name || "Bác sĩ"}</span>
                  )}
                </Space>
              </a>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 0,
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

export default DoctorLayout; 