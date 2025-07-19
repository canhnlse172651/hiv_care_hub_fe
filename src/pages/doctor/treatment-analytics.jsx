import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Typography, Statistic, Progress, 
  Table, Button, DatePicker, Select, Space, Tag,
  Tabs, Alert, Spin, message, Tooltip, Badge,
  Timeline, Descriptions, Divider
} from 'antd';
import {
  BarChartOutlined, MedicineBoxOutlined, UserOutlined, 
  DollarOutlined, CalendarOutlined, CheckCircleOutlined,
  WarningOutlined, InfoCircleOutlined, FileTextOutlined,
  SettingOutlined, SafetyOutlined, ExperimentOutlined
} from '@ant-design/icons';
import { patientTreatmentService } from '@/services/patientTreatmentService';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const TreatmentAnalyticsPage = () => {
  const [loading, setLoading] = useState(false);
  const [generalStats, setGeneralStats] = useState({});
  const [customMedicationStats, setCustomMedicationStats] = useState({});
  const [doctorStats, setDoctorStats] = useState({});
  const [complianceStats, setComplianceStats] = useState({});
  const [violations, setViolations] = useState(null);
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'days'), dayjs()]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const currentUser = useSelector(state => state.auth.user);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch general statistics
      const generalStatsRes = await patientTreatmentService.getGeneralTreatmentStats();
      setGeneralStats(generalStatsRes);

      // Fetch custom medication statistics
      const customMedStatsRes = await patientTreatmentService.getCustomMedicationStats();
      setCustomMedicationStats(customMedStatsRes);

      // Fetch doctor-specific statistics
      if (currentUser?.id) {
        const doctorStatsRes = await patientTreatmentService.getDoctorWorkloadStats(currentUser.id);
        setDoctorStats(doctorStatsRes);
      }

      // Fetch business rule violations
      const violationsRes = await patientTreatmentService.detectBusinessRuleViolations();
      setViolations(violationsRes);

    } catch (error) {
      message.error('Không thể tải dữ liệu phân tích');
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientComplianceCheck = async (patientId) => {
    try {
      const complianceRes = await patientTreatmentService.getTreatmentComplianceStats(patientId);
      setComplianceStats(complianceRes);
    } catch (error) {
      message.error('Không thể tải thông tin tuân thủ điều trị');
    }
  };

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

  const violationsColumns = [
    {
      title: 'Bệnh nhân ID',
      dataIndex: 'patientId',
      key: 'patientId',
      render: (id) => `PT-${id.toString().padStart(6, '0')}`
    },
    {
      title: 'Số điều trị đang hoạt động',
      dataIndex: 'activeTreatmentCount',
      key: 'activeTreatmentCount',
      render: (count) => <Badge count={count} style={{ backgroundColor: count > 1 ? '#ff4d4f' : '#52c41a' }} />
    },
    {
      title: 'Phác đồ',
      dataIndex: 'protocols',
      key: 'protocols',
      render: (protocols) => (
        <Space>
          {protocols.map((protocol, index) => (
            <Tag key={index} color="blue">{protocol}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          size="small"
          onClick={() => handlePatientComplianceCheck(record.patientId)}
        >
          Kiểm tra
        </Button>
      )
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
            onChange={setDateRange}
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
        activeKey="overview" 
        items={tabItems}
        className="mb-6"
      />

      {/* Overview Statistics */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số điều trị"
              value={generalStats.totalTreatments || 0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang điều trị"
              value={generalStats.activeTreatments || 0}
              prefix={<MedicineBoxOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng bệnh nhân"
              value={generalStats.totalPatients || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng chi phí"
              value={generalStats.totalCost || 0}
              prefix={<DollarOutlined />}
              formatter={(value) => `${value?.toLocaleString()} VNĐ`}
            />
          </Card>
        </Col>
      </Row>

      {/* Doctor Statistics */}
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card title="Thống kê bác sĩ" className="h-full">
            <Statistic
              title="Tổng điều trị của bác sĩ"
              value={doctorStats.totalTreatments || 0}
              prefix={<FileTextOutlined />}
            />
            <Divider />
            <Statistic
              title="Đang điều trị"
              value={doctorStats.activeTreatments || 0}
              prefix={<MedicineBoxOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
            <Divider />
            <Statistic
              title="Bệnh nhân duy nhất"
              value={doctorStats.uniquePatients || 0}
              prefix={<UserOutlined />}
            />
            <Divider />
            <Statistic
              title="TB điều trị/bệnh nhân"
              value={doctorStats.averageTreatmentsPerPatient || 0}
              precision={1}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Thuốc tùy chỉnh" className="h-full">
            <Statistic
              title="Tổng điều trị"
              value={customMedicationStats.totalTreatments || 0}
              prefix={<FileTextOutlined />}
            />
            <Divider />
            <Statistic
              title="Có thuốc tùy chỉnh"
              value={customMedicationStats.treatmentsWithCustomMeds || 0}
              prefix={<SettingOutlined />}
            />
            <Divider />
            <Progress
              percent={customMedicationStats.customMedicationUsageRate || 0}
              format={(percent) => `${percent}%`}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
            <Text type="secondary">Tỷ lệ sử dụng thuốc tùy chỉnh</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Tuân thủ điều trị" className="h-full">
            {complianceStats.patientId ? (
              <>
                <Statistic
                  title="Tỷ lệ tuân thủ"
                  value={complianceStats.adherence || 0}
                  suffix="%"
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ 
                    color: (complianceStats.adherence || 0) >= 95 ? '#3f8600' : 
                           (complianceStats.adherence || 0) >= 85 ? '#faad14' : '#cf1322'
                  }}
                />
                <Divider />
                <Statistic
                  title="Liều đã bỏ lỡ"
                  value={complianceStats.missedDoses || 0}
                  prefix={<WarningOutlined />}
                />
                <Divider />
                <Tag color={
                  complianceStats.riskLevel === 'low' ? 'green' :
                  complianceStats.riskLevel === 'medium' ? 'orange' : 'red'
                }>
                  Mức độ rủi ro: {complianceStats.riskLevel?.toUpperCase()}
                </Tag>
              </>
            ) : (
              <div className="text-center text-gray-500">
                <InfoCircleOutlined className="text-2xl mb-2" />
                <p>Chọn bệnh nhân để xem thống kê tuân thủ</p>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Business Rule Violations */}
      {violations && (
        <Card title="Vi phạm quy tắc kinh doanh" className="mb-6">
          <Alert
            message={`Phát hiện ${violations.totalViolations || 0} vi phạm quy tắc`}
            description="Các bệnh nhân có nhiều hơn một điều trị đang hoạt động"
            type="warning"
            showIcon
            className="mb-4"
          />
          
          <Table
            columns={violationsColumns}
            dataSource={violations.violatingPatients || []}
            rowKey="patientId"
            pagination={{ pageSize: 5 }}
          />
        </Card>
      )}

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