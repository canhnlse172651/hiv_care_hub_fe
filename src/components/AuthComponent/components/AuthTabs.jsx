import React from 'react';
import { Tabs } from 'antd';
import { LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import { AUTH_MODAL_TYPES } from '@/constant/authConfig';

const AuthTabs = ({ activeTab, onTabChange, children }) => {
  const items = [
    {
      key: AUTH_MODAL_TYPES.LOGIN,
      label: (
        <span className="font-medium">
          <LoginOutlined className="mr-2" />
          ĐĂNG NHẬP
        </span>
      ),
      children: children.login
    },
    {
      key: AUTH_MODAL_TYPES.REGISTER,
      label: (
        <span className="font-medium">
          <UserAddOutlined className="mr-2" />
          ĐĂNG KÝ
        </span>
      ),
      children: children.register
    }
  ];

  return (
    <div className="mb-6 border-b border-gray-200">
      <Tabs
        activeKey={activeTab}
        onChange={onTabChange}
        items={items}
        className="auth-tabs [&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-content-holder]:pt-6"
      />
    </div>
  );
};

export default AuthTabs;