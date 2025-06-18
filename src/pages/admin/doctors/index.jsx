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
  Rate
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>Doctor Management</Title>
        <Button 
          type="primary" 
          icon={<UserAddOutlined />} 
          onClick={() => setIsModalOpen(true)}
        >
          Add Doctor
        </Button>
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
        {/* Remove debug log from render */}
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
    </div>
  );
};

export default DoctorManagement;
