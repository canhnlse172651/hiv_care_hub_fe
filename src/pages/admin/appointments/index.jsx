import React, { useState } from 'react';
import { 
  Button, 
  Space, 
  Typography, 
  Tag,
  Modal,
  Select,
  message,
  DatePicker,
  Badge,
  Input
} from 'antd';
import { 
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import AdminTable, { StatusTag, ActionButtons, ActionTypes } from '@/components/AdminTable';
import AdminModal from '@/components/AdminModal';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const AppointmentList = () => {
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
    // Filter by date range if selected
    if (dateRange && dateRange[0] && dateRange[1]) {
      const appointmentDate = dayjs(appointment.date);
      const startDate = dateRange[0];
      const endDate = dateRange[1];
      
      return appointmentDate.isAfter(startDate) && appointmentDate.isBefore(endDate);
    }
    
    return true;
  });

  const columns = [
    {
      title: 'Patient',
      dataIndex: 'patientName',
      key: 'patientName',
      sorter: true,
    },
    {
      title: 'Doctor',
      dataIndex: 'doctorName',
      key: 'doctorName',
      sorter: true,
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
      sorter: true,
      render: (text) => dayjs(text).format('MMM DD, YYYY'),
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
      render: (status) => <StatusTag status={status} type="appointment" />,
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
      width: 200,
      render: (_, record) => (
        <ActionButtons
          record={record}
          actions={[
            {
              ...ActionTypes.VIEW,
              onClick: showAppointmentDetails,
            },
            ...(record.status === 'pending' ? [
              {
                type: 'confirm',
                icon: <CheckOutlined />,
                onClick: () => handleStatusChange(record.id, 'confirmed'),
                tooltip: 'Confirm Appointment',
                confirm: true,
                confirmTitle: 'Confirm this appointment?',
              },
              {
                type: 'cancel',
                icon: <CloseOutlined />,
                onClick: () => handleStatusChange(record.id, 'cancelled'),
                tooltip: 'Cancel Appointment',
                danger: true,
                confirm: true,
                confirmTitle: 'Cancel this appointment?',
              },
            ] : []),
            ...(record.status === 'confirmed' ? [
              {
                type: 'complete',
                icon: <CheckOutlined />,
                onClick: () => handleStatusChange(record.id, 'completed'),
                tooltip: 'Mark as Completed',
                confirm: true,
                confirmTitle: 'Mark as completed?',
              },
            ] : []),
          ]}
        />
      ),
    },
  ];

  const extraActions = (
    <RangePicker
      onChange={setDateRange}
      className="w-64"
      placeholder={['Start date', 'End date']}
    />
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminTable
        title="Appointment Management"
        columns={columns}
        dataSource={filteredAppointments}
        loading={false}
        pagination={{ pageSize: 10 }}
        onTableChange={() => {}}
        searchPlaceholder="Search by patient, doctor, or reason"
        searchValue=""
        onSearchChange={() => {}}
        onRefresh={() => {}}
        extraActions={extraActions}
        rowKey="key"
        showSearch={false}
      />

      {/* Appointment Details Modal */}
      <AdminModal
        title="Appointment Details"
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleCancel}
        showFooter={false}
        width={700}
      >
        {currentAppointment && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Patient Information</h3>
                <p><strong>Name:</strong> {currentAppointment.patientName}</p>
                <p><strong>Email:</strong> {currentAppointment.patientEmail}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Doctor Information</h3>
                <p><strong>Name:</strong> {currentAppointment.doctorName}</p>
                <p><strong>Specialty:</strong> {currentAppointment.doctorSpecialty}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Appointment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p><strong>Date:</strong> {dayjs(currentAppointment.date).format('MMMM DD, YYYY')}</p>
                  <p><strong>Time:</strong> {currentAppointment.time}</p>
                </div>
                <div>
                  <p>
                    <strong>Status:</strong>{' '}
                    <StatusTag status={currentAppointment.status} type="appointment" />
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Reason for Visit</h3>
              <p>{currentAppointment.reason}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Notes</h3>
              <TextArea
                rows={4}
                defaultValue={currentAppointment.notes}
                onChange={(e) => setCurrentAppointment({...currentAppointment, notes: e.target.value})}
                className="mb-3"
              />
              <div className="flex justify-end">
                <Button 
                  type="primary" 
                  onClick={() => handleSaveNotes(currentAppointment.notes)}
                >
                  Save Notes
                </Button>
              </div>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
};

export default AppointmentList;
