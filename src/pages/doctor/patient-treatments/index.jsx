import React, { useState } from 'react';
import { 
  Card, Button, Input, Form, Row, Col, Typography,
  Tabs, Statistic, Alert
} from 'antd';
import {
  PlusOutlined, SearchOutlined, MedicineBoxOutlined, UserOutlined,
  FileTextOutlined, BarChartOutlined, SettingOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';

// Import components and hooks
import { TreatmentTable, CreateTreatmentModal, TreatmentDetailDrawer } from '@/components/doctor/patient-treatments';
import { usePatientTreatments } from '@/hooks/doctor';

const { Title } = Typography;

const PatientTreatmentsPage = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [form] = Form.useForm();
  const currentUser = useSelector(state => state.auth.user);

  const {
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
    handleReset
  } = usePatientTreatments(currentUser);

  const onViewTreatment = async (treatmentId) => {
    const treatment = await handleViewTreatment(treatmentId);
    if (treatment) {
      setViewModalVisible(true);
    }
  };

  const tabItems = [
    {
      key: 'all',
      label: 'Tất cả',
      icon: <FileTextOutlined />
    },
    {
      key: 'active',
      label: 'Đang điều trị',
      icon: <MedicineBoxOutlined />
    },
    {
      key: 'custom',
      label: 'Có thuốc tùy chỉnh',
      icon: <SettingOutlined />
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="mb-0">Quản lý phác đồ điều trị</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setCreateModalVisible(true)}
        >
          Tạo phác đồ mới
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số điều trị"
              value={stats.totalTreatments || 0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang điều trị"
              value={stats.activeTreatments || 0}
              prefix={<MedicineBoxOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Bệnh nhân"
              value={stats.uniquePatients || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="TB điều trị/bệnh nhân"
              value={stats.averageTreatmentsPerPatient || 0}
              precision={1}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Business Rules Alert */}
      {businessRulesCheck && (
        <Alert
          message="Kiểm tra quy tắc kinh doanh"
          description={
            <div>
              <p><strong>Bệnh nhân ID:</strong> {businessRulesCheck.patientId}</p>
              <p><strong>Vi phạm:</strong> {businessRulesCheck.hasActiveViolations ? 'Có' : 'Không'}</p>
              <p><strong>Khuyến nghị:</strong> {businessRulesCheck.recommendation}</p>
            </div>
          }
          type={businessRulesCheck.hasActiveViolations ? 'warning' : 'info'}
          showIcon
          className="mb-4"
        />
      )}

      {/* Search and Filters */}
      <Card className="mb-4">
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Input
              placeholder="Tìm kiếm theo tên bệnh nhân, mã điều trị..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
            />
          </Col>
          <Col span={8}>
            <Button 
              type="primary" 
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
          </Col>
          <Col span={8}>
            <Button onClick={handleReset}>
              Làm mới
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Treatments Table */}
      <Card>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={tabItems}
          className="mb-4"
        />
        
        <TreatmentTable
          treatments={treatments}
          loading={loading}
          pagination={pagination}
          onPaginationChange={setPagination}
          onViewTreatment={onViewTreatment}
          onEndTreatment={handleEndTreatment}
          onDeleteTreatment={handleDeleteTreatment}
        />
      </Card>

      {/* Create Treatment Modal */}
      <CreateTreatmentModal
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSubmit={handleCreateTreatment}
        form={form}
        loading={loading}
      />

      {/* View Treatment Drawer */}
      <TreatmentDetailDrawer
        visible={viewModalVisible}
        onClose={() => {
          setViewModalVisible(false);
          setSelectedTreatment(null);
        }}
        treatment={selectedTreatment}
        onBusinessRulesCheck={handleBusinessRulesCheck}
      />
    </div>
  );
};

export default PatientTreatmentsPage;