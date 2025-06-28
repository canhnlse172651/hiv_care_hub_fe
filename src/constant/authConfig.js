// Auth Modal Types
export const AUTH_MODAL_TYPES = {
  LOGIN: 'login',
  REGISTER: 'register',
};

// Form Validation Messages
export const AUTH_MESSAGES = {
  login: {
    success: 'Đăng nhập thành công!',
    error: 'Đăng nhập không thành công',
    invalidCredentials: 'Email hoặc mật khẩu không đúng',
    networkError: 'Lỗi kết nối. Vui lòng thử lại.'
  },
  register: {
    success: 'Đăng ký tài khoản thành công!',
    error: 'Đăng ký không thành công',
    emailExists: 'Email đã tồn tại trong hệ thống',
    networkError: 'Lỗi kết nối. Vui lòng thử lại.'
  }
};

// Form Field Configurations
export const FORM_FIELDS = {
  login: [
    {
      name: 'email',
      type: 'email',
      placeholder: 'Email',
      icon: 'UserOutlined',
      required: true
    },
    {
      name: 'password', 
      type: 'password',
      placeholder: 'Mật khẩu',
      icon: 'LockOutlined',
      required: true
    }
  ],
  register: [
    {
      name: 'name',
      type: 'text',
      placeholder: 'Họ và tên',
      icon: 'IdcardOutlined',
      required: true
    },
    {
      name: 'email',
      type: 'email', 
      placeholder: 'Email',
      icon: 'MailOutlined',
      required: true
    },
    {
      name: 'phoneNumber',
      type: 'tel',
      placeholder: 'Số điện thoại',
      icon: 'PhoneOutlined',
      required: true
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Mật khẩu',
      icon: 'LockOutlined',
      required: true
    },
    {
      name: 'confirmPassword',
      type: 'password',
      placeholder: 'Xác nhận mật khẩu',
      icon: 'SafetyOutlined',
      required: true
    }
  ]
};