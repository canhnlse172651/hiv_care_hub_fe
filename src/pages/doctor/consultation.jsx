import React, { useState, useEffect } from 'react';
import { 
  Form, Input, Button, Card, Typography, Divider, 
  Select, DatePicker, Space, Tag, message, Spin,
  Alert, Row, Col, Modal, List, Tooltip
} from 'antd';
import {
  UserOutlined, MedicineBoxOutlined, FileTextOutlined,
  LeftOutlined, CheckOutlined, PlusOutlined, DeleteOutlined,
  InfoCircleOutlined, DollarOutlined, CalendarOutlined,
  ArrowLeftOutlined, EditOutlined
} from '@ant-design/icons';
import { useParams, Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { appointmentService } from '@/services/appointmentService';
import { patientTreatmentService } from '@/services/patientTreatmentService';
import { treatmentProtocolService } from '@/services/treatmentProtocolService';
import { medicineService } from '@/services/medicineService';
import { useSelector } from 'react-redux';

const { Title, Text } = Typography;
const { Option } = Select;

const ConsultationPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [patient, setPatient] = useState(null);
  const [protocols, setProtocols] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [customMedications, setCustomMedications] = useState([]);
  const [costPreview, setCostPreview] = useState(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const currentUser = useSelector(state => state.auth.user);

  // Fetch API data
  const fetchApiData = async () => {
    setLoadingData(true);
    try {
      // Fetch treatment protocols
      const protocolsRes = await treatmentProtocolService.getAllTreatmentProtocols();
      // Handle different response structures
      let protocolsData = [];
      if (protocolsRes?.data && Array.isArray(protocolsRes.data)) {
        protocolsData = protocolsRes.data;
      } else if (Array.isArray(protocolsRes)) {
        protocolsData = protocolsRes;
      } else if (protocolsRes?.data && Array.isArray(protocolsRes.data.data)) {
        protocolsData = protocolsRes.data.data; // Handle nested data structure
      }
      
      console.log('Protocols data:', protocolsData);
      
      // Check if protocolsData is an array
      if (Array.isArray(protocolsData)) {
        const mappedProtocols = protocolsData.map(protocol => {
          console.log('Protocol:', protocol); // Debug individual protocol
          console.log('Protocol medicines:', protocol.medicines); // Debug medicines
          
          // Extract medicines from the protocol
          let medications = [];
          if (protocol.medicines && Array.isArray(protocol.medicines)) {
            medications = protocol.medicines.map(protocolMed => ({
              name: protocolMed.medicine.name,
              description: protocolMed.medicine.description,
              dose: protocolMed.medicine.dose,
              unit: protocolMed.medicine.unit,
              price: protocolMed.medicine.price,
              dosage: protocolMed.dosage,
              durationValue: protocolMed.durationValue,
              durationUnit: protocolMed.durationUnit,
              schedule: protocolMed.schedule,
              notes: protocolMed.notes
            }));
          }
          
          console.log('Extracted medications:', medications);
          
          return {
            label: protocol.name,
            value: protocol.id,
            description: protocol.description,
            category: protocol.targetDisease,
            medications: medications
          };
        });
        console.log('Mapped protocols:', mappedProtocols); // Debug final result
        setProtocols(mappedProtocols);
      } else {
        console.warn('Protocols data is not an array:', protocolsData);
        // Set empty array if data is not in expected format
        setProtocols([]);
      }

      // Fetch all medicines
      const medicinesRes = await medicineService.getAllMedicines();
      // Handle different response structures
      let medicinesData = [];
      if (medicinesRes?.data && Array.isArray(medicinesRes.data)) {
        medicinesData = medicinesRes.data;
      } else if (Array.isArray(medicinesRes)) {
        medicinesData = medicinesRes;
      } else if (medicinesRes?.data && Array.isArray(medicinesRes.data.data)) {
        medicinesData = medicinesRes.data.data; // Handle nested data structure
      }
      
      console.log('Medicines data:', medicinesData);
      
      // Check if medicinesData is an array
      if (Array.isArray(medicinesData)) {
        setMedicines(medicinesData.map(med => ({
          label: med.name,
          value: med.id,
          name: med.name,
          category: med.category,
          price: med.price
        })));
      } else {
        console.warn('Medicines data is not an array:', medicinesData);
        // Set empty array if data is not in expected format
        setMedicines([]);
      }

    } catch (error) {
      console.error('Error fetching API data:', error);
      message.error('Không thể tải dữ liệu từ server. Sử dụng dữ liệu mẫu.');
      
      // Fallback to mock data
      setProtocols([
        { 
          label: 'TDF + 3TC + DTG', 
          value: 1, 
          description: 'Phác đồ chuẩn cho người mới bắt đầu',
          medications: [
            { name: 'Tenofovir (TDF)', dosage: '300mg daily' },
            { name: 'Lamivudine (3TC)', dosage: '300mg daily' },
            { name: 'Dolutegravir (DTG)', dosage: '50mg daily' }
          ]
        },
        { 
          label: 'TDF + 3TC + EFV', 
          value: 2, 
          description: 'Phác đồ thay thế',
          medications: [
            { name: 'Tenofovir (TDF)', dosage: '300mg daily' },
            { name: 'Lamivudine (3TC)', dosage: '300mg daily' },
            { name: 'Efavirenz (EFV)', dosage: '600mg daily' }
          ]
        }
      ]);
      
      setMedicines([
        { label: 'Vitamin D', value: 1, name: 'Vitamin D', category: 'VITAMIN', price: 5000 },
        { label: 'Paracetamol', value: 2, name: 'Paracetamol', category: 'PAINKILLER', price: 8000 },
        { label: 'Amoxicillin', value: 3, name: 'Amoxicillin', category: 'ANTIBIOTIC', price: 15000 },
        { label: 'Omeprazole', value: 4, name: 'Omeprazole', category: 'GASTRO', price: 12000 }
      ]);
    } finally {
      setLoadingData(false);
    }
  };

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
      } catch (error) {
        message.error('Không thể tải thông tin lịch hẹn. Dùng dữ liệu mẫu.');
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
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointment();
    fetchApiData();
  }, [appointmentId]);

  // Handle protocol selection
  const handleProtocolChange = (protocolId) => {
    const protocol = protocols.find(p => p.value === protocolId);
    setSelectedProtocol(protocol);
    setCustomMedications([]); // Reset custom medications
   
  };

  // Add custom medication
  const addCustomMedication = () => {
    setCustomMedications([...customMedications, { 
      name: '', 
      dosage: '',
      durationValue: 30,
      durationUnit: 'DAY',
      schedule: 'DAILY',
      notes: '',
      unit: ''
    }]);
  };

  // Remove custom medication
  const removeCustomMedication = (index) => {
    const newMedications = customMedications.filter((_, i) => i !== index);
    setCustomMedications(newMedications);
    calculateCost(selectedProtocol?.value, newMedications);
  };

  // Update custom medication
  const updateCustomMedication = (index, field, value) => {
    const newMedications = [...customMedications];
    newMedications[index][field] = value;
    setCustomMedications(newMedications);
    calculateCost(selectedProtocol?.value, newMedications);
  };

  

  // Form submission
  const handleFinish = async (values) => {
    if (!selectedProtocol) {
      message.error('Vui lòng chọn phác đồ điều trị');
      return;
    }

    setConfirmModalVisible(true);
  };

  // Create treatment
  const handleCreateTreatment = async () => {
    setLoading(true);
    try {
      const formValues = form.getFieldsValue();
      
      // Combine protocol medications and custom medications
      const allMedications = [
        ...(selectedProtocol.medications || []),
        ...customMedications
      ];
      
      const treatmentData = {
        patientId: parseInt(patient.id),
        protocolId: selectedProtocol.value,
        doctorId: currentUser?.id ? parseInt(currentUser.id) : 1, // Ensure it's a number
        customMedications: allMedications.map(med => ({
          medicineName: med.name, // Changed from 'name' to 'medicineName'
          dosage: med.dosage || med.dose,
          frequency: med.schedule || 'DAILY', // Added frequency field
          durationValue: med.durationValue || 30,
          durationUnit: med.durationUnit || 'DAY',
          notes: med.notes || '',
          description: med.description || '',
          unit: med.unit || medicines.find(m => m.name === med.name)?.unit || 'tablet', // Ensure unit is included
          price: med.price ? parseFloat(med.price) : 0 // Convert to number
        })),
        notes: formValues.notes || '',
        startDate: formValues.startDate?.toISOString() || new Date().toISOString(),
        endDate: formValues.endDate?.toISOString() || null,
        total: costPreview?.calculatedTotal || 0
      };

      console.log('Treatment data being sent:', treatmentData); // Debug log

      await patientTreatmentService.createPatientTreatment(treatmentData, currentUser?.id);
      
      // Update appointment status
      await appointmentService.updateAppointmentStatus(appointmentId, { status: 'COMPLETED' });

      message.success('Đã tạo phác đồ điều trị thành công');
      setConfirmModalVisible(false);
      navigate('/doctor/dashboard');
    } catch (error) {
      message.error('Không thể tạo phác đồ điều trị.');
      console.error('Error creating treatment:', error);
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
          <Button icon={<ArrowLeftOutlined />}>Quay lại</Button>
        </Link>
        <Title level={3} className="mb-0">Tạo phác đồ điều trị - {patient?.name}</Title>
      </div>

      {/* Cost Preview */}
      {costPreview && (
        <Alert
          message="Dự tính chi phí điều trị"
          description={
            <div>
              <p><strong>Tổng chi phí:</strong> {costPreview.calculatedTotal?.toLocaleString()} VNĐ</p>
              <p><strong>Chi phí phác đồ:</strong> {costPreview.breakdown?.protocolCost?.toLocaleString()} VNĐ</p>
              <p><strong>Chi phí thuốc tùy chỉnh:</strong> {costPreview.breakdown?.customMedicationCost?.toLocaleString()} VNĐ</p>
            </div>
          }
          type="info"
          showIcon
          className="mb-4"
        />
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Information */}
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
        </Card>
        
        {/* Treatment Form */}
        <Card className="lg:col-span-2 shadow-md">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{
              startDate: dayjs(),
              notes: ''
            }}
          >
            {/* Protocol Selection */}
            <div className="mb-6">
              <Title level={4}>Chọn phác đồ điều trị</Title>
              <Form.Item 
                name="protocolId" 
                rules={[{ required: true, message: 'Vui lòng chọn phác đồ điều trị' }]}
              >
                <Select
                  placeholder="Chọn phác đồ điều trị"
                  style={{ width: '100%' }}
                  options={protocols}
                  loading={loadingData}
                  showSearch
                  filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={handleProtocolChange}
                />
              </Form.Item>
            </div>

            {/* Custom Medications */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <Title level={4}>Thuốc trong phác đồ (có thể chỉnh sửa)</Title>
                <Button 
                  type="dashed" 
                  icon={<PlusOutlined />} 
                  onClick={addCustomMedication}
                >
                  Thêm thuốc mới
                </Button>
              </div>
              
              {/* Show existing protocol medications */}
              {selectedProtocol && selectedProtocol.medications && selectedProtocol.medications.length > 0 && (
                <div className="mb-4">
                  <Text strong className="text-blue-600">Thuốc có sẵn trong phác đồ:</Text>
                  {selectedProtocol.medications.map((med, index) => (
                    <div key={`protocol-${index}`} className="border rounded p-3 mb-3 bg-green-50">
                      <div className="flex items-center justify-between mb-2">
                        <Text strong>{med.name}</Text>
                        <Button 
                          type="text" 
                          danger 
                          icon={<DeleteOutlined />}
                          onClick={() => {
                            // Remove from protocol medications
                            const updatedMedications = selectedProtocol.medications.filter((_, i) => i !== index);
                            setSelectedProtocol({
                              ...selectedProtocol,
                              medications: updatedMedications
                            });
                          }}
                        />
                      </div>
                      
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item label="Liều lượng">
                            <Input
                              placeholder="VD: 1 tablet"
                              defaultValue={med.dosage}
                              onChange={(e) => {
                                const updatedMedications = [...selectedProtocol.medications];
                                updatedMedications[index].dosage = e.target.value;
                                setSelectedProtocol({
                                  ...selectedProtocol,
                                  medications: updatedMedications
                                });
                              }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item label="Thời gian">
                            <Input
                              placeholder="VD: 30"
                              defaultValue={med.durationValue}
                              onChange={(e) => {
                                const updatedMedications = [...selectedProtocol.medications];
                                updatedMedications[index].durationValue = parseInt(e.target.value) || 0;
                                setSelectedProtocol({
                                  ...selectedProtocol,
                                  medications: updatedMedications
                                });
                              }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item label="Đơn vị thời gian">
                            <Select
                              defaultValue={med.durationUnit}
                              onChange={(value) => {
                                const updatedMedications = [...selectedProtocol.medications];
                                updatedMedications[index].durationUnit = value;
                                setSelectedProtocol({
                                  ...selectedProtocol,
                                  medications: updatedMedications
                                });
                              }}
                            >
                              <Option value="DAY">Ngày</Option>
                              <Option value="WEEK">Tuần</Option>
                              <Option value="MONTH">Tháng</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                      
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item label="Lịch uống">
                            <Select
                              defaultValue={med.schedule}
                              onChange={(value) => {
                                const updatedMedications = [...selectedProtocol.medications];
                                updatedMedications[index].schedule = value;
                                setSelectedProtocol({
                                  ...selectedProtocol,
                                  medications: updatedMedications
                                });
                              }}
                            >
                              <Option value="MORNING">Buổi sáng</Option>
                              <Option value="AFTERNOON">Buổi chiều</Option>
                              <Option value="EVENING">Buổi tối</Option>
                              <Option value="DAILY">Hàng ngày</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="Ghi chú">
                            <Input
                              placeholder="VD: Uống sau ăn"
                              defaultValue={med.notes}
                              onChange={(e) => {
                                const updatedMedications = [...selectedProtocol.medications];
                                updatedMedications[index].notes = e.target.value;
                                setSelectedProtocol({
                                  ...selectedProtocol,
                                  medications: updatedMedications
                                });
                              }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      
                      <div className="mt-2 p-2 bg-blue-50 rounded">
                        <div className="text-sm text-gray-600">
                          <div><strong>Mô tả:</strong> {med.description}</div>
                          <div><strong>Liều lượng chuẩn:</strong> {med.dose} {med.unit}</div>
                          <div><strong>Giá:</strong> {med.price ? `${med.price} VNĐ` : 'Chưa có giá'}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Show custom medications */}
              {customMedications.length > 0 && (
                <div className="mb-4">
                  <Text strong className="text-orange-600">Thuốc tùy chỉnh thêm:</Text>
                  {customMedications.map((med, index) => (
                    <div key={index} className="border rounded p-3 mb-3 bg-orange-50">
                      <div className="flex items-center justify-between mb-2">
                        <Text strong>Thuốc {index + 1}</Text>
                        <Button 
                          type="text" 
                          danger 
                          icon={<DeleteOutlined />}
                          onClick={() => removeCustomMedication(index)}
                        />
                      </div>
                      
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item label="Tên thuốc">
                            <Select
                              placeholder="Chọn thuốc"
                              value={med.name}
                              onChange={(value) => {
                                updateCustomMedication(index, 'name', value);
                                // Auto-fill unit from selected medicine
                                const selectedMedicine = medicines.find(m => m.name === value);
                                if (selectedMedicine) {
                                  updateCustomMedication(index, 'unit', selectedMedicine.unit);
                                }
                              }}
                              showSearch
                              filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {medicines.map((medicine) => (
                                <Option key={medicine.value} value={medicine.name}>
                                  <div>
                                    <div><strong>{medicine.name}</strong></div>
                                    <div className="text-xs text-gray-500">
                                      {medicine.description} - {medicine.dose} {medicine.unit}
                                    </div>
                                  </div>
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label="Liều lượng">
                            <Input
                              placeholder="VD: 2"
                              value={med.dosage}
                              onChange={(e) => updateCustomMedication(index, 'dosage', e.target.value)}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label="Đơn vị">
                            <Input
                              placeholder="VD: viên"
                              value={med.unit}
                              onChange={(e) => updateCustomMedication(index, 'unit', e.target.value)}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item label="Thời gian">
                            <Input
                              placeholder="VD: 10"
                              value={med.durationValue || ''}
                              onChange={(e) => updateCustomMedication(index, 'durationValue', parseInt(e.target.value) || 0)}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item label="Đơn vị thời gian">
                            <Select
                              value={med.durationUnit || 'DAY'}
                              onChange={(value) => updateCustomMedication(index, 'durationUnit', value)}
                            >
                              <Option value="DAY">Ngày</Option>
                              <Option value="WEEK">Tuần</Option>
                              <Option value="MONTH">Tháng</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item label="Lịch uống">
                            <Select
                              value={med.schedule || 'DAILY'}
                              onChange={(value) => updateCustomMedication(index, 'schedule', value)}
                            >
                              <Option value="MORNING">Buổi sáng</Option>
                              <Option value="AFTERNOON">Buổi chiều</Option>
                              <Option value="EVENING">Buổi tối</Option>
                              <Option value="DAILY">Hàng ngày</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                      
                      <Row gutter={16}>
                        <Col span={24}>
                          <Form.Item label="Ghi chú">
                            <Input
                              placeholder="VD: Uống sau ăn cơm"
                              value={med.notes || ''}
                              onChange={(e) => updateCustomMedication(index, 'notes', e.target.value)}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      
                      {/* Show selected medicine details */}
                      {med.name && (
                        <div className="mt-2 p-2 bg-blue-50 rounded">
                          <Text strong>Thông tin thuốc đã chọn:</Text>
                          <div className="text-sm text-gray-600 mt-1">
                            <div><strong>Mô tả:</strong> {medicines.find(m => m.name === med.name)?.description || 'Không có mô tả'}</div>
                            <div><strong>Liều lượng chuẩn:</strong> {medicines.find(m => m.name === med.name)?.dose} {medicines.find(m => m.name === med.name)?.unit}</div>
                            <div><strong>Giá:</strong> {medicines.find(m => m.name === med.name)?.price ? `${medicines.find(m => m.name === med.name)?.price} VNĐ` : 'Chưa có giá'}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Treatment Dates */}
            <div className="mb-6">
              <Title level={4}>Thời gian điều trị</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="startDate"
                    label="Ngày bắt đầu"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                  >
                    <DatePicker 
                      style={{ width: '100%' }} 
                      format="DD/MM/YYYY"
                      placeholder="Chọn ngày bắt đầu"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="endDate"
                    label="Ngày kết thúc (tùy chọn)"
                  >
                    <DatePicker 
                      style={{ width: '100%' }} 
                      format="DD/MM/YYYY"
                      placeholder="Chọn ngày kết thúc"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <Form.Item 
                name="notes" 
                label="Ghi chú"
              >
                <Input.TextArea 
                  rows={4} 
                  placeholder="Nhập ghi chú về phác đồ điều trị" 
                />
              </Form.Item>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button 
                type="primary" 
                size="large"
                htmlType="submit"
                icon={<CheckOutlined />}
                disabled={!selectedProtocol}
              >
                Tạo phác đồ điều trị
              </Button>
            </div>
          </Form>
        </Card>
      </div>
      
      {/* Confirm Modal */}
      <Modal
        title="Xác nhận tạo phác đồ điều trị"
        open={confirmModalVisible}
        onCancel={() => setConfirmModalVisible(false)}
        onOk={handleCreateTreatment}
        okText="Tạo phác đồ"
        cancelText="Hủy bỏ"
        confirmLoading={loading}
      >
        <div className="py-2">
          <div className="mb-4">
            <Text strong>Bệnh nhân:</Text> {patient?.name}
          </div>
          <div className="mb-4">
            <Text strong>Phác đồ:</Text> {selectedProtocol?.label}
          </div>
          {customMedications.length > 0 && (
            <div className="mb-4">
              <Text strong>Thuốc tùy chỉnh:</Text>
              <List
                size="small"
                dataSource={customMedications}
                renderItem={(med, index) => (
                  <List.Item key={index}>
                    <Text>{med.name} - {med.dosage}</Text>
                  </List.Item>
                )}
              />
            </div>
          )}
          {costPreview && (
            <div className="mb-4">
              <Text strong>Tổng chi phí:</Text> {costPreview.calculatedTotal?.toLocaleString()} VNĐ
            </div>
          )}
          <Alert
            message="Thông báo"
            description="Phác đồ điều trị sẽ được tạo và lưu vào hồ sơ bệnh án của bệnh nhân."
            type="info"
            showIcon
          />
        </div>
      </Modal>
    </div>
  );
};

export default ConsultationPage;
