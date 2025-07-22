import { useState, useEffect } from 'react';
import { patientTreatmentService } from '@/services/patientTreatmentService';
import { message } from 'antd';

export const usePatientTreatments = (currentUser) => {
  const [loading, setLoading] = useState(false);
  const [treatments, setTreatments] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState({});
  const [businessRulesCheck, setBusinessRulesCheck] = useState(null);
  const [selectedTreatment, setSelectedTreatment] = useState(null);

  const fetchTreatments = async () => {
    setLoading(true);
    try {
      let response;
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText
      };

      if (activeTab === 'active') {
        response = await patientTreatmentService.getActivePatientTreatments(params);
      } else if (activeTab === 'custom') {
        response = await patientTreatmentService.getTreatmentsWithCustomMedications(params);
      } else {
        response = await patientTreatmentService.getAllPatientTreatments(params);
      }

      setTreatments(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.meta?.total || 0
      }));
    } catch (error) {
      message.error('Không thể tải danh sách điều trị');
      console.error('Error fetching treatments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      if (currentUser?.id) {
        const doctorStats = await patientTreatmentService.getDoctorWorkloadStats(currentUser.id);
        setStats(doctorStats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreateTreatment = async (values) => {
    setLoading(true);
    try {
      const treatmentData = {
        patientId: values.patientId,
        doctorId: currentUser?.id,
        protocolId: values.protocolId,
        startDate: values.startDate?.toISOString(),
        endDate: values.endDate?.toISOString(),
        notes: values.notes,
        customMedications: values.customMedications || null,
        total: values.total || 0
      };

      await patientTreatmentService.createPatientTreatment(treatmentData, currentUser?.id);
      message.success('Tạo phác đồ điều trị thành công');
      fetchTreatments();
      return true;
    } catch (error) {
      message.error('Không thể tạo phác đồ điều trị');
      console.error('Error creating treatment:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleViewTreatment = async (treatmentId) => {
    try {
      const treatment = await patientTreatmentService.getPatientTreatmentById(treatmentId);
      setSelectedTreatment(treatment);
      return treatment;
    } catch (error) {
      message.error('Không thể tải thông tin điều trị');
      return null;
    }
  };

  const handleDeleteTreatment = async (treatmentId) => {
    try {
      await patientTreatmentService.deletePatientTreatment(treatmentId);
      message.success('Xóa phác đồ điều trị thành công');
      fetchTreatments();
      return true;
    } catch (error) {
      message.error('Không thể xóa phác đồ điều trị');
      return false;
    }
  };

  const handleEndTreatment = async (treatmentId) => {
    try {
      await patientTreatmentService.updatePatientTreatment(treatmentId, {
        endDate: new Date().toISOString()
      });
      message.success('Kết thúc điều trị thành công');
      fetchTreatments();
      return true;
    } catch (error) {
      message.error('Không thể kết thúc điều trị');
      return false;
    }
  };

  const handleBusinessRulesCheck = async (patientId) => {
    try {
      const check = await patientTreatmentService.quickBusinessRulesCheck(patientId);
      setBusinessRulesCheck(check);
      return check;
    } catch (error) {
      message.error('Không thể kiểm tra quy tắc kinh doanh');
      return null;
    }
  };

  const handleSearch = () => {
    fetchTreatments();
  };

  const handleReset = () => {
    setSearchText('');
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  useEffect(() => {
    fetchTreatments();
    fetchStats();
  }, [activeTab, pagination.current, pagination.pageSize]);

  return {
    loading,
    treatments,
    pagination,
    setPagination,
    searchText,
    setSearchText,
    activeTab,
    setActiveTab,
    stats,
    businessRulesCheck,
    setBusinessRulesCheck,
    selectedTreatment,
    setSelectedTreatment,
    handleCreateTreatment,
    handleViewTreatment,
    handleDeleteTreatment,
    handleEndTreatment,
    handleBusinessRulesCheck,
    handleSearch,
    handleReset,
    fetchTreatments
  };
};
