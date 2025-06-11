import React, { useState } from 'react';
import { 
  Typography, 
  Table, 
  Input, 
  Button, 
  Space, 
  Tag,
  Card,
  Drawer,
  Tabs,
  Avatar,
  Descriptions,
  Timeline,
  Form,
  message,
  Modal,
  Select,
  DatePicker,
  InputNumber
} from 'antd';
import { 
  SearchOutlined, 
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EditOutlined,
  CalendarOutlined,
  PlusOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  ClockCircleOutlined,
  CheckOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const PatientsList = () => {
  const [searchText, setSearchText] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newAppointmentModalVisible, setNewAppointmentModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [appointmentForm] = Form.useForm();
  
  // Mock data for patients
  const mockPatients = [
    {
      id: 'PT-10001',
      name: 'Nguyễn Văn A',
      phone: '0912345678',
      email: 'nguyenvana@example.com',
      gender: 'Nam',
      dateOfBirth: '1985-06-15',
      address: 'Quận 1, TP.HCM',
      registeredDate: '2023-01-10',
      status: 'active',
      lastVisit: '2024-05-25',
      medicalHistory: [
        {
          date: '2024-05-25',
          doctor: 'Dr. Sarah Johnson',
          diagnosis: 'Khám định kỳ',
          prescription: 'Thuốc ARV: TDF + 3TC + DTG',
          notes: 'Bệnh nhân ổn định'
        },
        {
          date: '2024-02-20',
          doctor: 'Dr. Sarah Johnson',
          diagnosis: 'Khám định kỳ',
          prescription: 'Thuốc ARV: TDF + 3TC + DTG',
          notes: 'Bệnh nhân ổn định'
        }
      ],
      appointments: [
        {
          id: 'AP-2024060001',
          date: '2024-06-01',
          time: '09:00 AM',
          doctor: 'Dr. Sarah Johnson',
          department: 'Khoa HIV',
          status: 'upcoming',
          reason: 'Khám định kỳ'
        },
        {
          id: 'AP-2024022001',
          date: '2024-02-20',
          time: '10:30 AM',
          doctor: 'Dr. Sarah Johnson',
          department: 'Khoa HIV',
          status: 'completed',
          reason: 'Khám định kỳ'
        }
      ]
    },
    {
      id: 'PT-10002',
      name: 'Trần Thị B',
      phone: '0923456789',
      email: 'tranthib@example.com',
      gender: 'Nữ',
      dateOfBirth: '1990-03-22',
      address: 'Quận 3, TP.HCM',
      registeredDate: '2023-03-15',
      status: 'active',
      lastVisit: '2024-05-10',
      medicalHistory: [
        {
          date: '2024-05-10',
          doctor: 'Dr. Michael Brown',
          diagnosis: 'Tư vấn sức khỏe',
          prescription: 'Thuốc ARV: ABC + 3TC + DTG',
          notes: 'Bệnh nhân ổn định'
        }
      ],
      appointments: [
        {
          id: 'AP-2024060002',
          date: '2024-06-01',
          time: '09:30 AM',
          doctor: 'Dr. Michael Brown',
          department: 'Khoa Tư vấn',
          status: 'checked-in',
          reason: 'Tư vấn điều trị'
        }
      ]
    },
    {
      id: 'PT-10003',
      name: 'Lê Văn C',
      phone: '0934567890',
      email: 'levanc@example.com',
      gender: 'Nam',
      dateOfBirth: '1978-11-05',
      address: 'Quận 7, TP.HCM',
      registeredDate: '2022-10-20',
      status: 'inactive',
      lastVisit: '2023-12-15',
      medicalHistory: [
        {
          date: '2023-12-15',
          doctor: 'Dr. Sarah Johnson',
          diagnosis: 'Khám định kỳ',
          prescription: 'Thuốc ARV: TDF + FTC + EFV',
          notes: 'Bệnh nhân cần theo dõi thêm'
        }
      ],
      appointments: []
    },
    {
      id: 'PT-10004',
      name: 'Phạm Thị D',
      phone: '0945678901',
      email: 'phamthid@example.com',
      gender: 'Nữ',
      dateOfBirth: '1992-08-17',
      address: 'Quận 2, TP.HCM',
      registeredDate: '2023-06-05',
      status: 'active',
      lastVisit: '2024-05-20',
      medicalHistory: [],
      appointments: [
        {
          id: 'AP-2024060004',
          date: '2024-06-01',
          time: '10:30 AM',
          doctor: 'Dr. David Lee',
          department: 'Khoa Tư vấn tâm lý',
          status: 'upcoming',
          reason: 'Tư vấn tâm lý'
        }
      ]
    },
    {
      id: 'PT-10005',
      name: 'Hoàng Văn E',
      phone: '0956789012',
      email: 'hoangvane@example.com',
      gender: 'Nam',
      dateOfBirth: '1988-04-30',
      address: 'Quận 5, TP.HCM',
      registeredDate: '2022-12-10',
      status: 'active',
      lastVisit: '2024-04-15',
      medicalHistory: [],
      appointments: [
        {
          id: 'AP-2024060005',
          date: '2024-06-01',
          time: '11:00 AM',
          doctor: 'Dr. Emily Chen',
          department: 'Khoa Dinh dưỡng',
          status: 'canceled',
          reason: 'Tư vấn dinh dưỡng'
        }
      ]
    }
  ];
  
  // Filter patients based on search text
  const filteredPatients = mockPatients.filter(patient => {
    return (
      patient.name.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.phone.includes(searchText) ||
      patient.id.toLowerCase().includes(searchText.toLowerCase()) ||
      (patient.email && patient.email.toLowerCase().includes(searchText.toLowerCase()))
    );
  });
  
  const getStatusTag = (status) => {
    switch (status) {
      case 'active':
        return <Tag color="green">Đang điều trị</Tag>;
      case 'inactive':
        return <Tag color="red">Không hoạt động</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };
  
  const showDrawer = (patient) => {
    setSelectedPatient(patient);
    setDrawerVisible(true);
  };
  
  const closeDrawer = () => {
    setDrawerVisible(false);
  };
  
  const showEditModal = () => {
    form.setFieldsValue({
      name: selectedPatient.name,
      phone: selectedPatient.phone,
      email: selectedPatient.email,
      address: selectedPatient.address,
      status: selectedPatient.status
    });
    setEditModalVisible(true);
  };
  
  const handleUpdatePatient = (values) => {
    // In a real app, you would update the patient info here
    console.log('Updated patient info:', values);
    message.success('Thông tin bệnh nhân đã được cập nhật');
    
    // Update selected patient with new values
    setSelectedPatient({
      ...selectedPatient,
      ...values
    });
    
    setEditModalVisible(false);
  };
  
  const showNewAppointmentModal = () => {
    appointmentForm.resetFields();
    appointmentForm.setFieldsValue({
      date: dayjs().add(1, 'day'),
      patientId: selectedPatient.id,
      patientName: selectedPatient.name
    });
    setNewAppointmentModalVisible(true);
  };
  
  const handleCreateAppointment = (values) => {
    // In a real app, you would create a new appointment here
    console.log('New appointment:', values);
    
    const newAppointment = {
      id: `AP-${dayjs().format('YYYYMMDD')}${Math.floor(Math.random() * 1000)}`,
      date: values.date.format('YYYY-MM-DD'),
      time: values.time.format('hh:mm A'),
      doctor: values.doctor,
      department: values.department,
      status: 'upcoming',
      reason: values.reason
    };
    
    // Update selected patient with new appointment
    setSelectedPatient({
      ...selectedPatient,
      appointments: [newAppointment, ...selectedPatient.appointments]
    });
    
    message.success('Đã tạo lịch hẹn mới thành công');
    setNewAppointmentModalVisible(false);
  };
  
  const columns = [
    {
      title: 'Mã BN',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Ngày đăng ký',
      key: 'registeredDate',
      render: (_, record) => dayjs(record.registeredDate).format('DD/MM/YYYY'),
      sorter: (a, b) => new Date(a.registeredDate) - new Date(b.registeredDate),
    },
    {
      title: 'Lần khám gần nhất',
      key: 'lastVisit',
      render: (_, record) => dayjs(record.lastVisit).format('DD/MM/YYYY'),
      sorter: (a, b) => new Date(a.lastVisit) - new Date(b.lastVisit),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => getStatusTag(record.status),
      filters: [
        { text: 'Đang điều trị', value: 'active' },
        { text: 'Không hoạt động', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" onClick={() => showDrawer(record)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Danh sách bệnh nhân</Title>
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm bệnh nhân mới
        </Button>
      </div>
      
      <div className="mb-6">
        <Input.Search
          placeholder="Tìm kiếm theo tên, SĐT, email, mã BN..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className="max-w-lg"
        />
      </div>
      
      <Card>
        <Table 
          columns={columns} 
          dataSource={filteredPatients}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bệnh nhân`,
          }}
        />
      </Card>
      
      {/* Patient Detail Drawer */}
      <Drawer
        title={
          <Space size="middle" className="items-center">
            <Avatar size={40} icon={<UserOutlined />} className="bg-blue-500" />
            {selectedPatient && (
              <span>
                <Text strong className="text-lg">{selectedPatient?.name}</Text>
                <Text type="secondary" className="ml-2">({selectedPatient?.id})</Text>
              </span>
            )}
          </Space>
        }
        width={700}
        placement="right"
        onClose={closeDrawer}
        open={drawerVisible}
        extra={
          selectedPatient && (
            <Space>
              <Button icon={<EditOutlined />} onClick={showEditModal}>
                Chỉnh sửa
              </Button>
              <Button 
                type="primary" 
                icon={<CalendarOutlined />}
                onClick={showNewAppointmentModal}
              >
                Đặt lịch hẹn
              </Button>
            </Space>
          )
        }
      >
        {selectedPatient && (
          <Tabs defaultActiveKey="info">
            <TabPane 
              tab={<span><UserOutlined />Thông tin</span>}
              key="info"
            >
              <Descriptions bordered column={1} className="mb-6">
                <Descriptions.Item label="Họ và tên">{selectedPatient.name}</Descriptions.Item>
                <Descriptions.Item label="Giới tính">{selectedPatient.gender}</Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">
                  {dayjs(selectedPatient.dateOfBirth).format('DD/MM/YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{selectedPatient.phone}</Descriptions.Item>
                <Descriptions.Item label="Email">{selectedPatient.email}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">{selectedPatient.address}</Descriptions.Item>
                <Descriptions.Item label="Ngày đăng ký">
                  {dayjs(selectedPatient.registeredDate).format('DD/MM/YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  {getStatusTag(selectedPatient.status)}
                </Descriptions.Item>
              </Descriptions>
            </TabPane>
            
            <TabPane 
              tab={<span><CalendarOutlined />Lịch hẹn</span>}
              key="appointments"
            >
              <div className="mb-4 flex justify-between items-center">
                <Title level={5}>Lịch sử & lịch hẹn</Title>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={showNewAppointmentModal}
                >
                  Đặt lịch hẹn
                </Button>
              </div>
              
              {selectedPatient.appointments.length === 0 ? (
                <div className="text-center p-8 bg-gray-50">
                  <Text type="secondary">Bệnh nhân chưa có lịch hẹn nào</Text>
                </div>
              ) : (
                <Timeline mode="left">
                  {selectedPatient.appointments.map((appointment) => (
                    <Timeline.Item 
                      key={appointment.id}
                      dot={
                        appointment.status === 'upcoming' ? 
                          <ClockCircleOutlined className="text-blue-500" /> : 
                          appointment.status === 'checked-in' ?
                          <UserOutlined className="text-orange-500" /> :
                          appointment.status === 'completed' ?
                          <CheckOutlined className="text-green-500" /> :
                          <ClockCircleOutlined className="text-red-500" />
                      }
                      label={dayjs(appointment.date).format('DD/MM/YYYY')}
                    >
                      <Card size="small">
                        <p><strong>{appointment.time}</strong> - {appointment.doctor}</p>
                        <p>{appointment.department}</p>
                        <p>Lý do: {appointment.reason}</p>
                        <Tag color={
                          appointment.status === 'upcoming' ? 'blue' : 
                          appointment.status === 'checked-in' ? 'orange' :
                          appointment.status === 'completed' ? 'green' : 'red'
                        }>
                          {appointment.status === 'upcoming' ? 'Sắp tới' : 
                           appointment.status === 'checked-in' ? 'Đã check-in' : 
                           appointment.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                        </Tag>
                      </Card>
                    </Timeline.Item>
                  ))}
                </Timeline>
              )}
            </TabPane>
            
            <TabPane 
              tab={<span><FileTextOutlined />Hồ sơ bệnh án</span>}
              key="medical"
            >
              <div className="mb-4">
                <Title level={5}>Lịch sử khám bệnh</Title>
              </div>
              
              {selectedPatient.medicalHistory.length === 0 ? (
                <div className="text-center p-8 bg-gray-50">
                  <Text type="secondary">Bệnh nhân chưa có hồ sơ bệnh án</Text>
                </div>
              ) : (
                <Timeline mode="left">
                  {selectedPatient.medicalHistory.map((record, index) => (
                    <Timeline.Item 
                      key={index}
                      dot={<MedicineBoxOutlined className="text-blue-500" />}
                      label={dayjs(record.date).format('DD/MM/YYYY')}
                    >
                      <Card size="small">
                        <p><strong>Bác sĩ:</strong> {record.doctor}</p>
                        <p><strong>Chẩn đoán:</strong> {record.diagnosis}</p>
                        <p><strong>Thuốc:</strong> {record.prescription}</p>
                        <p><strong>Ghi chú:</strong> {record.notes}</p>
                      </Card>
                    </Timeline.Item>
                  ))}
                </Timeline>
              )}
            </TabPane>
          </Tabs>
        )}
      </Drawer>
      
      {/* Edit Patient Modal */}
      <Modal
        title="Cập nhật thông tin bệnh nhân"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdatePatient}
        >
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          
          <Form.Item
            name="address"
            label="Địa chỉ"
          >
            <Input placeholder="Địa chỉ" />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Trạng thái"
          >
            <Select>
              <Option value="active">Đang điều trị</Option>
              <Option value="inactive">Không hoạt động</Option>
            </Select>
          </Form.Item>
          
          <Form.Item className="mb-0 text-right">
            <Button type="default" className="mr-2" onClick={() => setEditModalVisible(false)}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* New Appointment Modal */}
      <Modal
        title="Đặt lịch hẹn mới"
        open={newAppointmentModalVisible}
        onCancel={() => setNewAppointmentModalVisible(false)}
        footer={null}
      >
        <Form
          form={appointmentForm}
          layout="vertical"
          onFinish={handleCreateAppointment}
        >
          <Form.Item
            name="patientName"
            label="Bệnh nhân"
          >
            <Input disabled />
          </Form.Item>
          
          <Form.Item
            name="patientId"
            label="Mã bệnh nhân"
          >
            <Input disabled />
          </Form.Item>
          
          <Form.Item
            name="date"
            label="Ngày hẹn"
            rules={[{ required: true, message: 'Vui lòng chọn ngày hẹn!' }]}
          >
            <DatePicker 
              format="DD/MM/YYYY" 
              disabledDate={(current) => {
                // Can't select days before today
                return current && current < dayjs().startOf('day');
              }}
              className="w-full"
            />
          </Form.Item>
          
          <Form.Item
            name="time"
            label="Giờ hẹn"
            rules={[{ required: true, message: 'Vui lòng chọn giờ hẹn!' }]}
          >
            <DatePicker.TimePicker 
              format="HH:mm" 
              minuteStep={15}
              className="w-full"
            />
          </Form.Item>
          
          <Form.Item
            name="doctor"
            label="Bác sĩ"
            rules={[{ required: true, message: 'Vui lòng chọn bác sĩ!' }]}
          >
            <Select placeholder="Chọn bác sĩ">
              <Option value="Dr. Sarah Johnson">Dr. Sarah Johnson</Option>
              <Option value="Dr. Michael Brown">Dr. Michael Brown</Option>
              <Option value="Dr. David Lee">Dr. David Lee</Option>
              <Option value="Dr. Emily Chen">Dr. Emily Chen</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="department"
            label="Khoa phòng"
            rules={[{ required: true, message: 'Vui lòng chọn khoa phòng!' }]}
          >
            <Select placeholder="Chọn khoa phòng">
              <Option value="Khoa HIV">Khoa HIV</Option>
              <Option value="Khoa Tư vấn">Khoa Tư vấn</Option>
              <Option value="Khoa Tư vấn tâm lý">Khoa Tư vấn tâm lý</Option>
              <Option value="Khoa Dinh dưỡng">Khoa Dinh dưỡng</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="reason"
            label="Lý do khám"
            rules={[{ required: true, message: 'Vui lòng nhập lý do khám!' }]}
          >
            <Input.TextArea rows={3} placeholder="Nhập lý do khám..." />
          </Form.Item>
          
          <Form.Item className="mb-0 text-right">
            <Button type="default" className="mr-2" onClick={() => setNewAppointmentModalVisible(false)}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Tạo lịch hẹn
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PatientsList;
