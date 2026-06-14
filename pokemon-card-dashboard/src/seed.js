// 카드 카탈로그 + 1년치 시세를 SQLite 에 시딩하고 지표를 사전 계산한다.
// 실행:  npm run seed
import { existsSync, unlinkSync } from "node:fs";
import { CARDS } from "../data/cards.js";
import { generateHistory, computeMetrics } from "./analytics.js";
import { openDb, initSchema, DB_PATH } from "./db.js";

// 기존 DB 초기화 (멱등성)
for (const ext of ["", "-wal", "-shm"]) {
  const p = DB_PATH + ext;
  if (existsSync(p)) unlinkSync(p);
}

const db = openDb();
initSchema(db);

const insertCard = db.prepare(`
  INSERT INTO cards (
    id, name_ja, name_ko, set_name, number, rarity, year, image,
    current_price, year_change_pct, high52, low52, fair_value,
    buy_low, buy_high, buy_target, is_cheap_now, valuation, val_ratio,
    annual_vol, prob_up, recommendation, reco_tone
  ) VALUES (
    @id, @name_ja, @name_ko, @set_name, @number, @rarity, @year, @image,
    @current_price, @year_change_pct, @high52, @low52, @fair_value,
    @buy_low, @buy_high, @buy_target, @is_cheap_now, @valuation, @val_ratio,
    @annual_vol, @prob_up, @recommendation, @reco_tone
  )
`);
const insertPrice = db.prepare(`INSERT INTO prices (card_id, date, price) VALUES (?, ?, ?)`);

const seedAll = db.transaction(() => {
  for (const card of CARDS) {
    const history = generateHistory(card, 365);
    const m = computeMetrics(history, card);

    insertCard.run({
      id: card.id,
      name_ja: card.nameJa,
      name_ko: card.nameKo,
      set_name: card.set,
      number: card.number,
      rarity: card.rarity,
      year: card.year,
      image: card.image,
      current_price: m.current,
      year_change_pct: m.yearChangePct,
      high52: m.high52,
      low52: m.low52,
      fair_value: m.fairValue,
      buy_low: m.buyLow,
      buy_high: m.buyHigh,
      buy_target: m.buyTarget,
      is_cheap_now: m.isCheapNow ? 1 : 0,
      valuation: m.valuation,
      val_ratio: m.valRatio,
      annual_vol: m.annualVol,
      prob_up: m.probUp,
      recommendation: m.recommendation,
      reco_tone: m.recoTone,
    });

    for (const { date, price } of history) insertPrice.run(card.id, date, price);
  }
});

seedAll();

const { c } = db.prepare("SELECT COUNT(*) c FROM cards").get();
const { p } = db.prepare("SELECT COUNT(*) p FROM prices").get();
console.log(`✅ 시딩 완료: 카드 ${c}장, 시세 데이터 ${p}건 → ${DB_PATH}`);
db.close();
