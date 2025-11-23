// src/NaverMap.js
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { generateDummyData } from './dummyData';
import { getClusters } from './utils/clusterUtils'; // 클러스터 유틸
import './NaverMap.css';

function NaverMap({ height = "100%", onMarkerClick, isActive, filterType }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [mapType, setMapType] = useState('HYBRID'); 

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

  // 맵 그리기 함수
  const updateMarkers = useCallback(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    const zoom = map.getZoom(); // 현재 줌 레벨

    // 1. 기존 마커 삭제
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // 2. 데이터 필터링
    const allApts = generateDummyData();
    const filteredApts = allApts.filter(apt => {
        if (filterType === '전체') return true;
        return apt.type === filterType;
    });

    // 3. 클러스터링 계산 (줌 16 이상이면 클러스터링 해제하고 개별 마커 표시)
    let pointsToRender = [];
    if (zoom >= 16) {
        // 개별 매물 모드
        pointsToRender = filteredApts.map(apt => ({ ...apt, isCluster: false }));
    } else {
        // 클러스터 모드
        const clusters = getClusters(filteredApts, zoom);
        pointsToRender = clusters.map(c => ({ ...c, isCluster: true }));
    }

    // 4. 마커 생성
    const newMarkers = pointsToRender.map((point) => {
        // (A) 클러스터 마커
        if (point.isCluster) {
            const marker = new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(point.lat, point.lng),
                map: map,
                icon: {
                    content: `
                      <div class="marker-cluster">
                        ${point.count}
                      </div>
                    `,
                    anchor: new window.naver.maps.Point(25, 25),
                },
                zIndex: 100
            });

            // 클러스터 클릭 시 -> 줌 확대 & 이동
            window.naver.maps.Event.addListener(marker, 'click', () => {
                map.panTo(new window.naver.maps.LatLng(point.lat, point.lng));
                setTimeout(() => {
                    map.setZoom(zoom + 2); // 2단계 확대
                }, 100);
            });
            return marker;
        } 
        
        // (B) 개별 매물 마커
        else {
            const marker = new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(point.lat, point.lng),
                map: map,
                icon: {
                    content: `
                      <div class="marker-price" style="background: ${point.type === '아파트' ? '' : '#10b981'}">
                        ${point.price}
                      </div>
                    `,
                    anchor: new window.naver.maps.Point(22, 11),
                },
                zIndex: 100
            });

            window.naver.maps.Event.addListener(marker, 'click', () => {
                if (onMarkerClick) onMarkerClick(point);
            });
            return marker;
        }
    });

    markersRef.current = newMarkers;
  }, [filterType, onMarkerClick]);

  const initMap = useCallback(() => {
    if (mapInstanceRef.current) return;

    const map = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(37.525, 126.896),
        zoom: 14, // 초기 줌 약간 축소
        mapTypeId: window.naver.maps.MapTypeId.HYBRID,
        scaleControl: false, logoControl: false, mapDataControl: false, zoomControl: false,
    });
    mapInstanceRef.current = map;

    // 줌 변경이나 드래그가 끝날 때마다 마커 다시 계산
    window.naver.maps.Event.addListener(map, 'idle', updateMarkers);
    updateMarkers(); // 최초 실행

  }, [updateMarkers]);

  // 필터가 바뀌면 마커 강제 업데이트
  useEffect(() => {
      updateMarkers();
  }, [filterType, updateMarkers]);

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