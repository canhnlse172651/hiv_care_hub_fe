import React, { useState } from 'react';
import { 
  Form, Input, Button, Card, Tabs, Typography, Divider, 
  Select, DatePicker, Space, Tag, Collapse, Table, 
  Timeline, Checkbox, Radio, Modal, Row, Col, Steps, message, Spin
} from 'antd';
import {
  UserOutlined, MedicineBoxOutlined, FileTextOutlined,
  LeftOutlined, SaveOutlined, CheckCircleOutlined,
  WarningOutlined, InfoCircleOutlined, PlusOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { useParams, Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { appointmentService } from '@/services/appointmentService';
import { useEffect } from 'react';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;
const { Step } = Steps;

const ConsultationPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('1');
  const [hivRegimen, setHivRegimen] = useState('standard');
  const [customRegimenModalVisible, setCustomRegimenModalVisible] = useState(false);
  const [confirmFinishModalVisible, setConfirmFinishModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);
  const [patient, setPatient] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);

  useEffect(() => {
    const fetchAppointment = async () => {
      setLoading(true);
      try {
        const res = await appointmentService.getAppointmentById(appointmentId);
        const data = res?.data || res;
        setAppointment(data);
        setPatient({
          id: data.user?.id || '',
          name: data.user?.name || '',
          age: data.user?.age || '',
          gender: data.user?.gender || '',
          dob: data.user?.dob || '',
          idNumber: data.user?.idNumber || '',
          phone: data.user?.phone || data.user?.phoneNumber || '',
          email: data.user?.email || '',
          address: data.user?.address || '',
          appointmentId: data.id,
          appointmentTime: dayjs(data.appointmentTime).format('HH:mm'),
          checkInTime: data.checkInTime ? dayjs(data.checkInTime).format('HH:mm') : '',
          reason: data.reason || data.service?.description || '',
          isHivPositive: data.user?.isHivPositive || false,
          startedTreatment: data.user?.startedTreatment || '',
          currentRegimen: data.user?.currentRegimen || '',
          allergies: data.user?.allergies || '',
          chronicConditions: data.user?.chronicConditions || '',
        });
        setMedicalHistory(data.user?.medicalHistory || []);
      } catch (error) {
        message.error('Không thể tải thông tin lịch hẹn. Dùng dữ liệu mẫu.');
        // fallback to mock data if needed
        setPatient({
          id: 'PT-10001',
          name: 'Nguyễn Văn A',
          age: 35,
          gender: 'Nam',
          dob: '1989-05-12',
          idNumber: '0123456789',
          phone: '0912345678',
          email: 'nguyenvana@email.com',
          address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
          appointmentId: 'AP-2024060001',
          appointmentTime: '09:00',
          checkInTime: '08:45',
          reason: 'Khám định kỳ HIV',
          isHivPositive: true,
          startedTreatment: '2022-03-10',
          currentRegimen: 'TDF + 3TC + DTG',
          allergies: 'Không',
          chronicConditions: 'Tăng huyết áp',
        });
        setMedicalHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [appointmentId]);
  
  // Mock data for a patient
  // const patient = {
  //   id: 'PT-10001',
  //   name: 'Nguyễn Văn A',
  //   age: 35,
  //   gender: 'Nam',
  //   dob: '1989-05-12',
  //   idNumber: '0123456789',
  //   phone: '0912345678',
  //   email: 'nguyenvana@email.com',
  //   address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
  //   appointmentId: 'AP-2024060001',
  //   appointmentTime: '09:00',
  //   checkInTime: '08:45',
  //   reason: 'Khám định kỳ HIV',
  //   isHivPositive: true,
  //   startedTreatment: '2022-03-10',
  //   currentRegimen: 'TDF + 3TC + DTG',
  //   allergies: 'Không',
  //   chronicConditions: 'Tăng huyết áp',
  // };
  
  // Mock data for patient's medical history
  // const medicalHistory = [
  //   {
  //     date: '2024-03-15',
  //     doctor: 'BS. Trần Văn B',
  //     diagnosis: 'Nhiễm HIV ổn định, tuân thủ điều trị tốt',
  //     symptoms: 'Không có triệu chứng bất thường',
  //     prescription: 'TDF + 3TC + DTG, uống 1 lần/ngày',
  //     notes: 'Xét nghiệm CD4: 650 cells/mm³, Tải lượng virus: Không phát hiện',
  //   },
  //   {
  //     date: '2023-12-20',
  //     doctor: 'BS. Trần Văn B',
  //     diagnosis: 'Nhiễm HIV ổn định, tuân thủ điều trị tốt',
  //     symptoms: 'Đau đầu nhẹ, mệt mỏi',
  //     prescription: 'TDF + 3TC + DTG, uống 1 lần/ngày',
  //     notes: 'Xét nghiệm CD4: 620 cells/mm³, Tải lượng virus: Không phát hiện',
  //   },
  //   {
  //     date: '2023-09-18',
  //     doctor: 'BS. Lê Thị C',
  //     diagnosis: 'Nhiễm HIV ổn định, nhiễm trùng đường hô hấp trên',
  //     symptoms: 'Ho, đau họng, sổ mũi',
  //     prescription: 'TDF + 3TC + DTG, uống 1 lần/ngày; Amoxicillin 500mg, uống 3 lần/ngày trong 5 ngày',
  //     notes: 'Cần uống nhiều nước và nghỉ ngơi',
  //   },
  // ];
  
  // Mock HIV regimen data
  const standardRegimens = [
    { value: 'TDF + 3TC + DTG', label: 'TDF + 3TC + DTG (Phác đồ bậc 1 ưa thích)' },
    { value: 'ABC + 3TC + DTG', label: 'ABC + 3TC + DTG (Thay thế khi có chống chỉ định với TDF)' },
    { value: 'TDF + 3TC + EFV', label: 'TDF + 3TC + EFV (Phác đồ thay thế)' },
    { value: 'AZT + 3TC + NVP', label: 'AZT + 3TC + NVP (Phác đồ thay thế)' },
    { value: 'TDF + FTC + RPV', label: 'TDF + FTC + RPV (Phác đồ thay thế khi có chống chỉ định với DTG và EFV)' },
  ];
  
  // Mock lab test options
  const labTestOptions = [
    { value: 'CD4', label: 'Xét nghiệm CD4' },
    { value: 'viral_load', label: 'Xét nghiệm tải lượng virus HIV' },
    { value: 'liver_function', label: 'Xét nghiệm chức năng gan (ALT, AST)' },
    { value: 'kidney_function', label: 'Xét nghiệm chức năng thận (Creatinine, eGFR)' },
    { value: 'cbc', label: 'Công thức máu toàn phần' },
    { value: 'lipid', label: 'Bảng mỡ máu (Cholesterol, Triglycerides)' },
    { value: 'glucose', label: 'Đường huyết đói' },
    { value: 'hepatitis', label: 'Xét nghiệm viêm gan B, C' },
    { value: 'syphilis', label: 'Xét nghiệm giang mai (RPR/VDRL)' },
    { value: 'tb_test', label: 'Xét nghiệm lao' },
  ];
  
  // Mock medication data
  const hivMedications = [
    { name: 'Tenofovir (TDF)', category: 'NRTI', doseUnit: 'mg', commonDoses: [300] },
    { name: 'Lamivudine (3TC)', category: 'NRTI', doseUnit: 'mg', commonDoses: [150, 300] },
    { name: 'Dolutegravir (DTG)', category: 'INSTI', doseUnit: 'mg', commonDoses: [50] },
    { name: 'Efavirenz (EFV)', category: 'NNRTI', doseUnit: 'mg', commonDoses: [400, 600] },
    { name: 'Abacavir (ABC)', category: 'NRTI', doseUnit: 'mg', commonDoses: [300, 600] },
    { name: 'Emtricitabine (FTC)', category: 'NRTI', doseUnit: 'mg', commonDoses: [200] },
    { name: 'Zidovudine (AZT)', category: 'NRTI', doseUnit: 'mg', commonDoses: [300] },
    { name: 'Nevirapine (NVP)', category: 'NNRTI', doseUnit: 'mg', commonDoses: [200] },
    { name: 'Rilpivirine (RPV)', category: 'NNRTI', doseUnit: 'mg', commonDoses: [25] },
  ];
  
  // Mock common medications
  const commonMedications = [
    { name: 'Acetaminophen (Paracetamol)', category: 'Giảm đau', doseUnit: 'mg', commonDoses: [500, 1000] },
    { name: 'Ibuprofen', category: 'Giảm đau', doseUnit: 'mg', commonDoses: [200, 400, 600] },
    { name: 'Amoxicillin', category: 'Kháng sinh', doseUnit: 'mg', commonDoses: [250, 500] },
    { name: 'Azithromycin', category: 'Kháng sinh', doseUnit: 'mg', commonDoses: [250, 500] },
    { name: 'Levofloxacin', category: 'Kháng sinh', doseUnit: 'mg', commonDoses: [500, 750] },
    { name: 'Loratadine', category: 'Kháng histamine', doseUnit: 'mg', commonDoses: [10] },
    { name: 'Omeprazole', category: 'Ức chế bơm proton', doseUnit: 'mg', commonDoses: [20, 40] },
    { name: 'Cetirizine', category: 'Kháng histamine', doseUnit: 'mg', commonDoses: [10] },
  ];
  
  // Form submission
  const handleFinish = (values) => {
    console.log('Form values:', values);
    setConfirmFinishModalVisible(true);
  };
  
  // Save custom HIV regimen
  const handleSaveCustomRegimen = (values) => {
    console.log('Custom regimen:', values);
    message.success('Đã lưu phác đồ tùy chỉnh');
    setCustomRegimenModalVisible(false);
  };
  
  // Finish consultation
  const handleFinishConsultation = async () => {
    setLoading(true);
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, { status: 'COMPLETED' });
      message.success('Đã hoàn thành buổi khám');
      setConfirmFinishModalVisible(false);
      navigate('/doctor/dashboard');
    } catch (error) {
      message.error('Không thể cập nhật trạng thái lịch hẹn.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link to="/doctor/dashboard" className="mr-4">
          <Button icon={<LeftOutlined />}>Quay lại</Button>
        </Link>
        <Title level={3} className="mb-0">Khám bệnh - {patient?.name}</Title>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Patient Information Panel */}
        <Card className="lg:col-span-1 shadow-md">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <UserOutlined className="text-xl text-blue-500" />
            </div>
            <div>
              <div className="font-bold text-lg">{patient?.name}</div>
              <div className="text-gray-500 text-sm">{patient?.age} tuổi | {patient?.gender}</div>
            </div>
          </div>

          <Divider className="my-3" />
          
          <div className="mb-3">
            <div className="font-medium mb-1">Thông tin cá nhân</div>
            <div className="text-sm space-y-1">
              <div><strong>Ngày sinh:</strong> {dayjs(patient?.dob).format('DD/MM/YYYY')}</div>
              <div><strong>CMND/CCCD:</strong> {patient?.idNumber}</div>
              <div><strong>SĐT:</strong> {patient?.phone}</div>
              <div><strong>Email:</strong> {patient?.email}</div>
              <div><strong>Địa chỉ:</strong> {patient?.address}</div>
            </div>
          </div>
          
          <Divider className="my-3" />
          
          <div className="mb-3">
            <div className="font-medium mb-1">Thông tin buổi khám</div>
            <div className="text-sm space-y-1">
              <div><strong>Mã lịch hẹn:</strong> {patient?.appointmentId}</div>
              <div><strong>Giờ hẹn:</strong> {patient?.appointmentTime}</div>
              <div><strong>Check-in lúc:</strong> {patient?.checkInTime}</div>
              <div><strong>Lý do khám:</strong> {patient?.reason}</div>
            </div>
          </div>
          
          <Divider className="my-3" />
          
          <div className="mb-3">
            <div className="font-medium mb-1">Thông tin y tế</div>
            <div className="text-sm space-y-1">
              {patient?.isHivPositive && (
                <div className="flex items-center">
                  <Tag color="blue">HIV+</Tag>
                  <span>Bắt đầu điều trị: {dayjs(patient?.startedTreatment).format('DD/MM/YYYY')}</span>
                </div>
              )}
              <div><strong>Phác đồ hiện tại:</strong> {patient?.currentRegimen}</div>
              <div><strong>Dị ứng:</strong> {patient?.allergies}</div>
              <div><strong>Bệnh mãn tính:</strong> {patient?.chronicConditions}</div>
            </div>
          </div>
          
          <Divider className="my-3" />
          
          <div className="mb-1">
            <div className="font-medium mb-1">Tiền sử bệnh</div>
            <Collapse ghost className="bg-gray-50 rounded border">
              {medicalHistory.map((record, index) => (
                <Panel 
                  header={
                    <div className="flex justify-between items-center">
                      <span>{dayjs(record.date).format('DD/MM/YYYY')}</span>
                      <Tag color="blue" className="ml-2">{record.doctor}</Tag>
                    </div>
                  } 
                  key={index}
                >
                  <div className="space-y-2 text-sm">
                    <div><strong>Chẩn đoán:</strong> {record.diagnosis}</div>
                    <div><strong>Triệu chứng:</strong> {record.symptoms}</div>
                    <div><strong>Thuốc:</strong> {record.prescription}</div>
                    <div><strong>Ghi chú:</strong> {record.notes}</div>
                  </div>
                </Panel>
              ))}
            </Collapse>
          </div>
        </Card>
        
        {/* Consultation Form */}
        <Card className="lg:col-span-3 shadow-md">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{
              consultationDate: dayjs(),
              prescription: [{
                medication: '',
                dose: '',
                frequency: '',
                duration: '',
                instructions: '',
              }],
            }}
          >
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="Khám lâm sàng" key="1">
                <Form.Item 
                  name="symptoms" 
                  label="Triệu chứng"
                  rules={[{ required: true, message: 'Vui lòng nhập triệu chứng/lý do khám' }]}
                >
                  <TextArea 
                    rows={3} 
                    placeholder="Nhập triệu chứng và lý do khám của bệnh nhân" 
                  />
                </Form.Item>
                
                <Form.Item 
                  name="examination" 
                  label="Khám lâm sàng"
                >
                  <TextArea 
                    rows={3} 
                    placeholder="Nhập kết quả khám lâm sàng" 
                  />
                </Form.Item>
                
                <Form.Item 
                  name="diagnosis" 
                  label="Chẩn đoán"
                  rules={[{ required: true, message: 'Vui lòng nhập chẩn đoán' }]}
                >
                  <TextArea 
                    rows={2} 
                    placeholder="Nhập chẩn đoán" 
                  />
                </Form.Item>
                
                <div className="mb-4">
                  <Form.Item 
                    name="labTests" 
                    label="Chỉ định cận lâm sàng (nếu có)"
                  >
                    <Select
                      mode="multiple"
                      placeholder="Chọn các xét nghiệm"
                      style={{ width: '100%' }}
                      options={labTestOptions}
                    />
                  </Form.Item>
                  
                  <Form.Item 
                    name="labNotes" 
                    label="Ghi chú cận lâm sàng"
                  >
                    <Input placeholder="Ghi chú về các xét nghiệm" />
                  </Form.Item>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="primary" 
                    onClick={() => setActiveTab('2')}
                  >
                    Tiếp theo: Phác đồ điều trị
                  </Button>
                </div>
              </TabPane>
              
              <TabPane tab="Phác đồ điều trị" key="2">
                {patient?.isHivPositive && (
                  <div className="mb-6 border rounded-md p-4 bg-blue-50">
                    <Title level={5} className="mb-3">Phác đồ điều trị HIV</Title>
                    
                    <Form.Item name="hivrRegimenType">
                      <Radio.Group 
                        value={hivRegimen} 
                        onChange={e => setHivRegimen(e.target.value)}
                        className="mb-4"
                      >
                        <Radio value="standard">Phác đồ chuẩn</Radio>
                        <Radio value="custom">Tạo phác đồ tùy chỉnh</Radio>
                      </Radio.Group>
                    </Form.Item>
                    
                    {hivRegimen === 'standard' ? (
                      <Form.Item 
                        name="hivRegimen" 
                        rules={[{ required: patient?.isHivPositive, message: 'Vui lòng chọn phác đồ HIV' }]}
                      >
                        <Select
                          placeholder="Chọn phác đồ điều trị HIV"
                          style={{ width: '100%' }}
                          options={standardRegimens}
                        />
                      </Form.Item>
                    ) : (
                      <div className="mb-4">
                        <Button 
                          type="dashed" 
                          icon={<PlusOutlined />} 
                          onClick={() => setCustomRegimenModalVisible(true)}
                          className="w-full"
                        >
                          Tạo phác đồ tùy chỉnh
                        </Button>
                      </div>
                    )}
                    
                    <Form.Item name="regimenStartDate" label="Ngày bắt đầu phác đồ">
                      <DatePicker 
                        style={{ width: '100%' }} 
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày bắt đầu áp dụng phác đồ"
                      />
                    </Form.Item>
                    
                    <Form.Item name="regimenNotes" label="Ghi chú phác đồ">
                      <TextArea 
                        rows={2}
                        placeholder="Ghi chú về phác đồ điều trị HIV"  
                      />
                    </Form.Item>
                  </div>
                )}
                
                <div className="mb-6">
                  <Title level={5} className="mb-3">Đơn thuốc</Title>
                  
                  <Form.List name="prescription">
                    {(fields, { add, remove }) => (
                      <div className="space-y-4">
                        {fields.map(({ key, name, ...restField }) => (
                          <div key={key} className="border rounded-md p-3 bg-gray-50 relative">
                            <Button
                              type="text"
                              className="absolute top-2 right-2"
                              icon={<CloseOutlined />}
                              onClick={() => remove(name)}
                            />
                            
                            <Row gutter={[16, 16]}>
                              <Col span={24} md={12}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'medication']}
                                  label="Thuốc"
                                  rules={[{ required: true, message: 'Vui lòng chọn thuốc' }]}
                                >
                                  <Select
                                    showSearch
                                    placeholder="Chọn thuốc"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    className="w-full"
                                  >
                                    <Select.OptGroup label="Thuốc thông thường">
                                      {commonMedications.map((med, i) => (
                                        <Option key={`common-${i}`} value={med.name}>{med.name}</Option>
                                      ))}
                                    </Select.OptGroup>
                                    <Select.OptGroup label="Thuốc ARV">
                                      {hivMedications.map((med, i) => (
                                        <Option key={`hiv-${i}`} value={med.name}>{med.name}</Option>
                                      ))}
                                    </Select.OptGroup>
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col span={12} md={6}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'dose']}
                                  label="Liều lượng"
                                  rules={[{ required: true, message: 'Nhập liều lượng' }]}
                                >
                                  <Input placeholder="VD: 500mg" />
                                </Form.Item>
                              </Col>
                              <Col span={12} md={6}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'frequency']}
                                  label="Tần suất"
                                  rules={[{ required: true, message: 'Nhập tần suất' }]}
                                >
                                  <Select placeholder="Chọn tần suất">
                                    <Option value="1/ngày">1 lần/ngày</Option>
                                    <Option value="2/ngày">2 lần/ngày</Option>
                                    <Option value="3/ngày">3 lần/ngày</Option>
                                    <Option value="4/ngày">4 lần/ngày</Option>
                                    <Option value="khác">Khác</Option>
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col span={12} md={6}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'duration']}
                                  label="Thời gian dùng"
                                  rules={[{ required: true, message: 'Nhập thời gian dùng' }]}
                                >
                                  <Input placeholder="VD: 5 ngày" />
                                </Form.Item>
                              </Col>
                              <Col span={12} md={18}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'instructions']}
                                  label="Hướng dẫn sử dụng"
                                >
                                  <Input placeholder="VD: Uống sau khi ăn" />
                                </Form.Item>
                              </Col>
                            </Row>
                          </div>
                        ))}
                        
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          icon={<PlusOutlined />}
                          className="w-full"
                        >
                          Thêm thuốc
                        </Button>
                      </div>
                    )}
                  </Form.List>
                </div>
                
                <div className="flex justify-between">
                  <Button onClick={() => setActiveTab('1')}>
                    Quay lại: Khám lâm sàng
                  </Button>
                  <Button 
                    type="primary" 
                    onClick={() => setActiveTab('3')}
                  >
                    Tiếp theo: Ghi chú và kế hoạch
                  </Button>
                </div>
              </TabPane>
              
              <TabPane tab="Ghi chú & kế hoạch" key="3">
                <Form.Item 
                  name="doctorNotes" 
                  label="Ghi chú của bác sĩ"
                >
                  <TextArea 
                    rows={4} 
                    placeholder="Nhập ghi chú và lời khuyên dành cho bệnh nhân" 
                  />
                </Form.Item>
                
                <Form.Item 
                  name="treatmentPlan" 
                  label="Kế hoạch điều trị"
                  rules={[{ required: true, message: 'Vui lòng nhập kế hoạch điều trị' }]}
                >
                  <TextArea 
                    rows={4} 
                    placeholder="Nhập kế hoạch điều trị tiếp theo" 
                  />
                </Form.Item>
                
                <div className="mb-6">
                  <Title level={5} className="mb-3">Hẹn tái khám</Title>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="followupDate"
                        label="Ngày tái khám"
                      >
                        <DatePicker 
                          style={{ width: '100%' }}
                          format="DD/MM/YYYY"
                          placeholder="Chọn ngày tái khám" 
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="followupNotes"
                        label="Ghi chú tái khám"
                      >
                        <Input placeholder="Ghi chú về buổi tái khám" />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
                
                <Form.Item 
                  name="consultationDate" 
                  label="Ngày khám"
                  rules={[{ required: true, message: 'Vui lòng nhập ngày khám' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }} 
                    format="DD/MM/YYYY"
                    disabled
                  />
                </Form.Item>
                
                <div className="flex justify-between">
                  <Button onClick={() => setActiveTab('2')}>
                    Quay lại: Phác đồ điều trị
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    icon={<CheckCircleOutlined />}
                  >
                    Hoàn thành buổi khám
                  </Button>
                </div>
              </TabPane>
            </Tabs>
          </Form>
        </Card>
      </div>
      
      {/* Custom HIV Regimen Modal */}
      <Modal
        title="Tạo phác đồ HIV tùy chỉnh"
        open={customRegimenModalVisible}
        onCancel={() => setCustomRegimenModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          layout="vertical"
          onFinish={handleSaveCustomRegimen}
        >
          <Form.Item
            name="regimenName"
            label="Tên phác đồ tùy chỉnh"
            rules={[{ required: true, message: 'Vui lòng nhập tên phác đồ' }]}
          >
            <Input placeholder="VD: Phác đồ tùy chỉnh cho bệnh nhân Nguyễn Văn A" />
          </Form.Item>
          
          <Form.List name="medications">
            {(fields, { add, remove }) => (
              <div className="space-y-4">
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="border rounded-md p-3 bg-gray-50 relative">
                    <Button
                      type="text"
                      className="absolute top-2 right-2"
                      icon={<CloseOutlined />}
                      onClick={() => remove(name)}
                    />
                    
                    <Row gutter={[16, 16]}>
                      <Col span={24} md={12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'medication']}
                          label="Thuốc"
                          rules={[{ required: true, message: 'Vui lòng chọn thuốc' }]}
                        >
                          <Select
                            showSearch
                            placeholder="Chọn thuốc ARV"
                            optionFilterProp="children"
                          >
                            {hivMedications.map((med, i) => (
                              <Option key={i} value={med.name}>
                                {med.name} ({med.category})
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12} md={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'dose']}
                          label="Liều lượng"
                          rules={[{ required: true, message: 'Nhập liều lượng' }]}
                        >
                          <Input placeholder="VD: 300mg" />
                        </Form.Item>
                      </Col>
                      <Col span={12} md={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'frequency']}
                          label="Tần suất"
                          rules={[{ required: true, message: 'Nhập tần suất' }]}
                        >
                          <Select placeholder="Chọn tần suất">
                            <Option value="1/ngày">1 lần/ngày</Option>
                            <Option value="2/ngày">2 lần/ngày</Option>
                            <Option value="1/tuần">1 lần/tuần</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          {...restField}
                          name={[name, 'notes']}
                          label="Ghi chú"
                        >
                          <Input placeholder="Ghi chú thêm về thuốc này" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                ))}
                
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  className="w-full"
                >
                  Thêm thuốc ARV
                </Button>
              </div>
            )}
          </Form.List>
          
          <Form.Item
            name="customRegimenNotes"
            label="Ghi chú phác đồ tùy chỉnh"
            className="mt-4"
          >
            <TextArea 
              rows={3}
              placeholder="Nhập các ghi chú, lưu ý đặc biệt về phác đồ này"  
            />
          </Form.Item>
          
          <div className="flex justify-end mt-4">
            <Button className="mr-2" onClick={() => setCustomRegimenModalVisible(false)}>
              Hủy bỏ
            </Button>
            <Button type="primary" htmlType="submit">
              Lưu phác đồ
            </Button>
          </div>
        </Form>
      </Modal>
      
      {/* Confirm Finish Modal */}
      <Modal
        title="Xác nhận hoàn thành buổi khám"
        open={confirmFinishModalVisible}
        onCancel={() => setConfirmFinishModalVisible(false)}
        onOk={handleFinishConsultation}
        okText="Xác nhận"
        cancelText="Quay lại"
      >
        <div className="py-2">
          <Steps direction="vertical" size="small" current={2}>
            <Step 
              title="Khám lâm sàng" 
              description="Đã nhập triệu chứng và chẩn đoán" 
              icon={<CheckCircleOutlined className="text-green-500" />} 
            />
            <Step 
              title="Phác đồ điều trị" 
              description="Đã thiết lập phác đồ và đơn thuốc" 
              icon={<CheckCircleOutlined className="text-green-500" />} 
            />
            <Step 
              title="Ghi chú và kế hoạch" 
              description="Đã nhập kế hoạch điều trị và hẹn tái khám" 
              icon={<CheckCircleOutlined className="text-green-500" />} 
            />
          </Steps>
          
          <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-100">
            <div className="flex items-start">
              <InfoCircleOutlined className="text-blue-500 mr-2 mt-1" />
              <div>
                <p className="m-0">Bạn sẽ hoàn thành buổi khám cho bệnh nhân <strong>{patient?.name}</strong>.</p>
                <p className="m-0 mt-1">Sau khi xác nhận, thông tin buổi khám sẽ được lưu vào hồ sơ bệnh án của bệnh nhân.</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ConsultationPage;
