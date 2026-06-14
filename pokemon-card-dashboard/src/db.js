// SQLite 연결 + 스키마. seed.js 와 server.js 가 공유.
import Database from "better-sqlite3";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const DB_PATH = join(__dirname, "..", "data", "cards.db");

export function openDb() {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  return db;
}

export function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cards (
      id        TEXT PRIMARY KEY,
      name_ja   TEXT NOT NULL,
      name_ko   TEXT NOT NULL,
      set_name  TEXT NOT NULL,
      number    TEXT NOT NULL,
      rarity    TEXT NOT NULL,
      year      INTEGER NOT NULL,
      image     TEXT,
      -- 사전 계산된 지표 (대시보드 목록 빠른 조회용)
      current_price    INTEGER,
      year_change_pct  REAL,
      high52           INTEGER,
      low52            INTEGER,
      fair_value       INTEGER,
      buy_low          INTEGER,
      buy_high         INTEGER,
      buy_target       INTEGER,
      is_cheap_now     INTEGER,
      valuation        TEXT,
      val_ratio        REAL,
      annual_vol       REAL,
      prob_up          INTEGER,
      recommendation   TEXT,
      reco_tone        TEXT
    );

    CREATE TABLE IF NOT EXISTS prices (
      card_id TEXT NOT NULL,
      date    TEXT NOT NULL,
      price   INTEGER NOT NULL,
      PRIMARY KEY (card_id, date),
      FOREIGN KEY (card_id) REFERENCES cards(id)
    );
  `);
}
