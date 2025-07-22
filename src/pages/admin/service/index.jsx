import React, { useState } from 'react';
import { Button, Card } from 'antd';
import { useAdminService } from '@/hooks/admin';
import {
  ServiceTable,
  ServiceFormModal,
  ServiceFilters
} from '@/components/admin/service';

const ServiceManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const {
    filteredServices,
    loading,
    error,
    success,
    search,
    setSearch,
    filterType,
    setFilterType,
    handleCreateService,
    handleUpdateService,
    handleDeleteService
  } = useAdminService();

  const handleEdit = (service) => {
    setEditingService(service);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingService(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingService(null);
  };

  const handleSubmit = async (formData) => {
    if (editingService) {
      return await handleUpdateService(editingService.id || editingService._id, formData);
    } else {
      return await handleCreateService(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý dịch vụ</h1>
          <Button type="primary" onClick={handleAdd}>
            Thêm dịch vụ
          </Button>
        </div>

        <ServiceFilters
          search={search}
          onSearchChange={setSearch}
          filterType={filterType}
          onFilterTypeChange={setFilterType}
        />

        <Card>
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Danh sách dịch vụ</h2>
          <ServiceTable
            services={filteredServices}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDeleteService}
          />
        </Card>

        <ServiceFormModal
          isOpen={showModal}
          onClose={handleClose}
          onSubmit={handleSubmit}
          editingService={editingService}
          error={error}
          success={success}
        />
      </div>
    </div>
  );
};

export default ServiceManagement;