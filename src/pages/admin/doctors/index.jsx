import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Space, 
  Typography, 
  Tag,
  Input,
  Modal,
  Form,
  Select,
  Popconfirm,
  message,
  Avatar,
  Upload,
  Rate,
  DatePicker,
  InputNumber
} from 'antd';
import { 
  UserAddOutlined, 
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { adminService } from '@/services/adminService';
import { doctorService } from '@/services/doctorService';
import { DOCTOR_SHIFT_TIME } from '@/constant/general';
import { Link, Outlet } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [generateForm] = Form.useForm();
  const [generateLoading, setGenerateLoading] = useState(false);
  const [generateResult, setGenerateResult] = useState(null);
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualShift, setManualShift] = useState(null);
  const [manualForm] = Form.useForm();
  const [manualLoading, setManualLoading] = useState(false);

  // Fetch doctor list
  const fetchDoctors = async (params = {}) => {
    setLoading(true);
    try {
      const response = await adminService.getDoctors({
        page: meta.page,
        limit: meta.limit,
        search: searchText,
        ...params,
      });
      
      console.log('API Response:', response.status, '/doctors', response.data);
      
      // Extract data from the correct path based on your API response structure
      const doctorsData = response.data?.data?.data || [];
      const metaData = response.data?.data?.meta || { page: 1, limit: 10, total: 0 };
      
      console.log('Extracted doctors data:', doctorsData);
      console.log('Extracted meta data:', metaData);
      
      // Filter out doctors without user data
      const validDoctors = Array.isArray(doctorsData) ? doctorsData.filter(d => d.user) : [];
      
      setDoctors(validDoctors);
      setMeta(metaData);
    } catch (e) {
      console.error('Error fetching doctors:', e);
      message.error('Failed to fetch doctors');
      setDoctors([]);
      setMeta({ page: 1, limit: 10, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line
  }, [meta.page, meta.limit, searchText]);

  // Add doctor
  const handleAddDoctor = async (values) => {
    try {
      await adminService.addDoctor(values);
      message.success('Doctor added successfully');
      setIsModalOpen(false);
      form.resetFields();
      fetchDoctors();
    } catch (e) {
      message.error('Failed to add doctor');
    }
  };

  const specialties = [
    'Infectious Disease Specialist', 
    'General Practitioner', 
    'Therapist', 
    'Nutritionist', 
    'Psychiatrist',
    'Pharmacologist',
    'Dermatologist'
  ];

  const showModal = (doctor = null) => {
    if (doctor) {
      setEditingDoctor(doctor);
      form.setFieldsValue({
        name: doctor.name,
        email: doctor.email,
        specialty: doctor.specialty,
        experience: doctor.experience,
        education: doctor.education,
        status: doctor.status,
        bio: doctor.bio,
        consultationFee: doctor.consultationFee
      });
      setFileList(doctor.profileImage ? [{
        uid: '-1',
        name: 'profile-image.png',
        status: 'done',
        url: doctor.profileImage,
      }] : []);
    } else {
      setEditingDoctor(null);
      form.resetFields();
      setFileList([]);
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    const profileImage = fileList.length > 0 ? fileList[0].url || fileList[0].thumbUrl : null;
    
    if (editingDoctor) {
      // Update existing doctor
      setDoctors(prevDoctors => 
        prevDoctors.map(doctor => 
          doctor.id === editingDoctor.id ? { 
            ...doctor, 
            ...values,
            profileImage 
          } : doctor
        )
      );
      message.success('Doctor updated successfully');
    } else {
      // Add new doctor
      const newDoctor = {
        key: String(doctors.length + 1),
        id: doctors.length + 1,
        ...values,
        profileImage,
        rating: 0,
        patients: 0
      };
      setDoctors([...doctors, newDoctor]);
      message.success('Doctor added successfully');
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDelete = (doctorId) => {
    setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
    message.success('Doctor deleted successfully');
  };

  const handleStatusChange = (doctorId) => {
    setDoctors(prevDoctors =>
      prevDoctors.map(doctor =>
        doctor.id === doctorId ? {
          ...doctor,
          status: doctor.status === 'active' ? 'inactive' : 'active'
        } : doctor
      )
    );
    message.success('Doctor status updated successfully');
  };

  const columns = [
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 80,
      sorter: (a, b) => a.userId - b.userId,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Doctor ID',
      dataIndex: 'id',
      key: 'doctorId',
      width: 80,
      render: (text, record) => record.id,
      sorter: (a, b) => a.id - b.id,
      sortDirections: ['descend', 'ascend'],
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
      render: (isAvailable) => (
        <Tag color={isAvailable ? 'green' : 'volcano'}>
          {isAvailable ? 'Available' : 'Unavailable'}
        </Tag>
      ),
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
      render: (_, record) => (
        <Link to={`/admin/doctors/${record.id}/schedule`}>
          <Button size="small">View Schedule</Button>
        </Link>
      ),
    },
  ];

  const uploadProps = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
    maxCount: 1,
  };

  // Only allow Mondays in DatePicker
  const disabledDate = (current) => current && current.day() !== 1;

  const handleOpenGenerate = () => {
    setGenerateModalOpen(true);
    setGenerateResult(null);
    generateForm.resetFields();
  };

  const handleGenerateSchedule = async (values) => {
    console.log('Submitting values:', values);
    setGenerateLoading(true);
    try {
      // Ensure startDate is a dayjs object
      const startDate = dayjs(values.startDate);
      const payload = {
        startDate: startDate.utc().hour(10).minute(0).second(0).millisecond(0).toISOString(),
        doctorsPerShift: values.doctorsPerShift,
      };
      console.log('Payload:', payload);
      const res = await doctorService.generateSchedule(payload);
      setGenerateResult(res.data?.data || null);
      message.success(res.data?.data?.message || 'Schedule generated successfully');
    } catch (e) {
      console.error('Error in handleGenerateSchedule:', e);
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>Doctor Management</Title>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenGenerate}>
            Generate Schedule
          </Button>
          <Button 
            type="primary" 
            icon={<UserAddOutlined />} 
            onClick={() => setIsModalOpen(true)}
          >
            Add Doctor
          </Button>
        </div>
      </div>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search by name or email"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </div>
        <Table
          columns={columns}
          dataSource={doctors}
          loading={loading}
          rowKey={record => record.id}
          pagination={{
            current: meta.page,
            pageSize: meta.limit,
            total: meta.total,
            onChange: (page, pageSize) => setMeta(m => ({ ...m, page, limit: pageSize })),
          }}
        />
      </Card>
      <Modal
        title="Add New Doctor"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
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
            <Input placeholder="Enter user ID" />
          </Form.Item>
          <Form.Item
            name="specialization"
            label="Specialization"
            rules={[{ required: true, message: 'Please enter specialization' }]}
          >
            <Input placeholder="Enter specialization" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Doctor
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Generate Doctor Schedule"
        open={generateModalOpen}
        onCancel={() => setGenerateModalOpen(false)}
        footer={null}
      >
        <Form form={generateForm} layout="vertical" onFinish={handleGenerateSchedule}>
          <Form.Item
            name="startDate"
            label="Start Date (Monday only)"
            rules={[{ required: true, message: 'Please select a start date' }]}
          >
            <DatePicker disabledDate={disabledDate} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="doctorsPerShift"
            label="Doctors Per Shift"
            rules={[{ required: true, message: 'Please enter number of doctors per shift' }]}
          >
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={generateLoading} block>
              Generate
            </Button>
          </Form.Item>
        </Form>
        {generateResult && (
          <div style={{ marginTop: 24 }}>
            <p><b>{generateResult.message}</b></p>
            <p>Total Assigned Shifts: {generateResult.totalAssignedShifts}</p>
            <p>Remaining Shifts: {generateResult.remainingShifts}</p>
            {generateResult.shiftsNeedingDoctors?.length > 0 && (
              <>
                <p>Shifts Needing Doctors:</p>
                <Table
                  columns={[
                    { title: 'Date', dataIndex: 'date', key: 'date', render: d => d?.slice(0, 10) },
                    { title: 'Day', dataIndex: 'dayOfWeek', key: 'dayOfWeek' },
                    { title: 'Shift', dataIndex: 'shift', key: 'shift' },
                    { title: 'Action', key: 'action', render: (_, record) => (
                      <Button size="small" onClick={() => handleOpenManual(record)}>
                        Manual Assign
                      </Button>
                    ) },
                  ]}
                  dataSource={generateResult.shiftsNeedingDoctors}
                  rowKey={(_, idx) => idx}
                  pagination={false}
                  size="small"
                />
              </>
            )}
          </div>
        )}
      </Modal>
      <Modal
        title="Manual Assign Shift"
        open={manualModalOpen}
        onCancel={() => setManualModalOpen(false)}
        footer={null}
      >
        <Form form={manualForm} layout="vertical" onFinish={handleManualAssign}>
          <Form.Item label="Doctors" name="doctorIds" rules={[{ required: true, message: 'Select doctors' }]}> 
            <Select
              mode="multiple"
              placeholder="Select doctors"
              optionFilterProp="children"
              showSearch
            >
              {doctors.map(doc => (
                <Option key={doc.id} value={doc.id}>{doc.user?.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Doctors Per Shift" name="doctorsPerShift" rules={[{ required: true, message: 'Enter doctors per shift' }]}> 
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={manualLoading} block>
              Assign
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Outlet />
    </div>
  );
};

export default DoctorManagement;
