// src/dummyData.js

const REGIONS = [
  { name: '강남구', lat: 37.4979, lng: 127.0276, basePrice: 25, typeRatio: 0.8 },
  { name: '서초구', lat: 37.4837, lng: 127.0324, basePrice: 28, typeRatio: 0.9 },
  { name: '용산구', lat: 37.5326, lng: 126.9900, basePrice: 30, typeRatio: 0.7 },
  { name: '마포구', lat: 37.5665, lng: 126.9015, basePrice: 15, typeRatio: 0.6 },
  { name: '성동구', lat: 37.5633, lng: 127.0371, basePrice: 18, typeRatio: 0.7 },
  { name: '영등포구', lat: 37.5264, lng: 126.8962, basePrice: 12, typeRatio: 0.5 },
  { name: '송파구', lat: 37.5145, lng: 127.1066, basePrice: 22, typeRatio: 0.8 },
  { name: '여의도', lat: 37.5215, lng: 126.9243, basePrice: 25, typeRatio: 0.4 },
];

const APT_PREFIX = ['래미안', '자이', '힐스테이트', '푸르지오', '아이파크', '더샵', '롯데캐슬', 'e편한세상', '아크로', '트리마제'];
const OFF_PREFIX = ['시티', '스테이트', '리버뷰', '더하우스', '프라임', '센트럴', '오피스', '스튜디오'];
const SCHOOLS = ['서울초', '경기초', '혁신초', '국제초', '부속초'];

const getRandom = (min, max) => Math.random() * (max - min) + min;

const getAmenities = () => {
  const list = ['starbucks', 'subway', 'mart', 'park', 'hospital'];
  return list.sort(() => 0.5 - Math.random()).slice(0, Math.floor(getRandom(2, 6)));
};

export const generateDummyData = () => {
  const data = [];
  let idCounter = 0;

  REGIONS.forEach(region => {
    const count = Math.floor(getRandom(20, 30)); // 클러스터링 테스트를 위해 개수 증가
    
    for (let i = 0; i < count; i++) {
      const isApt = Math.random() < region.typeRatio;
      const type = isApt ? '아파트' : '오피스텔';
      
      const prefix = isApt 
        ? APT_PREFIX[Math.floor(Math.random() * APT_PREFIX.length)]
        : OFF_PREFIX[Math.floor(Math.random() * OFF_PREFIX.length)];
      const name = `${region.name.replace('구','')} ${prefix} ${Math.floor(getRandom(1, 9))}차`;

      const variance = getRandom(0.8, 1.5);
      const typeMultiplier = isApt ? 1 : 0.4;
      
      // 매매가
      const priceNum = Number((region.basePrice * variance * typeMultiplier).toFixed(1)); 
      
      // [NEW] 전세가 (매매가의 60% ~ 95% 랜덤 설정)
      // 깡통전세 시뮬레이션을 위해 일부러 높게 설정
      const jeonseRatio = getRandom(0.6, 0.95); 
      const jeonseNum = Number((priceNum * jeonseRatio).toFixed(1));

      // [NEW] 학교 정보
      const schoolName = region.name.replace('구','') + SCHOOLS[Math.floor(Math.random()*SCHOOLS.length)];

      const lat = region.lat + getRandom(-0.02, 0.02);
      const lng = region.lng + getRandom(-0.025, 0.025);

      data.push({
        id: idCounter++,
        name: name,
        price: `${priceNum}억`,
        priceVal: priceNum,
        jeonseVal: jeonseNum, // 전세가 (숫자)
        type: type,
        lat: lat,
        lng: lng,
        region: region.name,
        area: Math.floor(getRandom(isApt ? 59 : 20, isApt ? 150 : 60)),
        floor: Math.floor(getRandom(1, 35)),
        amenities: getAmenities(),
        school: { name: schoolName, dist: Math.floor(getRandom(1, 15)) } // 도보 거리(분)
      });
    }
  });

  return data;
};