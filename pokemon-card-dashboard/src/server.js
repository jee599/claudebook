// 포켓몬 일본판 카드 시세 대시보드 — API + 정적 프론트 서빙
import express from "express";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execSync } from "node:child_process";
import { openDb, DB_PATH } from "./db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const JPY_TO_KRW = 9.1; // 엔→원 환산(표시용 고정 환율)

// DB 가 없으면 자동 시딩
if (!existsSync(DB_PATH)) {
  console.log("DB 없음 → 자동 시딩 실행...");
  execSync("node " + join(__dirname, "seed.js"), { stdio: "inherit" });
}

const db = openDb();
const app = express();

// DB row(snake_case) → API(camelCase) 매핑
function rowToCard(r) {
  return {
    id: r.id,
    nameJa: r.name_ja,
    nameKo: r.name_ko,
    set: r.set_name,
    number: r.number,
    rarity: r.rarity,
    year: r.year,
    image: r.image,
    current: r.current_price,
    currentKrw: Math.round(r.current_price * JPY_TO_KRW),
    yearChangePct: r.year_change_pct,
    high52: r.high52,
    low52: r.low52,
    fairValue: r.fair_value,
    buyLow: r.buy_low,
    buyHigh: r.buy_high,
    buyTarget: r.buy_target,
    buyTargetKrw: Math.round(r.buy_target * JPY_TO_KRW),
    isCheapNow: !!r.is_cheap_now,
    valuation: r.valuation,
    valRatio: r.val_ratio,
    annualVol: r.annual_vol,
    probUp: r.prob_up,
    recommendation: r.recommendation,
    recoTone: r.reco_tone,
  };
}

// 전체 카드 목록 + 지표 (+ 스파크라인용 축약 시세)
app.get("/api/cards", (req, res) => {
  const rows = db.prepare("SELECT * FROM cards").all();
  const sparkStmt = db.prepare(
    "SELECT price FROM prices WHERE card_id = ? ORDER BY date ASC"
  );
  const cards = rows.map((r) => {
    const all = sparkStmt.all(r.id).map((x) => x.price);
    // 스파크라인은 약 40포인트로 다운샘플
    const step = Math.max(1, Math.floor(all.length / 40));
    const spark = all.filter((_, i) => i % step === 0);
    return { ...rowToCard(r), spark };
  });
  res.json({ rate: JPY_TO_KRW, count: cards.length, cards });
});

// 요약 통계 (대시보드 상단 카드)
app.get("/api/summary", (req, res) => {
  const rows = db.prepare("SELECT * FROM cards").all().map(rowToCard);
  const totalMarket = rows.reduce((s, c) => s + c.current, 0);
  const gainers = rows.filter((c) => c.yearChangePct > 0).length;
  const cheap = rows.filter((c) => c.isCheapNow).length;
  const topGainer = [...rows].sort((a, b) => b.yearChangePct - a.yearChangePct)[0];
  const topPick = [...rows]
    .filter((c) => c.recoTone === "buy")
    .sort((a, b) => b.probUp - a.probUp)[0];
  res.json({
    count: rows.length,
    totalMarket,
    avgChange: +(rows.reduce((s, c) => s + c.yearChangePct, 0) / rows.length).toFixed(1),
    gainers,
    losers: rows.length - gainers,
    cheap,
    topGainer: topGainer && { nameKo: topGainer.nameKo, pct: topGainer.yearChangePct },
    topPick: topPick && { nameKo: topPick.nameKo, probUp: topPick.probUp },
  });
});

// 카드 단건 + 전체 1년치 시세
app.get("/api/cards/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM cards WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "카드를 찾을 수 없습니다." });
  const history = db
    .prepare("SELECT date, price FROM prices WHERE card_id = ? ORDER BY date ASC")
    .all(req.params.id);
  res.json({ ...rowToCard(row), rate: JPY_TO_KRW, history });
});

app.use(express.static(join(__dirname, "..", "public")));

app.listen(PORT, () => {
  console.log(`🎴 대시보드 실행 중 → http://localhost:${PORT}`);
});
