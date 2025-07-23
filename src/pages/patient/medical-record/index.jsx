import React, { useState, useEffect } from 'react';
import { 
  Card, Typography, Tabs, Button, Table, Tag, 
  Timeline, Divider, Descriptions, Input, 
  DatePicker, Select, Statistic, Row, Col, Empty, Progress,
  Badge, Avatar, Tooltip, Alert, Space
} from 'antd';
import {
  UserOutlined, SearchOutlined, FileTextOutlined,
  HistoryOutlined, MedicineBoxOutlined, CalendarOutlined,
  AreaChartOutlined, HeartOutlined, ExperimentOutlined,
  CheckCircleOutlined, ClockCircleOutlined, AlertOutlined,
  CaretUpOutlined, CaretDownOutlined, LineChartOutlined, BarChartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { localToken } from '@/utils/token';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const PatientMedicalRecordPage = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  
  const auth = localToken.get();
  const currentUser = auth?.user;
  
  // Mock patient data
  const patient = {
    id: 'PT-HIV-10001',
    name: currentUser?.name || 'Nguyễn Văn Minh',
    age: 32,
    gender: 'Nam',
    dob: '1991-08-15',
    idNumber: '0123456789',
    phone: '0912345678',
    email: currentUser?.email || 'nguyenvanminh@email.com',
    address: '123 Đường Nguyễn Văn Cừ, Quận 5, TP.HCM',
    hivStatus: 'HIV+',
    diagnosisDate: '2020-03-15',
    startedTreatment: '2020-03-22',
    currentRegimen: 'TDF + 3TC + DTG',
    allergies: 'Penicillin',
    chronicConditions: 'Không',
    status: 'stable',
    adherence: 95,
    nextAppointment: '2024-12-15',
    doctorInCharge: 'BS. Trần Văn Bình'
  };
  
  // Mock medical records
  const medicalRecords = [
    {
      id: 'MR-202412001',
      date: '2024-12-01',
      doctor: 'BS. Trần Văn Bình',
      type: 'routine_checkup',
      diagnosis: 'HIV ổn định, tuân thủ điều trị tốt',
      symptoms: 'Không có triệu chứng bất thường',
      prescription: [
        { medication: 'TDF', dose: '300mg', frequency: '1 lần/ngày', duration: '30 ngày' },
        { medication: '3TC', dose: '300mg', frequency: '1 lần/ngày', duration: '30 ngày' },
        { medication: 'DTG', dose: '50mg', frequency: '1 lần/ngày', duration: '30 ngày' }
      ],
      labTests: ['CD4', 'Tải lượng virus HIV', 'Công thức máu'],
      notes: 'Bệnh nhân tuân thủ điều trị tốt, không có tác dụng phụ',
      followupDate: '2025-03-01',
      status: 'completed'
    },
    {
      id: 'MR-202409001',
      date: '2024-09-15',
      doctor: 'BS. Trần Văn Bình',
      type: 'routine_checkup',
      diagnosis: 'HIV ổn định, theo dõi thường quy',
      symptoms: 'Mệt mỏi nhẹ',
      prescription: [
        { medication: 'TDF', dose: '300mg', frequency: '1 lần/ngày', duration: '30 ngày' },
        { medication: '3TC', dose: '300mg', frequency: '1 lần/ngày', duration: '30 ngày' },
        { medication: 'DTG', dose: '50mg', frequency: '1 lần/ngày', duration: '30 ngày' },
        { medication: 'Vitamin B', dose: '100mg', frequency: '1 lần/ngày', duration: '30 ngày' }
      ],
      labTests: ['CD4', 'Tải lượng virus HIV', 'Chức năng gan'],
      notes: 'Khuyến cáo tăng cường dinh dưỡng và tập thể dục',
      followupDate: '2024-12-15',
      status: 'completed'
    }
  ];
  
  // Mock lab results
  const labResults = [
    {
      date: '2024-12-01',
      type: 'CD4',
      value: '680',
      unit: 'cells/mm³',
      referenceRange: '500-1500',
      status: 'normal',
      trend: 'up'
    },
    {
      date: '2024-12-01',
      type: 'Tải lượng virus HIV',
      value: 'Không phát hiện',
      unit: 'copies/ml',
      referenceRange: '< 20',
      status: 'normal',
      trend: 'stable'
    },
    {
      date: '2024-09-15',
      type: 'CD4',
      value: '650',
      unit: 'cells/mm³',
      referenceRange: '500-1500',
      status: 'normal',
      trend: 'up'
    },
    {
      date: '2024-09-15',
      type: 'Tải lượng virus HIV',
      value: 'Không phát hiện',
      unit: 'copies/ml',
      referenceRange: '< 20',
      status: 'normal',
      trend: 'stable'
    }
  ];

  // Filter medical records
  const filteredRecords = medicalRecords.filter(record => {
    let matchesText = true;
    let matchesDate = true;
    let matchesFilter = true;
    
    if (searchText) {
      matchesText = 
        record.diagnosis.toLowerCase().includes(searchText.toLowerCase()) ||
        record.doctor.toLowerCase().includes(searchText.toLowerCase()) ||
        record.symptoms.toLowerCase().includes(searchText.toLowerCase());
    }
    
    if (dateRange && dateRange[0] && dateRange[1]) {
      const recordDate = dayjs(record.date);
      matchesDate = 
        recordDate.isAfter(dateRange[0]) && 
        recordDate.isBefore(dateRange[1]);
    }

    if (selectedFilter !== 'all') {
      matchesFilter = record.type === selectedFilter;
    }
    
    return matchesText && matchesDate && matchesFilter;
  });

  const recordsColumns = [
    {
      title: 'Ngày khám',
      dataIndex: 'date',
      key: 'date',
      render: date => (
        <div>
          <div className="font-medium">{dayjs(date).format('DD/MM/YYYY')}</div>
          <div className="text-xs text-gray-500">{dayjs(date).format('dddd')}</div>
        </div>
      ),
      sorter: (a, b) => new Date(b.date) - new Date(a.date),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Bác sĩ',
      dataIndex: 'doctor',
      key: 'doctor',
      render: doctor => (
        <div className="flex items-center space-x-2">
          <Avatar icon={<UserOutlined />} size="small" className="bg-blue-500" />
          <span className="font-medium">{doctor}</span>
        </div>
      )
    },
    {
      title: 'Chẩn đoán',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      ellipsis: true,
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: 'Loại khám',
      key: 'type',
      render: record => {
        const typeMap = {
          'routine_checkup': { text: 'Khám định kỳ', color: 'blue' },
          'emergency': { text: 'Cấp cứu', color: 'red' },
          'consultation': { text: 'Tư vấn', color: 'green' }
        };
        const type = typeMap[record.type] || { text: record.type, color: 'default' };
        return <Tag color={type.color}>{type.text}</Tag>;
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        const statusMap = {
          'completed': { text: 'Hoàn thành', color: 'green', icon: <CheckCircleOutlined /> },
          'pending': { text: 'Chờ kết quả', color: 'orange', icon: <ClockCircleOutlined /> }
        };
        const statusInfo = statusMap[status] || { text: status, color: 'default' };
        return (
          <Tag color={statusInfo.color} icon={statusInfo.icon}>
            {statusInfo.text}
          </Tag>
        );
      }
    }
  ];

  const labResultsColumns = [
    {
      title: 'Ngày XN',
      dataIndex: 'date',
      key: 'date',
      render: date => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a, b) => new Date(b.date) - new Date(a.date),
    },
    {
      title: 'Loại xét nghiệm',
      dataIndex: 'type',
      key: 'type',
      render: type => <span className="font-medium">{type}</span>
    },
    {
      title: 'Kết quả',
      key: 'value',
      render: record => (
        <div className="flex items-center space-x-2">
          <span className="font-semibold">{record.value}</span>
          <span className="text-gray-500 text-xs">{record.unit}</span>
          {record.trend === 'up' && <CaretUpOutlined className="text-green-500" />}
          {record.trend === 'down' && <CaretDownOutlined className="text-red-500" />}
          {record.trend === 'stable' && <div className="w-3 h-0.5 bg-blue-500"></div>}
        </div>
      )
    },
    {
      title: 'Giới hạn tham chiếu',
      dataIndex: 'referenceRange',
      key: 'referenceRange',
      render: text => <span className="text-gray-600">{text}</span>
    },
    {
      title: 'Đánh giá',
      key: 'status',
      render: record => {
        const statusMap = {
          'normal': { text: 'Bình thường', color: 'green' },
          'abnormal': { text: 'Bất thường', color: 'red' },
          'borderline': { text: 'Cận biên', color: 'orange' }
        };
        const status = statusMap[record.status] || { text: record.status, color: 'default' };
        return <Tag color={status.color}>{status.text}</Tag>;
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">

        <Row gutter={[24, 24]}>
          {/* Patient Info Sidebar */}
          <Col xs={24} lg={8}>
            <div className="space-y-6">
              {/* Basic Info */}
              <Card className="shadow-lg rounded-2xl border-0">
                <div className="text-center mb-6">
                  <Avatar size={80} icon={<UserOutlined />} className="bg-blue-500 mb-4" />
                  <Title level={4} className="mb-1">{patient.name}</Title>
                  <Text className="text-gray-500">{patient.age} tuổi • {patient.gender}</Text>
                </div>
                
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Mã bệnh nhân">{patient.id}</Descriptions.Item>
                  <Descriptions.Item label="Ngày sinh">{dayjs(patient.dob).format('DD/MM/YYYY')}</Descriptions.Item>
                  <Descriptions.Item label="Điện thoại">{patient.phone}</Descriptions.Item>
                  <Descriptions.Item label="Email">{patient.email}</Descriptions.Item>
                </Descriptions>
              </Card>

              {/* Medical Status */}
              <Card className="shadow-lg rounded-2xl border-0">
                <Title level={5} className="mb-4 flex items-center">
                  <HeartOutlined className="text-red-500 mr-2" />
                  Tình trạng sức khỏe
                </Title>
                
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <Text strong>Tình trạng HIV</Text>
                      <Tag color="blue">{patient.hivStatus}</Tag>
                    </div>
                    <Text className="text-sm text-gray-600">
                      Chẩn đoán: {dayjs(patient.diagnosisDate).format('DD/MM/YYYY')}
                    </Text>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <Text strong>Phác đồ hiện tại</Text>
                      <Tag color="green">Đang điều trị</Tag>
                    </div>
                    <Text className="text-sm text-gray-600">{patient.currentRegimen}</Text>
                  </div>
                  
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <Text strong className="block mb-2">Tuân thủ điều trị</Text>
                    <Progress 
                      percent={patient.adherence} 
                      strokeColor="#52c41a"
                      format={percent => `${percent}%`}
                    />
                  </div>
                </div>
              </Card>

              {/* Next Appointment */}
              <Card className="shadow-lg rounded-2xl border-0">
                <div className="text-center">
                  <CalendarOutlined className="text-2xl text-blue-500 mb-3" />
                  <Title level={5}>Lịch hẹn tiếp theo</Title>
                  <Text strong className="text-lg block mb-2">
                    {dayjs(patient.nextAppointment).format('DD/MM/YYYY')}
                  </Text>
                  <Text className="text-gray-500">
                    Với {patient.doctorInCharge}
                  </Text>
                </div>
              </Card>
            </div>
          </Col>

          {/* Main Content */}
          <Col xs={24} lg={16}>
            <Card className="shadow-lg rounded-2xl border-0">
              <Tabs defaultActiveKey="records" className="medical-records-tabs">
                <TabPane 
                  tab={<span><HistoryOutlined /> Lịch sử khám bệnh</span>}
                  key="records"
                >
                  {/* Filters */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={8}>
                        <Input
                          placeholder="Tìm kiếm chẩn đoán, bác sĩ..."
                          prefix={<SearchOutlined />}
                          value={searchText}
                          onChange={e => setSearchText(e.target.value)}
                          allowClear
                        />
                      </Col>
                      <Col xs={24} md={8}>
                        <RangePicker 
                          format="DD/MM/YYYY"
                          placeholder={['Từ ngày', 'Đến ngày']}
                          onChange={setDateRange}
                          style={{ width: '100%' }}
                        />
                      </Col>
                      <Col xs={24} md={8}>
                        <Select 
                          value={selectedFilter}
                          onChange={setSelectedFilter}
                          style={{ width: '100%' }}
                        >
                          <Option value="all">Tất cả</Option>
                          <Option value="routine_checkup">Khám định kỳ</Option>
                          <Option value="emergency">Cấp cứu</Option>
                          <Option value="consultation">Tư vấn</Option>
                        </Select>
                      </Col>
                    </Row>
                  </div>
                  
                  <Table
                    columns={recordsColumns}
                    dataSource={filteredRecords}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    expandable={{
                      expandedRowRender: record => (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <Row gutter={[16, 16]}>
                            <Col span={24}>
                              <Title level={5}>Chi tiết khám bệnh</Title>
                            </Col>
                            <Col xs={24} md={12}>
                              <div className="mb-4">
                                <Text strong>Triệu chứng:</Text>
                                <div className="mt-1">{record.symptoms}</div>
                              </div>
                              <div className="mb-4">
                                <Text strong>Xét nghiệm:</Text>
                                <div className="mt-1">
                                  {record.labTests.map(test => (
                                    <Tag key={test} className="mb-1">{test}</Tag>
                                  ))}
                                </div>
                              </div>
                            </Col>
                            <Col xs={24} md={12}>
                              <div className="mb-4">
                                <Text strong>Đơn thuốc:</Text>
                                <div className="mt-1 space-y-1">
                                  {record.prescription.map((med, idx) => (
                                    <div key={idx} className="text-sm">
                                      {med.medication} {med.dose} - {med.frequency} ({med.duration})
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </Col>
                            <Col span={24}>
                              <div className="mb-4">
                                <Text strong>Ghi chú:</Text>
                                <div className="mt-1">{record.notes}</div>
                              </div>
                              <div>
                                <Text strong>Tái khám:</Text>
                                <div className="mt-1">{dayjs(record.followupDate).format('DD/MM/YYYY')}</div>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      ),
                      rowExpandable: record => true,
                    }}
                  />
                </TabPane>
                
                <TabPane 
                  tab={<span><ExperimentOutlined /> Kết quả xét nghiệm</span>}
                  key="lab"
                >
                  <Table
                    columns={labResultsColumns}
                    dataSource={labResults}
                    rowKey={(record, index) => `${record.date}-${record.type}-${index}`}
                    pagination={{ pageSize: 10 }}
                  />
                </TabPane>
                
                <TabPane 
                  tab={<span><MedicineBoxOutlined /> Lịch sử phác đồ</span>}
                  key="regimen"
                >
                  <Timeline className="mt-4">
                    <Timeline.Item 
                      color="green" 
                      dot={<MedicineBoxOutlined style={{ fontSize: '16px' }} />}
                    >
                      <div className="mb-2">
                        <Text strong className="text-lg">{patient.currentRegimen}</Text>
                        <Tag color="green" className="ml-2">Hiện tại</Tag>
                      </div>
                      <div className="text-gray-500 mb-2">
                        Bắt đầu từ: {dayjs(patient.startedTreatment).format('DD/MM/YYYY')}
                      </div>
                      <div className="text-sm">
                        Phác đồ bậc 1 theo hướng dẫn điều trị quốc gia. Hiệu quả tốt, ít tác dụng phụ.
                      </div>
                    </Timeline.Item>
                  </Timeline>
                </TabPane>
                
                <TabPane 
                  tab={<span><AreaChartOutlined /> Biểu đồ theo dõi</span>}
                  key="chart"
                >
                  <Alert
                    message="Tính năng đang phát triển"
                    description="Biểu đồ theo dõi CD4, tải lượng virus và các chỉ số khác sẽ được cập nhật sớm."
                    type="info"
                    showIcon
                    className="mb-4"
                  />
                  <Empty 
                    image={<BarChartOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
                    description="Biểu đồ sẽ hiển thị xu hướng các chỉ số sức khỏe theo thời gian"
                  />
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PatientMedicalRecordPage;