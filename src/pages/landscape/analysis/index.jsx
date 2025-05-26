import React from 'react';
import { Carousel, Col, Divider, Image, Row } from 'antd';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Form, Input, DatePicker, Select, Button, message, Tabs } from 'antd';

import './analysis.css'

const images = ["/assets/xn-banner-1.png", "/assets/xn-banner-2.png", "/assets/xn-banner-3.png"];
const { Option } = Select;
const { TabPane } = Tabs;

const Analysis = () => {

    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Form values:', values);
        message.success('Đặt lịch xét nghiệm thành công!');
    };

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

    return (
        <div style={{textAlign: 'center'}}>
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

            <div
                style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    justifyContent: 'space-evenly',
                    padding: '20px 0',
                    flexWrap: 'wrap',
                    fontFamily: 'Arial, sans-serif',
                }}
            >
                <div style={{ flex: 1, textAlign: 'center', maxWidth: '400px' }}>
                    <Image
                        src="/assets/xn-banner-ic-1.png"
                        alt="Slide 4"
                        preview={false}
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxWidth: '100px',
                            marginBottom: '10px',
                        }} />
                    <p style={{ fontSize: '18px', fontWeight: '600' }}>Độ chính xác cao từ hệ thống thiết bị phòng xét nghiệm</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'stretch' }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </div>

                <div style={{ flex: 1, textAlign: 'center', maxWidth: '400px' }}>
                    <Image
                        src="/assets/xn-banner-ic-2.png"
                        alt="Slide 5"
                        preview={false}
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxWidth: '100px',
                            marginBottom: '10px',
                        }} />
                    <p style={{ fontSize: '18px', fontWeight: '600' }}>Trả kết quả cực nhanh trong vòng 30 phút – 60 phút, nhận kết quả qua điện thoại</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'stretch' }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </div>

                <div style={{ flex: 1, textAlign: 'center', maxWidth: '400px' }}>
                    <Image
                        src="/assets/xn-banner-ic-3.png"
                        alt="Slide 6"
                        preview={false}
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxWidth: '100px',
                            marginBottom: '10px',
                        }} />
                    <p style={{ fontSize: '18px', fontWeight: '600' }}>Tư vấn miễn phí trước và sau khi xét nghiệm, hỗ trợ tư vấn về sức khỏe</p>
                </div>
            </div>

            {/* Rest of the component would go here - truncated for brevity */}
        </div>
    )
}

export default Analysis
