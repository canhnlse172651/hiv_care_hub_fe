import React from 'react';
import { Table, Space, Tag, Button } from 'antd';
import { SwapOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const WeeklySchedule = ({ 
  scheduleData, 
  scheduleLoading, 
  weekRange, 
  onPrevWeek, 
  onNextWeek, 
  onCurrentWeek 
}) => {
  // Helper for days of week
  const daysOfWeek = [
    { key: 'MONDAY', label: 'Thứ 2' },
    { key: 'TUESDAY', label: 'Thứ 3' },
    { key: 'WEDNESDAY', label: 'Thứ 4' },
    { key: 'THURSDAY', label: 'Thứ 5' },
    { key: 'FRIDAY', label: 'Thứ 6' },
    { key: 'SATURDAY', label: 'Thứ 7' },
    { key: 'SUNDAY', label: 'CN' },
  ];

  // Render cell for schedule table
  function renderScheduleCell(schedules, dayKey, date) {
    // Compare using UTC and only date part
    const dateStr = date.utc().format('YYYY-MM-DD');
    const shifts = schedules?.filter(
      s => s.dayOfWeek === dayKey && dayjs(s.date).utc().format('YYYY-MM-DD') === dateStr
    ) || [];
    if (shifts.length === 0) return <span className="text-gray-400">-</span>;
    return (
      <Space direction="vertical" size={4}>
        {shifts.map((shift, idx) => {
          if (shift.isOff) return <Tag key={idx} color="default">Nghỉ</Tag>;
          if (shift.shift === 'MORNING')
            return <Tag key={idx} color="blue" className="bg-blue-50 text-blue-700 border-0">Sáng</Tag>;
          if (shift.shift === 'AFTERNOON')
            return <Tag key={idx} color="green" className="bg-green-50 text-green-700 border-0">Chiều</Tag>;
          return null;
        })}
      </Space>
    );
  }

  // Weekly schedule table columns
  const scheduleColumns = [
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
    ...daysOfWeek.map((day, idx) => ({
      title: (
        <div>
          <div className="font-semibold">{day.label}</div>
          <div className="text-xs text-gray-500">{weekRange.startDate.day(1 + idx).format('DD/MM')}</div>
        </div>
      ),
      dataIndex: day.key,
      key: day.key,
      align: 'center',
      render: (_, record) =>
        renderScheduleCell(
          record.schedules,
          day.key,
          weekRange.startDate.day(1 + idx).utc()
        ),
      width: 110,
    })),
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <span className="font-semibold text-lg mr-2">Lịch làm việc tuần</span>
          <span className="text-gray-500">
            {weekRange.startDate.format('DD/MM/YYYY')} - {weekRange.endDate.format('DD/MM/YYYY')}
          </span>
        </div>
        <Space>
          <Button icon={<SwapOutlined />} onClick={onPrevWeek}>Tuần trước</Button>
          <Button onClick={onCurrentWeek}>Tuần hiện tại</Button>
          <Button icon={<SwapOutlined />} onClick={onNextWeek}>Tuần sau</Button>
          <Button type="primary" icon={<PlusOutlined />}>Thêm lịch</Button>
        </Space>
      </div>
      <Table
        columns={scheduleColumns}
        dataSource={scheduleData}
        loading={scheduleLoading}
        pagination={false}
        scroll={{ x: 'max-content' }}
        bordered
        rowKey="key"
        className="bg-white rounded-xl"
      />
    </div>
  );
};

export default WeeklySchedule;
