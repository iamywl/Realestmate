// src/components/Home.js
import React from 'react';

const Home = ({ onGoToMap }) => {
  const recommendations = [
    { id: 1, name: '반포 래미안 원베일리', price: '38억 5,000', loc: '서울시 서초구', tag: '신규분양' },
    { id: 2, name: '아크로 리버파크', price: '42억 1,000', loc: '서울시 서초구', tag: '인기매물' },
    { id: 3, name: '한남 더힐', price: '85억', loc: '서울시 용산구', tag: '프리미엄' },
  ];

  return (
    <div className="main-viewport">
      <header className="home-header">
        <div className="top-bar">
          <h1 className="logo">ERS <span>Easy Reality Service</span></h1>
        </div>
      </header>
      <div className="home-content">
         <div className="hero-banner">
             <h3>서울 전역의 매물을 한눈에!</h3>
             <p>아파트부터 오피스텔까지, ERS AI가 분석합니다.</p>
         </div>
         <div className="menu-section">
             <button className="menu-item" onClick={onGoToMap}><div className="icon-box map">🗺️</div><span>지도</span></button>
             <button className="menu-item"><div className="icon-box apt">🏢</div><span>아파트</span></button>
             <button className="menu-item"><div className="icon-box villa">🏡</div><span>오피스텔</span></button>
             <button className="menu-item"><div className="icon-box room">🛋️</div><span>원룸</span></button>
         </div>
         <div className="ticker-bar">
            <span className="badge-hot">HOT</span>
            <span className="ticker-text">실시간 1위: 성수동 트리마제</span>
         </div>
         <div className="section-title">
          <span>오늘의 추천 매물</span>
          <span style={{ fontSize: '13px', color: '#6366f1', cursor: 'pointer' }}>더보기 →</span>
        </div>
        <div className="card-list">
          {recommendations.map(item => (
            <div key={item.id} className="property-card">
              <div className="card-img"></div>
              <div className="card-info">
                <span className="card-tag">{item.tag}</span>
                <h4 className="card-price">{item.price}</h4>
                <span className="card-name">{item.name}</span>
                <span className="card-loc">{item.loc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;