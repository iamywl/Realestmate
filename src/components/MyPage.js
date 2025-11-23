// src/components/MyPage.js
import React from 'react';

const MyPage = ({ savedCount }) => {
  return (
    <div className="page-container">
      <div className="mypage-header">
        <div className="profile-circle">👤</div>
        <div className="profile-info">
          <h3>김ERS 님</h3>
          <p>내 집 마련의 꿈, 현실이 됩니다 ✨</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dash-item">
          <span className="dash-num">{savedCount}</span>
          <span className="dash-label">관심매물</span>
        </div>
        <div className="dash-item">
          <span className="dash-num">2</span>
          <span className="dash-label">최근본</span>
        </div>
        <div className="dash-item">
          <span className="dash-num">0</span>
          <span className="dash-label">상담내역</span>
        </div>
      </div>

      <div className="section-title-row">
        <h3>🏠 홈 서비스 매칭</h3>
      </div>

      <div className="service-grid">
        <div className="service-card">
          <div className="service-icon" style={{background:'#e0e7ff', color:'#4338ca'}}>🎨</div>
          <span>인테리어</span>
        </div>
        <div className="service-card">
          <div className="service-icon" style={{background:'#dcfce7', color:'#15803d'}}>🧹</div>
          <span>입주청소</span>
        </div>
        <div className="service-card">
          <div className="service-icon" style={{background:'#fef3c7', color:'#b45309'}}>🚚</div>
          <span>이사견적</span>
        </div>
        <div className="service-card">
          <div className="service-icon" style={{background:'#fae8ff', color:'#86198f'}}>🛡️</div>
          <span>법무사</span>
        </div>
      </div>

      <div className="banner-box">
        <h4>🌟 프리미엄 멤버십</h4>
        <p>등기 대행 수수료 30% 할인 쿠폰 받기</p>
      </div>

      <div className="menu-list">
        <div className="menu-list-item">내 정보 수정 <span>{'>'}</span></div>
        <div className="menu-list-item">알림 설정 <span>{'>'}</span></div>
        <div className="menu-list-item">고객센터 <span>{'>'}</span></div>
        <div className="menu-list-item logout">로그아웃</div>
      </div>
    </div>
  );
};

export default MyPage;