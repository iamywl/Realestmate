import { useEffect, useRef } from 'react';

function NaverMapLoader({ onLoad }) {
  const loadedRef = useRef(false);

  useEffect(() => {
    // 이미 로드되어 있으면 바로 완료 처리
    if (window.naver && window.naver.maps) {
      onLoad?.();
      return;
    }

    if (loadedRef.current) return;
    loadedRef.current = true;

    const naverKey = process.env.REACT_APP_NAVER_MAP_KEY;

    // 스크립트 태그 생성
    const script = document.createElement('script');
    
    // ✅ 수정됨: 사용자님의 원래 방식인 'ncpKeyId'로 복구했습니다.
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverKey}&submodules=geocoder`;
    script.async = true;

    script.onload = () => {
      // 스크립트 로드 후 객체 초기화 대기
      const intervalId = setInterval(() => {
        if (window.naver && window.naver.maps) {
          clearInterval(intervalId);
          onLoad?.();
        }
      }, 100);
    };

    document.head.appendChild(script);
  }, [onLoad]);

  return null;
}

export default NaverMapLoader;