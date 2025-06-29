import React from 'react';
import { 
  Card, Typography, Button, Space, Tabs, 
  Input, Badge
} from 'antd';
import { 
  SearchOutlined, CalendarOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDoctorDashboard } from '@/hooks';
import { AppointmentTable, StatisticsCards } from '@/components/DoctorComponents';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const DoctorDashboard = () => {
  const {
    loading,
    dashboardData,
    searchText,
    setSearchText,
    filteredAppointments,
    refreshData
  } = useDoctorDashboard();

  const today = dayjs().format('DD/MM/YYYY');

  const completedTabItems = [
    {
      key: 'completed',
      label: <span><CheckCircleOutlined /> Đã hoàn thành</span>,
      children: (
        <AppointmentTable
          dataSource={dashboardData.completedAppointments}
          loading={loading}
          showActions={false}
        />
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <Title level={2} className="mb-2">Bảng điều khiển bác sĩ</Title>
          <Text className="text-gray-500">Ngày hôm nay: {today}</Text>
        </div>
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 mt-4 md:mt-0">
          <div className="text-lg font-semibold mb-1">Chào mừng, Bác sĩ Nguyễn</div>
          <div className="text-blue-100">Chúc một ngày làm việc hiệu quả</div>
        </Card>
      </div>

      <StatisticsCards statistics={dashboardData.statistics} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="col-span-1 xl:col-span-2 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <Title level={4} className="mb-0">Danh sách chờ khám</Title>
            <Space>
              <Input
                placeholder="Tìm kiếm bệnh nhân..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ width: 250 }}
                allowClear
              />
              <Link to="/doctor/appointments">
                <Button type="primary">
                  Xem tất cả
                </Button>
              </Link>
            </Space>
          </div>

          <AppointmentTable
            dataSource={filteredAppointments}
            loading={loading}
            showActions={false}
          />
        </Card>

        <Card className="shadow-md">
          <Tabs defaultActiveKey="completed" items={completedTabItems} className="mb-4" />

          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <Title level={5} className="mb-0">Lịch làm việc</Title>
              <Link to="/doctor/schedule">
                <Button type="primary" icon={<CalendarOutlined />}>
                  Xem lịch đầy đủ
                </Button>
              </Link>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                <Badge status="processing" className="mr-2" />
                <div>
                  <div>Ca sáng: 07:00 - 12:00</div>
                  <div className="text-xs text-gray-500">4 lịch hẹn đã đặt</div>
                </div>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                <Badge status="success" className="mr-2" />
                <div>
                  <div>Ca chiều: 12:00 - 17:00</div>
                  <div className="text-xs text-gray-500">2 lịch hẹn đã đặt</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <Title level={5}>Thông báo mới</Title>
            <div className="space-y-3">
              {dashboardData.notifications.length > 0 ? (
                dashboardData.notifications.map((notification, index) => (
                  <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <Badge status="processing" className="mr-2" />
                    <div>
                      <div>{notification.title}</div>
                      <div className="text-xs text-gray-500">{notification.time}</div>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <Badge status="processing" className="mr-2" />
                    <div>
                      <div>Hội thảo cập nhật phác đồ điều trị HIV mới</div>
                      <div className="text-xs text-gray-500">14:00, 15/06/2024</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                    <Badge status="success" className="mr-2" />
                    <div>
                      <div>Kết quả xét nghiệm của bệnh nhân Nguyễn Văn A đã có</div>
                      <div className="text-xs text-gray-500">Cập nhật 30 phút trước</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;
