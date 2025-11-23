// src/App.js
import React, { useState } from 'react';
import NaverMapLoader from './NaverMapLoader';
import NaverMap from './NaverMap';
import Finance from './Finance';
// ✅ [NEW] 분리한 컴포넌트들 불러오기
import Home from './components/Home';
import FloatingSearch from './components/FloatingSearch';
import BottomNav from './components/BottomNav';
import ModernDetail from './components/ModernDetail';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [mapReady, setMapReady] = useState(false);
  const [selectedApt, setSelectedApt] = useState(null);
  const [savedList, setSavedList] = useState([]);
  const [filterType, setFilterType] = useState('전체');

  const toggleSave = (apt) => {
    const exists = savedList.find(item => item.id === apt.id);
    if (exists) setSavedList(savedList.filter(item => item.id !== apt.id));
    else setSavedList([...savedList, apt]);
  };

  return (
    <div className="app-layout">
      {/* 1. 홈 탭 */}
      {activeTab === 'home' && <Home onGoToMap={() => setActiveTab('map')} />}

      {/* 2. 지도 탭 */}
      <div className="map-viewport" style={{ display: activeTab === 'map' ? 'block' : 'none' }}>
        
        {activeTab === 'map' && (
          <FloatingSearch filterType={filterType} setFilterType={setFilterType} />
        )}
        
        {selectedApt && (
          <ModernDetail 
            apt={selectedApt} 
            onClose={() => setSelectedApt(null)}
            onSave={toggleSave}
            isSaved={savedList.some(item => item.id === selectedApt.id)}
          />
        )}

        <NaverMapLoader onLoad={() => setMapReady(true)} />
        {mapReady && (
          <NaverMap 
            height="100%" 
            isActive={activeTab === 'map'}
            filterType={filterType} 
            onMarkerClick={(apt) => setSelectedApt(apt)} 
          />
        )}
      </div>

      {/* 3. 금융 탭 */}
      {activeTab === 'finance' && <div className="main-viewport"><Finance savedList={savedList} /></div>}
      
      {/* 4. 마이페이지 탭 */}
      {activeTab === 'mypage' && (
         <div className="main-viewport" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <h2>마이페이지 (준비중)</h2>
         </div>
      )}

      {/* 5. 하단 네비게이션 (독) */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;