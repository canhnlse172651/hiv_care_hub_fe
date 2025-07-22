import { useState, useEffect } from 'react';
import { patientTreatmentService } from '@/services/patientTreatmentService';
import { message } from 'antd';
import dayjs from 'dayjs';

export const useTreatmentAnalytics = (currentUser) => {
  const [loading, setLoading] = useState(false);
  const [generalStats, setGeneralStats] = useState({});
  const [customMedicationStats, setCustomMedicationStats] = useState({});
  const [doctorStats, setDoctorStats] = useState({});
  const [complianceStats, setComplianceStats] = useState({});
  const [violations, setViolations] = useState(null);
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'days'), dayjs()]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch general statistics
      const generalStatsRes = await patientTreatmentService.getGeneralTreatmentStats();
      setGeneralStats(generalStatsRes);

      // Fetch custom medication statistics
      const customMedStatsRes = await patientTreatmentService.getCustomMedicationStats();
      setCustomMedicationStats(customMedStatsRes);

      // Fetch doctor-specific statistics
      if (currentUser?.id) {
        const doctorStatsRes = await patientTreatmentService.getDoctorWorkloadStats(currentUser.id);
        setDoctorStats(doctorStatsRes);
      }

      // Fetch business rule violations
      const violationsRes = await patientTreatmentService.detectBusinessRuleViolations();
      setViolations(violationsRes);

    } catch (error) {
      message.error('Không thể tải dữ liệu phân tích');
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientComplianceCheck = async (patientId) => {
    try {
      const complianceRes = await patientTreatmentService.getTreatmentComplianceStats(patientId);
      setComplianceStats(complianceRes);
      setSelectedPatient(patientId);
    } catch (error) {
      message.error('Không thể tải thông tin tuân thủ điều trị');
    }
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  return {
    loading,
    generalStats,
    customMedicationStats,
    doctorStats,
    complianceStats,
    violations,
    dateRange,
    selectedPatient,
    activeTab,
    setActiveTab,
    fetchAnalytics,
    handlePatientComplianceCheck,
    handleDateRangeChange
  };
};
