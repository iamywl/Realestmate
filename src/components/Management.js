// src/components/Management.js
import React, { useState } from 'react';

const Management = () => {
  const [activeTab, setActiveTab] = useState('checklist'); // checklist, guide

  const [checklist, setChecklist] = useState([
    { id: 1, category: '현관', text: '도어락 작동 및 비밀번호 변경', checked: false },
    { id: 2, category: '거실', text: '바닥 마루 찍힘/들뜸 확인', checked: false },
    { id: 3, category: '거실', text: '창문(샷시) 잠금장치 및 방충망', checked: false },
    { id: 4, category: '주방', text: '싱크대 수압 및 하부장 누수', checked: false },
    { id: 5, category: '주방', text: '가스/인덕션 작동 확인', checked: false },
    { id: 6, category: '욕실', text: '변기 물 내림 및 배수 상태', checked: false },
    { id: 7, category: '욕실', text: '타일 깨짐 및 줄눈 오염', checked: false },
  ]);

  const toggleCheck = (id) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const progress = Math.round((checklist.filter(c => c.checked).length / checklist.length) * 100);

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>🛠️ 내 집 관리</h2>
        <p>입주 전 하자 점검부터 살면서 필요한 관리까지</p>
      </div>

      <div className="mgmt-tabs">
        <button className={`mgmt-tab ${activeTab === 'checklist' ? 'active' : ''}`} onClick={() => setActiveTab('checklist')}>✅ 하자 점검</button>
        <button className={`mgmt-tab ${activeTab === 'guide' ? 'active' : ''}`} onClick={() => setActiveTab('guide')}>📘 관리 꿀팁</button>
      </div>

      {activeTab === 'checklist' && (
        <div className="checklist-section">
          <div className="progress-card">
            <div className="progress-info">
              <span>점검 진행률</span>
              <strong>{progress}% 완료</strong>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{width: `${progress}%`}}></div>
            </div>
          </div>

          <div className="check-list-group">
            {checklist.map(item => (
              <div key={item.id} className={`check-item ${item.checked ? 'done' : ''}`} onClick={() => toggleCheck(item.id)}>
                <div className="check-cate">{item.category}</div>
                <div className="check-text">{item.text}</div>
                <div className="check-box-ui">{item.checked ? '✔' : ''}</div>
              </div>
            ))}
          </div>
          <button className="action-btn" style={{marginTop: '20px'}} onClick={() => alert('리포트가 저장되었습니다!')}>
            💾 점검 리포트 저장
          </button>
        </div>
      )}

      {activeTab === 'guide' && (
        <div className="guide-section">
          <div className="guide-card">
            <div className="guide-icon">❄️</div>
            <div className="guide-content">
              <h4>겨울철 결로 예방법</h4>
              <p>환기는 하루 2번 필수! 가구는 벽에서 5cm 띄우세요.</p>
            </div>
          </div>
          <div className="guide-card">
            <div className="guide-icon">🚿</div>
            <div className="guide-content">
              <h4>욕실 곰팡이 박멸</h4>
              <p>락스를 묻힌 휴지를 곰팡이 위에 1시간 올려두세요.</p>
            </div>
          </div>
          <div className="guide-card">
            <div className="guide-icon">⚡</div>
            <div className="guide-content">
              <h4>전기세 절약 꿀팁</h4>
              <p>대기전력 차단 콘센트 사용 시 연 5만원 절약 가능</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Management;