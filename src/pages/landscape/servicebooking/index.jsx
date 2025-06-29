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
import { useDispatch, useSelector } from 'react-redux'
import { handleShowModal } from '@/store/Reducer/authReducer'
import { MODAL_TYPE } from '@/constant/general'
import { localToken } from '@/utils/auth'
import { servicesService } from "@/services/servicesService"
import { Link } from "react-router-dom"

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
  const { profile } = useSelector((state) => state.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [services, setServices] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState("");
  
  // Check for authentication
  useEffect(() => {
    const authToken = localToken.get()?.accessToken;
    if (authToken || profile) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [profile]);
  
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
    <div className="service-selection-container">
      <Title level={3} className="text-center mb-8">Chọn dịch vụ</Title>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <div
            key={service.id}
            className={`service-item p-6 rounded-lg cursor-pointer border-2 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:translate-y-[-4px] ${
              selectedService === service.id 
                ? 'border-blue-500 bg-blue-50 shadow-lg' 
                : 'border-transparent bg-white hover:bg-gray-50 hover:shadow-md'
            }`}
            onClick={() => setSelectedService(service.id)}
          >
            <div className="relative mb-2">
              {/* Icon container with centered icon */}
              <div className={`service-item-icon w-16 h-16 flex items-center justify-center rounded-full shadow-md ${
                selectedService === service.id ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'
              }`}>
                <MedicineBoxOutlined style={{ fontSize: '28px' }} />
              </div>
              {/* Selection indicator dot */}
              {selectedService === service.id && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="text-white" style={{ fontSize: '10px', lineHeight: '1' }}>✓</div>
                </div>
              )}
            </div>
            <Text className="font-semibold text-base text-center mt-2">{service.name}</Text>            <div className="h-10 flex items-center justify-end mt-2">
              {selectedService === service.id && (
                <Button type="primary" onClick={handleNextStep} className="flex items-center">
                  Tiếp tục <RightOutlined className="ml-1" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map(doctor => (
          <div 
            key={doctor.id}
            className={`doctor-card relative rounded-xl cursor-pointer transition-all duration-300 hover:translate-y-[-4px] ${
              selectedDoctor === doctor.id 
                ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg' 
                : 'border border-gray-100 hover:shadow-md'
            }`}
            onClick={() => setSelectedDoctor(doctor.id)}
          >
            <div className={`p-6 rounded-xl ${
              selectedDoctor === doctor.id 
                ? 'bg-gradient-to-br from-blue-50 to-indigo-50' 
                : 'bg-white'
            }`}>
              <div className="flex items-center">
                <div className={`w-16 h-16 flex items-center justify-center rounded-full ${
                  selectedDoctor === doctor.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  <UserOutlined style={{ fontSize: '28px' }} />
                </div>
                <div className="ml-5 flex-1">
                  <Title level={4} className="m-0 font-bold text-gray-800">{doctor.name}</Title>
                  <Text className="block mb-2 text-gray-500">{doctor.specialization}</Text>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {doctor.certifications}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Selection check mark */}
              {selectedDoctor === doctor.id && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="text-white">✓</div>
                </div>
              )}
              
              <div className="mt-5 pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <Text className="text-gray-500">
                    <CheckCircleOutlined className="mr-1 text-green-500" /> Lịch khám sẵn sàng
                  </Text>
                  {selectedDoctor === doctor.id && (
                    <Button 
                      type="primary"
                      onClick={handleNextStep}
                      className="flex items-center justify-center"
                      icon={<RightOutlined />}
                    >
                      Chọn lịch
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const handleGoBack = () => {
    navigate(-1); // Navigate to previous page
  };

  const fetchServices = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await servicesService.getPublicServices({ page, limit: 10, search });
      if (response.data?.data) {
        setServices(response.data.data.data);
        setMeta(response.data.data.meta);
      }
    } catch (error) {
      message.error("Failed to fetch services. Please try again.");
      console.error("Service fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(1, searchTerm);
  }, [searchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= meta.totalPages) {
      fetchServices(newPage, searchTerm);
    }
  };

  // If not authenticated, show minimal content
  if (!isAuthenticated) {
    return (
      <main className="service-booking-page pt-[160px]">
        <div className="container mx-auto p-4 md:p-8">
          <Card className="max-w-md mx-auto text-center shadow-lg rounded-lg">
            <div className="p-4">
              <MedicineBoxOutlined style={{ fontSize: '48px', color: '#1890ff' }} className="mb-4" />
              <Title level={3}>Đặt lịch khám</Title>
              <Paragraph>Vui lòng đăng nhập để sử dụng dịch vụ đặt lịch khám</Paragraph>
              <Button 
                type="primary" 
                size="large"
                onClick={() => dispatch(handleShowModal(MODAL_TYPE.login))}
              >
                Đăng nhập
              </Button>
            </div>
          </Card>
        </div>
      </main>
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
                <div>
                  {currentStep > 0 && (
                    <Button onClick={handlePrevStep} className="back-step-button">
                      <ArrowLeftOutlined /> Quay lại
                    </Button>
                  )}
                </div>
                <div>
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
                </div>
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