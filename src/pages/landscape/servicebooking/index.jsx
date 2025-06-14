import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { 
  Col, Row, Modal, Form, Input, Typography, Select, message,
  Card, Steps, Button, Divider, Alert, Skeleton, Radio
} from 'antd'
import { 
  CalendarOutlined, UserAddOutlined, MedicineBoxOutlined, 
  CheckCircleOutlined, ClockCircleOutlined, UserOutlined,
  PhoneOutlined, MailOutlined, InfoCircleOutlined,
  RightOutlined, LoadingOutlined, ArrowLeftOutlined
} from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { handleShowModal } from '@/store/Reducer/authReducer'
import { MODAL_TYPE } from '@/constant/general'
import { localToken } from '@/utils/token'
import './servicebooking.css'

const { Title, Paragraph, Text } = Typography
const { Step } = Steps;

// Mock data
const services = [
  { id: 1, name: 'Thăm khám bệnh' },
  { id: 2, name: 'Tư vấn và xét nghiệm HIV' },
  { id: 3, name: 'Tư vấn và điều trị ARV' },
  { id: 4, name: 'Tầm soát các bệnh lây truyền qua đường tình dục' },
  { id: 5, name: 'Đăng ký tư vấn sử dụng thuốc ngừa HIV trước khi tiếp xúc' },
  { id: 6, name: 'Đăng ký tư vấn sử dụng thuốc ngừa HIV sau khi tiếp xúc' },
  { id: 7, name: 'Xét nghiệm tầm soát ung thư' },
  { id: 8, name: 'Xét nghiệm ký sinh trùng' }
]
// Doctor
const doctors = [
  {
    id: 1,
    name: 'Bác sĩ A',
    userId: 101,
    servicIds: [1, 2, 3, 4], // Thăm khám bệnh, Tư vấn và xét nghiệm HIV, Tư vấn và điều trị ARV, Tầm soát các bệnh lây truyền qua đường tình dục
    specialization: 'Nội tổng quát',
    certifications: 'Bác sĩ CKI',
    workingHours: [
      { day: 'Monday', start: '08:00', end: '12:00' },
      { day: 'Monday', start: '13:00', end: '17:00' }
    ],
    isAvailable: true,
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-06-01T08:00:00Z'
  },
  {
    id: 2,
    name: 'Bác sĩ B',
    userId: 102,
    servicIds: [2, 5, 6], // Tư vấn và xét nghiệm HIV, Đăng ký tư vấn sử dụng thuốc ngừa HIV trước/sau khi tiếp xúc
    specialization: 'Nam khoa',
    certifications: 'Bác sĩ CKII',
    workingHours: [
      { day: 'Tuesday', start: '08:00', end: '12:00' }
    ],
    isAvailable: true,
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-06-01T08:00:00Z'
  },
  {
    id: 3,
    name: 'Bác sĩ C',
    userId: 103,
    servicIds: [7, 8, 4], // Xét nghiệm tầm soát ung thư, Xét nghiệm ký sinh trùng, Tầm soát các bệnh lây truyền qua đường tình dục
    specialization: 'Xét nghiệm',
    certifications: 'Bác sĩ CKI',
    workingHours: [
      { day: 'Wednesday', start: '08:00', end: '12:00' }
    ],
    isAvailable: true,
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-06-01T08:00:00Z'
  }
]
// DoctorSchedule
const doctorSchedules = [
  {
    id: 1,
    doctorId: 1,
    date: '2025-06-12T08:00:00',
    isOff: false,
    shift: 'morning',
    createdAt: '2025-06-01T08:00:00Z',
    updatedAt: '2025-06-01T08:00:00Z'
  },
  {
    id: 2,
    doctorId: 1,
    date: '2025-06-12T13:00:00',
    isOff: false,
    shift: 'afternoon',
    createdAt: '2025-06-01T08:00:00Z',
    updatedAt: '2025-06-01T08:00:00Z'
  },
  // Thêm ca mới cho bác sĩ A ngày khác
  {
    id: 4,
    doctorId: 1,
    date: '2025-06-13T08:00:00',
    isOff: false,
    shift: 'morning',
    createdAt: '2025-06-01T08:00:00Z',
    updatedAt: '2025-06-01T08:00:00Z'
  },
  {
    id: 5,
    doctorId: 1,
    date: '2025-06-13T13:00:00',
    isOff: false,
    shift: 'afternoon',
    createdAt: '2025-06-01T08:00:00Z',
    updatedAt: '2025-06-01T08:00:00Z'
  },
  // Thêm ca cho bác sĩ B
  {
    id: 3,
    doctorId: 2,
    date: '2025-06-13T08:00:00',
    isOff: false,
    shift: 'morning',
    createdAt: '2025-06-01T08:00:00Z',
    updatedAt: '2025-06-01T08:00:00Z'
  },
  {
    id: 6,
    doctorId: 2,
    date: '2025-06-14T08:00:00',
    isOff: false,
    shift: 'morning',
    createdAt: '2025-06-01T08:00:00Z',
    updatedAt: '2025-06-01T08:00:00Z'
  },
  {
    id: 7,
    doctorId: 2,
    date: '2025-06-14T13:00:00',
    isOff: false,
    shift: 'afternoon',
    createdAt: '2025-06-01T08:00:00Z',
    updatedAt: '2025-06-01T08:00:00Z'
  },
  {
    id: 8,
    doctorId: 3,
    date: '2025-06-15T08:00:00',
    isOff: false,
    shift: 'morning',
    createdAt: '2025-06-01T08:00:00Z',
    updatedAt: '2025-06-01T08:00:00Z'
  },
  {
    id: 9,
    doctorId: 3,
    date: '2025-06-15T13:00:00',
    isOff: false,
    shift: 'afternoon',
    createdAt: '2025-06-01T08:00:00Z',
    updatedAt: '2025-06-01T08:00:00Z'
  },
  {
    id: 10,
    doctorId: 3,
    date: '2025-06-16T08:00:00',
    isOff: false,
    shift: 'morning',
    createdAt: '2025-06-01T08:00:00Z',
    updatedAt: '2025-06-01T08:00:00Z'
  },
  {
    id: 11,
    doctorId: 3,
    date: '2025-06-16T13:00:00',
    isOff: false,
    shift: 'afternoon',
    createdAt: '2025-06-01T08:00:00Z',
    updatedAt: '2025-06-01T08:00:00Z'
  }
]
// Appointment
const appointmentsInit = [
  {
    id: 1,
    userId: 201,
    doctorId: 1,
    servicId: 1,
    appointmentTime: '2025-06-12T08:00:00',
    isAnonymous: false,
    status: true,
    notes: 'Khám sức khỏe tổng quát',
    createdAt: '2025-06-01T09:00:00Z',
    updatedAt: '2025-06-01T09:00:00Z'
  },
  {
    id: 2,
    userId: 202,
    doctorId: 2,
    servicId: 2,
    appointmentTime: '2025-06-13T08:00:00',
    isAnonymous: false,
    status: true,
    notes: 'Tư vấn và xét nghiệm HIV',
    createdAt: '2025-06-01T10:00:00Z',
    updatedAt: '2025-06-01T10:00:00Z'
  }
]

