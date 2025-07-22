import React from 'react';
import { Table, Tag, Space, Input, Button } from 'antd';
import { SearchOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const DoctorList = ({ 
  doctors, 
  loading, 
  meta, 
  searchText, 
  onSearchChange, 
  onPaginationChange, 
  onOpenModal, 
  onOpenGenerate 
}) => {
  const columns = [
    {
      title: <span className="font-semibold">ID</span>,
      dataIndex: 'id',
      key: 'doctorId',
      width: 80,
      sorter: (a, b) => a.id - b.id,
      sortDirections: ['descend', 'ascend'],
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: <span className="font-semibold">Bác sĩ</span>,
      dataIndex: 'doctor',
      key: 'doctor',
      render: (_, record) => (
        <div>
          <div className="font-semibold">{record.user?.name}</div>
          <div className="text-gray-500 text-xs">{record.specialization}</div>
        </div>
      ),
      fixed: 'left',
      width: 180,
    },
    {
      title: <span className="font-semibold">Email</span>,
      dataIndex: ['user', 'email'],
      key: 'email',
      render: (text, record) => (
        <span className="text-gray-700">{record.user?.email || 'N/A'}</span>
      ),
    },
    {
      title: <span className="font-semibold">Chuyên môn</span>,
      dataIndex: 'specialization',
      key: 'specialization',
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: <span className="font-semibold">Trạng thái</span>,
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      render: (isAvailable) => (
        <Tag color={isAvailable ? 'green' : 'volcano'}>
          {isAvailable ? 'Đang làm việc' : 'Nghỉ'}
        </Tag>
      ),
    },
    {
      title: <span className="font-semibold">Chứng chỉ</span>,
      dataIndex: 'certifications',
      key: 'certifications',
      width: 120,
      render: (certifications) => (
        <Space wrap>
          {certifications?.map((cert, index) => (
            <Tag key={index} color="blue">{cert}</Tag>
          )) || <span className="text-gray-400">Không có</span>}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <span className="font-semibold text-lg mr-2">Danh sách bác sĩ</span>
        </div>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={onOpenGenerate}>
            Generate Schedule
          </Button>
          <Button 
            type="primary" 
            icon={<UserOutlined />} 
            onClick={onOpenModal}
          >
            Add Doctor
          </Button>
        </Space>
      </div>
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo tên hoặc email"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => onSearchChange(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>
      <Table
        columns={columns}
        dataSource={doctors}
        loading={loading}
        rowKey={record => record.id}
        pagination={{
          current: meta.page,
          pageSize: meta.limit,
          total: meta.total,
          onChange: onPaginationChange,
        }}
        scroll={{ x: 'max-content' }}
        bordered
        className="bg-white rounded-xl"
      />
    </div>
  );
};

export default DoctorList;