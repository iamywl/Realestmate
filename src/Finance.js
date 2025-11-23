// src/Finance.js
import React, { useState, useEffect } from 'react';

// --- 유틸리티 함수 ---
const parsePriceToManwon = (priceStr) => {
  if (!priceStr) return 0;
  let total = 0;
  if (priceStr.includes('억')) {
    const parts = priceStr.split('억');
    total += parseInt(parts[0].replace(/,/g, ''), 10) * 10000;
    if (parts[1]) {
      const rest = parts[1].trim().replace(/,/g, '');
      if (rest) total += parseInt(rest, 10);
    }
  } else {
    total += parseInt(priceStr.replace(/,/g, ''), 10);
  }
  return total;
};
const formatNum = (num) => num ? Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '0';

// 도움말 툴팁
const HelpTip = ({ title, desc }) => {
  const [show, setShow] = useState(false);
  return (
    <span style={{position:'relative', marginLeft:'6px', cursor:'help', display:'inline-block'}} 
          onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
      <span style={{color:'#888', fontSize:'12px', border:'1px solid #ddd', borderRadius:'50%', width:'16px', height:'16px', display:'flex', alignItems:'center', justifyContent:'center'}}>?</span>
      {show && (
        <div style={{
            position:'absolute', bottom:'25px', left:'-80px', width:'220px',
            background:'rgba(0,0,0,0.9)', color:'white', padding:'10px', borderRadius:'8px',
            fontSize:'11px', zIndex:100, lineHeight:'1.5', boxShadow:'0 4px 10px rgba(0,0,0,0.2)'
        }}>
            <strong style={{color:'#ffd700'}}>{title}</strong><br/>{desc}
        </div>
      )}
    </span>
  );
};

