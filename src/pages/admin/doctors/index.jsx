import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Space, 
  Typography, 
  Tag,
  Modal,
  Form,
  Select,
  message,
  DatePicker,
  InputNumber
} from 'antd';
import { 
  UserAddOutlined, 
  PlusOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';
import { adminService } from '@/services/adminService';
import { doctorService } from '@/services/doctorService';
import { DOCTOR_SHIFT_TIME } from '@/constant/general';
import { Link } from 'react-router-dom';
import { useAdminTable } from '@/hooks/useAdminTable';
import AdminTable, { StatusTag, ActionButtons, ActionTypes } from '@/components/AdminTable';
import AdminModal from '@/components/AdminModal';

const { Title } = Typography;
const { Option } = Select;

const DoctorManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [generateForm] = Form.useForm();
  const [generateLoading, setGenerateLoading] = useState(false);
  const [generateResult, setGenerateResult] = useState(null);
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualShift, setManualShift] = useState(null);
  const [manualForm] = Form.useForm();
  const [manualLoading, setManualLoading] = useState(false);

  // Use the custom hook for table operations
  const {
    data: doctors,
    loading,
    pagination,
    handleTableChange,
    handleSearch,
    handleRefresh,
    fetchData,
  } = useAdminTable({
    fetchFunction: adminService.getDoctors,
    searchField: 'search',
    defaultPageSize: 10,
  });

  // Add doctor
  const handleAddDoctor = async (values) => {
    try {
      await adminService.addDoctor(values);
      message.success('Doctor added successfully');
      setIsModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (e) {
      message.error('Failed to add doctor');
    }
  };

  const handleOpenGenerate = () => {
    setGenerateModalOpen(true);
    setGenerateResult(null);
    generateForm.resetFields();
  };

  const handleGenerateSchedule = async (values) => {
    setGenerateLoading(true);
    try {
      const payload = {
        startDate: values.startDate.utc().hour(10).minute(0).second(0).millisecond(0).toISOString(),
        doctorsPerShift: values.doctorsPerShift,
      };
      const res = await doctorService.generateSchedule(payload);
      setGenerateResult(res.data?.data || null);
      message.success(res.data?.data?.message || 'Schedule generated successfully');
    } catch (e) {
      message.error('Failed to generate schedule');
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleOpenManual = (shift) => {
    setManualShift(shift);
    setManualModalOpen(true);
    manualForm.resetFields();
  };

  const handleManualAssign = async (values) => {
    setManualLoading(true);
    try {
      const payload = {
        date: manualShift.date,
        shift: manualShift.shift,
        doctorIds: values.doctorIds,
        doctorsPerShift: values.doctorsPerShift,
      };
      await doctorService.manualAssignSchedule(payload);
      message.success('Manual assignment successful');
      setManualModalOpen(false);
    } catch (e) {
      message.error('Manual assignment failed');
    } finally {
      setManualLoading(false);
    }
  };

  // Only allow Sundays in DatePicker
  const disabledDate = (current) => current && current.day() !== 0;

  const columns = [
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 80,
      sorter: true,
    },
    {
      title: 'Name',
      dataIndex: ['user', 'name'],
      key: 'name',
      render: (text, record) => record.user?.name || 'N/A',
    },
    {
      title: 'Email',
      dataIndex: ['user', 'email'],
      key: 'email',
      render: (text, record) => record.user?.email || 'N/A',
    },
    {
      title: 'Specialization',
      dataIndex: 'specialization',
      key: 'specialization',
    },
    {
      title: 'Available',
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      render: (isAvailable) => <StatusTag status={isAvailable} type="doctor" />,
    },
    {
      title: 'Certifications',
      dataIndex: 'certifications',
      key: 'certifications',
      render: (certifications) => (
        <div>
          {certifications?.map((cert, index) => (
            <Tag key={index} color="blue">{cert}</Tag>
          )) || 'None'}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Link to={`/admin/doctors/${record.id}/schedule`}>
          <Button size="small" icon={<MedicineBoxOutlined />}>
            View Schedule
          </Button>
        </Link>
      ),
    },
  ];

  const extraActions = (
    <Space>
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={handleOpenGenerate}
      >
        Generate Schedule
      </Button>
      <Button 
        type="primary" 
        icon={<UserAddOutlined />} 
        onClick={() => setIsModalOpen(true)}
      >
        Add Doctor
      </Button>
    </Space>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminTable
        title="Doctor Management"
        columns={columns}
        dataSource={doctors}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        searchPlaceholder="Search by name or email"
        searchValue=""
        onSearchChange={handleSearch}
        onRefresh={handleRefresh}
        extraActions={extraActions}
        rowKey="id"
      />

      {/* Add Doctor Modal */}
      <AdminModal
        title="Add New Doctor"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        showFooter={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddDoctor}
        >
          <Form.Item
            name="userId"
            label="User ID"
            rules={[{ required: true, message: 'Please enter user ID' }]}
          >
            <InputNumber placeholder="Enter user ID" className="w-full" />
          </Form.Item>
          <Form.Item
            name="specialization"
            label="Specialization"
            rules={[{ required: true, message: 'Please enter specialization' }]}
          >
            <Select placeholder="Enter specialization" className="w-full">
              <Option value="Infectious Disease Specialist">Infectious Disease Specialist</Option>
              <Option value="General Practitioner">General Practitioner</Option>
              <Option value="Therapist">Therapist</Option>
              <Option value="Nutritionist">Nutritionist</Option>
              <Option value="Psychiatrist">Psychiatrist</Option>
              <Option value="Pharmacologist">Pharmacologist</Option>
              <Option value="Dermatologist">Dermatologist</Option>
            </Select>
          </Form.Item>
          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Add Doctor
            </Button>
          </div>
        </Form>
      </AdminModal>

      {/* Generate Schedule Modal */}
      <AdminModal
        title="Generate Doctor Schedule"
        open={generateModalOpen}
        onCancel={() => setGenerateModalOpen(false)}
        onOk={() => generateForm.submit()}
        showFooter={false}
        width={800}
      >
        <Form form={generateForm} layout="vertical" onFinish={handleGenerateSchedule}>
          <Form.Item
            name="startDate"
            label="Start Date (Sunday only)"
            rules={[{ required: true, message: 'Please select a start date' }]}
          >
            <DatePicker disabledDate={disabledDate} className="w-full" />
          </Form.Item>
          <Form.Item
            name="doctorsPerShift"
            label="Doctors Per Shift"
            rules={[{ required: true, message: 'Please enter number of doctors per shift' }]}
          >
            <InputNumber min={1} max={100} className="w-full" />
          </Form.Item>
          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setGenerateModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={generateLoading}>
              Generate
            </Button>
          </div>
        </Form>
        
        {generateResult && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="font-semibold">{generateResult.message}</p>
            <p>Total Assigned Shifts: {generateResult.totalAssignedShifts}</p>
            <p>Remaining Shifts: {generateResult.remainingShifts}</p>
            {generateResult.shiftsNeedingDoctors?.length > 0 && (
              <>
                <p className="mt-4 font-semibold">Shifts Needing Doctors:</p>
                <div className="mt-2 space-y-2">
                  {generateResult.shiftsNeedingDoctors.map((shift, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                      <span>{shift.date?.slice(0, 10)} - {shift.dayOfWeek} - {shift.shift}</span>
                      <Button 
                        size="small" 
                        onClick={() => handleOpenManual(shift)}
                      >
                        Manual Assign
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </AdminModal>

      {/* Manual Assign Modal */}
      <AdminModal
        title="Manual Assign Shift"
        open={manualModalOpen}
        onCancel={() => setManualModalOpen(false)}
        onOk={() => manualForm.submit()}
        showFooter={false}
      >
        <Form form={manualForm} layout="vertical" onFinish={handleManualAssign}>
          <Form.Item 
            label="Doctors" 
            name="doctorIds" 
            rules={[{ required: true, message: 'Select doctors' }]}
          > 
            <Select
              mode="multiple"
              placeholder="Select doctors"
              optionFilterProp="children"
              showSearch
              className="w-full"
            >
              {doctors.map(doc => (
                <Option key={doc.id} value={doc.id}>{doc.user?.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item 
            label="Doctors Per Shift" 
            name="doctorsPerShift" 
            rules={[{ required: true, message: 'Enter doctors per shift' }]}
          > 
            <InputNumber min={1} max={100} className="w-full" />
          </Form.Item>
          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setManualModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={manualLoading}>
              Assign
            </Button>
          </div>
        </Form>
      </AdminModal>
    </div>
  );
};

export default DoctorManagement;
