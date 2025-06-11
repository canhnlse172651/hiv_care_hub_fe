import React, { useState } from 'react';
import { 
  Card, Typography, Tabs, Space, Button, Table, Tag, 
  Timeline, Divider, Descriptions, Input, 
  DatePicker, Select, Statistic, Row, Col, Empty
} from 'antd';
import {
  UserOutlined, SearchOutlined, FileTextOutlined,
  HistoryOutlined, MedicineBoxOutlined, CalendarOutlined,
  AreaChartOutlined, LeftOutlined, FileSearchOutlined
} from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const MedicalRecordsPage = () => {
  const { patientId } = useParams();
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);
  
  // Mock data for a patient
  const patient = {
    id: 'PT-10001',
    name: 'Nguyễn Văn A',
    age: 35,
    gender: 'Nam',
    dob: '1989-05-12',
    idNumber: '0123456789',
    phone: '0912345678',
    email: 'nguyenvana@email.com',
    address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    startedTreatment: '2022-03-10',
    currentRegimen: 'TDF + 3TC + DTG',
    allergies: 'Không',
    chronicConditions: 'Tăng huyết áp',
    status: 'active'
  };
  
  // Mock data for medical records
  const medicalRecords = [
    {
      id: 'MR-202406001',
      date: '2024-06-01',
      doctor: 'BS. Trần Văn B',
      diagnosis: 'Nhiễm HIV ổn định, tuân thủ điều trị tốt',
      symptoms: 'Không có triệu chứng bất thường',
      prescription: [
        { medication: 'TDF', dose: '300mg', frequency: '1 lần/ngày', duration: 'Dài hạn' },
        { medication: '3TC', dose: '300mg', frequency: '1 lần/ngày', duration: 'Dài hạn' },
        { medication: 'DTG', dose: '50mg', frequency: '1 lần/ngày', duration: 'Dài hạn' },
      ],
      labTests: ['CD4', 'Tải lượng virus HIV', 'Công thức máu'],
      regimenChange: false,
      notes: 'Bệnh nhân tuân thủ điều trị tốt, không có tác dụng phụ',
      followupDate: '2024-09-01'
    },
    {
      id: 'MR-202403001',
      date: '2024-03-15',
      doctor: 'BS. Trần Văn B',
      diagnosis: 'Nhiễm HIV ổn định, tuân thủ điều trị tốt',
      symptoms: 'Không có triệu chứng bất thường',
      prescription: [
        { medication: 'TDF', dose: '300mg', frequency: '1 lần/ngày', duration: 'Dài hạn' },
        { medication: '3TC', dose: '300mg', frequency: '1 lần/ngày', duration: 'Dài hạn' },
        { medication: 'DTG', dose: '50mg', frequency: '1 lần/ngày', duration: 'Dài hạn' },
      ],
      labTests: ['CD4', 'Tải lượng virus HIV', 'Chức năng gan', 'Chức năng thận'],
      regimenChange: false,
      notes: 'Bệnh nhân tuân thủ điều trị tốt, không có tác dụng phụ',
      followupDate: '2024-06-15'
    },
    {
      id: 'MR-202312001',
      date: '2023-12-20',
      doctor: 'BS. Trần Văn B',
      diagnosis: 'Nhiễm HIV ổn định, tuân thủ điều trị tốt',
      symptoms: 'Đau đầu nhẹ, mệt mỏi',
      prescription: [
        { medication: 'TDF', dose: '300mg', frequency: '1 lần/ngày', duration: 'Dài hạn' },
        { medication: '3TC', dose: '300mg', frequency: '1 lần/ngày', duration: 'Dài hạn' },
        { medication: 'DTG', dose: '50mg', frequency: '1 lần/ngày', duration: 'Dài hạn' },
        { medication: 'Paracetamol', dose: '500mg', frequency: '3 lần/ngày', duration: '5 ngày' },
      ],
      labTests: ['CD4', 'Tải lượng virus HIV'],
      regimenChange: false,
      notes: 'Đau đầu có thể do căng thẳng, không liên quan đến thuốc ARV',
      followupDate: '2024-03-20'
    },
    {
      id: 'MR-202309001',
      date: '2023-09-18',
      doctor: 'BS. Lê Thị C',
      diagnosis: 'Nhiễm HIV ổn định, nhiễm trùng đường hô hấp trên',
      symptoms: 'Ho, đau họng, sổ mũi',
      prescription: [
        { medication: 'TDF', dose: '300mg', frequency: '1 lần/ngày', duration: 'Dài hạn' },
        { medication: '3TC', dose: '300mg', frequency: '1 lần/ngày', duration: 'Dài hạn' },
        { medication: 'DTG', dose: '50mg', frequency: '1 lần/ngày', duration: 'Dài hạn' },
        { medication: 'Amoxicillin', dose: '500mg', frequency: '3 lần/ngày', duration: '5 ngày' },
        { medication: 'Loratadine', dose: '10mg', frequency: '1 lần/ngày', duration: '5 ngày' },
      ],
      labTests: [],
      regimenChange: false,
      notes: 'Nhiễm trùng đường hô hấp trên. Cần uống nhiều nước và nghỉ ngơi',
      followupDate: '2023-12-18'
    },
  ];
  
  // Mock data for lab results
  const labResults = [
    {
      date: '2024-06-01',
      type: 'CD4',
      value: '650',
      unit: 'cells/mm³',
      referenceRange: '500-1500',
      status: 'normal'
    },
    {
      date: '2024-06-01',
      type: 'Tải lượng virus HIV',
      value: 'Không phát hiện',
      unit: 'copies/ml',
      referenceRange: '< 20',
      status: 'normal'
    },
    {
      date: '2024-03-15',
      type: 'CD4',
      value: '620',
      unit: 'cells/mm³',
      referenceRange: '500-1500',
      status: 'normal'
    },
    {
      date: '2024-03-15',
      type: 'Tải lượng virus HIV',
      value: 'Không phát hiện',
      unit: 'copies/ml',
      referenceRange: '< 20',
      status: 'normal'
    },
    {
      date: '2024-03-15',
      type: 'ALT',
      value: '32',
      unit: 'U/L',
      referenceRange: '7-55',
      status: 'normal'
    },
    {
      date: '2024-03-15',
      type: 'AST',
      value: '28',
      unit: 'U/L',
      referenceRange: '8-48',
      status: 'normal'
    },
    {
      date: '2024-03-15',
      type: 'Creatinine',
      value: '0.9',
      unit: 'mg/dL',
      referenceRange: '0.7-1.3',
      status: 'normal'
    },
    {
      date: '2023-12-20',
      type: 'CD4',
      value: '580',
      unit: 'cells/mm³',
      referenceRange: '500-1500',
      status: 'normal'
    },
    {
      date: '2023-12-20',
      type: 'Tải lượng virus HIV',
      value: 'Không phát hiện',
      unit: 'copies/ml',
      referenceRange: '< 20',
      status: 'normal'
    },
  ];
  
  // Filter medical records
  const filteredRecords = medicalRecords.filter(record => {
    let matchesText = true;
    let matchesDate = true;
    
    if (searchText) {
      matchesText = 
        record.diagnosis.toLowerCase().includes(searchText.toLowerCase()) ||
        record.doctor.toLowerCase().includes(searchText.toLowerCase());
    }
    
    if (dateRange && dateRange[0] && dateRange[1]) {
      const recordDate = dayjs(record.date);
      matchesDate = 
        recordDate.isAfter(dateRange[0]) && 
        recordDate.isBefore(dateRange[1]);
    }
    
    return matchesText && matchesDate;
  });
  
  // Column definition for medical records table
  const recordsColumns = [
    {
      title: 'Ngày khám',
      dataIndex: 'date',
      key: 'date',
      render: date => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a, b) => new Date(b.date) - new Date(a.date),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Bác sĩ',
      dataIndex: 'doctor',
      key: 'doctor',
    },
    {
      title: 'Chẩn đoán',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      ellipsis: true,
    },
    {
      title: 'Thay đổi phác đồ',
      key: 'regimenChange',
      render: record => record.regimenChange ? 
        <Tag color="blue">Có</Tag> : 
        <Tag color="default">Không</Tag>
    },
    {
      title: '',
      key: 'action',
      render: record => (
        <Button type="link" onClick={() => console.log('View record', record.id)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];
  
  // Column definition for lab results table
  const labResultsColumns = [
    {
      title: 'Ngày xét nghiệm',
      dataIndex: 'date',
      key: 'date',
      render: date => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a, b) => new Date(b.date) - new Date(a.date),
    },
    {
      title: 'Loại xét nghiệm',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Kết quả',
      key: 'value',
      render: record => (
        <Space>
          <span>{record.value}</span>
          <span className="text-gray-500 text-xs">{record.unit}</span>
        </Space>
      )
    },
    {
      title: 'Giới hạn tham chiếu',
      dataIndex: 'referenceRange',
      key: 'referenceRange',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: record => {
        switch (record.status) {
          case 'normal':
            return <Tag color="green">Bình thường</Tag>;
          case 'abnormal':
            return <Tag color="red">Bất thường</Tag>;
          default:
            return <Tag color="default">{record.status}</Tag>;
        }
      }
    },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center">
          <Link to="/doctor/dashboard" className="mr-4">
            <Button icon={<LeftOutlined />}>Quay lại</Button>
          </Link>
          <Title level={3} className="mb-0">Hồ sơ bệnh án</Title>
        </div>
        <Button type="primary" icon={<FileSearchOutlined />} className="mt-4 md:mt-0">
          Tạo báo cáo
        </Button>
      </div>
      
      <Row gutter={16}>
        <Col span={24} lg={8}>
          <Card className="mb-6 shadow-md">
            <div className="flex items-center mb-4">
              <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl mr-4">
                <UserOutlined />
              </div>
              <div>
                <Title level={4} className="mb-0">{patient.name}</Title>
                <Text className="text-gray-500">
                  {patient.age} tuổi | {patient.gender} | Mã BN: {patient.id}
                </Text>
              </div>
            </div>
            
            <Divider className="my-3" />
            
            <Descriptions column={1} className="mb-4">
              <Descriptions.Item label="Bắt đầu điều trị">{dayjs(patient.startedTreatment).format('DD/MM/YYYY')}</Descriptions.Item>
              <Descriptions.Item label="Phác đồ hiện tại">{patient.currentRegimen}</Descriptions.Item>
              <Descriptions.Item label="Dị ứng">{patient.allergies}</Descriptions.Item>
              <Descriptions.Item label="Bệnh mãn tính">{patient.chronicConditions}</Descriptions.Item>
            </Descriptions>
            
            <Divider className="my-3" />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-3 bg-blue-50">
                <div className="text-sm text-gray-500 mb-1">CD4 gần nhất</div>
                <div className="text-lg font-semibold">650 cells/mm³</div>
                <div className="text-xs text-gray-500">01/06/2024</div>
              </div>
              <div className="border rounded-lg p-3 bg-green-50">
                <div className="text-sm text-gray-500 mb-1">Tải lượng virus</div>
                <div className="text-lg font-semibold">Không phát hiện</div>
                <div className="text-xs text-gray-500">01/06/2024</div>
              </div>
            </div>
            
            <Divider className="my-3" />
            
            <Timeline mode="left" className="mt-4">
              <Timeline.Item dot={<CalendarOutlined />}>
                Khám định kỳ tiếp theo: {dayjs('2024-09-01').format('DD/MM/YYYY')}
              </Timeline.Item>
              <Timeline.Item dot={<MedicineBoxOutlined />}>
                Cấp thuốc lần cuối: {dayjs('2024-06-01').format('DD/MM/YYYY')}
              </Timeline.Item>
              <Timeline.Item dot={<FileTextOutlined />}>
                Xét nghiệm tiếp theo: {dayjs('2024-09-01').format('DD/MM/YYYY')}
              </Timeline.Item>
            </Timeline>
          </Card>
          
          <Card title="Biểu đồ CD4" className="shadow-md">
            <Empty description="Chức năng đang được phát triển" />
          </Card>
        </Col>
        
        <Col span={24} lg={16}>
          <Card className="mb-6 shadow-md">
            <Tabs defaultActiveKey="records">
              <TabPane 
                tab={<span><HistoryOutlined /> Lịch sử khám bệnh</span>}
                key="records"
              >
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div className="mb-3 md:mb-0">
                    <Input
                      placeholder="Tìm kiếm chẩn đoán, bác sĩ..."
                      prefix={<SearchOutlined />}
                      value={searchText}
                      onChange={e => setSearchText(e.target.value)}
                      style={{ width: 250 }}
                      allowClear
                    />
                  </div>
                  <div>
                    <RangePicker 
                      format="DD/MM/YYYY"
                      placeholder={['Từ ngày', 'Đến ngày']}
                      onChange={setDateRange}
                      style={{ width: 300 }}
                      className="mr-2"
                    />
                    <Select defaultValue="all" style={{ width: 120 }}>
                      <Option value="all">Tất cả</Option>
                      <Option value="6months">6 tháng</Option>
                      <Option value="1year">1 năm</Option>
                    </Select>
                  </div>
                </div>
                
                <Table
                  columns={recordsColumns}
                  dataSource={filteredRecords}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                  className="border rounded-lg"
                />
              </TabPane>
              <TabPane 
                tab={<span><FileTextOutlined /> Kết quả xét nghiệm</span>}
                key="lab"
              >
                <div className="flex justify-end mb-4">
                  <Select defaultValue="all" style={{ width: 180 }} className="mr-2">
                    <Option value="all">Tất cả xét nghiệm</Option>
                    <Option value="cd4">CD4</Option>
                    <Option value="viral">Tải lượng virus</Option>
                    <Option value="liver">Chức năng gan</Option>
                    <Option value="kidney">Chức năng thận</Option>
                  </Select>
                  <Select defaultValue="all" style={{ width: 120 }}>
                    <Option value="all">Tất cả</Option>
                    <Option value="6months">6 tháng</Option>
                    <Option value="1year">1 năm</Option>
                  </Select>
                </div>
                
                <Table
                  columns={labResultsColumns}
                  dataSource={labResults}
                  rowKey={(record, index) => `${record.date}-${record.type}-${index}`}
                  pagination={{ pageSize: 10 }}
                  className="border rounded-lg"
                />
              </TabPane>
              <TabPane 
                tab={<span><MedicineBoxOutlined /> Lịch sử phác đồ</span>}
                key="regimen"
              >
                <Timeline mode="left" className="mt-4">
                  <Timeline.Item color="green" dot={<MedicineBoxOutlined />}>
                    <div className="font-medium">TDF + 3TC + DTG</div>
                    <div className="text-gray-500">Bắt đầu từ: 10/03/2022 - Hiện tại</div>
                    <div className="text-sm">Phác đồ bậc 1 theo hướng dẫn quốc gia</div>
                  </Timeline.Item>
                </Timeline>
              </TabPane>
              <TabPane 
                tab={<span><AreaChartOutlined /> Biểu đồ theo dõi</span>}
                key="chart"
              >
                <Empty description="Chức năng đang được phát triển" />
              </TabPane>
            </Tabs>
          </Card>
          
          <Card title="Tóm tắt điều trị" className="shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Statistic 
                title="Thời gian điều trị"
                value={dayjs().diff(dayjs(patient.startedTreatment), 'month')}
                suffix="tháng"
              />
              <Statistic 
                title="Tuân thủ điều trị"
                value="Tốt"
              />
              <Statistic 
                title="Tác dụng phụ"
                value="Không"
              />
            </div>
            
            <Paragraph className="text-gray-700">
              Bệnh nhân tuân thủ điều trị tốt, không có tác dụng phụ đáng kể. Phác đồ hiện tại TDF + 3TC + DTG đang phù hợp.
              CD4 ổn định và tải lượng virus không phát hiện. Tiếp tục điều trị với phác đồ hiện tại.
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MedicalRecordsPage;
