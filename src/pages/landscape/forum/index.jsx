import React, { useState } from 'react';
import { Typography, Collapse, Button, Tabs, Row, Col } from 'antd';
import { DownOutlined, UpOutlined, CommentOutlined } from '@ant-design/icons';
import './forum.css';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;

const faqData = [
  {
    question: 'Chi phí xét nghiệm HIV tại Galant là bao nhiêu?',
    answer: 'Mỗi phương pháp xét nghiệm sẽ có chi phí khác nhau, dao động từ 100.000 đến 800.000 đồng. Chi phí thực tế cụ thể, xin vui lòng gọi vào hotline.',
    category: 'xet-nghiem'
  },
  {
    question: 'Trả kết quả xét nghiệm HIV trong bao lâu?',
    answer: 'Thời gian trả kết quả xét nghiệm HIV tại Galant phụ thuộc vào loại xét nghiệm. Xét nghiệm nhanh có thể có kết quả trong vòng 15-30 phút. Xét nghiệm khẳng định có thể mất từ 1-3 ngày làm việc.',
    category: 'xet-nghiem'
  },
  {
    question: 'Ưu điểm khi xét nghiệm HIV tại Galant',
    answer: 'Xét nghiệm tại Galant đem lại nhiều ưu điểm như: bảo mật thông tin tuyệt đối, nhân viên chuyên nghiệp thân thiện, kết quả nhanh chóng và chính xác, chi phí hợp lý, cơ sở vật chất hiện đại và trang thiết bị y tế tiên tiến.',
    category: 'xet-nghiem'
  },
  {
    question: 'Phương pháp xét nghiệm HIV tại Galant',
    answer: 'Tại Galant, chúng tôi áp dụng nhiều phương pháp xét nghiệm HIV khác nhau như xét nghiệm sàng lọc nhanh, xét nghiệm Elisa, xét nghiệm Western Blot và xét nghiệm PCR. Mỗi phương pháp có ưu điểm riêng và được tư vấn phù hợp với từng trường hợp cụ thể.',
    category: 'xet-nghiem'
  },
  {
    question: 'Xét nghiệm HIV có chính xác không?',
    answer: 'Xét nghiệm HIV tại Galant có độ chính xác cao (trên 99%) khi được thực hiện đúng quy trình và đủ thời gian cửa sổ. Tuy nhiên, để có kết quả chắc chắn nhất, chúng tôi khuyến nghị làm xét nghiệm khẳng định nếu có kết quả dương tính từ xét nghiệm sàng lọc ban đầu.',
    category: 'xet-nghiem'
  },
  {
    question: 'Lợi ích của việc xét nghiệm HIV?',
    answer: 'Xét nghiệm HIV mang lại nhiều lợi ích quan trọng như phát hiện sớm tình trạng nhiễm HIV, bắt đầu điều trị kịp thời, giảm nguy cơ lây truyền sang người khác, yên tâm về tình trạng sức khỏe, và góp phần kiểm soát dịch HIV trong cộng đồng.',
    category: 'xet-nghiem'
  },
  {
    question: 'Các bệnh lây qua đường tình dục phổ biến là gì?',
    answer: 'Các bệnh lây truyền qua đường tình dục phổ biến bao gồm: Lậu, Giang mai, Chlamydia, Viêm gan B và C, Herpes sinh dục, Sùi mào gà (HPV), HIV/AIDS, và Trichomonas.',
    category: 'benh-xa-hoi'
  },
  {
    question: 'Các triệu chứng của bệnh lý nam khoa thường gặp',
    answer: 'Các triệu chứng thường gặp của bệnh lý nam khoa bao gồm: đau khi tiểu tiện, tiểu rắt, tiểu buốt, tiểu ra máu, đau vùng bìu, xuất tinh sớm, rối loạn cương dương, và các bất thường về tinh dịch.',
    category: 'benh-ly-nam'
  }
];

const categoryTabs = [
  { key: 'xet-nghiem', label: 'XÉT NGHIỆM & ĐIỀU TRỊ HIV', icon: null },
  { key: 'benh-xa-hoi', label: 'BỆNH XÃ HỘI (STDS)', icon: null },
  { key: 'benh-ly-nam', label: 'BỆNH LÝ NAM KHOA', icon: null },
  { key: 'benh-da-lieu', label: 'BỆNH DA LIỄU', icon: null },
  { key: 'benh-man-tinh', label: 'BỆNH MẠN TÍNH', icon: null },
  { key: 'benh-ngoai-khoa', label: 'BỆNH NGOẠI KHOA', icon: null },
];

const HoiDap = () => {
  const [activeTab, setActiveTab] = useState('xet-nghiem');
  const [activeKeys, setActiveKeys] = useState(['0']);

  const filteredFAQs = faqData.filter(faq => faq.category === activeTab);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setActiveKeys([]);
  };

  const expandIcon = ({ isActive, panelKey }) => {
    return isActive ? (
      <UpOutlined style={{ fontSize: '14px', color: '#3E86F5' }} />
    ) : (
      <DownOutlined style={{ fontSize: '14px', color: '#3E86F5' }} />
    );
  };

  return (
    <div className="hoidap-container">
      <div className="hoidap-header">
        <Title level={2}>Hỏi đáp</Title>
        <div className="title-underline"></div>
      </div>

      <div className="hoidap-content">
        <div className="ask-button-container">
          <Button 
            type="primary" 
            size="large" 
            icon={<CommentOutlined />} 
            className="ask-button"
          >
            GỬI CÂU HỎI
          </Button>
        </div>
        
        <div className="category-tabs">
          {categoryTabs.map(tab => (
            <div 
              key={tab.key} 
              className={`category-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.key)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        <div className="faq-list">
          <Collapse 
            activeKey={activeKeys} 
            onChange={setActiveKeys}
            expandIcon={expandIcon}
            ghost
            className="faq-collapse"
          >
            {filteredFAQs.map((faq, index) => (
              <Panel 
                header={
                  <div className="faq-question">
                    <span>{faq.question}</span>
                  </div>
                } 
                key={index.toString()}
                className="faq-panel"
              >
                <div className="faq-answer">
                  <Paragraph>{faq.answer}</Paragraph>
                </div>
              </Panel>
            ))}
          </Collapse>
        </div>
      </div>
    </div>
  );
};

export default HoiDap;