export const MENU_ITEMS = {
  services: {
    key: 'services',
    label: 'Dịch vụ',
    children: [
      { key: 'service-1', label: 'Điều trị HIV', path: '/service-booking' },
      { key: 'service-2', label: 'Gói xét nghiệm các bệnh xã hội (STDs)', path: '/service-booking' },
      { key: 'service-3', label: 'Xét nghiệm HIV tại Galant', path: '/service-booking' },
      { key: 'service-4', label: 'Xét nghiệm bệnh lậu tại Galant', path: '/service-booking' },
      { key: 'service-5', label: 'Dự phòng trước phơi nhiễm HIV - PrEP', path: '/service-booking' }
    ]
  },
  news: {
    key: 'news',
    label: 'Tin tức-Sự kiện',
    children: [
      { key: 'news-1', label: 'PrEP miễn phí' },
      { key: 'news-2', label: 'Báo chí Nói về Galant' },
      { key: 'news-3', label: 'Prep thương mại' }
    ]
  },
  knowledge: {
    key: 'knowledge',
    label: 'Kiến thức',
    children: [
      { key: 'knowledge-1', label: 'Điều trị Bệnh HIV' },
      { key: 'knowledge-2', label: 'Bệnh lây qua đường tình dục' }
    ]
  },
  mainMenu: [
    { key: 'hiv-test', label: 'Xét nghiệm HIV' },
    { key: 'pharmacy', label: 'Nhà thuốc' },
    { key: 'contact', label: 'Liên hệ' },
    { key: 'faq', label: 'Hỏi đáp' }
  ]
};

export const CONTACT_INFO = {
  phone: '0938848615',
  email: 'contact@galant.com'
};