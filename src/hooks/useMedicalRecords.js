import { useState, useEffect } from 'react';
import { message } from 'antd';
import { doctorService } from '@/services/doctorService';
import { useParams } from 'react-router-dom';

export const useMedicalRecords = () => {
  const { patientId } = useParams();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const fetchPatientData = async () => {
    if (!patientId) {
      message.error('Patient ID not found');
      return;
    }

    setLoading(true);
    try {
      // Fetch patient profile
      const patientResponse = await doctorService.getPatientProfile(patientId);
      setPatient(patientResponse.data?.data);

      // Fetch medical records
      const recordsResponse = await doctorService.getPatientMedicalRecords(patientId, {
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText,
        dateFrom: dateRange?.[0]?.format('YYYY-MM-DD'),
        dateTo: dateRange?.[1]?.format('YYYY-MM-DD')
      });
      
      setMedicalRecords(recordsResponse.data?.data || []);
      setPagination(prev => ({
        ...prev,
        total: recordsResponse.data?.meta?.total || 0
      }));

      // Fetch lab results
      const labResponse = await doctorService.getPatientLabResults(patientId, {
        dateFrom: dateRange?.[0]?.format('YYYY-MM-DD'),
        dateTo: dateRange?.[1]?.format('YYYY-MM-DD')
      });
      setLabResults(labResponse.data?.data || []);

    } catch (error) {
      console.error('Error fetching patient data:', error);
      message.error('Failed to load patient data');
      
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
        startedTreatment: '2022-03-10',
        currentRegimen: 'TDF + 3TC + DTG',
        allergies: 'Không',
        chronicConditions: 'Tăng huyết áp',
        status: 'active'
      });
      
      setMedicalRecords([
        {
          id: 'MR-202406001',
          date: '2024-06-01',
          doctor: 'BS. Trần Văn B',
          diagnosis: 'Nhiễm HIV ổn định, tuân thủ điều trị tốt',
          symptoms: 'Không có triệu chứng bất thường',
          prescription: [
            { medication: 'TDF', dose: '300mg', frequency: '1 lần/ngày', duration: 'Dài hạn' },
            { medication: '3TC', dose: '300mg', frequency: '1 lần/ngày', duration: 'Dài hạn' },
            { medication: 'DTG', dose: '50mg', frequency: '1 lần/ngày', duration: 'Dài hạn' },
          ],
          labTests: ['CD4', 'Tải lượng virus HIV', 'Công thức máu'],
          regimenChange: false,
          notes: 'Bệnh nhân tuân thủ điều trị tốt, không có tác dụng phụ',
          followupDate: '2024-09-01'
        }
      ]);
      
      setLabResults([
        {
          date: '2024-06-01',
          type: 'CD4',
          value: '650',
          unit: 'cells/mm³',
          referenceRange: '500-1500',
          status: 'normal'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination(prev => ({ ...prev, current: page, pageSize }));
  };

  const refreshData = () => {
    fetchPatientData();
  };

  // Filter medical records based on search and date range
  const filteredRecords = medicalRecords.filter(record => {
    let matchesText = true;
    let matchesDate = true;
    
    if (searchText) {
      matchesText = 
        record.diagnosis.toLowerCase().includes(searchText.toLowerCase()) ||
        record.doctor.toLowerCase().includes(searchText.toLowerCase());
    }
    
    if (dateRange && dateRange[0] && dateRange[1]) {
      const recordDate = new Date(record.date);
      matchesDate = recordDate >= dateRange[0].toDate() && recordDate <= dateRange[1].toDate();
    }
    
    return matchesText && matchesDate;
  });

  useEffect(() => {
    fetchPatientData();
  }, [patientId, pagination.current, pagination.pageSize, searchText, dateRange]);

  return {
    loading,
    patient,
    medicalRecords: filteredRecords,
    labResults,
    searchText,
    setSearchText,
    dateRange,
    setDateRange,
    pagination,
    handleSearch,
    handleDateRangeChange,
    handlePaginationChange,
    refreshData
  };
}; 