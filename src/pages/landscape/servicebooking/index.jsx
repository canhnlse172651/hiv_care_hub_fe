import React, { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Col, Row, Modal, Form, Input, Typography, Select, message } from 'antd'
import { CalendarOutlined, UserAddOutlined } from '@ant-design/icons'
import './servicebooking.css'

const { Title, Paragraph } = Typography

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

  const handleOk = () => {
    form.validateFields().then(values => {
      const newApp = {
        id: appointments.length + 1,
        userId: 999,
        doctorId: selectedDoctor,
        servicId: selectedService,
        appointmentTime: selectedSlot.startStr,
        appointmentEndTime: selectedSlot.endStr,
        isAnonymous: false,
        status: true,
        notes: values.title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setAppointments(prev => [...prev, newApp])
      setModalOpen(false)
      form.resetFields()
      message.success('Đặt lịch thành công!')
    })
  }

  const renderEventContent = (eventInfo) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <CalendarOutlined style={{ color: eventInfo.event.title === 'Đã đặt lịch' ? '#fa8c16' : '#1890ff' }} />
      <b>{eventInfo.event.title}</b>
    </div>
  )

  return (
    <div className="booking-container">
      <Row gutter={20} style={{ padding: '20px 0', marginLeft: 'auto', marginRight: 'auto' }}>
        <Col span={24} style={{ marginBottom: 24 }}>
          <Title level={2} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CalendarOutlined style={{ color: '#1890ff' }} /> Đặt lịch khám bệnh
          </Title>
          <Paragraph type="secondary">
            Chọn dịch vụ, bác sĩ và khung giờ phù hợp để đặt lịch khám.
          </Paragraph>
        </Col>
        <Col span={6}>
          <Form layout="vertical">
            <Form.Item label="Chọn dịch vụ">
              <Select
                placeholder="Chọn dịch vụ"
                onChange={(value) => {
                  setSelectedService(value)
                  setSelectedDoctor(null)
                }}
                value={selectedService}
                allowClear
              >
                {services.map(s => (
                  <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Chọn bác sĩ">
              <Select
                placeholder="Chọn bác sĩ"
                onChange={setSelectedDoctor}
                value={selectedDoctor}
                disabled={!selectedService}
                allowClear
              >
                {filteredDoctors.map(d => (
                  <Select.Option key={d.id} value={d.id}>{d.name} - {d.specialization}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Col>
        <Col span={18}>
          <div className="calendar-wrapper">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              eventClick={handleEventClick}
              events={events}
              eventContent={renderEventContent}
              height={520}
              locale="vi"
              slotMinTime="08:00:00"
              slotMaxTime="17:00:00"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
            />
          </div>
          <Modal
            title={<span><UserAddOutlined /> Đặt lịch khám</span>}
            open={modalOpen}
            onOk={handleOk}
            onCancel={() => {
              setModalOpen(false)
              form.resetFields()
            }}
            okText="Đặt lịch"
            cancelText="Hủy"
            centered
            bodyStyle={{ paddingTop: 24 }}
          >
            <Form form={form} layout="vertical">
              <Form.Item
                name="title"
                label="Lý do khám"
                rules={[{ required: true, message: 'Vui lòng nhập lý do khám' }]}
              >
                <Input placeholder="Nhập lý do khám..." />
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            open={!!viewAppointment}
            title="Thông tin lịch đã đặt"
            onCancel={() => setViewAppointment(null)}
            footer={null}
            centered
          >
            {viewAppointment && (
              <div>
                <p><b>Dịch vụ:</b> {services.find(s => s.id === viewAppointment.servicId)?.name}</p>
                <p><b>Bác sĩ:</b> {doctors.find(d => d.id === viewAppointment.doctorId)?.name}</p>
                <p><b>Thời gian:</b> {new Date(viewAppointment.appointmentTime).toLocaleString()} - {new Date(viewAppointment.appointmentEndTime).toLocaleString()}</p>
                <p><b>Lý do khám:</b> {viewAppointment.notes}</p>
              </div>
            )}
          </Modal>
        </Col>
      </Row>
    </div>
  )
}

export default ServiceBooking