const ServiceBooking = () => {
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [events, setEvents] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [form] = Form.useForm()
  const [appointments, setAppointments] = useState(appointmentsInit)
  const [viewAppointment, setViewAppointment] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    phone: '',
    email: '',
    anonymous: false
  })
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check for authentication
  useEffect(() => {
    const authToken = localToken.get()?.accessToken;
    if (!authToken) {
      // Show login modal if not authenticated
      dispatch(handleShowModal(MODAL_TYPE.login));
    } else {
      setIsAuthenticated(true);
    }
  }, [dispatch]);
  
  // Lọc bác sĩ theo dịch vụ
  const filteredDoctors = selectedService
    ? doctors.filter(d => d.servicIds.includes(selectedService))
    : []

  // Khi chọn bác sĩ, load lịch làm việc và lịch hẹn
  React.useEffect(() => {
    if (!selectedDoctor) {
      setEvents([])
      return
    }
    const schedules = doctorSchedules
      .filter(s => s.doctorId === selectedDoctor && !s.isOff)
      .map(s => {
        const app = appointments.find(a =>
          a.doctorId === selectedDoctor &&
          new Date(a.appointmentTime).getTime() === new Date(s.date).getTime()
        )
        const shiftLabel = s.shift === 'morning' ? 'Ca sáng' : 'Ca chiều'
        return {
          id: `schedule-${s.id}`,
          title: app ? `${shiftLabel} (đã đặt lịch)` : shiftLabel,
          start: s.date,
          end: s.shift === 'morning'
            ? new Date(new Date(s.date).setHours(12, 0, 0)).toISOString()
            : new Date(new Date(s.date).setHours(17, 0, 0)).toISOString(),
          backgroundColor: app ? '#ffccbc' : '#b3e5fc'
        }
      })
    setEvents(schedules)
  }, [selectedDoctor, appointments])

  const handleEventClick = (info) => {
    // Kiểm tra nếu là ca đã đặt lịch (title có chứa '(đã đặt lịch)')
    if (info.event.title.includes('(đã đặt lịch)')) {
      const app = appointments.find(a =>
        a.doctorId === selectedDoctor &&
        new Date(a.appointmentTime).getTime() === new Date(info.event.startStr).getTime()
      )
      setViewAppointment(app)
    } else {
      setSelectedSlot({
        startStr: info.event.startStr,
        endStr: info.event.endStr,
        scheduleId: info.event.id
      })
      setModalOpen(true)
    }
  }

  const handleNextStep = () => {
    if (currentStep === 0 && !selectedService) {
      message.error('Vui lòng chọn dịch vụ');
      return;
    }
    if (currentStep === 1 && !selectedDoctor) {
      message.error('Vui lòng chọn bác sĩ');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const newApp = {
          id: appointments.length + 1,
          userId: 999,
          doctorId: selectedDoctor,
          servicId: selectedService,
          appointmentTime: selectedSlot.startStr,
          appointmentEndTime: selectedSlot.endStr,
          patientName: values.name || 'Khách hàng',
          phoneNumber: values.phone,
          email: values.email,
          isAnonymous: values.anonymous || false,
          status: true,
          notes: values.reason,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setAppointments(prev => [...prev, newApp])
        setModalOpen(false)
        form.resetFields()
        message.success('Đặt lịch thành công!')
        setLoading(false);
      }, 1500);
    });
  };

  const renderEventContent = (eventInfo) => (
    <div className="fc-event-content-wrapper">
      <div className="fc-event-time-icon">
        <ClockCircleOutlined className="event-icon" />
        <span className="event-time">{new Date(eventInfo.event.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
      </div>
      <div className="fc-event-title-container">
        <b>{eventInfo.event.title}</b>
      </div>
    </div>
  );

  // Service selection component
  const ServiceSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map(service => (
        <Card 
          key={service.id}
          hoverable
          className={`service-card transition-all duration-200 ${selectedService === service.id ? 'service-card-active border-blue-500 bg-blue-50' : ''}`}
          onClick={() => setSelectedService(service.id)}
        >
          <div className="flex items-center">
            <div className={`service-icon-wrapper ${selectedService === service.id ? 'bg-blue-500' : 'bg-gray-200'}`}>
              <MedicineBoxOutlined className="text-xl" />
            </div>
            <div className="ml-4">
              <Title level={5} className="m-0">{service.name}</Title>
            </div>
          </div>
          {selectedService === service.id && (
            <div className="mt-3 text-right">
              <Button type="primary" size="small" onClick={handleNextStep}>
                Tiếp tục <RightOutlined />
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );

  // Doctor selection component
  const DoctorSelection = () => (
    <>
      {!filteredDoctors.length && (
        <Alert
          message="Không tìm thấy bác sĩ phù hợp"
          description="Hiện không có bác sĩ nào cho dịch vụ này. Vui lòng chọn dịch vụ khác."
          type="info"
          showIcon
          className="mb-6"
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDoctors.map(doctor => (
          <Card 
            key={doctor.id}
            hoverable
            className={`doctor-card ${selectedDoctor === doctor.id ? 'doctor-card-active border-blue-500' : ''}`}
            onClick={() => setSelectedDoctor(doctor.id)}
          >
            <div className="flex items-start">
              <div className="doctor-avatar">
                <UserOutlined className="text-3xl" />
              </div>
              <div className="ml-4 flex-1">
                <Title level={5} className="m-0 font-bold">{doctor.name}</Title>
                <Text type="secondary" className="block mb-2">{doctor.specialization}</Text>
                <div className="doctor-badge-wrapper">
                  <div className="doctor-badge">{doctor.certifications}</div>
                </div>
              </div>
            </div>
            {selectedDoctor === doctor.id && (
              <div className="mt-3 text-right">
                <Button type="primary" size="small" onClick={handleNextStep}>
                  Chọn lịch <RightOutlined />
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </>
  );

  const handleGoBack = () => {
    navigate(-1); // Navigate to previous page
  };

  // If not authenticated, show minimal content
  if (!isAuthenticated) {
    return (
      <div className="booking-container bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[60vh] flex items-center justify-center">
          <Card className="text-center max-w-md w-full shadow-lg">
            <MedicineBoxOutlined className="text-5xl text-blue-500 mb-4" />
            <Title level={3}>Đặt lịch khám</Title>
            <Paragraph className="mb-6">
              Vui lòng đăng nhập để sử dụng dịch vụ đặt lịch khám
            </Paragraph>
            <Button 
              type="primary" 
              size="large"
              onClick={() => dispatch(handleShowModal(MODAL_TYPE.login))}
            >
              Đăng nhập
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-container bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Button 
          onClick={handleGoBack} 
          className="back-button mb-6"
          icon={<ArrowLeftOutlined />}
        >
          Quay lại
        </Button>
        
        <Row gutter={[24, 32]}>
          <Col span={24}>
            <Title level={2} className="text-center text-blue-800 mb-2 flex items-center justify-center">
              <MedicineBoxOutlined className="mr-2 text-blue-600" /> 
              <span>Đặt Lịch Khám Và Tư Vấn</span>
            </Title>
            <Paragraph className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Đặt lịch trực tuyến giúp tiết kiệm thời gian chờ đợi và được tư vấn bởi các chuyên gia y tế chất lượng cao
            </Paragraph>
            
            <Card className="booking-steps-card shadow-lg border-0">
              <Steps current={currentStep} className="mb-8 custom-steps">
                <Step title="Chọn dịch vụ" icon={<MedicineBoxOutlined />} />
                <Step title="Chọn bác sĩ" icon={<UserOutlined />} />
                <Step title="Chọn lịch khám" icon={<CalendarOutlined />} />
              </Steps>
              
              {currentStep === 0 && <ServiceSelection />}
              
              {currentStep === 1 && <DoctorSelection />}
              
              {currentStep === 2 && (
                <div className="calendar-step-container">
                  <Alert
                    message="Hướng dẫn"
                    description="Nhấp vào các ô lịch màu xanh để đặt lịch khám. Những ô màu cam đã có người đặt trước."
                    type="info"
                    showIcon
                    className="mb-6"
                  />
                  <div className="calendar-wrapper">
                    <FullCalendar
                      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                      initialView="timeGridWeek"
                      eventClick={handleEventClick}
                      events={events}
                      eventContent={renderEventContent}
                      height={600}
                      locale="vi"
                      slotMinTime="08:00:00"
                      slotMaxTime="17:00:00"
                      headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'timeGridWeek,timeGridDay'
                      }}
                      allDaySlot={false}
                      slotLabelFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      }}
                    />
                  </div>
                </div>
              )}
              
              <div className="steps-action mt-8 flex justify-between">
                {currentStep > 0 && (
                  <Button onClick={handlePrevStep} className="back-step-button">
                    <ArrowLeftOutlined /> Quay lại
                  </Button>
                )}
                {currentStep === 0 && (
                  <Button type="primary" onClick={handleNextStep} disabled={!selectedService}>
                    Tiếp tục <RightOutlined />
                  </Button>
                )}
                {currentStep === 1 && (
                  <Button type="primary" onClick={handleNextStep} disabled={!selectedDoctor}>
                    Xem lịch khám <RightOutlined />
                  </Button>
                )}
                {currentStep === 2 && (
                  <div></div>
                )}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Booking Modal with Enhanced Form */}
        <Modal
          title={
            <div className="modal-title">
              <span className="modal-icon"><CalendarOutlined /></span>
              <span>Đặt lịch khám</span>
            </div>
          }
          open={modalOpen}
          onOk={handleOk}
          onCancel={() => {
            setModalOpen(false)
            form.resetFields()
          }}
          okText="Đặt lịch"
          cancelText="Hủy"
          centered
          okButtonProps={{ loading: loading }}
          bodyStyle={{ paddingTop: 24 }}
          className="booking-modal"
        >
          <div className="appointment-info mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-2">
              <MedicineBoxOutlined className="text-blue-600 mr-2" />
              <Text strong>
                {selectedService && services.find(s => s.id === selectedService)?.name}
              </Text>
            </div>
            <div className="flex items-center mb-2">
              <UserOutlined className="text-blue-600 mr-2" />
              <Text strong>
                {selectedDoctor && doctors.find(d => d.id === selectedDoctor)?.name}
              </Text>
            </div>
            {selectedSlot && (
              <div className="flex items-center">
                <ClockCircleOutlined className="text-blue-600 mr-2" />
                <Text strong>
                  {new Date(selectedSlot.startStr).toLocaleString([], {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </div>
            )}
          </div>
          
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Họ và tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên..." />
            </Form.Item>
            
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại..." />
            </Form.Item>
            
            <Form.Item
              name="email"
              label="Email"
              rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
            >
              <Input prefix={<MailOutlined />} placeholder="Nhập email..." />
            </Form.Item>
            
            <Form.Item
              name="reason"
              label="Lý do khám"
              rules={[{ required: true, message: 'Vui lòng nhập lý do khám' }]}
            >
              <Input.TextArea 
                placeholder="Mô tả ngắn gọn lý do bạn muốn khám..." 
                rows={3}
              />
            </Form.Item>
            
            <Form.Item name="anonymous" valuePropName="checked">
              <Radio>Đặt lịch ẩn danh</Radio>
            </Form.Item>
            
            <Divider />
            
            <Alert
              message="Lưu ý"
              description="Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục. Bạn có thể hủy lịch hẹn trước 24 giờ."
              type="warning"
              showIcon
            />
          </Form>
        </Modal>
        
        <Modal
          open={!!viewAppointment}
          title={
            <div className="modal-title">
              <span className="modal-icon"><InfoCircleOutlined /></span>
              <span>Thông tin lịch đã đặt</span>
            </div>
          }
          onCancel={() => setViewAppointment(null)}
          footer={null}
          centered
          className="view-appointment-modal"
        >
          {viewAppointment && (
            <div className="appointment-details">
              <div className="service-info mb-4 p-3 bg-blue-50 rounded-lg">
                <Title level={5} className="m-0 mb-2 text-blue-800">Chi tiết dịch vụ</Title>
                <p className="mb-2"><Text strong>Dịch vụ:</Text> {services.find(s => s.id === viewAppointment.servicId)?.name}</p>
                <p><Text strong>Bác sĩ:</Text> {doctors.find(d => d.id === viewAppointment.doctorId)?.name}</p>
              </div>
              
              <div className="time-info mb-4 p-3 bg-green-50 rounded-lg">
                <Title level={5} className="m-0 mb-2 text-green-800">Thời gian</Title>
                <p className="mb-2"><Text strong>Ngày khám:</Text> {new Date(viewAppointment.appointmentTime).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><Text strong>Giờ khám:</Text> {new Date(viewAppointment.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              
              <div className="notes-info p-3 bg-yellow-50 rounded-lg">
                <Title level={5} className="m-0 mb-2 text-yellow-800">Ghi chú</Title>
                <p>{viewAppointment.notes}</p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}

export default ServiceBooking