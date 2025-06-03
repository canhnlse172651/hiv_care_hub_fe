import React, { useState } from 'react';
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

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const DoctorManagement = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [fileList, setFileList] = useState([]);

  // Example data - in a real app, this would come from API
  const [doctors, setDoctors] = useState([
    {
      key: '1',
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@example.com',
      specialty: 'Infectious Disease Specialist',
      experience: 12,
      education: 'MD, Stanford University',
      status: 'active',
      rating: 4.8,
      patients: 189,
      profileImage: null,
      bio: 'Dr. Johnson is a board-certified infectious disease specialist with over a decade of experience in HIV/AIDS treatment and research.',
      consultationFee: 150
    },
    {
      key: '2',
      id: 2,
      name: 'Dr. Michael Brown',
      email: 'michael.brown@example.com',
      specialty: 'General Practitioner',
      experience: 8,
      education: 'MD, UCLA School of Medicine',
      status: 'active',
      rating: 4.5,
      patients: 256,
      profileImage: null,
      bio: 'Dr. Brown specializes in providing comprehensive healthcare with a focus on HIV prevention and management.',
      consultationFee: 100
    },
    {
      key: '3',
      id: 3,
      name: 'Dr. David Lee',
      email: 'david.lee@example.com',
      specialty: 'Therapist',
      experience: 15,
      education: 'Ph.D. in Clinical Psychology, Harvard University',
      status: 'active',
      rating: 4.9,
      patients: 124,
      profileImage: null,
      bio: 'Dr. Lee provides mental health support for individuals living with HIV, focusing on coping strategies and emotional well-being.',
      consultationFee: 120
    },
    {
      key: '4',
      id: 4,
      name: 'Dr. Emily Chen',
      email: 'emily.chen@example.com',
      specialty: 'Nutritionist',
      experience: 7,
      education: 'Ph.D. in Nutrition, Johns Hopkins University',
      status: 'inactive',
      rating: 4.7,
      patients: 93,
      profileImage: null,
      bio: 'Dr. Chen specializes in nutrition planning for individuals with HIV, focusing on dietary approaches to manage symptoms and improve overall health.',
      consultationFee: 90
    },
  ]);

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

  const filteredDoctors = doctors.filter(doctor => {
    return (
      doctor.name.toLowerCase().includes(searchText.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchText.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const columns = [
    {
      title: 'Doctor',
      key: 'doctor',
      render: (_, record) => (
        <Space>
          <Avatar 
            size={40} 
            src={record.profileImage} 
            icon={<UserOutlined />} 
            style={{ backgroundColor: record.profileImage ? 'transparent' : '#1890ff' }} 
          />
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.name}</div>
            <div style={{ fontSize: '12px' }}>{record.email}</div>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Specialty',
      dataIndex: 'specialty',
      key: 'specialty',
      filters: specialties.map(specialty => ({ text: specialty, value: specialty })),
      onFilter: (value, record) => record.specialty === value,
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
      render: (years) => `${years} years`,
      sorter: (a, b) => a.experience - b.experience,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => (
        <Space>
          <Rate disabled defaultValue={rating} allowHalf style={{ fontSize: '14px' }} />
          <span>{rating}</span>
        </Space>
      ),
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: 'Patients',
      dataIndex: 'patients',
      key: 'patients',
      sorter: (a, b) => a.patients - b.patients,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'volcano'}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            type="primary"
            ghost
            onClick={() => showModal(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this doctor?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              icon={<DeleteOutlined />} 
              size="small" 
              danger
            />
          </Popconfirm>
          <Button
            icon={record.status === 'active' ? <MedicineBoxOutlined /> : <MedicineBoxOutlined />}
            size="small"
            type={record.status === 'active' ? 'default' : 'dashed'}
            onClick={() => handleStatusChange(record.id)}
          />
        </Space>
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
          onClick={() => showModal()}
        >
          Add Doctor
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search by name, email or specialty"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </div>

        <Table 
          columns={columns} 
          dataSource={filteredDoctors}
          pagination={{ pageSize: 10 }}
          rowKey="key"
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ padding: '0 20px' }}>
                <p style={{ margin: 0 }}><strong>Education:</strong> {record.education}</p>
                <p style={{ margin: '8px 0 0' }}><strong>Bio:</strong> {record.bio}</p>
                <p style={{ margin: '8px 0 0' }}><strong>Consultation Fee:</strong> ${record.consultationFee}</p>
              </div>
            ),
          }}
        />
      </Card>

      <Modal
        title={editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: '1 1 300px' }}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter doctor name' }]}
              >
                <Input placeholder="Enter full name" prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>

              <Form.Item
                name="specialty"
                label="Specialty"
                rules={[{ required: true, message: 'Please select specialty' }]}
              >
                <Select placeholder="Select specialty">
                  {specialties.map(specialty => (
                    <Option key={specialty} value={specialty}>{specialty}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="experience"
                label="Experience (years)"
                rules={[{ required: true, message: 'Please enter years of experience' }]}
              >
                <Input type="number" min={0} max={50} placeholder="Years of experience" />
              </Form.Item>
            </div>
            
            <div style={{ flex: '1 1 300px' }}>
              <Form.Item
                name="education"
                label="Education"
                rules={[{ required: true, message: 'Please enter education details' }]}
              >
                <Input placeholder="Education details" prefix={<FileTextOutlined />} />
              </Form.Item>

              <Form.Item
                name="consultationFee"
                label="Consultation Fee ($)"
                rules={[{ required: true, message: 'Please enter consultation fee' }]}
              >
                <Input type="number" min={0} placeholder="Enter fee in USD" />
              </Form.Item>

              {editingDoctor && (
                <Form.Item
                  name="status"
                  label="Status"
                  rules={[{ required: true, message: 'Please select status' }]}
                >
                  <Select placeholder="Select status">
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                  </Select>
                </Form.Item>
              )}

              <Form.Item
                label="Profile Image"
              >
                <Upload 
                  listType="picture-card" 
                  {...uploadProps}
                >
                  {fileList.length === 0 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </div>
          </div>

          <Form.Item
            name="bio"
            label="Bio"
            rules={[{ required: true, message: 'Please enter doctor bio' }]}
          >
            <TextArea rows={4} placeholder="Enter professional bio" />
          </Form.Item>

          {!editingDoctor && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter password' }]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          )}

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingDoctor ? 'Update' : 'Add'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorManagement;
