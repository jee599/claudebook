// 시세 시계열 생성 + 투자 지표 계산 엔진.
// - generateHistory : 카드 메타데이터로 현실적인 1년치 일별 시세를 결정론적으로 생성
// - computeMetrics  : 현재가/52주 고저/적정가/추천 매수가/상승확률/가치평가 산출

/** 문자열 → 32bit 시드 */
function hashSeed(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return (h >>> 0);
}

/** 시드 기반 PRNG (mulberry32) — 같은 카드는 항상 같은 시세 */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 표준정규분포 난수 (Box-Muller) */
function gaussian(rng) {
  let u = 0, v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * 카드 1장의 1년치(기본 365일) 일별 시세 생성.
 * 장기추세(trend) + 변동성(volatility) + 완만한 사이클 + 가끔의 스파이크를 섞은 기하브라운운동 변형.
 */
export function generateHistory(card, days = 365, endDate = new Date()) {
  const rng = mulberry32(hashSeed(card.id));
  const out = [];
  // 1년에 걸친 누적 추세를 일 단위 드리프트로 환산
  const dailyDrift = Math.log(1 + card.trend) / days;
  const cyclePhase = rng() * Math.PI * 2;
  const cycleAmp = 0.05 + rng() * 0.08; // ±5~13% 완만한 파동

  let price = card.basePrice;
  for (let i = 0; i < days; i++) {
    const d = new Date(endDate);
    d.setDate(d.getDate() - (days - 1 - i));

    // 추세가 노이즈에 묻히지 않도록 일간 변동성은 적당히 억제
    const shock = gaussian(rng) * card.volatility * 0.55;
    // 발매 인기 카드의 간헐적 급등/급락 이벤트
    let spike = 0;
    if (rng() > 0.99) spike = (rng() - 0.4) * card.volatility * 3;

    const logReturn = dailyDrift + shock + spike;
    price = price * Math.exp(logReturn);

    // 완만한 사이클 가미
    const cycle = 1 + cycleAmp * Math.sin(cyclePhase + (i / days) * Math.PI * 3);
    const shown = Math.max(50, Math.round((price * cycle) / 10) * 10);

    out.push({ date: d.toISOString().slice(0, 10), price: shown });
  }
  return out;
}

/* ---------- 통계 헬퍼 ---------- */
const avg = (arr) => arr.reduce((s, x) => s + x, 0) / arr.length;
const ma = (prices, n) => avg(prices.slice(-n));
function percentile(prices, p) {
  const sorted = [...prices].sort((a, b) => a - b);
  const idx = (sorted.length - 1) * (p / 100);
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}
function stddev(arr) {
  const m = avg(arr);
  return Math.sqrt(avg(arr.map((x) => (x - m) ** 2)));
}
const round10 = (v) => Math.round(v / 10) * 10;

/**
 * 시세 배열로부터 투자 지표 일괄 계산.
 * @param {Array<{date,price}>} history
 * @param {object} card
 */
export function computeMetrics(history, card) {
  const prices = history.map((h) => h.price);
  const n = prices.length;
  const current = prices[n - 1];
  const yearAgo = prices[0];
  const yearChangePct = ((current - yearAgo) / yearAgo) * 100;

  const high52 = Math.max(...prices);
  const low52 = Math.min(...prices);

  // 이동평균 (가용 길이에 맞게)
  const ma30 = ma(prices, Math.min(30, n));
  const ma90 = ma(prices, Math.min(90, n));
  const ma120 = ma(prices, Math.min(120, n));

  // 일간 수익률 변동성
  const returns = [];
  for (let i = 1; i < n; i++) returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  const dailyVol = stddev(returns);
  const annualVol = dailyVol * Math.sqrt(365);

  // 적정가(현재 가치) = 중기 이동평균 기준
  const fairValue = round10(ma120);

  // 추천 매수 구간 — 최근 120일 분포의 하단부
  const recent = prices.slice(-Math.min(120, n));
  const buyLow = round10(percentile(recent, 10));
  const buyHigh = round10(percentile(recent, 30));
  const buyTarget = round10(percentile(recent, 25)); // "이 가격쯤이면 싸게 사는 것"
  const isCheapNow = current <= buyHigh;

  // 가치 평가 (현재가 / 적정가)
  const valRatio = current / fairValue;
  let valuation;
  if (valRatio < 0.92) valuation = "저평가";
  else if (valRatio <= 1.08) valuation = "적정";
  else valuation = "고평가";

  // 상승 확률 — 모멘텀 + 평균회귀 + 장기추세를 로지스틱으로 합성
  const momentum = (ma30 - ma90) / ma90;        // 단기>중기면 상승 모멘텀
  const reversion = (fairValue - current) / fairValue; // 적정가 대비 저평가면 +
  const z = 3.5 * momentum + 1.8 * reversion + 0.6 * card.trend;
  const probUp = Math.min(0.93, Math.max(0.07, 1 / (1 + Math.exp(-z))));

  // 종합 추천
  let recommendation, recoTone;
  if (isCheapNow && probUp >= 0.5) { recommendation = "지금 매수 적기"; recoTone = "buy"; }
  else if (valuation === "고평가" && probUp < 0.45) { recommendation = "매도/관망 고려"; recoTone = "sell"; }
  else if (probUp >= 0.6) { recommendation = "상승 기대 (분할 매수)"; recoTone = "buy"; }
  else { recommendation = "관망 (HOLD)"; recoTone = "hold"; }

  return {
    current,
    yearAgo,
    yearChangePct: +yearChangePct.toFixed(1),
    high52,
    low52,
    fairValue,
    buyLow,
    buyHigh,
    buyTarget,
    isCheapNow,
    valuation,
    valRatio: +valRatio.toFixed(2),
    annualVol: +(annualVol * 100).toFixed(1),
    probUp: Math.round(probUp * 100),
    recommendation,
    recoTone,
  };
}
