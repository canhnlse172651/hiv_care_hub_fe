import React, { useState } from 'react';
import { Form, Button, Typography, Alert, Spin, Modal, List } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Import components and hooks
import { PatientInfoCard, TreatmentForm } from '@/components/doctor/consultation';
import { useConsultation, useTreatmentForm } from '@/hooks/doctor';

const { Title, Text } = Typography;

const ConsultationPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const currentUser = useSelector(state => state.auth.user);

  // Custom hooks
  const {
    loading,
    loadingData,
    patient,
    protocols,
    medicines,
    costPreview,
    createTreatment
  } = useConsultation(appointmentId, currentUser);

  const {
    selectedProtocol,
    customMedications,
    handleProtocolChange,
    addCustomMedication,
    removeCustomMedication,
    updateCustomMedication,
    updateProtocolMedication,
    removeProtocolMedication,
    validateForm,
    prepareTreatmentData
  } = useTreatmentForm();

  // Handle form submission
  const handleFinish = async (values) => {
    if (!validateForm()) return;
    setConfirmModalVisible(true);
  };

  // Handle protocol change
  const onProtocolChange = (protocolId) => {
    handleProtocolChange(protocolId, protocols);
  };

  // Create treatment
  const handleCreateTreatment = async () => {
    const formValues = form.getFieldsValue();
    const treatmentData = prepareTreatmentData(formValues, patient, currentUser, costPreview);
    
    const success = await createTreatment(treatmentData);
    if (success) {
      setConfirmModalVisible(false);
      navigate('/doctor/dashboard');
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
        <PatientInfoCard patient={patient} />
        
        {/* Treatment Form */}
        <TreatmentForm 
          form={form}
          protocols={protocols}
          medicines={medicines}
          loadingData={loadingData}
          selectedProtocol={selectedProtocol}
          customMedications={customMedications}
          onProtocolChange={onProtocolChange}
          onAddCustomMedication={addCustomMedication}
          onFinish={handleFinish}
        />
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