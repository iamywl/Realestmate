// src/components/ModernDetail.js
import React, { useState } from 'react';
import { calcDistance, WORK_LAT, WORK_LNG } from '../utils/geoUtils'; 

const ModernDetail = ({ apt, onClose, onSave, isSaved }) => {
  const [showReport, setShowReport] = useState(false);
  const [activeTab, setActiveTab] = useState('trade'); 

  if (!apt) return null;

  const dist = calcDistance(WORK_LAT, WORK_LNG, apt.lat, apt.lng);
  const timeByCar = Math.round((dist / 30) * 60);
  
  let basePrice = 0;
  if (typeof apt.priceVal === 'number') {
      basePrice = apt.priceVal;
  } else if (apt.price) {
      basePrice = parseFloat(apt.price.replace(/[^0-9.]/g, '')) || 0;
  }
  
  const score = Math.floor(70 + (basePrice/5) + Math.random() * 10);

  const tradeHistory = [
    { date: '25.02.10', price: basePrice * 0.98, floor: 12 },
    { date: '25.01.15', price: basePrice * 0.95, floor: 5 },
    { date: '24.12.20', price: basePrice * 1.02, floor: 21 },
    { date: '24.11.05', price: basePrice * 0.90, floor: 3 },
  ];

  const reviews = [
    { user: '30대 직장인', rating: 5, tags: ['#주차여유', '#뷰맛집'], text: '여의도 출퇴근하기 최고입니다. 밤에 야경이 진짜 예뻐요.' },
    { user: '신혼부부', rating: 4, tags: ['#조용함', '#마트가깝'], text: '단지 관리가 잘 되고 조용해요. 다만 지하철역까지 걷기엔 살짝 멉니다.' },
    { user: '초등맘', rating: 3, tags: ['#학군보통', '#층간소음'], text: '애들 키우기는 무난한데 윗집 발소리가 좀 들리네요 ㅠㅠ' },
  ];

  return (
    <>
      <div className="detail-panel">
        <div className="detail-header-modern">
          <button className="back-btn" onClick={onClose}>←</button>
          <div className="header-info">
             <div className="apt-type-badge">{apt.type || '부동산'}</div>
             <h2 className="detail-name">{apt.name}</h2>
             <span className="detail-region">{apt.region || '서울시'}</span>
          </div>
          <div className="header-actions">
            <button className="icon-btn">🔗</button>
            <button className="icon-btn">🔔</button>
          </div>
        </div>
        
        <div className="detail-content">
          <div className="detail-filter-row">
             <select className="detail-select"><option>매매</option><option>전세</option></select>
             <select className="detail-select"><option>{apt.area}㎡ ({Math.round(apt.area/3.3)}평)</option></select>
          </div>

          <div className="price-section">
            <span className="price-label">최근 실거래 기준 1개월 평균</span>
            <div className="price-big">{apt.price}</div>
            <div className={`commute-badge ${timeByCar > 40 ? 'commute-red' : 'commute-green'}`}>
               🚗 여의도 직장까지 {timeByCar}분
            </div>
          </div>

          <div className="detail-tabs">
            <button className={`d-tab ${activeTab==='trade'?'active':''}`} onClick={()=>setActiveTab('trade')}>실거래</button>
            <button className={`d-tab ${activeTab==='chart'?'active':''}`} onClick={()=>setActiveTab('chart')}>시세</button>
            <button className={`d-tab ${activeTab==='review'?'active':''}`} onClick={()=>setActiveTab('review')}>거주민 리뷰</button>
          </div>

          {activeTab === 'chart' && (
            <div className="chart-container">
               <div className="dummy-chart">
                 <svg viewBox="0 0 100 50" className="chart-line">
                    <polyline fill="none" stroke="#6366f1" strokeWidth="2" points="0,40 20,35 40,38 60,20 80,25 100,10" />
                    <circle cx="100" cy="10" r="3" fill="#6366f1" />
                 </svg>
                 <div className="chart-labels"><span>23.01</span><span>24.01</span><span>25.01</span></div>
               </div>
               <div className="ai-insight">💡 <strong>ERS Insight:</strong> 최근 1년간 <strong>15% 상승</strong>했습니다.</div>
            </div>
          )}

          {activeTab === 'trade' && (
             <div className="trade-list">
                <div className="trade-header"><span>계약일</span><span>가격</span><span>층</span></div>
                {tradeHistory.map((t, i) => (
                    <div className="trade-row" key={i}>
                        <span>{t.date}</span>
                        <strong>{t.price ? t.price.toFixed(1) : '-'}억</strong>
                        <span>{t.floor}층</span>
                    </div>
                ))}
             </div>
          )}

          {activeTab === 'review' && (
            <div className="review-section">
                <div className="review-summary">
                    <span className="score-avg">4.2</span>
                    <span className="score-stars">⭐⭐⭐⭐☆</span>
                    <span className="score-count">(35명 참여)</span>
                </div>
                <div className="review-list">
                    {reviews.map((rev, idx) => (
                        <div className="review-card" key={idx}>
                            <div className="rev-header">
                                <span className="rev-user">{rev.user}</span>
                                <span className="rev-rating">{'⭐'.repeat(rev.rating)}</span>
                            </div>
                            <div className="rev-tags">{rev.tags.map(tag => <span key={tag} className="rev-tag">{tag}</span>)}</div>
                            <p className="rev-text">{rev.text}</p>
                        </div>
                    ))}
                </div>
                <button className="write-review-btn">나도 리뷰 쓰기 ✍️</button>
            </div>
          )}

          <div className="info-grid">
            <div className="info-box"><label>방/욕실</label><span>3개/2개</span></div>
            <div className="info-box"><label>현관구조</label><span>계단식</span></div>
            <div className="info-box"><label>세대수</label><span>500세대</span></div>
            <div className="info-box"><label>연식</label><span>10년차</span></div>
          </div>

          <div style={{marginTop: '20px'}}>
             <label style={{fontSize:'12px', fontWeight:'bold', color:'#666'}}>🏙️ 주변 인프라</label>
             <div className="lifestyle-grid">
                {['starbucks', 'subway', 'mart', 'park'].map(type => {
                    const has = apt.amenities && apt.amenities.includes(type);
                    return (
                        <div key={type} className={`life-badge ${has ? 'active' : ''}`}>
                            <span className="life-icon">
                                {type==='starbucks'?'☕':type==='subway'?'🚇':type==='mart'?'🛒':'🌳'}
                            </span>
                            {type==='starbucks'?'스세권':type==='subway'?'역세권':type==='mart'?'몰세권':'공세권'}
                        </div>
                    )
                })}
             </div>
          </div>

          <div className="action-buttons">
              <button className="action-btn report" onClick={() => setShowReport(true)}>📄 AI 리포트</button>
              <button 
                  className={`action-btn save ${isSaved ? 'saved' : ''}`} 
                  onClick={() => onSave(apt)}
              >
                  {isSaved ? '♥ 저장됨' : '♡ 관심등록'}
              </button>
          </div>
        </div>
      </div>

      {showReport && (
        <div className="report-overlay" onClick={() => setShowReport(false)}>
            <div className="report-modal" onClick={e => e.stopPropagation()}>
                <div className="report-head">
                    <div className="score-circle">{score}점</div>
                    <h3>ERS 프리미엄 리포트</h3>
                </div>
                <div className="report-body">
                    <div className="report-item">✅ <strong>가격:</strong> 주변 시세 대비 적정</div>
                    <div className="report-item">✅ <strong>교통:</strong> 여의도 {timeByCar}분</div>
                    <div className="report-item">✨ <strong>총평:</strong> 30대 직장인에게 추천!</div>
                    <button className="report-btn">💾 리포트 저장</button>
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default ModernDetail;