import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Alert,
  Space,
  Typography,
  Row,
  Col,
  Spin,
  Form,
  Input
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  PlusOutlined,
  EditOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';

// Import components and hooks
import {
  ProtocolSelector,
  ProtocolCustomizer,
  TreatmentValidation,
  StepIndicator,
  PatientInfo,
  TreatmentSummary
} from '@/components/doctor/treatment-prescription';
import { useTreatmentPrescription } from '@/hooks/doctor';

const { Title } = Typography;

const TreatmentPrescriptionPage = () => {
  const { appointmentId, patientId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [form] = Form.useForm();

  const {
    currentStep,
    loading,
    error,
    setError,
    success,
    patient,
    selectedProtocol,
    customizedProtocol,
    validationResult,
    treatmentNotes,
    setTreatmentNotes,
    costSummary,
    handleProtocolSelect,
    handleProtocolCustomize,
    handleValidationComplete,
    handleCreateTreatment,
    handleStepBack
  } = useTreatmentPrescription(appointmentId, patientId, user);

  const onCreateTreatment = async () => {
    const success = await handleCreateTreatment();
    if (success) {
      setTimeout(() => {
        navigate(`/doctor/consultation/${appointmentId}`);
      }, 2000);
    }
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
      <StepIndicator currentStep={currentStep} />

      {/* Patient Information */}
      <PatientInfo patient={patient} />

      {/* Error/Success Messages */}
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
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
                  <Button onClick={handleStepBack}>
                    Back
                  </Button>
                  <Button 
                    type="primary"
                    icon={<PlusOutlined />}
                    loading={loading}
                    onClick={onCreateTreatment}
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
          <TreatmentSummary
            selectedProtocol={selectedProtocol}
            costSummary={costSummary}
            validationResult={validationResult}
            treatmentNotes={treatmentNotes}
            setTreatmentNotes={setTreatmentNotes}
            currentStep={currentStep}
          />
        </Col>
      </Row>
    </div>
  );
};

export default TreatmentPrescriptionPage;