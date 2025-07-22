export const sidebarMenuItems = {
  admin: [
    {
      key: 'dashboard',
      icon: 'DashboardOutlined',
      label: 'Bảng điều khiển',
      path: '/admin/dashboard',
    },
    {
      key: 'users',
      icon: 'UserOutlined',
      label: 'Quản lý người dùng',
      path: '/admin/users',
    },
    {
      key: 'roles',
      icon: 'SafetyCertificateOutlined',
      label: 'Quản lý vai trò',
      path: '/admin/roles',
    },
    {
      key: 'permissions',
      icon: 'KeyOutlined',
      label: 'Quản lý quyền',
      path: '/admin/permissions',
    },
    {
      key: 'doctors',
      icon: 'MedicineBoxOutlined',
      label: 'Quản lý bác sĩ',
      path: '/admin/doctors',
    },
    // {
    //   key: 'appointments',
    //   icon: 'CalendarOutlined',
    //   label: 'Quản lý lịch hẹn',
    //   path: '/admin/appointments',
    // },
    // {
    //   key: 'treatment-tracking',
    //   icon: 'FileDoneOutlined',
    //   label: 'Theo dõi điều trị',
    //   path: '/admin/treatment-tracking',
    // },
    {
      key: 'medicine',
      icon: 'ExperimentOutlined',
      label: 'Quản lý thuốc',
      path: '/admin/medicine',
    },
    {
      key: 'service',
      icon: 'AppstoreOutlined',
      label: 'Quản lý dịch vụ',
      path: '/admin/service',
    },
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
      icon: 'UserOutlined',
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
    },
  ],
  staff: [
    {
      key: 'dashboard',
      icon: 'DashboardOutlined',
      label: 'Bảng điều khiển',
      path: '/staff/dashboard',
    },
    // {
    //   key: 'payment',
    //   icon: 'DollarOutlined',
    //   label: 'Thanh toán',
    //   path: '/staff/payment',
    // },
    // {
    //   key: 'patients',
    //   icon: 'UserOutlined',
    //   label: 'Danh sách bệnh nhân',
    //   path: '/staff/patients',
    // },
    // {
    //   key: 'appointments',
    //   icon: 'CalendarOutlined',
    //   label: 'Lịch hẹn',
    //   path: '/staff/appointments',
    // },
  ],
};

export const userMenuItems = [
  {
    key: "profile",
    icon: "UserOutlined",
    label: "Thông tin cá nhân",
    path: "profile",
  },
  {
    key: "settings",
    icon: "SettingOutlined",
    label: "Thiết lập tài khoản",
    path: "settings",
  },
  {
    key: "logout",
    icon: "LogoutOutlined",
    label: "Đăng xuất",
    danger: true,
  },
];