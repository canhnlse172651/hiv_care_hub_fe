import { Button, Carousel, Col, DatePicker, Divider, Form, Image, Input, message, Row, Select } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import React from 'react';

const { Option } = Select;
const images = ["/assets/lh-banner-1.png", "/assets/lh-banner-2.png", "/assets/lh-banner-3.png", "/assets/lh-banner-4.png"];

const Contact = () => {

  const [form] = Form.useForm();

  const PrevArrow = ({ onClick }) => (
    <div className="custom-arrow custom-prev" onClick={onClick}>
      <LeftOutlined />
    </div>
  );

  const NextArrow = ({ onClick }) => (
    <div className="custom-arrow custom-next" onClick={onClick}>
      <RightOutlined />
    </div>
  );

  const onFinish = (values) => {
    console.log('Form values:', values);
    message.success('Đặt lịch xét nghiệm thành công!');
  };

  return (
    <div style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: '1200px', textAlign: 'center' }}>
      <Row gutter={20} style={{ padding: '20px 0', marginLeft: 'auto', marginRight: 'auto' }}>
        <Col span={14}>
          <Carousel
            autoplay
            autoplaySpeed={5000}
            infinite
            arrows
            effect='fade'
            prevArrow={<PrevArrow />}
            nextArrow={<NextArrow />}
          >
            {images.map((src, index) => (
              <div key={index} style={{ textAlign: 'center', height: '100%' }}>
                <Image
                  src={src}
                  alt={`slide-${index}`}
                  preview={false}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </div>
            ))}
          </Carousel>

          <h2 style={{ color: '#00aae7' }}>Galant – Phòng khám cộng đồng</h2>
          <p style={{ fontWeight: '500', fontSize: '16px', textAlign: 'left' }}>Galant là phòng khám chăm sóc sức khỏe cộng đồng với sứ mệnh nâng cao chất lượng cuộc sống cho cộng đồng thông qua các dịch vụ "CHĂM SÓC SỨC KHỎE TOÀN DIỆN" với giá trị cốt lõi <strong style={{ color: '#00aae7' }}>Thân Thiện – Thấu Cảm – Tận Tình – Trách Nhiệm – Chuyên Nghiệp.</strong></p>
        </Col>

        <Col span={10}>
          <Divider style={{ borderColor: 'rgba(179, 179, 179, 0.88)', margin: '0 0 40px 0' }} >
            <h2 style={{ color: '#00aae7', margin: '0' }}>ĐẶT LỊCH HẸN KHÁM</h2>
          </Divider>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            style={{ maxWidth: 600, padding: '0 20px', paddingBottom: '20px' }}
          >
            <Form.Item
              name="fullName"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
            >
              <Input style={{ borderRadius: '50px' }} placeholder="Nguyễn Văn A" />
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
              ]}
            >
              <Input style={{ borderRadius: '50px' }} placeholder="0123456789" />
            </Form.Item>

            <Form.Item
              name="date"
              rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
            >
              <DatePicker style={{ width: '100%', borderRadius: '50px' }} />
            </Form.Item>

            <Form.Item
              name="timeSlot"
              rules={[{ required: true, message: 'Vui lòng chọn khung giờ!' }]}
            >
              <Select placeholder="Chọn khung giờ" style={{ textAlign: 'left' }}>
                <Option value="08:00 - 09:00">08:00 - 09:00</Option>
                <Option value="09:00 - 10:00">09:00 - 10:00</Option>
                <Option value="10:00 - 11:00">10:00 - 11:00</Option>
                <Option value="13:00 - 14:00">13:00 - 14:00</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="service"
              rules={[{ required: true, message: 'Vui lòng chọn dịch vụ!' }]}
            >
              <Select
                style={{ textAlign: 'left' }}
                placeholder="Chọn dịch vụ xét nghiệm">
                <Option value="Thăm khám bệnh">Thăm khám bệnh</Option>
                <Option value="Tư vấn và xét nghiệm HIV">Tư vấn và xét nghiệm HIV</Option>
                <Option value="Tư vấn và điều trị ARV">Tư vấn và điều trị ARV</Option>
                <Option value="Tầm soát các bệnh lây truyền qua đường tình dục">Tầm soát các bệnh lây truyền qua đường tình dục</Option>
                <Option value="Đăng ký tư vấn sử dụng thuốc ngừa HIV trước khi tiếp xúc">Đăng ký tư vấn sử dụng thuốc ngừa HIV trước khi tiếp xúc</Option>
                <Option value="Đăng ký tư vấn sử dụng thuốc ngừa HIV sau khi tiếp xúc">Đăng ký tư vấn sử dụng thuốc ngừa HIV sau khi tiếp xúc</Option>
                <Option value="Xét nghiệm tầm soát ung thư">Xét nghiệm tầm soát ung thư</Option>
                <Option value="Xét nghiệm ký sinh trùng">Xét nghiệm ký sinh trùng</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ borderRadius: '50px', fontSize: '17px', padding: '20px' }}>
                <strong>ĐẶT LỊCH KHÁM</strong>
              </Button>
            </Form.Item>
          </Form>
        </Col>

        <Col span={24} style={{ marginTop: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '600px' }}>
              <Divider style={{ borderBlockStart: '3px solid #0f7ff0' }} />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Contact
