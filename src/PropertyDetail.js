// src/PropertyDetail.js
import React from 'react';

const PropertyDetail = ({ apt, onClose }) => {
  if (!apt) return null;

  // 가격에서 '억' 제거하고 숫자로 변환 (그래프용 더미 로직)
  // 실제로는 API 데이터를 써야 하지만 여기선 UI 구현 위주로 작성
  
  return (
    <div className="detail-panel">
      {/* 1. 헤더 */}
      <div className="detail-header">
        <button className="back-btn" onClick={onClose}>←</button>
        <h2 className="detail-title">{apt.name}</h2>
        <div className="header-icons">
          <button className="icon-btn">🔗</button>
          <button className="icon-btn">🔔</button>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
      </div>

      <div className="detail-scroll-area">
        {/* 2. 필터 (매매, 평수) */}
        <div className="detail-filter-bar">
          <button className="dropdown-btn active">매매 ⌄</button>
          <button className="dropdown-btn">{apt.area}㎡ ⌄</button>
          <button className="dropdown-btn">80 💬</button>
        </div>

        {/* 3. 메인 가격 정보 */}
        <div className="price-section">
          <span className="sub-text">최근 실거래 기준 1개월 평균</span>
          <h1 className="main-price">{apt.price}</h1>
          
          <div className="price-tabs">
             <button className="tab-btn active">최근 3년</button>
             <button className="tab-btn">전체 기간</button>
             <button className="tab-btn">매매/전세</button>
             <button className="tab-btn">비교</button>
          </div>
        </div>

        {/* 4. 그래프 (SVG로 간단히 구현) */}
        <div className="graph-container">
           <svg viewBox="0 0 300 120" className="chart-svg">
              {/* 배경 격자 */}
              <line x1="0" y1="20" x2="300" y2="20" stroke="#eee" />
              <line x1="0" y1="60" x2="300" y2="60" stroke="#eee" />
              <line x1="0" y1="100" x2="300" y2="100" stroke="#eee" />
              
              {/* 그래프 선 (대충 상승하다 하락하는 모양) */}
              <path 
                d="M0,90 Q50,90 80,60 T150,50 T220,20 T260,80 T300,80" 
                fill="none" 
                stroke="#6b8e23" 
                strokeWidth="3" 
              />
              {/* 최고점 포인트 */}
              <circle cx="220" cy="20" r="5" fill="white" stroke="#6b8e23" strokeWidth="2" />
              <text x="210" y="15" fontSize="10" fill="#ff5a5a">최고</text>
           </svg>
           <div className="graph-labels">
             <span>2023.01</span>
             <span>2024.01</span>
             <span>2025.01</span>
           </div>
        </div>

        <div className="divider"></div>

        {/* 5. 실거래 내역 리스트 */}
        <div className="trade-list-container">
            <div className="list-header-row">
                <span>계약일</span>
                <span>면적(공급)</span>
                <span>가격</span>
            </div>
            
            {/* 더미 거래 내역 5개 생성 */}
            {[1, 2, 3, 4, 5].map((_, i) => (
                <div className="trade-item" key={i}>
                    <div className="trade-date">25.0{5-i}.{10+i}</div>
                    <div className="trade-area">{apt.area}A</div>
                    <div className="trade-price-col">
                        <div className="trade-price">
                            {/* 가격을 조금씩 다르게 보여주기 위한 트릭 */}
                            {apt.price.replace('억', '')}억 {Math.floor(Math.random()*9000)}
                        </div>
                        <div className="trade-floor">
                            <span className="badge-type">중개</span>
                            {Math.floor(Math.random() * 20) + 1}층
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* 6. 하단 고정 버튼 */}
      <div className="detail-bottom-action">
         <button className="notify-btn">🔔 새로운 실거래가 알림받기</button>
      </div>
    </div>
  );
};

export default PropertyDetail;