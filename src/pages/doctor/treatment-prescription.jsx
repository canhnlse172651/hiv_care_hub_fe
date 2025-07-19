import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Badge,
  Alert,
  Progress,
  Space,
  Typography,
  Divider,
  Row,
  Col,
  Spin,
  Modal,
  Form,
  Input,
  Select,
  Tooltip,
  notification
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckOutlined,
  UserOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  PlusOutlined,
  EditOutlined,
  InfoCircleOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import ProtocolSelector from '@/components/ProtocolSelector';
import ProtocolCustomizer from '@/components/ProtocolCustomizer';
import TreatmentValidation from '@/components/TreatmentValidation';
import { treatmentProtocolService } from '@/services/treatmentProtocolService';
import { medicineService } from '@/services/medicineService';
import { useSelector } from 'react-redux';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const TreatmentPrescriptionPage = () => {
  const { appointmentId, patientId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Data state
  const [patient, setPatient] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [customizedProtocol, setCustomizedProtocol] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [treatmentNotes, setTreatmentNotes] = useState('');
  const [costSummary, setCostSummary] = useState(null);

  // Form state
  const [form] = Form.useForm();

  useEffect(() => {
    fetchInitialData();
  }, [appointmentId, patientId]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // Fetch patient data
      if (patientId) {
        // TODO: Implement patient service call
        setPatient({
          id: patientId,
          name: 'John Doe',
          age: 35,
          gender: 'Male',
          diagnosis: 'HIV Positive',
          lastVisit: '2024-01-15'
        });
      }

      // Fetch appointment data
      if (appointmentId) {
        // TODO: Implement appointment service call
        setAppointment({
          id: appointmentId,
          date: '2024-01-20',
          time: '10:00 AM',
          type: 'Follow-up',
          notes: 'Regular checkup'
        });
      }
    } catch (error) {
      setError('Failed to load patient and appointment data');
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProtocolSelect = async (protocol) => {
    setSelectedProtocol(protocol);
    setCustomizedProtocol(null);
    setValidationResult(null);
    
    try {
      // Calculate cost for selected protocol
      if (patient?.id) {
        const costData = await treatmentProtocolService.calculateProtocolCostForPatient(
          protocol.id,
          patient.id
        );
        setCostSummary(costData);
      }
      
      setCurrentStep(2);
    } catch (error) {
      setError('Failed to calculate protocol cost');
      console.error('Error calculating protocol cost:', error);
    }
  };

  const handleProtocolCustomize = (customized) => {
    setCustomizedProtocol(customized);
    setCurrentStep(3);
  };

  const handleValidationComplete = async (validation) => {
    setValidationResult(validation);
    setCurrentStep(4);
  };

  const handleCreateTreatment = async () => {
    setLoading(true);
    try {
      const treatmentData = {
        patientId: patient.id,
        doctorId: user.id,
        protocolId: selectedProtocol.id,
        customizedProtocol: customizedProtocol,
        notes: treatmentNotes,
        validationResult: validationResult,
        costSummary: costSummary
      };

      // TODO: Implement treatment creation service call
      console.log('Creating treatment:', treatmentData);
      
      setSuccess('Treatment created successfully!');
      notification.success({
        message: 'Success',
        description: 'Treatment has been created successfully.',
        placement: 'topRight'
      });
      
      // Navigate back to consultation page
      setTimeout(() => {
        navigate(`/doctor/consultation/${appointmentId}`);
      }, 2000);
      
    } catch (error) {
      setError('Failed to create treatment');
      console.error('Error creating treatment:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { title: 'Protocol Selection', icon: <FileTextOutlined /> },
      { title: 'Customization', icon: <EditOutlined /> },
      { title: 'Validation', icon: <CheckOutlined /> },
      { title: 'Create Treatment', icon: <PlusOutlined /> }
    ];

    return (
      <Card className="mb-6">
        <Progress
          percent={(currentStep / steps.length) * 100}
          format={() => `Step ${currentStep} of ${steps.length}`}
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
        />
        <Row gutter={16} className="mt-4">
          {steps.map((step, index) => (
            <Col span={6} key={index}>
              <div className={`text-center ${index < currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className="text-xl mb-2">{step.icon}</div>
                <Text strong={index < currentStep}>{step.title}</Text>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    );
  };

  const renderPatientInfo = () => {
    if (!patient) return null;

    return (
      <Card className="mb-6">
        <Title level={4}>
          <UserOutlined className="mr-2" />
          Patient Information
        </Title>
        <Row gutter={16}>
          <Col span={8}>
            <Text strong>Name:</Text> {patient.name}
          </Col>
          <Col span={8}>
            <Text strong>Age:</Text> {patient.age} years
          </Col>
          <Col span={8}>
            <Text strong>Gender:</Text> {patient.gender}
          </Col>
        </Row>
        <Row gutter={16} className="mt-2">
          <Col span={12}>
            <Text strong>Diagnosis:</Text> {patient.diagnosis}
          </Col>
          <Col span={12}>
            <Text strong>Last Visit:</Text> {patient.lastVisit}
          </Col>
        </Row>
      </Card>
    );
  };

  const renderCostSummary = () => {
    if (!costSummary) return null;

    return (
      <Card className="mb-6">
        <Title level={4}>
          <DollarOutlined className="mr-2" />
          Cost Summary
        </Title>
        <Row gutter={16}>
          <Col span={8}>
            <Text strong>Total Cost:</Text>
            <div className="text-lg font-bold text-green-600">
              ${costSummary.totalCost?.toFixed(2)}
            </div>
          </Col>
          <Col span={8}>
            <Text strong>Duration:</Text>
            <div className="text-lg">{costSummary.duration} days</div>
          </Col>
          <Col span={8}>
            <Text strong>Medicines:</Text>
            <div className="text-lg">{costSummary.medicineCount} items</div>
          </Col>
        </Row>
      </Card>
    );
  };

  if (loading && !patient) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)}
            className="mb-2"
          >
            Back
          </Button>
          <Title level={2}>Treatment Prescription</Title>
        </div>
        <Space>
          <Button icon={<PrinterOutlined />}>
            Print
          </Button>
          <Button icon={<ShareAltOutlined />}>
            Share
          </Button>
        </Space>
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Patient Information */}
      {renderPatientInfo()}

      {/* Error/Success Messages */}
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          className="mb-4"
        />
      )}

      {success && (
        <Alert
          message="Success"
          description={success}
          type="success"
          showIcon
          className="mb-4"
        />
      )}

      {/* Main Content */}
      <Row gutter={24}>
        <Col span={16}>
          {/* Step 1: Protocol Selection */}
          {currentStep === 1 && (
            <Card>
              <Title level={4}>
                <FileTextOutlined className="mr-2" />
                Select Treatment Protocol
              </Title>
              <ProtocolSelector
                patientId={patient?.id}
                onProtocolSelect={handleProtocolSelect}
              />
            </Card>
          )}

          {/* Step 2: Protocol Customization */}
          {currentStep === 2 && selectedProtocol && (
            <Card>
              <Title level={4}>
                <EditOutlined className="mr-2" />
                Customize Protocol
              </Title>
              <ProtocolCustomizer
                protocol={selectedProtocol}
                patientId={patient?.id}
                onCustomize={handleProtocolCustomize}
              />
            </Card>
          )}

          {/* Step 3: Validation */}
          {currentStep === 3 && customizedProtocol && (
            <Card>
              <Title level={4}>
                <CheckOutlined className="mr-2" />
                Validate Treatment
              </Title>
              <TreatmentValidation
                protocol={customizedProtocol}
                patientId={patient?.id}
                onValidationComplete={handleValidationComplete}
              />
            </Card>
          )}

          {/* Step 4: Create Treatment */}
          {currentStep === 4 && (
            <Card>
              <Title level={4}>
                <PlusOutlined className="mr-2" />
                Create Treatment
              </Title>
              
              <Form form={form} layout="vertical">
                <Form.Item
                  label="Treatment Notes"
                  name="notes"
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Enter any special instructions or notes for the patient..."
                    value={treatmentNotes}
                    onChange={(e) => setTreatmentNotes(e.target.value)}
                  />
                </Form.Item>

                <div className="flex justify-end space-x-4">
                  <Button onClick={() => setCurrentStep(3)}>
                    Back
                  </Button>
                  <Button 
                    type="primary"
                    icon={<PlusOutlined />}
                    loading={loading}
                    onClick={handleCreateTreatment}
                  >
                    Create Treatment
                  </Button>
                </div>
              </Form>
            </Card>
          )}
        </Col>

        {/* Right Column - Summary */}
        <Col span={8}>
          <Card>
            <Title level={4}>
              <InfoCircleOutlined className="mr-2" />
              Summary
            </Title>

            {/* Selected Protocol */}
            {selectedProtocol && (
              <div className="mb-4">
                <Text strong>Selected Protocol:</Text>
                <div className="mt-2 p-3 bg-blue-50 rounded">
                  <Text strong>{selectedProtocol.name}</Text>
                  <div className="text-sm text-gray-600 mt-1">
                    {selectedProtocol.description}
                  </div>
                </div>
              </div>
            )}

            {/* Cost Summary */}
            {renderCostSummary()}

            {/* Validation Status */}
            {validationResult && (
              <div className="mb-4">
                <Text strong>Validation Status:</Text>
                <div className="mt-2">
                  {validationResult.isValid ? (
                    <Alert
                      message="Valid"
                      description="Treatment protocol is valid for this patient"
                      type="success"
                      showIcon
                    />
                  ) : (
                    <Alert
                      message="Issues Found"
                      description={validationResult.issues?.join(', ')}
                      type="warning"
                      showIcon
                    />
                  )}
                </div>
              </div>
            )}

            {/* Treatment Notes */}
            {currentStep === 4 && (
              <div className="mb-4">
                <Text strong>Treatment Notes:</Text>
                <div className="mt-2">
                  <Input.TextArea
                    rows={3}
                    placeholder="Add notes..."
                    value={treatmentNotes}
                    onChange={(e) => setTreatmentNotes(e.target.value)}
                  />
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TreatmentPrescriptionPage; 