const Finance = ({ savedList }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  
  // [입력 상태]
  const [myCash, setMyCash] = useState(0);         // 보유 현금
  const [income, setIncome] = useState(6000);      // 연봉 (DSR용)
  const [otherDebt, setOtherDebt] = useState(0);   // 기타 대출의 연간 원리금 상환액 (DSR용)
  const [loanTerm, setLoanTerm] = useState(30);    // 대출 기간
  const [interestRate, setInterestRate] = useState(4.0); // 대출 금리

  // 매물 선택 시 초기값 세팅
  useEffect(() => {
    if (selectedItem) {
      const priceVal = parsePriceToManwon(selectedItem.price);
      setMyCash(Math.floor(priceVal * 0.4)); // 집값의 40% 보유 가정
    }
  }, [selectedItem]);

  if (!selectedItem && savedList.length === 0) {
    return (
        <div className="finance-container">
            <h2 className="finance-title">💸 자금 상세 분석</h2>
            <div className="empty-state">
              <span style={{fontSize: '40px'}}>📝</span>
              <p>분석할 데이터가 없습니다.<br/>지도에서 매물을 먼저 저장해주세요.</p>
            </div>
        </div>
    );
  }

  if (!selectedItem) {
    return (
      <div className="finance-container">
        <h2 className="finance-title">💸 자금 상세 분석</h2>
        <p className="sub-desc">LTV, DSR 규제부터 세금까지 완벽하게 계산해드립니다.</p>
        <div className="saved-grid">
          {savedList.map((item) => (
            <div key={item.id} className="saved-card" onClick={() => setSelectedItem(item)}>
              <div className="card-top">
                <div className="saved-tag">{item.type}</div>
                <div className="saved-price">{item.price}</div>
              </div>
              <div className="saved-name">{item.name}</div>
              <button className="calc-btn">상세 분석 →</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- [1] 핵심 계산 로직 ---
  const housePrice = parsePriceToManwon(selectedItem.price);

  // 1. 취득세 (주택 가액에 따른 차등 세율)
  // 6억이하: 1.1%, 6~9억: 1.1~3.3%, 9억초과: 3.3% (지방교육세 포함 약식)
  let acqRate = 0.011; 
  if (housePrice > 90000) acqRate = 0.033; // 9억 초과
  else if (housePrice > 60000) {
      // 6~9억 사이 복잡한 구간 (약식으로 중간값 적용)
      acqRate = 0.022; 
  }
  // 오피스텔은 무조건 4.6%
  if (selectedItem.type === '오피스텔') acqRate = 0.046;
  
  const acqTax = Math.floor(housePrice * acqRate);

  // 2. 중개수수료 (상한 요율 적용)
  // 2~9억: 0.4%, 9~12억: 0.5%, 12~15억: 0.6%, 15억~: 0.7%
  let agentRate = 0.004;
  if (housePrice >= 150000) agentRate = 0.007;
  else if (housePrice >= 120000) agentRate = 0.006;
  else if (housePrice >= 90000) agentRate = 0.005;
  if (selectedItem.type === '오피스텔') agentRate = 0.004; // 오피스텔 단일
  
  const agentFee = Math.floor(housePrice * agentRate);

  // 3. 기타 비용 (법무비 + 채권할인 + 인지세 등) -> 대략 0.3% 잡음
  const legalFee = Math.floor(housePrice * 0.003);

  // 4. 총 필요 자금 & 대출금
  const totalCost = housePrice + acqTax + agentFee + legalFee;
  const loanAmount = Math.max(0, totalCost - myCash);

  // --- [2] 규제 비율 계산 (Regulatory) ---
  
  // LTV (Loan To Value)
  const ltv = ((loanAmount / housePrice) * 100).toFixed(1);

  // 월 원리금 상환액 (원리금균등)
  const monthlyRate = (interestRate / 100) / 12;
  const totalMonths = loanTerm * 12;
  let monthlyPayment = 0;
  if (loanAmount > 0) {
    monthlyPayment = Math.floor(
      (loanAmount * 10000 * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
    );
  }
  const yearlyPayment = monthlyPayment * 12; // 연간 주담대 원리금

  // DSR (Debt Service Ratio): (주담대 연원리금 + 기타부채 연원리금) / 연소득
  // otherDebt: 사용자가 입력한 기타 대출의 연간 상환액 (만원 단위라고 가정)
  const totalYearlyDebt = yearlyPayment + (otherDebt * 10000);
  const dsr = income > 0 ? ((totalYearlyDebt / (income * 10000)) * 100).toFixed(1) : 0;

  // DTI (Debt To Income): (주담대 연원리금 + 기타대출 '이자') / 연소득 
  // (간편 계산을 위해 기타대출 전체 상환액의 30%를 이자로 가정)
  const dti = income > 0 ? ((yearlyPayment + (otherDebt * 10000 * 0.3)) / (income * 10000) * 100).toFixed(1) : 0;

  // 보유세 (재산세 + 종부세) 약식 추산 (공시가 70% 가정, 세율 단순화)
  const holdingTaxYearly = Math.floor(housePrice * 0.7 * 0.002); // 0.2% 단순 적용
  const maintenanceFee = 200000; // 관리비 20만원 고정

  // 판정 로직
  const isLtvSafe = ltv <= 70; // 보통 70% 제한
  const isDsrSafe = dsr <= 40; // 1금융권 40% 제한

  return (
    <div className="finance-container">
      <div className="sim-header">
        <button className="back-link" onClick={() => setSelectedItem(null)}>← 목록</button>
        <h3>{selectedItem.name} <span style={{fontSize:'16px', color:'#555'}}>상세 분석</span></h3>
        <div className="price-badge">{selectedItem.price}</div>
      </div>

      <div className="finance-grid-layout">
        
        {/* LEFT: 입력 폼 */}
        <div className="input-column">
            <h4 className="section-head">1. 자금 조건 설정</h4>
            
            <div className="input-card">
                <div className="input-row">
                    <label>보유 현금 (가용 자금)</label>
                    <input type="number" value={myCash} onChange={(e)=>setMyCash(Number(e.target.value))}/>
                    <span className="unit">만원</span>
                </div>
                <div className="input-row">
                    <label>연 소득 (세전)</label>
                    <input type="number" value={income} onChange={(e)=>setIncome(Number(e.target.value))}/>
                    <span className="unit">만원</span>
                </div>
                <div className="input-row">
                    <label>기타 대출 상환액 (연간) <HelpTip title="기타 대출" desc="신용대출, 마통, 학자금 등 다른 빚을 갚는데 1년에 쓰는 원금+이자 총액입니다."/></label>
                    <input type="number" value={otherDebt} onChange={(e)=>setOtherDebt(Number(e.target.value))}/>
                    <span className="unit">만원</span>
                </div>
            </div>

            <div className="input-card">
                <label className="card-label">대출 조건</label>
                <div className="dual-input">
                    <div>
                        <span>금리</span>
                        <input type="number" value={interestRate} step="0.1" onChange={(e)=>setInterestRate(e.target.value)}/>
                        <b>%</b>
                    </div>
                    <div>
                        <span>기간</span>
                        <input type="number" value={loanTerm} onChange={(e)=>setLoanTerm(e.target.value)}/>
                        <b>년</b>
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT: 결과 리포트 */}
        <div className="result-column">
            
            {/* (1) 규제 심사 카드 */}
            <div className="result-card regulation-card">
                <h4 className="card-title">🏦 대출 규제 심사 (DSR/LTV)</h4>
                
                {/* LTV */}
                <div className="reg-row">
                    <div className="reg-label">
                        LTV (담보인정비율) <HelpTip title="LTV" desc="집값 대비 대출금의 비율입니다. 보통 70% (생애최초 80%) 까지 가능합니다."/>
                    </div>
                    <div className="reg-bar-bg">
                        <div className={`reg-bar ${isLtvSafe ? 'safe' : 'danger'}`} style={{width: `${Math.min(ltv, 100)}%`}}></div>
                    </div>
                    <div className={`reg-val ${!isLtvSafe && 'warn'}`}>{ltv}% / 70%</div>
                </div>

                {/* DSR */}
                <div className="reg-row">
                    <div className="reg-label">
                        DSR (총부채상환비율) <HelpTip title="DSR" desc="내 연봉에서 모든 빚을 갚는데 쓰는 돈의 비율입니다. 40%를 넘으면 대출이 거절될 수 있습니다."/>
                    </div>
                    <div className="reg-bar-bg">
                        <div className={`reg-bar ${isDsrSafe ? 'safe' : 'danger'}`} style={{width: `${Math.min(dsr, 100)}%`}}></div>
                    </div>
                    <div className={`reg-val ${!isDsrSafe && 'warn'}`}>{dsr}% / 40%</div>
                </div>

                {/* DTI */}
                <div className="reg-row">
                    <div className="reg-label">DTI (총부채상환비율)</div>
                    <div className="reg-bar-bg">
                        <div className="reg-bar safe" style={{width: `${Math.min(dti, 100)}%`, background:'#aaa'}}></div>
                    </div>
                    <div className="reg-val">{dti}%</div>
                </div>

                {!isDsrSafe && <div className="warning-box">🚨 DSR이 40%를 초과했습니다. 대출 한도가 줄어들 수 있습니다.</div>}
            </div>

            {/* (2) 초기 비용 영수증 */}
            <div className="result-card receipt-card">
                <h4 className="card-title">🧾 초기 필요 자금 명세서</h4>
                <div className="receipt-row head">
                    <span>항목</span><span>금액</span>
                </div>
                <div className="receipt-row">
                    <span>매매가</span><span>{formatNum(housePrice)} 만원</span>
                </div>
                <div className="receipt-row sub">
                    <span>ㄴ 취득세 ({(acqRate*100).toFixed(1)}%)</span>
                    <span>+ {formatNum(acqTax)} 만원</span>
                </div>
                <div className="receipt-row sub">
                    <span>ㄴ 중개보수 (상한)</span>
                    <span>+ {formatNum(agentFee)} 만원</span>
                </div>
                <div className="receipt-row sub">
                    <span>ㄴ 등기/법무비용 (추산)</span>
                    <span>+ {formatNum(legalFee)} 만원</span>
                </div>
                
                <div className="receipt-divider"></div>
                
                <div className="receipt-row total">
                    <span>총 필요 비용</span>
                    <span style={{color:'#6366f1'}}>{formatNum(totalCost)} 만원</span>
                </div>
                <div className="receipt-row final">
                    <span>내 현금 제외 필요 대출금</span>
                    <span style={{color:'#e11d48'}}>{formatNum(loanAmount)} 만원</span>
                </div>
            </div>

            {/* (3) 월 고정 지출 */}
            <div className="result-card monthly-card">
                <h4 className="card-title">🗓 월 예상 납입금</h4>
                <div className="monthly-grid">
                    <div className="m-item">
                        <label>대출 원리금</label>
                        <strong>{formatNum(monthlyPayment)}원</strong>
                    </div>
                    <div className="m-item">
                        <label>보유세 (월환산)</label>
                        <strong>{formatNum(holdingTaxYearly/12)}원</strong>
                    </div>
                    <div className="m-item">
                        <label>관리비 (평균)</label>
                        <strong>{formatNum(maintenanceFee)}원</strong>
                    </div>
                </div>
                <div className="monthly-total">
                    <span>합계 (월)</span>
                    <span>{formatNum(monthlyPayment + (holdingTaxYearly/12) + maintenanceFee)} 원</span>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Finance;