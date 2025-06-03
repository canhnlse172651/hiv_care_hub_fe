import React, { useState } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Space, 
  Typography, 
  Tag,
  Input, 
  Select,
  Modal,
  Form, 
  DatePicker,
  Popconfirm,
  message,
  Badge,
  Tooltip,
  Tabs,
  Alert,
  Drawer,
  Timeline,
  InputNumber,
  Progress
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BellOutlined,
  HistoryOutlined,
  NotificationOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const TreatmentTracking = () => {
  const [searchText, setSearchText] = useState('');
  const [patientDrawerVisible, setPatientDrawerVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [form] = Form.useForm();
  
  // Example data - in a real app, this would come from API
  const [patients, setPatients] = useState([
    {
      key: '1',
      id: 1,
      name: 'John Doe',
      age: 35,
      dateOfDiagnosis: '2022-03-15',
      currentRegimen: 'TDF + 3TC + DTG',
      startDate: '2023-01-10',
      lastRefill: '2025-05-15',
      nextRefill: '2025-06-15',
      adherenceRate: 95,
      status: 'active',
      notes: 'Patient responding well to treatment.',
      doctor: 'Dr. Sarah Johnson',
      regimenHistory: [
        {
          regimen: 'AZT + 3TC + EFV',
          startDate: '2022-03-20',
          endDate: '2023-01-10',
          reason: 'Side effects - switched to current regimen'
        },
        {
          regimen: 'TDF + 3TC + DTG',
          startDate: '2023-01-10',
          endDate: null,
          reason: 'Current regimen'
        }
      ],
      refillHistory: [
        {
          date: '2025-03-15',
          medication: 'TDF + 3TC + DTG',
          quantity: '30 days',
          dispensedBy: 'Dr. Michael Brown'
        },
        {
          date: '2025-04-15',
          medication: 'TDF + 3TC + DTG',
          quantity: '30 days',
          dispensedBy: 'Dr. Sarah Johnson'
        },
        {
          date: '2025-05-15',
          medication: 'TDF + 3TC + DTG',
          quantity: '30 days',
          dispensedBy: 'Dr. Michael Brown'
        }
      ]
    },
    {
      key: '2',
      id: 2,
      name: 'Jane Smith',
      age: 28,
      dateOfDiagnosis: '2020-07-22',
      currentRegimen: 'ABC + 3TC + DTG',
      startDate: '2020-08-15',
      lastRefill: '2025-05-20',
      nextRefill: '2025-06-20',
      adherenceRate: 88,
      status: 'active',
      notes: 'Patient reported mild nausea, monitoring closely.',
      doctor: 'Dr. David Lee',
      regimenHistory: [
        {
          regimen: 'ABC + 3TC + DTG',
          startDate: '2020-08-15',
          endDate: null,
          reason: 'Initial regimen, still current'
        }
      ],
      refillHistory: [
        {
          date: '2025-03-20',
          medication: 'ABC + 3TC + DTG',
          quantity: '30 days',
          dispensedBy: 'Dr. David Lee'
        },
        {
          date: '2025-04-20',
          medication: 'ABC + 3TC + DTG',
          quantity: '30 days',
          dispensedBy: 'Dr. David Lee'
        },
        {
          date: '2025-05-20',
          medication: 'ABC + 3TC + DTG',
          quantity: '30 days',
          dispensedBy: 'Dr. Sarah Johnson'
        }
      ]
    },
    {
      key: '3',
      id: 3,
      name: 'Robert Johnson',
      age: 42,
      dateOfDiagnosis: '2018-11-05',
      currentRegimen: 'TDF + FTC + EFV',
      startDate: '2019-01-10',
      lastRefill: '2025-04-05',
      nextRefill: '2025-05-05',
      adherenceRate: 72,
      status: 'late',
      notes: 'Patient missed last appointment, follow-up scheduled.',
      doctor: 'Dr. Michael Brown',
      regimenHistory: [
        {
          regimen: 'AZT + 3TC + NVP',
          startDate: '2018-11-15',
          endDate: '2019-01-10',
          reason: 'Allergic reaction to NVP'
        },
        {
          regimen: 'TDF + FTC + EFV',
          startDate: '2019-01-10',
          endDate: null,
          reason: 'Current regimen'
        }
      ],
      refillHistory: [
        {
          date: '2025-02-05',
          medication: 'TDF + FTC + EFV',
          quantity: '30 days',
          dispensedBy: 'Dr. Michael Brown'
        },
        {
          date: '2025-03-05',
          medication: 'TDF + FTC + EFV',
          quantity: '30 days',
          dispensedBy: 'Dr. Sarah Johnson'
        },
        {
          date: '2025-04-05',
          medication: 'TDF + FTC + EFV',
          quantity: '30 days',
          dispensedBy: 'Dr. Michael Brown'
        }
      ]
    },
    {
      key: '4',
      id: 4,
      name: 'Emily Wilson',
      age: 31,
      dateOfDiagnosis: '2021-05-18',
      currentRegimen: 'DTG + 3TC',
      startDate: '2021-06-01',
      lastRefill: '2025-05-01',
      nextRefill: '2025-06-01',
      adherenceRate: 98,
      status: 'active',
      notes: 'Excellent adherence, viral load undetectable.',
      doctor: 'Dr. Sarah Johnson',
      regimenHistory: [
        {
          regimen: 'DTG + 3TC',
          startDate: '2021-06-01',
          endDate: null,
          reason: 'Initial regimen, still current'
        }
      ],
      refillHistory: [
        {
          date: '2025-03-01',
          medication: 'DTG + 3TC',
          quantity: '30 days',
          dispensedBy: 'Dr. Sarah Johnson'
        },
        {
          date: '2025-04-01',
          medication: 'DTG + 3TC',
          quantity: '30 days',
          dispensedBy: 'Dr. David Lee'
        },
        {
          date: '2025-05-01',
          medication: 'DTG + 3TC',
          quantity: '30 days',
          dispensedBy: 'Dr. Sarah Johnson'
        }
      ]
    },
    {
      key: '5',
      id: 5,
      name: 'Michael Brown',
      age: 45,
      dateOfDiagnosis: '2015-09-12',
      currentRegimen: 'RAL + TDF + FTC',
      startDate: '2023-02-20',
      lastRefill: '2025-03-10',
      nextRefill: '2025-04-10',
      adherenceRate: 65,
      status: 'non-adherent',
      notes: 'Patient struggles with adherence, considering treatment support options.',
      doctor: 'Dr. David Lee',
      regimenHistory: [
        {
          regimen: 'AZT + 3TC + EFV',
          startDate: '2015-09-25',
          endDate: '2018-06-15',
          reason: 'Treatment failure'
        },
        {
          regimen: 'TDF + FTC + ATV/r',
          startDate: '2018-06-15',
          endDate: '2023-02-20',
          reason: 'Side effects - gastrointestinal issues'
        },
        {
          regimen: 'RAL + TDF + FTC',
          startDate: '2023-02-20',
          endDate: null,
          reason: 'Current regimen'
        }
      ],
      refillHistory: [
        {
          date: '2025-01-10',
          medication: 'RAL + TDF + FTC',
          quantity: '30 days',
          dispensedBy: 'Dr. David Lee'
        },
        {
          date: '2025-02-15',
          medication: 'RAL + TDF + FTC',
          quantity: '30 days',
          dispensedBy: 'Dr. Michael Brown'
        },
        {
          date: '2025-03-10',
          medication: 'RAL + TDF + FTC',
          quantity: '30 days',
          dispensedBy: 'Dr. David Lee'
        }
      ]
    }
  ]);
  
  // Medication regimen options (example data)
  const regimenOptions = [
    { value: 'TDF + 3TC + DTG', label: 'TDF + 3TC + DTG (Tenofovir + Lamivudine + Dolutegravir)' },
    { value: 'ABC + 3TC + DTG', label: 'ABC + 3TC + DTG (Abacavir + Lamivudine + Dolutegravir)' },
    { value: 'TDF + FTC + EFV', label: 'TDF + FTC + EFV (Tenofovir + Emtricitabine + Efavirenz)' },
    { value: 'AZT + 3TC + EFV', label: 'AZT + 3TC + EFV (Zidovudine + Lamivudine + Efavirenz)' },
    { value: 'TDF + FTC + ATV/r', label: 'TDF + FTC + ATV/r (Tenofovir + Emtricitabine + Atazanavir/ritonavir)' },
    { value: 'DTG + 3TC', label: 'DTG + 3TC (Dolutegravir + Lamivudine)' },
    { value: 'RAL + TDF + FTC', label: 'RAL + TDF + FTC (Raltegravir + Tenofovir + Emtricitabine)' },
  ];
  
  // Example doctor options
  const doctorOptions = [
    { value: 'Dr. Sarah Johnson', label: 'Dr. Sarah Johnson (Infectious Disease)' },
    { value: 'Dr. Michael Brown', label: 'Dr. Michael Brown (General Practitioner)' },
    { value: 'Dr. David Lee', label: 'Dr. David Lee (Therapist)' },
    { value: 'Dr. Emily Chen', label: 'Dr. Emily Chen (Nutritionist)' },
  ];
  
  const getStatusTag = (status, adherenceRate) => {
    if (status === 'late') {
      return <Tag color="red" icon={<WarningOutlined />}>Late Refill</Tag>;
    } else if (status === 'non-adherent' || adherenceRate < 80) {
      return <Tag color="orange" icon={<WarningOutlined />}>Non-adherent</Tag>;
    } else if (adherenceRate >= 95) {
      return <Tag color="green" icon={<CheckCircleOutlined />}>Excellent</Tag>;
    } else {
      return <Tag color="blue" icon={<CheckCircleOutlined />}>Good</Tag>;
    }
  };

  const getAdherenceColor = (rate) => {
    if (rate >= 95) return '#52c41a'; // green
    if (rate >= 80) return '#1890ff'; // blue
    if (rate >= 70) return '#faad14'; // yellow
    return '#ff4d4f'; // red
  };

  const getRefillStatus = (nextRefill) => {
    const today = dayjs();
    const refillDate = dayjs(nextRefill);
    const daysUntilRefill = refillDate.diff(today, 'day');

    if (daysUntilRefill < 0) {
      return <Tag color="red">Overdue</Tag>;
    } else if (daysUntilRefill <= 7) {
      return <Tag color="orange">Soon</Tag>;
    } else {
      return <Tag color="green">Scheduled</Tag>;
    }
  };
  
  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setPatientDrawerVisible(true);
  };

  const handleAddRegimen = () => {
    setModalMode('add');
    setIsModalVisible(true);
    form.resetFields();
  };
  
  const handleEditRegimen = (patient) => {
    setModalMode('edit');
    setSelectedPatient(patient);
    setIsModalVisible(true);
    form.setFieldsValue({
      patientId: patient.id,
      patientName: patient.name,
      regimen: patient.currentRegimen,
      startDate: dayjs(patient.startDate),
      doctor: patient.doctor,
      notes: patient.notes,
      adherenceRate: patient.adherenceRate,
    });
  };

  const handleModalSubmit = (values) => {
    console.log('Form values:', values);
    
    if (modalMode === 'edit' && selectedPatient) {
      // Edit existing regimen
      setPatients(prevPatients => 
        prevPatients.map(patient => 
          patient.id === selectedPatient.id 
            ? {
                ...patient,
                currentRegimen: values.regimen,
                startDate: values.startDate.format('YYYY-MM-DD'),
                doctor: values.doctor,
                notes: values.notes,
                adherenceRate: values.adherenceRate,
                regimenHistory: [
                  ...patient.regimenHistory.map(history => 
                    history.endDate === null 
                      ? {...history, endDate: values.startDate.format('YYYY-MM-DD'), reason: 'Changed to new regimen'}
                      : history
                  ),
                  {
                    regimen: values.regimen,
                    startDate: values.startDate.format('YYYY-MM-DD'),
                    endDate: null,
                    reason: 'Current regimen'
                  }
                ]
              }
            : patient
        )
      );
      message.success('Treatment regimen updated successfully');
    } else {
      // Add new regimen would happen here in a real application
      message.success('New treatment regimen would be added here');
    }
    
    setIsModalVisible(false);
  };

  const handleRecordRefill = (patient) => {
    const today = dayjs().format('YYYY-MM-DD');
    
    setPatients(prevPatients => 
      prevPatients.map(p => 
        p.id === patient.id 
          ? {
              ...p,
              lastRefill: today,
              nextRefill: dayjs().add(30, 'day').format('YYYY-MM-DD'),
              status: 'active',
              refillHistory: [
                {
                  date: today,
                  medication: p.currentRegimen,
                  quantity: '30 days',
                  dispensedBy: p.doctor
                },
                ...p.refillHistory
              ]
            }
          : p
      )
    );
    
    message.success('Medication refill recorded successfully');
  };

  const filteredPatients = patients.filter(patient => {
    return (
      patient.name.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.currentRegimen.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.doctor.toLowerCase().includes(searchText.toLowerCase())
    );
  });
  
  // Get patients who are late for refills or have low adherence
  const alertPatients = patients.filter(patient => 
    patient.status === 'late' || 
    patient.status === 'non-adherent' || 
    patient.adherenceRate < 80 ||
    dayjs().isAfter(dayjs(patient.nextRefill))
  );
  
  const columns = [
    {
      title: 'Patient',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <a onClick={() => handleViewPatient(record)}>{text}</a>
      ),
    },
    {
      title: 'Current Regimen',
      dataIndex: 'currentRegimen',
      key: 'currentRegimen',
      filters: regimenOptions.map(option => ({ text: option.value, value: option.value })),
      onFilter: (value, record) => record.currentRegimen === value,
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
    },
    {
      title: 'Last Refill',
      dataIndex: 'lastRefill',
      key: 'lastRefill',
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a, b) => new Date(a.lastRefill) - new Date(b.lastRefill),
    },
    {
      title: 'Next Refill',
      dataIndex: 'nextRefill',
      key: 'nextRefill',
      render: (date, record) => (
        <Space>
          {dayjs(date).format('MMM DD, YYYY')}
          {getRefillStatus(date)}
        </Space>
      ),
      sorter: (a, b) => new Date(a.nextRefill) - new Date(b.nextRefill),
    },
    {
      title: 'Adherence',
      key: 'adherence',
      dataIndex: 'adherenceRate',
      render: (adherenceRate) => (
        <Tooltip title={`${adherenceRate}%`}>
          <Progress 
            percent={adherenceRate} 
            size="small" 
            strokeColor={getAdherenceColor(adherenceRate)}
            showInfo={false}
          />
          <span style={{ marginLeft: 8 }}>{adherenceRate}%</span>
        </Tooltip>
      ),
      sorter: (a, b) => a.adherenceRate - b.adherenceRate,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => getStatusTag(record.status, record.adherenceRate),
      filters: [
        { text: 'Excellent', value: 'excellent' },
        { text: 'Good', value: 'good' },
        { text: 'Non-adherent', value: 'non-adherent' },
        { text: 'Late', value: 'late' },
      ],
      onFilter: (value, record) => {
        if (value === 'excellent') return record.adherenceRate >= 95;
        if (value === 'good') return record.adherenceRate >= 80 && record.adherenceRate < 95;
        if (value === 'non-adherent') return record.adherenceRate < 80 || record.status === 'non-adherent';
        if (value === 'late') return record.status === 'late';
        return true;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditRegimen(record)}
          />
          <Button
            icon={<MedicineBoxOutlined />}
            size="small"
            onClick={() => handleRecordRefill(record)}
          >
            Refill
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>Treatment & Medication Tracking</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddRegimen}
        >
          Assign New Regimen
        </Button>
      </div>
      
      {alertPatients.length > 0 && (
        <Alert
          message="Attention Required"
          description={
            <div>
              <p>{alertPatients.length} patient(s) need attention due to late refills or poor adherence.</p>
              <div style={{ marginTop: 8 }}>
                {alertPatients.map(patient => (
                  <Tag key={patient.id} color="red" style={{ marginBottom: 4 }}>
                    {patient.name} - {patient.status === 'late' ? 'Late refill' : 'Low adherence'}
                  </Tag>
                ))}
              </div>
            </div>
          }
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" danger>
              Generate Alert Report
            </Button>
          }
        />
      )}
      
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space size="large" wrap>
            <Input
              placeholder="Search by patient name or regimen"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
            
            <Select
              placeholder="Filter by regimen"
              style={{ width: 300 }}
              allowClear
              options={regimenOptions}
              onChange={value => setSearchText(value || '')}
            />
            
            <Select
              placeholder="Filter by doctor"
              style={{ width: 250 }}
              allowClear
              options={doctorOptions}
              onChange={value => setSearchText(value || '')}
            />
          </Space>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Badge color="green" text="Excellent Adherence (≥95%)" />
            <Badge color="blue" text="Good Adherence (80-94%)" />
            <Badge color="orange" text="Poor Adherence (70-79%)" />
            <Badge color="red" text="Critical Adherence (<70%)" />
          </Space>
        </div>

        <Table 
          columns={columns} 
          dataSource={filteredPatients}
          pagination={{ pageSize: 10 }}
          rowKey="key"
        />
      </Card>
      
      {/* Patient Detail Drawer */}
      <Drawer
        title={selectedPatient ? `${selectedPatient.name} (${selectedPatient.age} years)` : 'Patient Details'}
        placement="right"
        width={700}
        onClose={() => setPatientDrawerVisible(false)}
        open={patientDrawerVisible}
        extra={
          selectedPatient && (
            <Space>
              <Button onClick={() => handleEditRegimen(selectedPatient)} type="primary">
                Update Regimen
              </Button>
            </Space>
          )
        }
      >
        {selectedPatient && (
          <>
            <div style={{ marginBottom: 24 }}>
              <Space size="large">
                <div>
                  <Text type="secondary">Diagnosis Date</Text>
                  <div>{dayjs(selectedPatient.dateOfDiagnosis).format('MMMM DD, YYYY')}</div>
                </div>
                <div>
                  <Text type="secondary">Primary Provider</Text>
                  <div>{selectedPatient.doctor}</div>
                </div>
                <div>
                  <Text type="secondary">Adherence</Text>
                  <div>
                    <Progress 
                      percent={selectedPatient.adherenceRate} 
                      strokeColor={getAdherenceColor(selectedPatient.adherenceRate)} 
                      size="small"
                      style={{ width: 120 }}
                    />
                  </div>
                </div>
              </Space>
            </div>

            <Tabs defaultActiveKey="1">
              <TabPane 
                tab={
                  <span>
                    <MedicineBoxOutlined />
                    Current Treatment
                  </span>
                } 
                key="1"
              >
                <Card size="small" title="Current Regimen" style={{ marginBottom: 16 }}>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong>Medication:</Text> {selectedPatient.currentRegimen}
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong>Start Date:</Text> {dayjs(selectedPatient.startDate).format('MMMM DD, YYYY')}
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong>Prescribed By:</Text> {selectedPatient.doctor}
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <Text strong>Status:</Text> {getStatusTag(selectedPatient.status, selectedPatient.adherenceRate)}
                    </div>
                    <div>
                      <Text strong>Notes:</Text>
                      <div style={{ marginTop: 4, padding: 8, background: '#f5f5f5', borderRadius: 4 }}>
                        {selectedPatient.notes || 'No notes available.'}
                      </div>
                    </div>
                  </div>
                </Card>
                
                <Card size="small" title="Refill Schedule" style={{ marginBottom: 16 }}>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>Last Refill:</Text> {dayjs(selectedPatient.lastRefill).format('MMMM DD, YYYY')}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>Next Refill:</Text> {dayjs(selectedPatient.nextRefill).format('MMMM DD, YYYY')} {getRefillStatus(selectedPatient.nextRefill)}
                  </div>
                  <div>
                    <Button 
                      type="primary" 
                      icon={<MedicineBoxOutlined />} 
                      size="small" 
                      onClick={() => handleRecordRefill(selectedPatient)}
                    >
                      Record New Refill
                    </Button>
                  </div>
                </Card>
              </TabPane>
              
              <TabPane 
                tab={
                  <span>
                    <HistoryOutlined />
                    Treatment History
                  </span>
                } 
                key="2"
              >
                <Timeline
                  mode="left"
                  items={selectedPatient.regimenHistory.map((history, index) => ({
                    color: history.endDate ? 'blue' : 'green',
                    label: history.startDate,
                    children: (
                      <div>
                        <div><strong>{history.regimen}</strong></div>
                        <div>{history.startDate} to {history.endDate || 'Present'}</div>
                        <div>{history.reason}</div>
                      </div>
                    )
                  }))}
                />
              </TabPane>
              
              <TabPane 
                tab={
                  <span>
                    <FileTextOutlined />
                    Refill History
                  </span>
                } 
                key="3"
              >
                <Table
                  dataSource={selectedPatient.refillHistory}
                  columns={[
                    {
                      title: 'Date',
                      dataIndex: 'date',
                      key: 'date',
                      render: (text) => dayjs(text).format('MMM DD, YYYY')
                    },
                    {
                      title: 'Medication',
                      dataIndex: 'medication',
                      key: 'medication',
                    },
                    {
                      title: 'Quantity',
                      dataIndex: 'quantity',
                      key: 'quantity',
                    },
                    {
                      title: 'Dispensed By',
                      dataIndex: 'dispensedBy',
                      key: 'dispensedBy',
                    }
                  ]}
                  pagination={false}
                  size="small"
                />
              </TabPane>
            </Tabs>
          </>
        )}
      </Drawer>
      
      {/* Add/Edit Regimen Modal */}
      <Modal
        title={modalMode === 'add' ? 'Assign New Treatment Regimen' : 'Update Treatment Regimen'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalSubmit}
        >
          {modalMode === 'add' && (
            <Form.Item
              name="patientId"
              label="Select Patient"
              rules={[{ required: true, message: 'Please select a patient' }]}
            >
              <Select
                placeholder="Select patient"
                showSearch
                optionFilterProp="children"
              >
                {patients.map(patient => (
                  <Option key={patient.id} value={patient.id}>{patient.name}</Option>
                ))}
              </Select>
            </Form.Item>
          )}
          
          {modalMode === 'edit' && (
            <Form.Item
              name="patientName"
              label="Patient"
            >
              <Input disabled />
            </Form.Item>
          )}
          
          <Form.Item
            name="regimen"
            label="ART Regimen"
            rules={[{ required: true, message: 'Please select a regimen' }]}
          >
            <Select
              placeholder="Select regimen"
              showSearch
              optionFilterProp="children"
              options={regimenOptions}
            />
          </Form.Item>
          
          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: 'Please select a start date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="doctor"
            label="Prescribing Doctor"
            rules={[{ required: true, message: 'Please select a doctor' }]}
          >
            <Select
              placeholder="Select doctor"
              showSearch
              optionFilterProp="children"
              options={doctorOptions}
            />
          </Form.Item>
          
          <Form.Item
            name="adherenceRate"
            label="Adherence Rate (%)"
            rules={[{ required: true, message: 'Please enter adherence rate' }]}
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="notes"
            label="Provider Notes"
          >
            <TextArea rows={4} placeholder="Enter clinical notes about this regimen" />
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {modalMode === 'add' ? 'Assign Regimen' : 'Update Regimen'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TreatmentTracking;
