// src/dummyData.js

// 서울 주요 거점 좌표 (위도, 경도)
const REGIONS = [
  { name: '강남구', lat: 37.4979, lng: 127.0276, basePrice: 25, typeRatio: 0.8 }, // 아파트 많음
  { name: '서초구', lat: 37.4837, lng: 127.0324, basePrice: 28, typeRatio: 0.9 },
  { name: '용산구', lat: 37.5326, lng: 126.9900, basePrice: 30, typeRatio: 0.7 },
  { name: '마포구', lat: 37.5665, lng: 126.9015, basePrice: 15, typeRatio: 0.6 },
  { name: '성동구', lat: 37.5633, lng: 127.0371, basePrice: 18, typeRatio: 0.7 },
  { name: '영등포구', lat: 37.5264, lng: 126.8962, basePrice: 12, typeRatio: 0.5 },
  { name: '송파구', lat: 37.5145, lng: 127.1066, basePrice: 22, typeRatio: 0.8 },
  { name: '여의도', lat: 37.5215, lng: 126.9243, basePrice: 25, typeRatio: 0.4 }, // 오피스텔 많음
];

// 아파트/오피스텔 이름 데이터베이스
const APT_PREFIX = ['래미안', '자이', '힐스테이트', '푸르지오', '아이파크', '더샵', '롯데캐슬', 'e편한세상', '아크로', '트리마제'];
const OFF_PREFIX = ['시티', '스테이트', '리버뷰', '더하우스', '프라임', '센트럴', '오피스', '스튜디오'];

const getRandom = (min, max) => Math.random() * (max - min) + min;

// 편의시설 랜덤 생성
const getAmenities = () => {
  const list = ['starbucks', 'subway', 'mart', 'park', 'hospital'];
  return list.sort(() => 0.5 - Math.random()).slice(0, Math.floor(getRandom(2, 6)));
};

export const generateDummyData = () => {
  const data = [];
  let idCounter = 0;

  // 각 지역별로 매물 생성
  REGIONS.forEach(region => {
    // 지역당 15~25개 매물 생성
    const count = Math.floor(getRandom(15, 25));
    
    for (let i = 0; i < count; i++) {
      // 1. 주거 유형 결정 (지역별 비율에 따름)
      const isApt = Math.random() < region.typeRatio;
      const type = isApt ? '아파트' : '오피스텔';
      
      // 2. 이름 생성
      const prefix = isApt 
        ? APT_PREFIX[Math.floor(Math.random() * APT_PREFIX.length)]
        : OFF_PREFIX[Math.floor(Math.random() * OFF_PREFIX.length)];
      const name = `${region.name.replace('구','')} ${prefix} ${Math.floor(getRandom(1, 9))}차`;

      // 3. 가격 생성 (지역 시세 반영 + 랜덤 변동)
      const variance = getRandom(0.8, 1.5); // 80% ~ 150% 변동
      // 오피스텔은 아파트 가격의 40% 수준으로 조정
      const typeMultiplier = isApt ? 1 : 0.4;
      const finalPriceVal = (region.basePrice * variance * typeMultiplier).toFixed(1);
      
      // 4. 좌표 생성 (지역 중심에서 넓게 퍼뜨림)
      const lat = region.lat + getRandom(-0.015, 0.015);
      const lng = region.lng + getRandom(-0.02, 0.02);

      data.push({
        id: idCounter++,
        name: name,
        price: `${finalPriceVal}억`,
        priceVal: parseFloat(finalPriceVal), // 정렬/비교용 숫자
        type: type, // 아파트, 오피스텔
        lat: lat,
        lng: lng,
        region: region.name,
        area: Math.floor(getRandom(isApt ? 59 : 20, isApt ? 150 : 60)), // 평수 차이
        floor: Math.floor(getRandom(1, 35)),
        amenities: getAmenities(),
      });
    }
  });

  return data;
};