// src/components/AssetPlanner.js
import React, { useState, useEffect } from 'react';

const AssetPlanner = ({ targetPrice, targetName }) => {
  // 입력 상태
  const [currentAsset, setCurrentAsset] = useState(5000); // 현재 자산 (만원)
  const [monthlySaving, setMonthlySaving] = useState(200); // 월 저축액 (만원)
  const [savingRate, setSavingRate] = useState(3.5); // 예금 금리 (%)
  const [inflationRate, setInflationRate] = useState(2.0); // 집값 상승률 (%)

  // 결과 상태
  const [result, setResult] = useState(null);

  const calculateDDay = () => {
    let months = 0;
    let collected = currentAsset;
    let houseCost = targetPrice; // 만원 단위

    // 무한 루프 방지 (최대 50년)
    while (collected < houseCost && months < 600) {
      // 1. 저축액에 이자 붙이기 (월복리)
      collected = collected * (1 + (savingRate / 100 / 12)) + monthlySaving;
      
      // 2. 집값도 오른다 (월 단위 인플레이션 반영)
      // 연 2% 상승이면 월에는 2/12% 상승
      houseCost = houseCost * (1 + (inflationRate / 100 / 12));
      
      months++;
    }

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    setResult({
      years,
      months: remainingMonths,
      finalAsset: Math.round(collected),
      finalHousePrice: Math.round(houseCost),
      isImpossible: months >= 600
    });
  };

  // 값이 바뀔 때마다 자동 계산
  useEffect(() => {
    if (targetPrice > 0) calculateDDay();
  }, [currentAsset, monthlySaving, savingRate, inflationRate, targetPrice]);

  const formatNum = (num) => num.toLocaleString();

  return (
    <div className="planner-container">
      <div className="planner-header">
        <h4>📅 내 집 마련 D-Day 플래너</h4>
        <p><strong>{targetName}</strong> 구매까지 얼마나 걸릴까요?</p>
      </div>

      <div className="planner-grid">
        {/* 입력 섹션 */}
        <div className="planner-inputs">
          <div className="input-group">
            <label>현재 모은 돈 (만원)</label>
            <input type="number" value={currentAsset} onChange={(e) => setCurrentAsset(Number(e.target.value))} />
          </div>
          <div className="input-group">
            <label>월 저축 가능액 (만원)</label>
            <input type="number" value={monthlySaving} onChange={(e) => setMonthlySaving(Number(e.target.value))} />
          </div>
          <div className="slider-group">
            <label>예금 금리 (수익률): <b>{savingRate}%</b></label>
            <input type="range" min="1" max="10" step="0.1" value={savingRate} onChange={(e)=>setSavingRate(Number(e.target.value))} />
          </div>
          <div className="slider-group">
            <label>집값 상승률 (물가): <b>{inflationRate}%</b></label>
            <input type="range" min="0" max="10" step="0.1" value={inflationRate} onChange={(e)=>setInflationRate(Number(e.target.value))} />
          </div>
        </div>

        {/* 결과 섹션 */}
        <div className="planner-result">
          {result && (
            <>
              {result.isImpossible ? (
                <div className="result-fail">
                  😰 50년이 걸려도 구매가 어려워요.<br/>저축액을 늘리거나 목표를 조정해보세요.
                </div>
              ) : (
                <div className="result-success">
                  <span className="d-day-badge">D-{result.years * 365 + result.months * 30}일</span>
                  <div className="time-text">
                    약 <strong>{result.years}년 {result.months}개월</strong> 뒤<br/>
                    내 집이 됩니다! 🎉
                  </div>
                  <div className="future-info">
                    <p>미래 모은 돈: {formatNum(result.finalAsset)}만원</p>
                    <p>미래 집값: {formatNum(result.finalHousePrice)}만원</p>
                  </div>
                </div>
              )}
              
              {/* 간단한 시각화 바 */}
              {!result.isImpossible && (
                <div className="progress-track">
                   <div className="progress-current" style={{width: `${(currentAsset/result.finalHousePrice)*100}%`}}></div>
                   <div className="progress-saving" style={{width: `${100 - (currentAsset/result.finalHousePrice)*100}%`}}></div>
                   <span className="track-label">현재 자산</span>
                   <span className="track-label right">미래 저축분</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetPlanner;