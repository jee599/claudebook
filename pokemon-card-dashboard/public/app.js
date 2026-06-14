// 대시보드 프론트엔드 로직
let ALL = [];
let RATE = 9.1;
let detailChart = null;

const $ = (sel) => document.querySelector(sel);
const fmtYen = (v) => "¥" + v.toLocaleString("ja-JP");
const fmtWon = (v) => "₩" + v.toLocaleString("ko-KR");

const RARITY_LABEL = {
  UR: "UR 울트라레어", SAR: "SAR 스페셜아트", HR: "HR 하이퍼레어",
  SR: "SR 슈퍼레어", CHR: "CHR 캐릭터레어", AR: "AR 아트레어", PROMO: "PROMO 프로모",
};

init();

async function init() {
  const [summary, cardsRes] = await Promise.all([
    fetch("/api/summary").then((r) => r.json()),
    fetch("/api/cards").then((r) => r.json()),
  ]);
  ALL = cardsRes.cards;
  RATE = cardsRes.rate;
  $("#rateBadge").textContent = `1¥ ≈ ₩${RATE} · 카드 ${cardsRes.count}종`;

  renderSummary(summary);
  buildRarityFilter();
  bindControls();
  render();
}

function renderSummary(s) {
  const el = $("#summary");
  el.innerHTML = `
    ${stat("등록 카드", `${s.count}종`)}
    ${stat("전체 평균 1년 수익률", `${s.avgChange > 0 ? "+" : ""}${s.avgChange}%`, s.avgChange >= 0 ? "up" : "down")}
    ${stat("상승 / 하락", `${s.gainers} / ${s.losers}`)}
    ${stat("지금 저렴한 카드", `${s.cheap}종`)}
    ${stat("최고 상승 카드", s.topGainer ? `${s.topGainer.nameKo}` : "-", "", "small", s.topGainer ? `+${s.topGainer.pct}%` : "")}
    ${stat("AI 추천 1순위", s.topPick ? `${s.topPick.nameKo}` : "-", "", "small", s.topPick ? `상승확률 ${s.topPick.probUp}%` : "")}
  `;
}
function stat(label, value, tone = "", size = "", extra = "") {
  return `<div class="stat"><div class="label">${label}</div>
    <div class="value ${size} ${tone === "up" ? "" : ""}" ${tone ? `style="color:var(--${tone})"` : ""}>${value}</div>
    ${extra ? `<div class="label" style="margin-top:4px">${extra}</div>` : ""}</div>`;
}

function buildRarityFilter() {
  const sel = $("#rarityFilter");
  const rarities = [...new Set(ALL.map((c) => c.rarity))];
  for (const r of rarities) {
    const o = document.createElement("option");
    o.value = r; o.textContent = RARITY_LABEL[r] || r;
    sel.appendChild(o);
  }
}

