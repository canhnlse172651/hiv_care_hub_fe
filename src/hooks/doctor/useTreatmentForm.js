import { useState } from 'react';
import { message } from 'antd';

export const useTreatmentForm = () => {
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [customMedications, setCustomMedications] = useState([]);

  // Handle protocol selection
  const handleProtocolChange = (protocolId, protocols) => {
    const protocol = protocols.find(p => p.value === protocolId);
    setSelectedProtocol(protocol);
    setCustomMedications([]);
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
  };

  // Update custom medication
  const updateCustomMedication = (index, field, value) => {
    const newMedications = [...customMedications];
    newMedications[index][field] = value;
    setCustomMedications(newMedications);
  };

  // Update protocol medications
  const updateProtocolMedication = (index, field, value) => {
    if (!selectedProtocol) return;
    
    const updatedMedications = [...selectedProtocol.medications];
    updatedMedications[index][field] = value;
    setSelectedProtocol({
      ...selectedProtocol,
      medications: updatedMedications
    });
  };

  // Remove protocol medication
  const removeProtocolMedication = (index) => {
    if (!selectedProtocol) return;
    
    const updatedMedications = selectedProtocol.medications.filter((_, i) => i !== index);
    setSelectedProtocol({
      ...selectedProtocol,
      medications: updatedMedications
    });
  };

  // Validate form
  const validateForm = () => {
    if (!selectedProtocol) {
      message.error('Vui lòng chọn phác đồ điều trị');
      return false;
    }
    return true;
  };

  // Prepare treatment data
  const prepareTreatmentData = (formValues, patient, currentUser, costPreview) => {
    const allMedications = [
      ...(selectedProtocol.medications || []),
      ...customMedications
    ];
    
    return {
      patientId: parseInt(patient.id),
      protocolId: selectedProtocol.value,
      doctorId: currentUser?.id ? parseInt(currentUser.id) : 1,
      customMedications: allMedications.map(med => ({
        medicineName: med.name,
        dosage: med.dosage || med.dose,
        frequency: med.schedule || 'DAILY',
        durationValue: med.durationValue || 30,
        durationUnit: med.durationUnit || 'DAY',
        notes: med.notes || '',
        description: med.description || '',
        unit: med.unit || 'tablet',
        price: med.price ? parseFloat(med.price) : 0
      })),
      notes: formValues.notes || '',
      startDate: formValues.startDate?.toISOString() || new Date().toISOString(),
      endDate: formValues.endDate?.toISOString() || null,
      total: costPreview?.calculatedTotal || 0
    };
  };

  return {
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
  };
};
