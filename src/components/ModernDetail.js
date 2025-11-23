// src/components/ModernDetail.js
import React, { useState } from 'react';
import { calcDistance, WORK_LAT, WORK_LNG } from '../utils/geoUtils'; 

const ModernDetail = ({ apt, onClose, onSave, isSaved }) => {
  const [showReport, setShowReport] = useState(false);
  const [activeTab, setActiveTab] = useState('trade'); 
  
  // 인테리어 상태
  const [interiorOpts, setInteriorOpts] = useState({
    wallpaper: false, kitchen: false, bathroom: false, window: false
  });
  
  // 임장 체크리스트 상태
  const [showImjang, setShowImjang] = useState(false);
  const [imjangItems, setImjangItems] = useState({
    water: { label: '수압 (세면대+변기)', checked: false, score: 20 },
    mold: { label: '곰팡이/결로 흔적', checked: false, score: 20 },
    leak: { label: '천장 누수 얼룩', checked: false, score: 20 },
    noise: { label: '층간소음 확인', checked: false, score: 10 },
    sun: { label: '채광 상태', checked: false, score: 15 },
    smell: { label: '하수구 냄새', checked: false, score: 15 },
  });

  if (!apt) return null;

  const dist = calcDistance(WORK_LAT, WORK_LNG, apt.lat, apt.lng);
  const timeByCar = Math.round((dist / 30) * 60);
  
  let basePrice = 0;
  if (typeof apt.priceVal === 'number') basePrice = apt.priceVal;
  else if (apt.price) basePrice = parseFloat(apt.price.replace(/[^0-9.]/g, '')) || 0;
  
  const score = Math.floor(70 + (basePrice/5) + Math.random() * 10);

  // 인테리어 비용 계산
  const pyeong = Math.round(apt.area / 3.3);
  const costs = { wallpaper: pyeong * 5, kitchen: 300, bathroom: 250, window: pyeong * 20 };
  const totalInteriorCost = (
    (interiorOpts.wallpaper ? costs.wallpaper : 0) +
    (interiorOpts.kitchen ? costs.kitchen : 0) +
    (interiorOpts.bathroom ? costs.bathroom : 0) +
    (interiorOpts.window ? costs.window : 0)
  );
  const finalCost = basePrice * 10000 + totalInteriorCost;

  // 임장 점수
  const currentScore = Object.values(imjangItems).reduce((acc, curr) => acc + (curr.checked ? curr.score : 0), 0);
  const toggleCheck = (key) => {
    setImjangItems(prev => ({ ...prev, [key]: { ...prev[key], checked: !prev[key].checked } }));
  };

  const tradeHistory = [
    { date: '25.02.10', price: basePrice * 0.98, floor: 12 },
    { date: '25.01.15', price: basePrice * 0.95, floor: 5 },
    { date: '24.12.20', price: basePrice * 1.02, floor: 21 },
    { date: '24.11.05', price: basePrice * 0.90, floor: 3 },
  ];

  const reviews = [
    { user: '30대 직장인', rating: 5, tags: ['#주차여유', '#뷰맛집'], text: '여의도 출퇴근하기 최고입니다.' },
    { user: '신혼부부', rating: 4, tags: ['#조용함', '#마트가깝'], text: '단지 관리가 잘 되고 조용해요.' },
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
             <select className="detail-select"><option>{apt.area}㎡ ({pyeong}평)</option></select>
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
            <button className={`d-tab ${activeTab==='renov'?'active':''}`} onClick={()=>setActiveTab('renov')}>인테리어</button>
            <button className={`d-tab ${activeTab==='review'?'active':''}`} onClick={()=>setActiveTab('review')}>리뷰</button>
          </div>

          {/* 인테리어 탭 */}
          {activeTab === 'renov' && (
            <div className="renov-container" style={{background:'#f9fafb', padding:'20px', borderRadius:'12px', marginBottom:'20px'}}>
                <h4 style={{margin:'0 0 10px 0', fontSize:'15px'}}>구축 아파트 수리비 계산기</h4>
                <div className="check-grid" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                    <label className={`check-box ${interiorOpts.wallpaper?'on':''}`}>
                        <input type="checkbox" checked={interiorOpts.wallpaper} onChange={(e)=>setInteriorOpts({...interiorOpts, wallpaper:e.target.checked})} />
                        <span>도배/장판</span> <small>+{costs.wallpaper}만</small>
                    </label>
                    <label className={`check-box ${interiorOpts.kitchen?'on':''}`}>
                        <input type="checkbox" checked={interiorOpts.kitchen} onChange={(e)=>setInteriorOpts({...interiorOpts, kitchen:e.target.checked})} />
                        <span>주방 교체</span> <small>+{costs.kitchen}만</small>
                    </label>
                    <label className={`check-box ${interiorOpts.bathroom?'on':''}`}>
                        <input type="checkbox" checked={interiorOpts.bathroom} onChange={(e)=>setInteriorOpts({...interiorOpts, bathroom:e.target.checked})} />
                        <span>욕실 수리</span> <small>+{costs.bathroom}만</small>
                    </label>
                    <label className={`check-box ${interiorOpts.window?'on':''}`}>
                        <input type="checkbox" checked={interiorOpts.window} onChange={(e)=>setInteriorOpts({...interiorOpts, window:e.target.checked})} />
                        <span>샷시 교체</span> <small>+{costs.window}만</small>
                    </label>
                </div>
                <div className="renov-total" style={{marginTop:'20px', borderTop:'2px dashed #ddd', paddingTop:'15px'}}>
                    <div style={{display:'flex', justifyContent:'space-between'}}>
                        <span>총 매입가 (집값+수리비)</span> 
                        <span style={{fontWeight:'900', color:'#6366f1'}}>{(finalCost/10000).toFixed(1)}억</span>
                    </div>
                </div>
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
                <div className="review-list">
                    {reviews.map((rev, idx) => (
                        <div className="review-card" key={idx}>
                            <div className="rev-header">
                                <span className="rev-user">{rev.user}</span>
                                <span className="rev-rating">{'⭐'.repeat(rev.rating)}</span>
                            </div>
                            <p className="rev-text">{rev.text}</p>
                        </div>
                    ))}
                </div>
            </div>
          )}

          <div className="info-grid">
            <div className="info-box"><label>방/욕실</label><span>3개/2개</span></div>
            <div className="info-box"><label>세대수</label><span>500세대</span></div>
          </div>

          <div className="action-buttons-grid">
              <button className="action-btn imjang" onClick={() => setShowImjang(true)}>🕵️ 임장 체크</button>
              <button className="action-btn report" onClick={() => setShowReport(true)}>📄 AI 리포트</button>
              <button className={`action-btn save ${isSaved ? 'saved' : ''}`} onClick={() => onSave(apt)}>
                  {isSaved ? '♥ 저장됨' : '♡ 관심등록'}
              </button>
          </div>
        </div>
      </div>

      {/* 임장 모달 */}
      {showImjang && (
        <div className="report-overlay" onClick={() => setShowImjang(false)}>
            <div className="report-modal" onClick={e => e.stopPropagation()}>
                <div className="report-head" style={{background:'#10b981'}}><h3>🕵️ 임장 체크리스트</h3></div>
                <div className="imjang-body">
                    <div className="imjang-score">점수: <strong>{currentScore}점</strong></div>
                    <div className="check-grid-modal">
                        {Object.keys(imjangItems).map(key => (
                            <div key={key} className={`check-card ${imjangItems[key].checked ? 'checked' : ''}`} onClick={() => toggleCheck(key)}>
                                <div className="check-circle">{imjangItems[key].checked ? '✔' : ''}</div>
                                <span>{imjangItems[key].label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* 리포트 모달 */}
      {showReport && (
        <div className="report-overlay" onClick={() => setShowReport(false)}>
            <div className="report-modal" onClick={e => e.stopPropagation()}>
                <div className="report-head"><div className="score-circle">{score}점</div><h3>ERS 리포트</h3></div>
                <div className="report-body">
                    <div className="report-item">✅ 가격: 적정</div>
                    <div className="report-item">✅ 교통: {timeByCar}분 소요</div>
                    <button className="report-btn">확인</button>
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default ModernDetail;