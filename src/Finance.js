// src/Finance.js
import React, { useState, useEffect } from 'react';

// 유틸
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
    <span style={{position:'relative', marginLeft:'4px', cursor:'help', display:'inline-block'}} 
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
  const [analysisTab, setAnalysisTab] = useState('basic'); 

  // 계약 도우미 상태
  const [showContractHelper, setShowContractHelper] = useState(false);
  const [contractOptions, setContractOptions] = useState({
    loan: false, leak: false, tenant: false, clean: false
  });

  // 입력 상태
  const [myCash, setMyCash] = useState(0);         
  const [income, setIncome] = useState(5000);      
  const [otherDebt, setOtherDebt] = useState(0);   
  const [loanTerm, setLoanTerm] = useState(30);    
  const [interestRate, setInterestRate] = useState(4.0); 

  useEffect(() => {
    if (selectedItem) {
      const priceVal = parsePriceToManwon(selectedItem.price);
      setMyCash(Math.floor(priceVal * 0.3)); 
    }
  }, [selectedItem]);

  // --- [계산 로직] ---
  const housePrice = selectedItem ? parsePriceToManwon(selectedItem.price) : 0;
  
  let taxRate = 0.011;
  if (housePrice > 90000) taxRate = 0.033;
  else if (housePrice > 60000) taxRate = 0.022;
  if (selectedItem && selectedItem.type === '오피스텔') taxRate = 0.046;
  
  const acquisitionTax = Math.floor(housePrice * taxRate);
  const agentFee = Math.floor(housePrice * 0.004);
  const otherCost = 300; 
  const totalInitialCost = housePrice + acquisitionTax + agentFee + otherCost;
  
  const needLoan = Math.max(0, totalInitialCost - myCash);
  
  const monthlyRate = (interestRate / 100) / 12;
  const totalMonths = loanTerm * 12;
  let monthlyPayment = 0;
  if (needLoan > 0) {
    monthlyPayment = Math.floor(
      (needLoan * 10000 * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
    );
  }

  const yearlyPayment = monthlyPayment * 12;
  const totalYearlyDebt = yearlyPayment + (otherDebt * 10000);
  
  // ✅ 경고 원인 해결: dsr, ltv 변수 활용
  const dsr = income > 0 ? ((totalYearlyDebt / (income * 10000)) * 100).toFixed(1) : 0;
  const ltv = housePrice > 0 ? ((needLoan / housePrice) * 100).toFixed(1) : 0;
  
  const holdingTaxYearly = Math.floor(housePrice * 0.7 * 0.002); 
  const maintenanceFee = 200000;

  const ltvLimit = Math.floor(housePrice * 0.7); 
  const maxYearlyPaymentDsr = (income * 10000) * 0.4 - (otherDebt * 10000); 
  
  let dsrLimit = 0;
  if (maxYearlyPaymentDsr > 0) {
      dsrLimit = Math.floor(
          (maxYearlyPaymentDsr / 12 * (Math.pow(1 + monthlyRate, totalMonths) - 1)) / 
          (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 10000
      );
  }
  const finalLoanLimit = Math.min(ltvLimit, dsrLimit);
  const isPossible = finalLoanLimit >= needLoan;

  const requiredYearlyPayment = yearlyPayment; 
  const requiredIncome = Math.ceil((requiredYearlyPayment + (otherDebt * 10000)) / 0.4 / 10000);

  // 배지 스타일 계산
  const isLtvSafe = ltv <= 70;
  const isDsrSafe = dsr <= 40;

  const generateClause = () => {
    let text = "";
    if (contractOptions.loan) text += "1. 매수인의 귀책사유 없이 대출 미승인 시 본 계약은 무효로 하며 계약금을 반환한다.\n";
    if (contractOptions.leak) text += "2. 잔금일로부터 6개월 내 중대 하자(누수 등) 발견 시 매도인이 책임진다.\n";
    if (contractOptions.tenant) text += "3. 현 임대차 계약을 승계하는 조건이며, 잔금일까지 임차인 문제를 해결한다.\n";
    if (contractOptions.clean) text += "4. 잔금일 전까지 폐기물 처리 및 입주 청소를 완료한다.\n";
    return text || "선택된 특약이 없습니다.";
  };

  // 1. 목록 화면
  if (!selectedItem) {
    return (
      <div className="finance-container">
        <div className="sim-header" style={{border:0}}>
            <h2 className="finance-title">💸 자금 & 계약 솔루션</h2>
            <p className="sub-desc">자금 분석, 대출 한도 진단, 계약서 작성까지 한번에!</p>
        </div>
        
        <div className="contract-banner" onClick={() => setShowContractHelper(true)}>
            <div className="cb-icon">⚖️</div>
            <div className="cb-text">
                <strong>안전 계약 특약 생성기</strong>
                <span>전세사기, 대출거절 방지 특약 자동 생성</span>
            </div>
            <div className="cb-arrow">→</div>
        </div>

        <div className="saved-grid" style={{marginTop:'20px'}}>
          {savedList.length === 0 ? (
             <div className="empty-state">📌 저장된 매물이 없습니다.</div>
          ) : savedList.map((item) => (
            <div key={item.id} className="saved-card" onClick={() => setSelectedItem(item)}>
              <div className="card-top">
                <div className="saved-tag">{item.type}</div>
                <div className="saved-price">{item.price}</div>
              </div>
              <div className="saved-name">{item.name}</div>
              <button className="calc-btn">분석 시작 →</button>
            </div>
          ))}
        </div>

        {showContractHelper && (
            <div className="report-overlay" onClick={() => setShowContractHelper(false)}>
                <div className="report-modal" onClick={e => e.stopPropagation()} style={{width:'350px'}}>
                    <div className="report-head" style={{background:'#4f46e5'}}><h3>⚖️ 계약 특약 도우미</h3></div>
                    <div className="report-body">
                        <div className="check-list-group">
                            <label className={`check-item ${contractOptions.loan?'done':''}`} onClick={()=>setContractOptions({...contractOptions, loan:!contractOptions.loan})}>
                                <div className="check-box-ui">{contractOptions.loan?'✔':''}</div><span>대출 안 나올까봐 걱정돼요</span>
                            </label>
                            <label className={`check-item ${contractOptions.leak?'done':''}`} onClick={()=>setContractOptions({...contractOptions, leak:!contractOptions.leak})}>
                                <div className="check-box-ui">{contractOptions.leak?'✔':''}</div><span>누수가 걱정돼요</span>
                            </label>
                        </div>
                        <div className="clause-box">
                            <h5>📄 계약서 특약 사항</h5>
                            <textarea readOnly value={generateClause()} />
                        </div>
                        <button className="report-btn" onClick={()=>alert('복사되었습니다!')}>복사하기</button>
                    </div>
                </div>
            </div>
        )}
      </div>
    );
  }

  // 2. 상세 분석 화면
  return (
    <div className="finance-container">
      <div className="sim-header">
        <button className="back-link" onClick={() => setSelectedItem(null)}>← 목록</button>
        <h3>{selectedItem.name} <span style={{fontSize:'16px', color:'#555'}}>자금 분석</span></h3>
      </div>

      <div className="finance-tabs">
        <button className={`f-tab ${analysisTab==='basic'?'active':''}`} onClick={()=>setAnalysisTab('basic')}>🧾 종합 비용 분석</button>
        <button className={`f-tab ${analysisTab==='advanced'?'active':''}`} onClick={()=>setAnalysisTab('advanced')}>📊 매수 가능성 진단</button>
      </div>

      <div className="analysis-grid">
        <div className="input-section">
            <h4>내 조건 입력</h4>
            <div className="input-group">
                <label>보유 현금</label>
                <div className="input-wrapper"><input type="number" value={myCash} onChange={(e)=>setMyCash(Number(e.target.value))} /><span className="unit">만원</span></div>
            </div>
            <div className="input-group">
                <label>연봉 (세전)</label>
                <div className="input-wrapper"><input type="number" value={income} onChange={(e)=>setIncome(Number(e.target.value))} /><span className="unit">만원</span></div>
            </div>
            <div className="input-group">
                {/* ✅ 경고 해결: HelpTip 사용 */}
                <label>기타 대출 (연 상환액) <HelpTip title="기타 대출" desc="신용대출 등 다른 빚의 연간 원리금 상환액" /></label>
                <div className="input-wrapper"><input type="number" value={otherDebt} onChange={(e)=>setOtherDebt(Number(e.target.value))} /><span className="unit">만원</span></div>
            </div>
            <div className="row-inputs">
                <div className="input-group"><label>금리 (%)</label><div className="input-wrapper small"><input type="number" value={interestRate} step="0.1" onChange={(e)=>setInterestRate(e.target.value)}/></div></div>
                <div className="input-group"><label>기간 (년)</label><div className="input-wrapper small"><input type="number" value={loanTerm} onChange={(e)=>setLoanTerm(e.target.value)}/></div></div>
            </div>
        </div>

        <div className="result-section">
            
            {/* TAB 1: 종합 비용 분석 */}
            {analysisTab === 'basic' && (
                <>
                    <div className="cost-breakdown">
                        <h4>💸 초기 필요 자금</h4>
                        <div className="breakdown-item"><span>집값</span><span>{formatNum(housePrice)} 만원</span></div>
                        <div className="breakdown-item"><span>+ 취득세/중개비/등기</span><span>{formatNum(totalInitialCost - housePrice)} 만원</span></div>
                        <div className="breakdown-total"><span>필요 대출금</span><span style={{color:'#e11d48'}}>{formatNum(needLoan)} 만원</span></div>
                    </div>
                    <div className="loan-analysis-card">
                        {/* ✅ 경고 해결: LTV, DSR 안전도 배지 추가 */}
                        <div className="badge-container">
                            <div className={`status-badge ${isLtvSafe ? 'safe' : 'danger'}`}>LTV {ltv}% {isLtvSafe ? '(안전)' : '(주의)'}</div>
                            <div className={`status-badge ${isDsrSafe ? 'safe' : 'danger'}`}>DSR {dsr}% {isDsrSafe ? '(양호)' : '(위험)'}</div>
                        </div>

                        <div className="monthly-payment-box">
                            <div className="payment-row"><span>월 원리금</span><strong>{formatNum(monthlyPayment)} 원</strong></div>
                            <div className="payment-row"><span>월 관리비+세금</span><span>{formatNum(maintenanceFee + holdingTaxYearly/12)} 원</span></div>
                            <div className="payment-total"><span>총 월 고정지출</span><span style={{color:'#6366f1'}}>{formatNum(monthlyPayment + maintenanceFee + holdingTaxYearly/12)} 원</span></div>
                        </div>
                    </div>
                </>
            )}

            {/* TAB 2: 매수 가능성 진단 */}
            {analysisTab === 'advanced' && (
                <>
                    <div className={`verdict-card ${isPossible ? 'success' : 'fail'}`}>
                        <h4>AI 진단 결과</h4>
                        <div className="verdict-text">{isPossible ? '매수 가능합니다! 🎉' : '자금이 부족해요 🚧'}</div>
                        {!isPossible && <p className="verdict-sub">한도보다 <strong>{formatNum(needLoan - finalLoanLimit)}만원</strong> 더 필요합니다.</p>}
                    </div>

                    <div className="loan-limit-analysis">
                        <h5>📉 대출 한도 병목 분석</h5>
                        <div className="limit-chart">
                            <div className="limit-item">
                                <div className="bar" style={{height:'100%', background:'#e5e7eb'}}></div><span>필요금액<br/>{formatNum(needLoan)}</span>
                            </div>
                            <div className="limit-item">
                                <div className="bar" style={{height:`${Math.min(100, (ltvLimit/Math.max(needLoan,1))*100)}%`, background:'#3b82f6'}}></div><span>LTV한도<br/>{formatNum(ltvLimit)}</span>
                            </div>
                            <div className="limit-item">
                                <div className="bar" style={{height:`${Math.min(100, (dsrLimit/Math.max(needLoan,1))*100)}%`, background: dsrLimit<needLoan?'#ef4444':'#10b981'}}></div><span>DSR한도<br/>{formatNum(dsrLimit)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="income-req-card" style={{marginTop:'15px'}}>
                        <h4>💰 필요 소득 역산</h4>
                        <div className="req-result-box">
                            <span>이 대출을 받기 위한 최소 연봉</span>
                            <strong>{formatNum(requiredIncome)} 만원</strong>
                        </div>
                        <p style={{fontSize:'12px', color:'#666'}}>
                            {income >= requiredIncome ? "현재 소득으로 충분합니다. 👍" : `연봉이 ${formatNum(requiredIncome - income)}만원 부족합니다. 대출 기간을 늘려보세요.`}
                        </p>
                    </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default Finance;