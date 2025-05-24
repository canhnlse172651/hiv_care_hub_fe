import React from 'react';
import { Carousel, Col, Divider, Image, Row } from 'antd';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Form, Input, DatePicker, Select, Button, message, Tabs } from 'antd';

import './xetnghiem.css'

const images = ["/assets/xn-banner-1.png", "/assets/xn-banner-2.png", "/assets/xn-banner-3.png"];
const { Option } = Select;
const { TabPane } = Tabs;

const XetNghiem = () => {

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
                    <p style={{ fontSize: '18px', fontWeight: '600' }}>Tư vấn kết quả sau xét nghiệm, mọi thông tin được bảo mật tuyệt đối</p>
                </div>
            </div>

            <div>
                <Image
                    src="/assets/xn-banner-4.png"
                    alt="Slide 7"
                    preview={false}
                    style={{
                        width: '100%',
                        height: 'auto',
                        maxWidth: '100%',
                        marginBottom: '10px',
                    }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '600px' }}>
                    <Divider style={{ borderBlockStart: '3px solid #0f7ff0' }} />
                </div>
            </div>

            <div style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: '1200px' }}>
                <Row gutter={20} style={{ padding: '20px 0', marginLeft: 'auto', marginRight: 'auto' }}>
                    <Col span={14}>
                        <div className='xetnghiem-text-info' style={{ textAlign: 'start' }}>
                            <h1>Giới thiệu về Xét Nghiệm</h1>
                            <ul>
                                <li>Sàng lọc HIV từ giai đoạn sớm (giai đoạn phơi nhiễm sau 21 ngày)</li>
                                <li>Phát hiện dấu hiệu virus HIV ở giai đoạn đầu</li>
                            </ul>
                            <h1>Dành cho đối tượng nào</h1>
                            <ul>
                                <li>Người mắc các bệnh xã hội, bệnh lây nhiễm qua đường tình dục</li>
                                <li>Người quan hệ tình dục không an toàn, có nhiều bạn tình</li>
                                <li>Người chấn thương hoặc chia sẻ kim tiêm</li>
                                <li>Người hoạt động lao động tình dục
                                </li>
                                <li>Nhóm quan hệ đồng giới (MSM)
                                </li>
                                <li>Trẻ em sinh ra từ mẹ nhiễm HIV
                                </li>
                                <li>Phụ nữ mang thai
                                </li>
                            </ul>
                            <h1>Loại mẫu</h1>
                            <ul>
                                <li>Máu</li>
                            </ul>
                            <h1>Thời gian nhận kết quả</h1>
                            <ul>
                                <li>30 phút có kết quả</li>
                            </ul>
                            <h1>Có cần nhịn ăn trước khi xét nghiệm</h1>
                            <ul>
                                <li>Không cần nhịn ăn trước khi lấy mẫu xét</li>
                            </ul>
                            <h1>Vì sao nên chọn GALANT</h1>
                            <ul>
                                <li>Phòng khám tư đầu tiên điều trị HIV thanh toán BHYT</li>
                                <li>Phòng khám tư nhân được cấp phép xét nghiệm HIV khẳng định</li>
                                <li>Nhận kết quả online qua SMS – Zalo</li>
                                <li>Thông tin y tế bảo mật tuyệt đối</li>
                                <li>Phòng tư vấn cách âm, riêng tư</li>
                                <li>Miễn phí tư vấn dự phòng và điều trị HIV</li>
                                <li>Thân thiện, tận tình, thấu cảm, trách nhiệm, chuyên nghiệp</li>
                                <li>Nhân viên hỗ trợ cộng đồng, tư vấn hỗ trợ tâm lý 24/7</li>
                            </ul>
                        </div>
                    </Col>
                    <Col span={10}>
                        <div style={{ backgroundColor: 'rgb(250, 250, 250)', borderRadius: '20px' }}>
                            <Image
                                src="/assets/xn-form-1.png"
                                alt="Slide 8"
                                preview={false}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxWidth: '100%',
                                    marginBottom: '10px',
                                }} />
                            <h1 style={{ color: '#00aae7', padding: '0 20px' }}>Đăng ký & đặt lịch xét nghiệm ngay</h1>
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
                        </div>
                    </Col>

                    <Col span={24} style={{ marginTop: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '100%', maxWidth: '600px' }}>
                                <Divider style={{ borderBlockStart: '3px solid #0f7ff0' }} />
                            </div>
                        </div>
                    </Col>

                    <Col span={24}>
                        <Divider style={{ borderColor: 'rgba(179, 179, 179, 0.88)', margin: '0' }} >
                            <h2 style={{ color: '#00aae7', margin: '0' }}>DẤU HIỆU VÀ TRIỆU CHỨNG HIV</h2>
                        </Divider>
                    </Col>

                    <Col span={24}>
                        <h1 style={{ fontSize: '35px', fontWeight: 'bold', color: '#00aae7' }}>13 Dấu hiệu và triệu chứng HIV với những người đã từng tiếp xúc nguy cơ lây nhiễm HIV nên đi xét nghiệm HIV càng sớm càng tốt</h1>
                    </Col>
                    <Col span={18}>
                        <p style={{ fontWeight: '500', fontSize: '20px', textAlign: 'left' }} ><strong>&#128311;Sốt: </strong>Có thể trải qua cơn sốt cao trong vòng 2-4 tuần sau khi tiếp xúc nguy cơ lây nhiễm HIV. Sốt thường kéo dài trong một thời gian ngắn và thường đi kèm với các triệu chứng như đau cơ, mệt mỏi và đau đầu.</p>
                    </Col>
                    <Col span={6} style={{ margin: '20px 0', }}>
                        <Image
                            src="/assets/xn-trch-1.png"
                            preview={false}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxWidth: '100px',
                            }} />
                    </Col>
                    <Col span={18}>
                        <p style={{ fontWeight: '500', fontSize: '20px', textAlign: 'left' }} ><strong>&#128311;Sưng hạch bạch huyết: </strong>Bạch huyết là các cụm tế bào miễn dịch nằm trong cơ thể, và khi hệ thống miễn dịch bị tác động bởi HIV, các hạch bạch huyết có thể sưng to và trở nên nhạy cảm khi chạm.</p>
                    </Col>
                    <Col span={6} style={{ margin: '20px 0', }}>
                        <Image
                            src="/assets/xn-trch-2.png"
                            preview={false}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxWidth: '100px',
                            }} />
                    </Col>
                    <Col span={18}>
                        <p style={{ fontWeight: '500', fontSize: '20px', textAlign: 'left' }} ><strong>&#128311;Sụt cân: </strong>Mất cân không giải quyết dù có chế độ ăn uống bình thường và có thể là dấu hiệu của sự suy giảm chức năng miễn dịch.</p>
                    </Col>
                    <Col span={6} style={{ margin: '20px 0', }}>
                        <Image
                            src="/assets/xn-trch-3.png"
                            preview={false}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxWidth: '100px',
                            }} />
                    </Col>
                    <Col span={18}>
                        <p style={{ fontWeight: '500', fontSize: '20px', textAlign: 'left' }} ><strong>&#128311;Phát ban thân thể: </strong>nhiễm HIV giai đoạn đầu thì thường có dấu hiệu phát ban thường xuất hiện dưới dạng các nốt đỏ hoặc ban đỏ trên da.</p>
                    </Col>
                    <Col span={6} style={{ margin: '20px 0', }}>
                        <Image
                            src="/assets/xn-trch-4.png"
                            preview={false}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxWidth: '100px',
                            }} />
                    </Col>
                    <Col span={18}>
                        <p style={{ fontWeight: '500', fontSize: '20px', textAlign: 'left' }} ><strong>&#128311;Tiêu chảy: </strong>Tiêu chảy có thể xảy ra ở một số người trong giai đoạn sớm  phơi nhiễm HIV. Đây là một triệu chứng khá phổ biến và có thể kéo dài trong thời gian dài, gây mất nước và dẫn đến suy dinh dưỡng.</p>
                    </Col>
                    <Col span={6} style={{ margin: '20px 0', }}>
                        <Image
                            src="/assets/xn-trch-5.png"
                            preview={false}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxWidth: '100px',
                            }} />
                    </Col>
                    <Col span={18}>
                        <p style={{ fontWeight: '500', fontSize: '20px', textAlign: 'left' }} ><strong>&#128311;Loét miệng: </strong>Loét miệng có thể gây ra đau và khó chịu trong miệng, làm cho việc ăn uống và nói chuyện trở nên khó khăn.</p>
                    </Col>
                    <Col span={6} style={{ margin: '20px 0', }}>
                        <Image
                            src="/assets/xn-trch-6.png"
                            preview={false}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxWidth: '100px',
                            }} />
                    </Col>
                    <Col span={18}>
                        <p style={{ fontWeight: '500', fontSize: '20px', textAlign: 'left' }} ><strong>&#128311;Viêm đau họng: </strong>Viêm họng và đau họng là một dấu hiệu khá thường gặp trong giai đoạn sớm sau phơi nhiễm HIV.</p>
                    </Col>
                    <Col span={6} style={{ margin: '20px 0', }}>
                        <Image
                            src="/assets/xn-trch-7.png"
                            preview={false}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxWidth: '100px',
                            }} />
                    </Col>
                    <Col span={18}>
                        <p style={{ fontWeight: '500', fontSize: '20px', textAlign: 'left' }} ><strong>&#128311;Cảm lạnh: </strong>giai đoạn nhiễm HIV có thể trải qua các triệu chứng giống cảm lạnh như nghẹt mũi, chảy nước mũi, hắt hơi, hoặc đau và khó thở trong ngực.</p>
                    </Col>
                    <Col span={6} style={{ margin: '20px 0', }}>
                        <Image
                            src="/assets/xn-trch-8.png"
                            preview={false}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxWidth: '100px',
                            }} />
                    </Col>
                    <Col span={18}>
                        <p style={{ fontWeight: '500', fontSize: '20px', textAlign: 'left' }} ><strong>&#128311;Mệt mỏi và suy nhược: </strong>Bạn cảm thấy mệt mỏi một cách bất thường và không có lý do rõ ràng.</p>
                    </Col>
                    <Col span={6} style={{ margin: '20px 0', }}>
                        <Image
                            src="/assets/xn-trch-9.png"
                            preview={false}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxWidth: '100px',
                            }} />
                    </Col>
                    <Col span={18}>
                        <p style={{ fontWeight: '500', fontSize: '20px', textAlign: 'left' }} ><strong>&#128311;Buồn nôn và nôn: </strong>cũng là những biểu hiện ít phổ biến trong giai đoạn cấp tính của HIV.</p>
                    </Col>
                    <Col span={6} style={{ margin: '20px 0', }}>
                        <Image
                            src="/assets/xn-trch-10.png"
                            preview={false}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxWidth: '100px',
                            }} />
                    </Col>
                    <Col span={18}>
                        <p style={{ fontWeight: '500', fontSize: '20px', textAlign: 'left' }} ><strong>&#128311;Đổ mồ hôi đêm: </strong>là một biểu hiện ít phổ biến, trải qua các cơn đổ mồ hôi đêm nhiều hơn thường lệ và có thể gây mất ngủ và khó chịu.</p>
                    </Col>
                    <Col span={6} style={{ margin: '20px 0', }}>
                        <Image
                            src="/assets/xn-trch-11.png"
                            preview={false}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxWidth: '100px',
                            }} />
                    </Col>
                    <Col span={18}>
                        <p style={{ fontWeight: '500', fontSize: '20px', textAlign: 'left' }} ><strong>&#128311;Đau khớp: </strong>Đau khớp có thể xảy ra ở các khớp khác nhau trong cơ thể và có thể gây khó khăn khi di chuyển và thực hiện các hoạt động hàng ngày.</p>
                    </Col>
                    <Col span={6} style={{ margin: '20px 0', }}>
                        <Image
                            src="/assets/xn-trch-12.png"
                            preview={false}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxWidth: '100px',
                            }} />
                    </Col>
                    <Col span={18}>
                        <p style={{ fontWeight: '500', fontSize: '20px', textAlign: 'left' }} ><strong>&#128311;Sưng hoặc đau tinh hoàn: </strong>Đây là một triệu chứng rất ít phổ biến nhưng cần được lưu ý theo dõi.</p>
                    </Col>
                    <Col span={6} style={{ margin: '20px 0', }}>
                        <Image
                            src="/assets/xn-trch-13.png"
                            preview={false}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxWidth: '100px',
                            }} />
                    </Col>

                    <Col span={24}>
                        <div style={{ display: 'flex' }}>
                            <div style={{ display: 'flex', alignItems: 'stretch', paddingRight: '10px' }}>
                                <Divider type="vertical" style={{ height: '100%', borderColor: ' #0f7ff0' }} />
                            </div>
                            <p style={{ fontWeight: '500', fontSize: '20px', textAlign: 'left' }}>
                                Bệnh HIV không có dấu hiệu và triệu chứng rõ ràng, nếu bạn đã từng tiếp xúc nguy cơ lây nhiễm HIV thì phương pháp duy nhất là xét nghiệm HIV để chẩn đoán.</p>
                        </div>
                    </Col>

                    <Col span={24} style={{ marginTop: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '100%', maxWidth: '600px' }}>
                                <Divider style={{ borderBlockStart: '3px solid #0f7ff0' }} />
                            </div>
                        </div>
                    </Col>

                    <Col span={24}>
                        <Divider style={{ borderColor: 'rgba(179, 179, 179, 0.88)', margin: '0' }} >
                            <h2 style={{ color: '#00aae7', margin: '0' }}>DẤU HIỆU VÀ TRIỆU CHỨNG HIV</h2>
                        </Divider>
                    </Col>

                    <Col span={24} >
                        <Tabs defaultActiveKey="1" centered size='large'>
                            <TabPane tab={<span style={{ fontWeight: 'bold', fontSize: '20px' }}>Xét nghiệm HIV sàng lọc</span>} key="1">
                                <ul style={{ textAlign: 'left', fontSize: '20px' }}>
                                    <li><strong>Xét nghiệm sàng lọc</strong> ( <strong style={{ color: '#00aae7' }}>21 ngày</strong> bắt đầu có thể xét nghiệm , tỷ lệ chính xác vào thời điểm này <strong style={{ color: '#00aae7' }}>90%</strong> )</li>
                                    <li><strong>Phương pháp HIV combo ag/ab test nhanh :</strong> <strong style={{ color: '#00aae7' }}>3 tháng</strong> kể từ khi tiếp xúc vơi nguy cơ (trong 3 tháng không tiếp xúc với bất kỳ nguy cơ nào khác) thì test <strong style={{ color: '#00aae7' }}>chính xác</strong><br />
                                        <strong style={{ color: '#d83131' }}>– Giá 169.000 VND/ xét nghiệm</strong></li>
                                    <li><strong>Phương pháp HIV combo ag/ab bằng máy miễn dịch :</strong> <strong style={{ color: '#00aae7' }}>45 ngày</strong> kể từ khi tiếp xúc vơi nguy cơ ( trong 45 ngày không tiếp xúc với bất kỳ nguy cơ nào khác ) thì test <strong style={{ color: '#00aae7' }}>chính xác</strong><br />
                                        <strong style={{ color: '#d83131' }}>– Giá 250.000VND/ xét nghiệm.</strong></li>
                                </ul>
                            </TabPane>
                            <TabPane tab={<span style={{ fontWeight: 'bold', fontSize: '20px' }}>Xét nghiệm HIV khẳng định</span>} key="2">
                                <h3 style={{ textAlign: 'left', fontSize: '20px' }}>Xét nghiệm HIV khẳng định:</h3>
                                <ul style={{ textAlign: 'left', fontSize: '20px' }}>
                                    <li>Xét nghiệm khẳng HIV phương pháp 3 test nhanh</li>
                                    <li>Xét nghiệm HIV PCR (Sinh học phân tử)</li>
                                </ul>
                            </TabPane>
                        </Tabs>
                        <Button type="primary" block style={{ borderRadius: '50px', fontSize: '17px', padding: '20px', maxWidth: '400px' }}>
                            <strong>LIÊN HỆ</strong>
                        </Button>
                    </Col>

                    <Col span={24} style={{ marginTop: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '100%', maxWidth: '600px' }}>
                                <Divider style={{ borderBlockStart: '3px solid #0f7ff0' }} />
                            </div>
                        </div>
                    </Col>

                    <Col span={24}>
                        <Image
                            src="/assets/xn-banner-5.png"
                            preview={false}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxWidth: '100%',
                                marginBottom: '10px',
                            }} />
                    </Col>

                    <Col span={24} style={{ marginTop: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '100%', maxWidth: '600px' }}>
                                <Divider style={{ borderBlockStart: '3px solid #0f7ff0' }} />
                            </div>
                        </div>
                    </Col>

                    <Col span={24}>
                        <Divider style={{ borderColor: 'rgba(179, 179, 179, 0.88)', margin: '0', marginBottom: '40px' }} >
                            <h2 style={{ color: '#00aae7', margin: '0' }}>CÁC GÓI XÉT NGHIỆM KHÁC</h2>
                        </Divider>
                    </Col>

                    <Col span={8}>
                        <div style={{ backgroundColor: 'rgb(250, 250, 250)', borderRadius: '10px', boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)' }}>
                            <Image
                                src="/assets/xn-goi-1.png"
                                alt="Slide 8"
                                preview={false}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxWidth: '100%',
                                    marginBottom: '10px',
                                    borderRadius: '10px',
                                }} />

                            <Button type="primary" style={{ borderRadius: '50px', fontSize: '17px', padding: '20px', margin: '20px' }}>
                                <strong>ĐẶT LỊCH</strong>
                            </Button>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ backgroundColor: 'rgb(250, 250, 250)', borderRadius: '10px', boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)' }}>
                            <Image
                                src="/assets/xn-goi-2.png"
                                alt="Slide 8"
                                preview={false}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxWidth: '100%',
                                    marginBottom: '10px',
                                    borderRadius: '10px',
                                }} />

                            <Button type="primary" style={{ borderRadius: '50px', fontSize: '17px', padding: '20px', margin: '20px' }}>
                                <strong>ĐẶT LỊCH</strong>
                            </Button>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ backgroundColor: 'rgb(250, 250, 250)', borderRadius: '10px', boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)' }}>
                            <Image
                                src="/assets/xn-goi-3.png"
                                alt="Slide 8"
                                preview={false}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxWidth: '100%',
                                    marginBottom: '10px',
                                    borderRadius: '10px',
                                }} />

                            <Button type="primary" style={{ borderRadius: '50px', fontSize: '17px', padding: '20px', margin: '20px' }}>
                                <strong>ĐẶT LỊCH</strong>
                            </Button>
                        </div>
                    </Col>

                    <Col span={24} style={{ marginTop: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '100%', maxWidth: '600px' }}>
                                <Divider style={{ borderBlockStart: '3px solid #0f7ff0' }} />
                            </div>
                        </div>
                    </Col>
                    <Col span={24}>
                        <h1 style={{ color: '#00aae7' }}>ĐĂNG KÝ & ĐẶT LỊCH XÉT NGHIỆM NGAY</h1>
                        <p style={{ fontSize: '20px', color: '#00aae7' }}>Mời Quý khách đăng ký thông tin xét nghiệm để tiết kiệm thời gian khi đến phòng khám làm thủ tục và hưởng thêm nhiều chính sách ưu đãi khác.</p>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            style={{ maxWidth: 1200, padding: '0 20px', paddingBottom: '20px' }}
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
        </div>
    );
};

export default XetNghiem;
