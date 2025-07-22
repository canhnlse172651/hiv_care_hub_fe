import React, { useState } from 'react';
import { Card, Typography, Tabs } from 'antd';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import { useAdminDoctors, useDoctorSchedule, useScheduleGeneration } from '@/hooks/admin';
import {
  DoctorList,
  WeeklySchedule,
  AddDoctorModal,
  GenerateScheduleModal,
  ManualAssignModal
} from '@/components/admin/doctors';

const { Title } = Typography;
const { TabPane } = Tabs;

const DoctorManagement = () => {
  // State for modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualShift, setManualShift] = useState(null);

  // Custom hooks
  const {
    doctors,
    meta,
    loading,
    searchText,
    setSearchText,
    handleAddDoctor,
    updateMeta
  } = useAdminDoctors();

  const {
    weeklySchedule,
    scheduleLoading,
    weekRange,
    handlePrevWeek,
    handleNextWeek,
    handleCurrentWeek
  } = useDoctorSchedule();

  const {
    generateLoading,
    generateResult,
    manualLoading,
    handleGenerateSchedule,
    handleManualAssign,
    resetGenerateResult
  } = useScheduleGeneration();

  // Handlers
  const handleOpenGenerate = () => {
    setGenerateModalOpen(true);
    resetGenerateResult();
  };

  const handleOpenManual = (shift) => {
    setManualShift(shift);
    setManualModalOpen(true);
  };

  const handlePaginationChange = (page, pageSize) => {
    updateMeta({ page, limit: pageSize });
  };

  // Weekly schedule data for table
  const scheduleData = weeklySchedule?.doctors?.map(doc => ({
    ...doc,
    key: doc.id,
  })) || [];

  return (
    <div>
      <Title level={2}>Quản lý bác sĩ</Title>
      <Tabs defaultActiveKey="list" className="mb-6">
        <TabPane
          tab={
            <span>
              <UserOutlined /> Danh sách
            </span>
          }
          key="list"
        >
          <Card className="mb-6">
            <DoctorList
              doctors={doctors}
              loading={loading}
              meta={meta}
              searchText={searchText}
              onSearchChange={setSearchText}
              onPaginationChange={handlePaginationChange}
              onOpenModal={() => setIsModalOpen(true)}
              onOpenGenerate={handleOpenGenerate}
            />
          </Card>
        </TabPane>
        <TabPane
          tab={
            <span>
              <CalendarOutlined /> Lịch làm việc
            </span>
          }
          key="schedule"
        >
          <Card className="mb-6">
            <WeeklySchedule
              scheduleData={scheduleData}
              scheduleLoading={scheduleLoading}
              weekRange={weekRange}
              onPrevWeek={handlePrevWeek}
              onNextWeek={handleNextWeek}
              onCurrentWeek={handleCurrentWeek}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Modals */}
      <AddDoctorModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleAddDoctor}
        loading={loading}
      />

      <GenerateScheduleModal
        open={generateModalOpen}
        onCancel={() => setGenerateModalOpen(false)}
        onSubmit={handleGenerateSchedule}
        loading={generateLoading}
        result={generateResult}
        onManualAssign={handleOpenManual}
      />

      <ManualAssignModal
        open={manualModalOpen}
        onCancel={() => setManualModalOpen(false)}
        onSubmit={handleManualAssign}
        loading={manualLoading}
        shift={manualShift}
        doctors={doctors}
      />

      <Outlet />
    </div>
  );
};

export default DoctorManagement;