import React from 'react';
import {
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileDoneOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
  KeyOutlined,
  SafetyCertificateOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  BookOutlined,
  DollarOutlined,
  UserOutlined,
  ScheduleOutlined
} from '@ant-design/icons';

// User menu items configuration
export const USER_MENU_ITEMS = {
  admin: [
    {
      key: "1",
      label: "Thông tin cá nhân",
      path: "/admin/profile",
      icon: "UserOutlined",
    },
    {
      key: "2",
      label: "Thiết lập tài khoản",
      path: "/admin/settings",
      icon: "SettingOutlined",
    },
    {
      key: "3",
      label: "Đăng xuất",
      icon: "LogoutOutlined",
      danger: true,
    },
  ],
  doctor: [
    {
      key: "1",
      label: "Thông tin cá nhân",
      path: "/doctor/profile",
      icon: "UserOutlined",
    },
    {
      key: "2",
      label: "Thiết lập tài khoản",
      path: "/doctor/settings",
      icon: "SettingOutlined",
    },
    {
      key: "3",
      label: "Đăng xuất",
      icon: "LogoutOutlined",
      danger: true,
    },
  ],
  staff: [
    {
      key: "1",
      label: "Thông tin cá nhân",
      path: "/staff/profile",
      icon: "UserOutlined",
    },
    {
      key: "2",
      label: "Thiết lập tài khoản",
      path: "/staff/settings",
      icon: "SettingOutlined",
    },
    {
      key: "3",
      label: "Đăng xuất",
      icon: "LogoutOutlined",
      danger: true,
    },
  ],
};

// Sidebar menu items configuration
export const SIDEBAR_MENU_ITEMS = {
  admin: [
    {
      key: 'dashboard',
      icon: 'DashboardOutlined',
      label: 'Bảng điều khiển',
      path: '/admin/dashboard',
    },
    {
      key: 'users',
      icon: 'TeamOutlined',
      label: 'Quản lý người dùng',
      path: '/admin/users',
    },
    {
      key: 'roles',
      icon: 'KeyOutlined',
      label: 'Quản lý vai trò',
      path: '/admin/roles',
    },
    {
      key: 'permissions',
      icon: 'SafetyCertificateOutlined',
      label: 'Quản lý quyền',
      path: '/admin/permissions',
    },
    {
      key: 'doctors',
      icon: 'MedicineBoxOutlined',
      label: 'Quản lý bác sĩ',
      path: '/admin/doctors',
    },
    {
      key: 'appointments',
      icon: 'CalendarOutlined',
      label: 'Quản lý lịch hẹn',
      path: '/admin/appointments',
    },
    {
      key: 'treatment-tracking',
      icon: 'FileDoneOutlined',
      label: 'Theo dõi điều trị',
      path: '/admin/treatment-tracking',
    }
  ],
  doctor: [
    {
      key: 'dashboard',
      icon: 'DashboardOutlined',
      label: 'Bảng điều khiển',
      path: '/doctor/dashboard',
    },
    {
      key: 'schedule',
      icon: 'ScheduleOutlined',
      label: 'Lịch làm việc',
      path: '/doctor/schedule',
    },
    {
      key: 'appointments',
      icon: 'CalendarOutlined',
      label: 'Lịch hẹn',
      path: '/doctor/appointments',
    },
    {
      key: 'regimens',
      icon: 'BookOutlined',
      label: 'Phác đồ điều trị',
      path: '/doctor/regimens',
    }
  ],
  staff: [
    {
      key: 'dashboard',
      icon: 'DashboardOutlined',
      label: 'Bảng điều khiển',
      path: '/staff/dashboard',
    },
    {
      key: 'payment',
      icon: 'DollarOutlined',
      label: 'Thanh toán',
      path: '/staff/payment',
    },
    {
      key: 'patients',
      icon: 'TeamOutlined',
      label: 'Danh sách bệnh nhân',
      path: '/staff/patients',
    },
    {
      key: 'appointments',
      icon: 'CalendarOutlined',
      label: 'Lịch hẹn',
      path: '/staff/appointments',
    },
  ],
};

// Breadcrumb configuration
export const BREADCRUMB_CONFIG = {
  admin: {
    basePath: '/admin/dashboard',
    baseTitle: 'Trang chủ',
    mappings: {
      'dashboard': 'Bảng điều khiển',
      'users': 'Quản lý người dùng',
      'roles': 'Quản lý vai trò',
      'permissions': 'Quản lý quyền',
      'doctors': 'Quản lý bác sĩ',
      'appointments': 'Quản lý lịch hẹn',
      'treatment-tracking': 'Theo dõi điều trị',
    }
  },
  doctor: {
    basePath: '/doctor/dashboard',
    baseTitle: 'Trang chủ',
    mappings: {
      'dashboard': 'Bảng điều khiển',
      'schedule': 'Lịch làm việc',
      'appointments': 'Lịch hẹn',
      'regimens': 'Phác đồ điều trị',
    }
  },
  staff: {
    basePath: '/staff/dashboard',
    baseTitle: 'Trang chủ',
    mappings: {
      'dashboard': 'Bảng điều khiển',
      'payment': 'Thanh toán',
      'patients': 'Bệnh nhân',
      'appointments': 'Lịch hẹn',
    }
  },
};

// Layout configuration
export const LAYOUT_CONFIG = {
  admin: {
    role: 'admin',
    defaultName: 'Admin',
    notificationCount: 5,
  },
  doctor: {
    role: 'doctor',
    defaultName: 'Bác sĩ',
    notificationCount: 3,
  },
  staff: {
    role: 'staff',
    defaultName: 'Nhân viên',
    notificationCount: 2,
  },
}; 