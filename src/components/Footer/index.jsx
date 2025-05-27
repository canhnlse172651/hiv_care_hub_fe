import { FacebookFilled } from '@ant-design/icons';
import { Col, Row, Typography, Button } from 'antd';
import { Link } from "react-router-dom";
import './Footer.css';

const { Title, Text } = Typography;

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <Row gutter={[32, 32]}>
          {/* About Us Column */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4}>Về chúng tôi</Title>
            <ul className="footer-links">
              <li><Link to="/">Giới thiệu</Link></li>
              <li><Link to="/">Hệ thống phòng khám</Link></li>
              <li><Link to="/">Điều khoản sử dụng</Link></li>
              <li><Link to="/">Chính sách đối - trả hàng</Link></li>
              <li><Link to="/">Phí giao hàng</Link></li>
              <li><Link to="/">Hình thức thanh toán</Link></li>
            </ul>
          </Col>

          {/* Learn More Column */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4}>Tìm hiểu thêm</Title>
            <ul className="footer-links">
              <li><Link to="/">Dịch vụ</Link></li>
              <li><Link to="/">Tin tức - Sự kiện</Link></li>
              <li><Link to="/">Kiến thức</Link></li>
              <li><Link to="/">Liên hệ Hỏi đáp</Link></li>
            </ul>
          </Col>

          {/* Categories Column */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4}>Danh mục</Title>
            <ul className="footer-links">
              <li><Link to="/">Điều trị Bệnh HIV</Link></li>
              <li><Link to="/">Thuốc</Link></li>
              <li><Link to="/">Bệnh lậu</Link></li>
              <li><Link to="/">Bệnh Giang Mai</Link></li>
              <li><Link to="/">Bệnh Sùi Mào Gà</Link></li>
              <li><Link to="/">Ký sinh trùng</Link></li>
              <li><Link to="/">Nấm sinh dục</Link></li>
            </ul>
          </Col>

          {/* Contact Column */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4}>Kết nối với chúng tôi</Title>
            <div className="social-links">
              <Button type="link" icon={<FacebookFilled />} href="#" />
              <Button type="link" icon={<img src="/assets/zalo-icon.png" alt="Zalo" className="zalo-icon" />} href="#" />
            </div>

          </Col>
        </Row>

        <div className="footer-bottom">
          <Text>
            Các thông tin trên website chỉ dành cho mục đích tham khảo, tra cứu, khuyến nghị Quý khách hàng không tự ý áp dụng.
          </Text>
          <Text>
            Galant không chịu trách nhiệm về những trường hợp tự ý áp dụng mà không có chỉ định của bác sĩ.
          </Text>
          <Text>Số GPKD/MST: 0313657065 do Sở KH&ĐT TP.HCM cấp ngày 23/02/2016</Text>
          <Text>GPHĐ số: 06178/HCM-GPHD do Sở Y tế cấp ngày 30/01/2020</Text>
        </div>
      </div>
    </footer>
  );
};

export default Footer;