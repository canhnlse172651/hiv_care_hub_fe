import { useState, useEffect } from 'react';
import { appointmentService } from '@/services/appointmentService';
import { patientTreatmentService } from '@/services/patientTreatmentService';
import { treatmentProtocolService } from '@/services/treatmentProtocolService';
import { medicineService } from '@/services/medicineService';
import { message } from 'antd';
import dayjs from 'dayjs';

export const useConsultation = (appointmentId, currentUser) => {
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [patient, setPatient] = useState(null);
  const [protocols, setProtocols] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [costPreview, setCostPreview] = useState(null);

  // Fetch API data
  const fetchApiData = async () => {
    setLoadingData(true);
    try {
      // Fetch treatment protocols
      const protocolsRes = await treatmentProtocolService.getAllTreatmentProtocols();
      let protocolsData = [];
      if (protocolsRes?.data && Array.isArray(protocolsRes.data)) {
        protocolsData = protocolsRes.data;
      } else if (Array.isArray(protocolsRes)) {
        protocolsData = protocolsRes;
      } else if (protocolsRes?.data && Array.isArray(protocolsRes.data.data)) {
        protocolsData = protocolsRes.data.data;
      }
      
      if (Array.isArray(protocolsData)) {
        const mappedProtocols = protocolsData.map(protocol => {
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
          
          return {
            label: protocol.name,
            value: protocol.id,
            description: protocol.description,
            category: protocol.targetDisease,
            medications: medications
          };
        });
        setProtocols(mappedProtocols);
      } else {
        setProtocols([]);
      }

      // Fetch all medicines
      const medicinesRes = await medicineService.getAllMedicines();
      let medicinesData = [];
      if (medicinesRes?.data && Array.isArray(medicinesRes.data)) {
        medicinesData = medicinesRes.data;
      } else if (Array.isArray(medicinesRes)) {
        medicinesData = medicinesRes;
      } else if (medicinesRes?.data && Array.isArray(medicinesRes.data.data)) {
        medicinesData = medicinesRes.data.data;
      }
      
      if (Array.isArray(medicinesData)) {
        setMedicines(medicinesData.map(med => ({
          label: med.name,
          value: med.id,
          name: med.name,
          category: med.category,
          price: med.price,
          description: med.description,
          dose: med.dose,
          unit: med.unit
        })));
      } else {
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
        }
      ]);
      
      setMedicines([
        { label: 'Vitamin D', value: 1, name: 'Vitamin D', category: 'VITAMIN', price: 5000 },
        { label: 'Paracetamol', value: 2, name: 'Paracetamol', category: 'PAINKILLER', price: 8000 }
      ]);
    } finally {
      setLoadingData(false);
    }
  };

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
      // Set mock patient data
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

  const createTreatment = async (treatmentData) => {
    setLoading(true);
    try {
      await patientTreatmentService.createPatientTreatment(treatmentData, currentUser?.id);
      await appointmentService.updateAppointmentStatus(appointmentId, { status: 'COMPLETED' });
      message.success('Đã tạo phác đồ điều trị thành công');
      return true;
    } catch (error) {
      // Show server message if available, else fallback
      const errMsg = error?.response?.data?.message?.message || error?.message || 'Không thể tạo phác đồ điều trị.';
      message.error(errMsg);
      console.error('Error creating treatment:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
    fetchApiData();
  }, [appointmentId]);

  return {
    loading,
    loadingData,
    appointment,
    patient,
    protocols,
    medicines,
    costPreview,
    setCostPreview,
    createTreatment
  };
};
