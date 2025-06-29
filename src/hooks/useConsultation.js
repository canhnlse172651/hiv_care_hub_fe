import { useState, useEffect } from 'react';
import { message } from 'antd';
import { doctorService } from '@/services/doctorService';
import { useParams } from 'react-router-dom';

export const useConsultation = () => {
  const { appointmentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [consultationData, setConsultationData] = useState({
    diagnosis: '',
    symptoms: '',
    prescription: [],
    labTests: [],
    notes: '',
    followupDate: null
  });

  const fetchAppointmentDetails = async () => {
    if (!appointmentId) {
      message.error('Appointment ID not found');
      return;
    }

    setLoading(true);
    try {
      const response = await doctorService.getAppointmentDetails(appointmentId);
      const appointmentData = response.data?.data;
      
      if (appointmentData) {
        setPatient(appointmentData.patient);
        
        // Fetch patient medical history
        if (appointmentData.patient?.id) {
          const historyResponse = await doctorService.getPatientMedicalHistory(appointmentData.patient.id);
          setMedicalHistory(historyResponse.data?.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      message.error('Failed to load appointment details');
      
      // Fallback to mock data
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
        appointmentId: appointmentId,
        appointmentTime: '09:00',
        checkInTime: '08:45',
        reason: 'Khám định kỳ HIV',
        isHivPositive: true,
        startedTreatment: '2022-03-10',
        currentRegimen: 'TDF + 3TC + DTG',
        allergies: 'Không',
        chronicConditions: 'Tăng huyết áp',
      });
      
      setMedicalHistory([
        {
          date: '2024-03-15',
          doctor: 'BS. Trần Văn B',
          diagnosis: 'Nhiễm HIV ổn định, tuân thủ điều trị tốt',
          symptoms: 'Không có triệu chứng bất thường',
          prescription: 'TDF + 3TC + DTG, uống 1 lần/ngày',
          notes: 'Xét nghiệm CD4: 650 cells/mm³, Tải lượng virus: Không phát hiện',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const saveConsultation = async (consultationData) => {
    setLoading(true);
    try {
      const response = await doctorService.saveConsultation(appointmentId, consultationData);
      message.success('Consultation saved successfully!');
      return response.data;
    } catch (error) {
      console.error('Error saving consultation:', error);
      message.error('Failed to save consultation');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateConsultation = async (consultationData) => {
    setLoading(true);
    try {
      const response = await doctorService.updateConsultation(appointmentId, consultationData);
      message.success('Consultation updated successfully!');
      return response.data;
    } catch (error) {
      console.error('Error updating consultation:', error);
      message.error('Failed to update consultation');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateConsultationData = (field, value) => {
    setConsultationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    fetchAppointmentDetails();
  }, [appointmentId]);

  return {
    loading,
    patient,
    medicalHistory,
    consultationData,
    setConsultationData,
    updateConsultationData,
    saveConsultation,
    updateConsultation,
    fetchAppointmentDetails
  };
}; 