function bindControls() {
  ["search", "rarityFilter", "recoFilter", "sortBy"].forEach((id) =>
    $("#" + id).addEventListener("input", render)
  );
  $("#cheapOnly").addEventListener("change", render);
  $("#closeModal").addEventListener("click", closeModal);
  $("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
}

function render() {
  const q = $("#search").value.trim().toLowerCase();
  const rarity = $("#rarityFilter").value;
  const reco = $("#recoFilter").value;
  const sortBy = $("#sortBy").value;
  const cheapOnly = $("#cheapOnly").checked;

  let list = ALL.filter((c) => {
    if (rarity && c.rarity !== rarity) return false;
    if (reco && c.recoTone !== reco) return false;
    if (cheapOnly && !c.isCheapNow) return false;
    if (q) {
      const hay = `${c.nameKo} ${c.nameJa} ${c.set} ${c.rarity}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  list.sort((a, b) => {
    if (sortBy === "cheap") return (a.current / a.fairValue) - (b.current / b.fairValue);
    return b[sortBy] - a[sortBy];
  });

  const grid = $("#grid");
  grid.innerHTML = list.map(cardHtml).join("");
  $("#emptyMsg").hidden = list.length > 0;
  grid.querySelectorAll(".card").forEach((el) =>
    el.addEventListener("click", () => openDetail(el.dataset.id))
  );
}

function cardHtml(c) {
  const [c1, c2] = c.image.split(",");
  const up = c.yearChangePct >= 0;
  return `
  <article class="card" data-id="${c.id}">
    <div class="card-head">
      <div class="thumb" style="background:linear-gradient(160deg,${c1},${c2})">🎴</div>
      <div class="card-title">
        <div class="ko">${c.nameKo}</div>
        <div class="ja">${c.nameJa}</div>
        <div class="tags">
          <span class="tag rarity">${c.rarity}</span>
          <span class="tag">${c.set}</span>
          <span class="tag">${c.year}</span>
        </div>
      </div>
    </div>

    <div class="price-row">
      <div class="price">${fmtYen(c.current)}<span class="krw">${fmtWon(c.currentKrw)}</span></div>
      <div class="chg ${up ? "up" : "down"}">${up ? "▲" : "▼"} ${Math.abs(c.yearChangePct)}%</div>
    </div>

    <div class="spark">${sparkSvg(c.spark, up)}</div>

    <div class="metrics">
      <div class="metric"><div class="m-label">적정가(현재 가치)</div><div class="m-value">${fmtYen(c.fairValue)}</div></div>
      <div class="metric"><div class="m-label">싸게 사는 가격</div><div class="m-value" style="color:var(--buy)">${fmtYen(c.buyTarget)}</div></div>
      <div class="metric"><div class="m-label">가치 평가</div><div class="m-value">${valBadge(c.valuation)}</div></div>
      <div class="metric"><div class="m-label">변동성(연)</div><div class="m-value">${c.annualVol}%</div></div>
    </div>

    <div class="prob-wrap">
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:4px">
        <span>상승 확률</span><span style="color:var(--text);font-weight:700">${c.probUp}%</span>
      </div>
      <div class="prob-bar"><div class="prob-fill" style="width:${c.probUp}%"></div></div>
    </div>

    <div class="reco">
      <span class="pill ${c.recoTone}">${c.recommendation}</span>
      ${c.isCheapNow ? '<span class="cheap-flag">· 지금 저렴 👍</span>' : ""}
    </div>
  </article>`;
}

function valBadge(v) {
  const color = v === "저평가" ? "var(--buy)" : v === "고평가" ? "var(--sell)" : "var(--hold)";
  return `<span style="color:${color}">${v}</span>`;
}

// 간단한 인라인 SVG 스파크라인
function sparkSvg(data, up) {
  if (!data || data.length < 2) return "";
  const w = 270, h = 46, pad = 2;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const color = up ? "#2ecc71" : "#ff5d5d";
  const area = `${pad},${h} ${pts.join(" ")} ${w - pad},${h}`;
  return `<svg width="100%" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <polygon points="${area}" fill="${color}" opacity="0.12"/>
    <polyline points="${pts.join(" ")}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>
  </svg>`;
}

/* ---------- 상세 모달 ---------- */
async function openDetail(id) {
  const c = await fetch(`/api/cards/${id}`).then((r) => r.json());
  const up = c.yearChangePct >= 0;
  const [c1, c2] = c.image.split(",");

  $("#modalContent").innerHTML = `
    <div style="display:flex;gap:16px;align-items:center">
      <div class="thumb" style="width:70px;height:96px;font-size:30px;background:linear-gradient(160deg,${c1},${c2})">🎴</div>
      <div>
        <h2>${c.nameKo} <span class="tag rarity">${c.rarity}</span></h2>
        <p class="ja">${c.nameJa} · ${c.set} · ${c.number} · ${c.year}년</p>
        <div style="font-size:28px;font-weight:800">${fmtYen(c.current)}
          <span style="font-size:14px;color:var(--muted)">${fmtWon(c.currentKrw)}</span>
          <span class="chg ${up ? "up" : "down"}" style="font-size:16px;margin-left:8px">${up ? "▲" : "▼"} ${Math.abs(c.yearChangePct)}% (1년)</span>
        </div>
      </div>
    </div>

    <div class="detail-grid">
      <div class="metric"><div class="m-label">52주 최고</div><div class="m-value">${fmtYen(c.high52)}</div></div>
      <div class="metric"><div class="m-label">52주 최저</div><div class="m-value">${fmtYen(c.low52)}</div></div>
      <div class="metric"><div class="m-label">적정가(현재 가치)</div><div class="m-value">${fmtYen(c.fairValue)}</div></div>
      <div class="metric"><div class="m-label">가치 평가</div><div class="m-value">${valBadge(c.valuation)} (${c.valRatio}x)</div></div>
      <div class="metric"><div class="m-label">상승 확률</div><div class="m-value">${c.probUp}%</div></div>
      <div class="metric"><div class="m-label">연 변동성</div><div class="m-value">${c.annualVol}%</div></div>
    </div>

    <div class="chart-box"><canvas id="detailChart" height="120"></canvas></div>

    <div class="advice">
      💡 <b>매수 가이드</b><br/>
      추천 매수 구간: <b>${fmtYen(c.buyLow)} ~ ${fmtYen(c.buyHigh)}</b>
      (이 가격쯤이면 싸게 사는 편 · 목표가 <b>${fmtYen(c.buyTarget)}</b> / ${fmtWon(c.buyTargetKrw)})<br/>
      ${adviceText(c)}<br/>
      종합 의견: <span class="pill ${c.recoTone}" style="display:inline-block;margin-top:6px">${c.recommendation}</span>
    </div>
  `;
  $("#modal").hidden = false;
  drawChart(c);
}

function adviceText(c) {
  const gap = (((c.current - c.fairValue) / c.fairValue) * 100).toFixed(1);
  if (c.valuation === "저평가")
    return `현재가는 적정가보다 <b>${Math.abs(gap)}% 낮습니다</b>. 저평가 구간이라 분할 매수에 유리합니다.`;
  if (c.valuation === "고평가")
    return `현재가가 적정가보다 <b>${gap}% 높습니다</b>. 단기 과열 가능성이 있어 조정 시 매수를 권합니다.`;
  return `현재가는 적정가 근처(<b>${gap}%</b>)입니다. 추천 매수 구간까지 기다리면 더 안전합니다.`;
}

function drawChart(c) {
  const ctx = document.getElementById("detailChart");
  if (detailChart) detailChart.destroy();
  const labels = c.history.map((h) => h.date);
  const prices = c.history.map((h) => h.price);
  const up = c.yearChangePct >= 0;
  const line = up ? "#2ecc71" : "#ff5d5d";

  detailChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: "시세(¥)", data: prices, borderColor: line, backgroundColor: line + "22",
          fill: true, tension: 0.25, pointRadius: 0, borderWidth: 2 },
        { label: "적정가", data: prices.map(() => c.fairValue), borderColor: "#9aa3b5",
          borderDash: [6, 6], pointRadius: 0, borderWidth: 1.5, fill: false },
        { label: "싸게 사는 가격", data: prices.map(() => c.buyTarget), borderColor: "#3b6cff",
          borderDash: [3, 3], pointRadius: 0, borderWidth: 1.5, fill: false },
      ],
    },
    options: {
      responsive: true,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { labels: { color: "#9aa3b5", usePointStyle: true, boxWidth: 8 } },
        tooltip: { callbacks: { label: (i) => `${i.dataset.label}: ¥${i.parsed.y.toLocaleString()}` } },
      },
      scales: {
        x: { ticks: { color: "#9aa3b5", maxTicksLimit: 8 }, grid: { color: "#ffffff10" } },
        y: { ticks: { color: "#9aa3b5", callback: (v) => "¥" + v.toLocaleString() }, grid: { color: "#ffffff10" } },
      },
    },
  });
}

function closeModal() {
  $("#modal").hidden = true;
  if (detailChart) { detailChart.destroy(); detailChart = null; }
}
