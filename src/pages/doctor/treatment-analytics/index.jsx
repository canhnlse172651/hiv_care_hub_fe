import React from 'react';
import { 
  Card, Row, Col, Typography, Statistic, Table, Button, 
  DatePicker, Select, Space, Tag, Tabs, Timeline, Descriptions
} from 'antd';
import {
  BarChartOutlined, MedicineBoxOutlined, UserOutlined, 
  DollarOutlined, CalendarOutlined, SettingOutlined, 
  WarningOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

// Import components and hooks
import {
  OverviewStats,
  DoctorStats,
  CustomMedicationStats,
  ComplianceStats,
  ViolationsTable
} from '@/components/doctor/treatment-analytics';
import { useTreatmentAnalytics } from '@/hooks/doctor';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const TreatmentAnalyticsPage = () => {
  const currentUser = useSelector(state => state.auth.user);

  const {
    loading,
    generalStats,
    customMedicationStats,
    doctorStats,
    complianceStats,
    violations,
    dateRange,
    activeTab,
    setActiveTab,
    fetchAnalytics,
    handlePatientComplianceCheck,
    handleDateRangeChange
  } = useTreatmentAnalytics(currentUser);

  const generalStatsColumns = [
    {
      title: 'Tháng',
      dataIndex: 'month',
      key: 'month',
      render: (month) => dayjs(month).format('MM/YYYY')
    },
    {
      title: 'Điều trị mới',
      dataIndex: 'newTreatments',
      key: 'newTreatments',
      render: (value) => <Tag color="blue">{value}</Tag>
    },
    {
      title: 'Điều trị hoàn thành',
      dataIndex: 'completedTreatments',
      key: 'completedTreatments',
      render: (value) => <Tag color="green">{value}</Tag>
    },
    {
      title: 'Tổng chi phí',
      dataIndex: 'totalCost',
      key: 'totalCost',
      render: (value) => `${value?.toLocaleString()} VNĐ`
    }
  ];

  const tabItems = [
    {
      key: 'overview',
      label: 'Tổng quan',
      icon: <BarChartOutlined />
    },
    {
      key: 'doctor',
      label: 'Thống kê bác sĩ',
      icon: <UserOutlined />
    },
    {
      key: 'custom',
      label: 'Thuốc tùy chỉnh',
      icon: <SettingOutlined />
    },
    {
      key: 'violations',
      label: 'Vi phạm quy tắc',
      icon: <WarningOutlined />
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="mb-0">Phân tích điều trị</Title>
        <Space>
          <RangePicker 
            value={dateRange}
            onChange={handleDateRangeChange}
            format="DD/MM/YYYY"
          />
          <Button 
            type="primary" 
            onClick={fetchAnalytics}
            loading={loading}
          >
            Làm mới
          </Button>
        </Space>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={tabItems}
        className="mb-6"
      />

      {/* Overview Statistics */}
      <OverviewStats generalStats={generalStats} />

      {/* Doctor Statistics */}
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <DoctorStats doctorStats={doctorStats} />
        </Col>
        <Col span={8}>
          <CustomMedicationStats customMedicationStats={customMedicationStats} />
        </Col>
        <Col span={8}>
          <ComplianceStats complianceStats={complianceStats} />
        </Col>
      </Row>

      {/* Business Rule Violations */}
      <ViolationsTable 
        violations={violations}
        onPatientComplianceCheck={handlePatientComplianceCheck}
      />

      {/* Monthly Trends */}
      {generalStats.monthlyTrends && (
        <Card title="Xu hướng hàng tháng" className="mb-6">
          <Table
            columns={generalStatsColumns}
            dataSource={generalStats.monthlyTrends}
            rowKey="month"
            pagination={false}
          />
        </Card>
      )}

      {/* Top Protocols */}
      {generalStats.topProtocols && (
        <Card title="Phác đồ phổ biến nhất" className="mb-6">
          <Row gutter={16}>
            {generalStats.topProtocols.map((protocol, index) => (
              <Col span={8} key={protocol.protocolId}>
                <Card size="small">
                  <Statistic
                    title={`Phác đồ ${protocol.protocolId}`}
                    value={protocol.count}
                    suffix={`(${protocol.percentage}%)`}
                    prefix={<MedicineBoxOutlined />}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* Custom Medications Analysis */}
      {customMedicationStats.topCustomMedicines && (
        <Card title="Thuốc tùy chỉnh phổ biến" className="mb-6">
          <Row gutter={16}>
            {customMedicationStats.topCustomMedicines.slice(0, 6).map((medicine, index) => (
              <Col span={8} key={medicine.medicineId}>
                <Card size="small">
                  <div className="text-sm">
                    <div className="font-medium">{medicine.medicineName}</div>
                    <div className="text-gray-500">Sử dụng: {medicine.usageCount} lần</div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* Compliance Recommendations */}
      {complianceStats.recommendations && complianceStats.recommendations.length > 0 && (
        <Card title="Khuyến nghị cải thiện tuân thủ" className="mb-6">
          <Timeline>
            {complianceStats.recommendations.map((recommendation, index) => (
              <Timeline.Item key={index} color="blue">
                {recommendation}
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
      )}

      {/* Treatment Duration Analysis */}
      {generalStats.averageTreatmentDuration && (
        <Card title="Phân tích thời gian điều trị" className="mb-6">
          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title="Thời gian điều trị trung bình"
                value={generalStats.averageTreatmentDuration}
                suffix="ngày"
                prefix={<CalendarOutlined />}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Chi phí trung bình/điều trị"
                value={generalStats.averageCostPerTreatment || 0}
                prefix={<DollarOutlined />}
                formatter={(value) => `${value?.toLocaleString()} VNĐ`}
              />
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default TreatmentAnalyticsPage;