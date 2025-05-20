import React from 'react';
import { Typography, Row, Col, Card, Button, Space, Carousel } from 'antd';
import { TeamOutlined, SafetyCertificateOutlined, PhoneOutlined } from '@ant-design/icons';
import './home.css'

const dichVu = [
  {
    key: 'service-1',
    title: 'Điều trị HIV',
    description: 'Tư vấn, hỗ trợ bạn trong việc tiếp cận phác đồ điều trị HIV tiên tiến nhất được Bộ Y tế cấp phép.'
  },
  {
    key: 'service-2',
    title: 'Xét nghiệm sàng lọc HIV',
    description: 'Xét nghiệm sàng lọc HIV nhanh chóng, chính xác và bảo mật nhằm giúp khách hàng phát hiện sớm và quản lý hiệu quả tình trạng HIV.'
  },
  {
    key: 'service-3',
    title: 'Dự phòng trước phơi nhiễm HIV – PrEP',
    description: 'Dùng PrEP như một lá chắn bảo vệ hoàn hảo trước HIV, để luôn cảm thấy an toàn và cởi mở trước những cơ hội tình cảm mới.'
  },
  {
    key: 'service-4',
    title: 'Xét nghiệm các bệnh lây truyền qua đường tình dục (STIs)',
    description: 'Xét nghiệm các bệnh lây truyền qua đường tình dục (STIs) nhằm phát hiện sớm và điều trị kịp thời, bảo vệ sức khỏe tình dục của bạn.'
  },
  {
    key: 'service-5',
    title: 'Dự phòng sau phơi nhiễm HIV –  PEP',
    description: 'PEP là phương pháp dự phòng HIV sau khi tiếp xúc với nguy cơ phơi nhiễm, để không bị nhiễm HIV.'
  },
  {
    key: 'service-6',
    title: 'Xét nghiệm tổng quát tầm soát ung thư',
    description: 'Tầm soát ung thư là thực hiện những xét nghiệm trên những người khỏe mạnh, chưa có triệu chứng của bệnh.'
  }
];

const { Title, Paragraph } = Typography;

const HomePage = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          {/* Left Banner (3/4 width) */}
          <div className="hero-main-banner">
            <img
              src="/assets/banner-1.png"
              alt="Main Banner"
              className="hero-banner-image"
            />

          </div>

          {/* Right Banners (1/4 width) */}
          <div className="hero-side-banners">
            <div className="hero-side-banner">
              <img
                src="/assets/banner-2.png"
                alt="Secondary Banner"
                className="hero-banner-image"
              />
            </div>
            <div className="hero-side-banner">
              <img
                src="/assets/banner-3.png"
                alt="Third Banner"
                className="hero-banner-image"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Services Section */}
      <div className="services-section">
        <Title level={2} className="services-title">
          DỊCH VỤ CHÍNH TẠI GALANT
        </Title>
        <div className="services-container">
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={12}>
              <Row gutter={[24, 24]}>
                {dichVu.map((service) => (
                  <Col xs={24} sm={12} key={service.key}>
                    <div className="service-item">
                      <img src="/assets/virus-icon.png" alt="Service Icon" className="service-item-icon" />
                      <Title level={4}>{service.title}</Title>
                      <Paragraph>{service.description}</Paragraph>
                      <div className="service-item-buttons">
                        <Button type="primary">Đăng ký</Button>
                        <Button type="link">Xem thêm</Button>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>

            <Col xs={24} lg={12}>
              <div className="service-carousel-container">
                <Carousel autoplay className="service-carousel">
                  <div>
                    <img src="/assets/service-1.png" alt="Service 1" />
                  </div>
                  <div>
                    <img src="/assets/service-2.png" alt="Service 2" />
                  </div>
                  <div>
                    <img src="/assets/service-3.png" alt="Service 3" />
                  </div>
                </Carousel>
                <div className="service-clinic-info">
                  <Title level={3}>Galant – Phòng khám cộng đồng</Title>
                  <Paragraph>
                    GALANT trở thành phòng khám đa khoa chăm sóc sức khỏe toàn diện – chuyên nghiệp đặc biệt là điều trị dự phòng HIV và các Bệnh lây truyền qua đường tình dục (STDs).
                  </Paragraph>
                  <Paragraph>
                    GALANT hướng đến là Phòng khám đa khoa dẫn đầu về chất lượng chuyên môn và ứng dụng công nghệ kỹ thuật tiên tiến hàng đầu tại Việt Nam.
                  </Paragraph>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>      {/* Info Section */}      <div className="info-section">
        <div className="info-banner-container">
          <img src="/assets/banner-4.png" alt="GALANT Team" className="info-banner" />
          <div className="info-banner-overlay">
            <Title level={2}>Điều trị HIV chuyên nghiệp tại hệ thống<br />PHÒNG KHÁM ĐA KHOA GALANT</Title>
          </div>
        </div>

        <div className="info-stats">
          <div className="info-stat-row">
            <div className="stat-item">
              <Title level={3}>2017</Title>
              <div className="stat-label">Phòng khám đa khoa GALANT ra đời</div>
            </div>

            <div className="stat-item">
              <Title level={3}>20000+</Title>
              <div className="stat-label">Khách hàng đã khám chữa bệnh</div>
            </div>

            <div className="stat-item">
              <Title level={3}>10000+</Title>
              <div className="stat-label">Bác sĩ có chuyên môn cao</div>
            </div>

            <div className="stat-item">
              <Title level={3}>100000+</Title>
              <div className="stat-label">Người được cung cấp kiến thức</div>
            </div>
          </div>

          <div className="info-description">
            <Paragraph>
              Phòng khám đa khoa GALANT là một hình thành chăm sóc sức khỏe cộng đồng bền vững do sự hợp tác điều trị của các tổ chức dựa vào cộng đồng (CBO) (G3VN, Aloboy, Sắc Màu Cuộc Sống, Nu Cuội và VHH Sống).
            </Paragraph>
            <Paragraph>
              Phòng khám đa khoa GALANT là điểm đến nổi tiếng dành cho cộng đồng những người đồng tính, song tính và chuyển giới (LGBT). GALANT luôn sẵn sàng chào đón các khách hàng đến thăm khám với sự thân thiện, trách nhiệm, tận tình và thấu cảm nhất.
            </Paragraph>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;