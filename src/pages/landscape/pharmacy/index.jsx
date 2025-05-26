import React from 'react';
import './pharmacy.css';

const Pharmacy = () => {
  return (
    <div className="pharmacy-container">
      <h1>Nhà Thuốc</h1>
      <div className="pharmacy-content">
        <p>Trang nhà thuốc đang được phát triển. Vui lòng quay lại sau.</p>
        <div className="pharmacy-coming-soon">
          <img src="/assets/virus-icon.png" alt="Coming Soon" className="pharmacy-icon" />
          <h2>Coming Soon</h2>
        </div>
      </div>
    </div>
  );
};

export default Pharmacy;
