import React from 'react';
import { Card, Table } from 'antd';
import dayjs from 'dayjs';

const RecentUsersTable = ({ recentUsers }) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Registered Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => dayjs(text).format('DD/MM/YYYY'),
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   key: 'status',
    //   render: (status) => (
    //     <span className={`font-bold ${status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}`}>
    //       {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    //     </span>
    //   ),
    // },
  ];

  return (
    <Card title="Recent Users">
      <Table 
        dataSource={recentUsers} 
        columns={columns} 
        pagination={false} 
        size="small"
        rowKey="id"
      />
    </Card>
  );
};

export default RecentUsersTable;
