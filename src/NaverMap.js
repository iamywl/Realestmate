// src/NaverMap.js
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { generateDummyData } from './dummyData';
import './NaverMap.css';

// ✅ filterType prop 추가
function NaverMap({ height = "100%", onMarkerClick, isActive, filterType }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [mapType, setMapType] = useState('HYBRID'); 

  // ... (changeMapType, handleZoom 등 기존 함수 유지) ...
  const changeMapType = (type) => {
    if (!mapInstanceRef.current || !window.naver) return;
    setMapType(type);
    const typeId = type === 'HYBRID' ? window.naver.maps.MapTypeId.HYBRID : window.naver.maps.MapTypeId.NORMAL;
    mapInstanceRef.current.setMapTypeId(typeId);
  };

  const handleZoom = (delta) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + delta);
  };

  const initMap = useCallback(() => {
    if (mapInstanceRef.current) {
        // 맵이 이미 있으면 마커만 새로고침하는 로직으로 분기 가능하지만, 
        // 여기선 간편하게 마커 재생성 로직을 실행합니다.
    } else {
        const map = new window.naver.maps.Map(mapRef.current, {
            center: new window.naver.maps.LatLng(37.525, 126.896),
            zoom: 15,
            mapTypeId: window.naver.maps.MapTypeId.HYBRID,
            scaleControl: false, logoControl: false, mapDataControl: false, zoomControl: false,
        });
        mapInstanceRef.current = map;
    }

    // 1. 기존 마커 삭제 (초기화)
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // 2. 데이터 필터링
    const allApts = generateDummyData();
    const filteredApts = allApts.filter(apt => {
        if (filterType === '전체') return true;
        return apt.type === filterType; // '아파트' or '오피스텔'
    });

    // 3. 필터링된 데이터로 마커 생성
    const newMarkers = filteredApts.map((apt) => {
        const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(apt.lat, apt.lng),
            map: mapInstanceRef.current,
            icon: {
                content: `
                  <div class="marker-price" style="background: ${apt.type === '아파트' ? '' : '#10b981'}">
                    ${apt.price}
                  </div>
                `,
                anchor: new window.naver.maps.Point(22, 11),
            },
            zIndex: 100
        });

        window.naver.maps.Event.addListener(marker, 'click', () => {
            if (onMarkerClick) onMarkerClick(apt);
        });

        return marker;
    });

    markersRef.current = newMarkers;
  }, [onMarkerClick, filterType]); // ✅ filterType이 바뀌면 재실행

  // ... (useEffect 부분 유지) ...
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (window.naver && window.naver.maps) {
        clearInterval(checkInterval);
        initMap();
      }
    }, 100);
    return () => clearInterval(checkInterval);
  }, [initMap]); 

  useEffect(() => {
    if (isActive && mapInstanceRef.current && mapRef.current) {
      setTimeout(() => {
        const map = mapInstanceRef.current;
        const w = mapRef.current.offsetWidth;
        const h = mapRef.current.offsetHeight;
        map.setSize(new window.naver.maps.Size(w, h));
      }, 100);
    }
  }, [isActive]);

  return (
    <div className="map-container" style={{ height: height }}>
      <div ref={mapRef} className="map-element" />
      <div className="map-controls">
        <div className="control-group">
          <button className={`control-btn ${mapType === 'NORMAL' ? 'active' : ''}`} onClick={() => changeMapType('NORMAL')}>지도</button>
          <button className={`control-btn ${mapType === 'HYBRID' ? 'active' : ''}`} onClick={() => changeMapType('HYBRID')}>위성</button>
        </div>
        <div className="control-group">
          <button className="control-btn icon" onClick={() => handleZoom(1)}>+</button>
          <button className="control-btn icon" onClick={() => handleZoom(-1)}>-</button>
        </div>
      </div>
    </div>
  );
}

export default NaverMap;