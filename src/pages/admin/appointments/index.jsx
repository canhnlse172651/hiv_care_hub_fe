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
  Select,
  Popconfirm,
  message,
  DatePicker,
  Badge
} from 'antd';
import { 
  SearchOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const AppointmentList = () => {
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);

  // Example data - in a real app, this would come from API
  const [appointments, setAppointments] = useState([
    {
      key: '1',
      id: 1,
      patientName: 'John Doe',
      patientEmail: 'john.doe@example.com',
      doctorName: 'Dr. Sarah Johnson',
      doctorSpecialty: 'Infectious Disease Specialist',
      date: '2025-06-10',
      time: '09:00 AM',
      status: 'pending',
      reason: 'Regular checkup and medication review',
      notes: '',
    },
    {
      key: '2',
      id: 2,
      patientName: 'Jane Smith',
      patientEmail: 'jane.smith@example.com',
      doctorName: 'Dr. Michael Brown',
      doctorSpecialty: 'General Practitioner',
      date: '2025-06-08',
      time: '11:30 AM',
      status: 'confirmed',
      reason: 'Follow-up after treatment',
      notes: 'Patient reported improved symptoms in last visit',
    },
    {
      key: '3',
      id: 3,
      patientName: 'Robert Johnson',
      patientEmail: 'robert@example.com',
      doctorName: 'Dr. Sarah Johnson',
      doctorSpecialty: 'Infectious Disease Specialist',
      date: '2025-06-05',
      time: '02:15 PM',
      status: 'completed',
      reason: 'Medication side effects consultation',
      notes: 'Adjusted medication dosage',
    },
    {
      key: '4',
      id: 4,
      patientName: 'Emily Wilson',
      patientEmail: 'emily@example.com',
      doctorName: 'Dr. David Lee',
      doctorSpecialty: 'Therapist',
      date: '2025-06-12',
      time: '10:45 AM',
      status: 'cancelled',
      reason: 'Mental health support',
      notes: 'Cancelled by patient',
    },
  ]);

  const showAppointmentDetails = (record) => {
    setCurrentAppointment(record);
    setIsModalVisible(true);
  };

  const handleStatusChange = (appointmentId, newStatus) => {
    setAppointments(prevAppointments =>
      prevAppointments.map(appointment =>
        appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment
      )
    );
    message.success(`Appointment status updated to ${newStatus}`);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSaveNotes = (notes) => {
    if (currentAppointment) {
      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment.id === currentAppointment.id ? { ...appointment, notes } : appointment
        )
      );
      message.success('Appointment notes updated');
      setIsModalVisible(false);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    let matchesSearch = 
      appointment.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchText.toLowerCase()) ||
      appointment.patientEmail.toLowerCase().includes(searchText.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchText.toLowerCase());
    
    // Filter by date range if selected
    if (dateRange && dateRange[0] && dateRange[1]) {
      const appointmentDate = dayjs(appointment.date);
      const startDate = dateRange[0];
      const endDate = dateRange[1];
      
      return matchesSearch && appointmentDate.isAfter(startDate) && appointmentDate.isBefore(endDate);
    }
    
    return matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'confirmed':
        return 'blue';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Patient',
      dataIndex: 'patientName',
      key: 'patientName',
      sorter: (a, b) => a.patientName.localeCompare(b.patientName),
    },
    {
      title: 'Doctor',
      dataIndex: 'doctorName',
      key: 'doctorName',
      sorter: (a, b) => a.doctorName.localeCompare(b.doctorName),
    },
    {
      title: 'Specialty',
      dataIndex: 'doctorSpecialty',
      key: 'doctorSpecialty',
      filters: [
        { text: 'Infectious Disease Specialist', value: 'Infectious Disease Specialist' },
        { text: 'General Practitioner', value: 'General Practitioner' },
        { text: 'Therapist', value: 'Therapist' },
      ],
      onFilter: (value, record) => record.doctorSpecialty === value,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (text) => {
        return dayjs(text).format('MMM DD, YYYY');
      }
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Confirmed', value: 'confirmed' },
        { text: 'Completed', value: 'completed' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => showAppointmentDetails(record)}
          />
          {record.status === 'pending' && (
            <>
              <Popconfirm
                title="Confirm this appointment?"
                onConfirm={() => handleStatusChange(record.id, 'confirmed')}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  icon={<CheckOutlined />}
                  size="small"
                  type="primary"
                />
              </Popconfirm>
              <Popconfirm
                title="Cancel this appointment?"
                onConfirm={() => handleStatusChange(record.id, 'cancelled')}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  icon={<CloseOutlined />}
                  size="small"
                  danger
                />
              </Popconfirm>
            </>
          )}
          {record.status === 'confirmed' && (
            <Popconfirm
              title="Mark as completed?"
              onConfirm={() => handleStatusChange(record.id, 'completed')}
              okText="Yes"
              cancelText="No"
            >
              <Button
                icon={<CheckOutlined />}
                size="small"
                type="primary"
                style={{ backgroundColor: '#52c41a' }}
              />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>Appointment Management</Title>
      </div>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Input
            placeholder="Search by patient, doctor, or reason"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          
          <RangePicker
            onChange={setDateRange}
            style={{ width: 300 }}
            placeholder={['Start date', 'End date']}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Space>
            <Badge color={getStatusColor('pending')} text="Pending" />
            <Badge color={getStatusColor('confirmed')} text="Confirmed" />
            <Badge color={getStatusColor('completed')} text="Completed" />
            <Badge color={getStatusColor('cancelled')} text="Cancelled" />
          </Space>
        </div>

        <Table 
          columns={columns} 
          dataSource={filteredAppointments}
          pagination={{ pageSize: 10 }}
          rowKey="key"
        />
      </Card>

      <Modal
        title="Appointment Details"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {currentAppointment && (
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <div style={{ flex: '1 1 300px' }}>
                <h3>Patient Information</h3>
                <p><strong>Name:</strong> {currentAppointment.patientName}</p>
                <p><strong>Email:</strong> {currentAppointment.patientEmail}</p>
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <h3>Doctor Information</h3>
                <p><strong>Name:</strong> {currentAppointment.doctorName}</p>
                <p><strong>Specialty:</strong> {currentAppointment.doctorSpecialty}</p>
              </div>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <h3>Appointment Details</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ flex: '1 1 200px' }}>
                  <p><strong>Date:</strong> {dayjs(currentAppointment.date).format('MMMM DD, YYYY')}</p>
                  <p><strong>Time:</strong> {currentAppointment.time}</p>
                </div>
                <div style={{ flex: '1 1 200px' }}>
                  <p>
                    <strong>Status:</strong>{' '}
                    <Tag color={getStatusColor(currentAppointment.status)}>
                      {currentAppointment.status.toUpperCase()}
                    </Tag>
                  </p>
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <h3>Reason for Visit</h3>
              <p>{currentAppointment.reason}</p>
            </div>
            
            <div>
              <h3>Notes</h3>
              <Input.TextArea
                rows={4}
                defaultValue={currentAppointment.notes}
                onChange={(e) => setCurrentAppointment({...currentAppointment, notes: e.target.value})}
              />
              <Button 
                type="primary" 
                style={{ marginTop: '8px' }}
                onClick={() => handleSaveNotes(currentAppointment.notes)}
              >
                Save Notes
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AppointmentList;
