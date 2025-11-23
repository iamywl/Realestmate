// src/utils/clusterUtils.js

// 지도 줌 레벨에 따른 그리드 크기 (단위: 도)
// 줌이 작을수록(멀리 볼수록) 그리드를 크게 잡아서 많이 뭉칩니다.
const getGridSize = (zoom) => {
    if (zoom >= 19) return 0.0005;
    if (zoom >= 17) return 0.002;
    if (zoom >= 15) return 0.005;
    if (zoom >= 13) return 0.02;
    return 0.05;
};

export const getClusters = (data, zoom) => {
    const clusters = {};
    const gridSize = getGridSize(zoom);

    data.forEach(item => {
        // 위도, 경도를 그리드 크기로 나누어 키를 생성 (격자핑)
        const gridX = Math.floor(item.lat / gridSize);
        const gridY = Math.floor(item.lng / gridSize);
        const key = `${gridX}-${gridY}`;

        if (!clusters[key]) {
            clusters[key] = [];
        }
        clusters[key].push(item);
    });

    // 각 클러스터의 중심 좌표 계산
    return Object.values(clusters).map(items => {
        const sumLat = items.reduce((acc, cur) => acc + cur.lat, 0);
        const sumLng = items.reduce((acc, cur) => acc + cur.lng, 0);
        
        return {
            lat: sumLat / items.length,
            lng: sumLng / items.length,
            count: items.length,
            items: items, // 포함된 매물들
            id: items[0].id // 대표 ID
        };
    });
};