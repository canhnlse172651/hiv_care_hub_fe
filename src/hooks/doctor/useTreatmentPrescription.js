import { useState, useEffect } from 'react';
import { treatmentProtocolService } from '@/services/treatmentProtocolService';
import { message, notification } from 'antd';

export const useTreatmentPrescription = (appointmentId, patientId, user) => {
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
      
      return true;
      
    } catch (error) {
      setError('Failed to create treatment');
      console.error('Error creating treatment:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [appointmentId, patientId]);

  return {
    currentStep,
    setCurrentStep,
    loading,
    error,
    setError,
    success,
    patient,
    appointment,
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
  };
};
