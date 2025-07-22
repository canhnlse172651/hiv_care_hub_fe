import React, { useState } from 'react';
import { Button, Card } from 'antd';
import { useAdminMedicine } from '@/hooks/admin';
import {
  MedicineTable,
  MedicineFormModal,
  MedicineFilters
} from '@/components/admin/medicine';

const MedicineManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);

  const {
    filteredMedicines,
    loading,
    error,
    success,
    search,
    setSearch,
    filterUnit,
    setFilterUnit,
    filterDose,
    setFilterDose,
    uniqueUnits,
    uniqueDoses,
    handleCreateMedicine,
    handleUpdateMedicine,
    handleDeleteMedicine
  } = useAdminMedicine();

  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingMedicine(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingMedicine(null);
  };

  const handleSubmit = async (formData) => {
    if (editingMedicine) {
      return await handleUpdateMedicine(editingMedicine.id || editingMedicine._id, formData);
    } else {
      return await handleCreateMedicine(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý thuốc</h1>
          <Button type="primary" onClick={handleAdd}>
            Thêm thuốc
          </Button>
        </div>

        <MedicineFilters
          search={search}
          onSearchChange={setSearch}
          filterUnit={filterUnit}
          onFilterUnitChange={setFilterUnit}
          filterDose={filterDose}
          onFilterDoseChange={setFilterDose}
          uniqueUnits={uniqueUnits}
          uniqueDoses={uniqueDoses}
        />

        <Card>
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Danh sách thuốc</h2>
          <MedicineTable
            medicines={filteredMedicines}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDeleteMedicine}
            uniqueUnits={uniqueUnits}
            uniqueDoses={uniqueDoses}
          />
        </Card>

        <MedicineFormModal
          isOpen={showModal}
          onClose={handleClose}
          onSubmit={handleSubmit}
          editingMedicine={editingMedicine}
          error={error}
          success={success}
        />
      </div>
    </div>
  );
};

export default MedicineManagement;
