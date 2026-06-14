// 포켓몬 일본판(日本版) 카드 샘플 카탈로그.
// 실제 시세는 환경 네트워크 정책상 외부 API 연동이 제한될 수 있어,
// 아래 메타데이터를 기반으로 src/seed.js 가 현실적인 1년치 시세를 생성한다.
// 나중에 실제 API(카드러시, 매물 스크래핑 등)로 교체하기 쉽도록 분리해 둠.
//
// 필드 설명
//  - id        : 고유 식별자(슬러그)
//  - nameJa    : 일본어 카드명
//  - nameKo    : 한국어 표기
//  - set       : 수록 확장팩(일본판)
//  - number    : 카드 번호
//  - rarity    : 등급 (SAR/SR/HR/UR/AR/CHR/PROMO ...)
//  - year      : 발매 연도
//  - basePrice : 1년 전 기준가(JPY, 엔)
//  - trend     : 1년 추세 강도 (-1.0 ~ +1.0, 양수=상승장)
//  - volatility: 변동성 (0.01 ~ 0.08, 클수록 출렁임)
//  - image     : 대표 색(카드 썸네일 대용 그라데이션)

export const RARITY_INFO = {
  UR:  { label: "UR (울트라레어)",   weight: 9 },
  SAR: { label: "SAR (스페셜아트)",  weight: 8 },
  HR:  { label: "HR (하이퍼레어)",   weight: 7 },
  SR:  { label: "SR (슈퍼레어)",     weight: 6 },
  CHR: { label: "CHR (캐릭터레어)",  weight: 5 },
  AR:  { label: "AR (아트레어)",     weight: 4 },
  PROMO: { label: "PROMO (프로모)",  weight: 5 },
};

export const CARDS = [
  { id: "charizard-ex-sar-clk", nameJa: "リザードンex (SAR)", nameKo: "리자몽 ex", set: "黒炎の支配者", number: "201/190", rarity: "SAR", year: 2023, basePrice: 28000, trend: 0.55, volatility: 0.045, image: "#ff7043,#d84315" },
  { id: "umbreon-vmax-hr", nameJa: "ブラッキーVMAX (HR)", nameKo: "블래키 VMAX", set: "イーブイヒーローズ", number: "095/069", rarity: "HR", year: 2021, basePrice: 62000, trend: 0.72, volatility: 0.05, image: "#5c6bc0,#283593" },
  { id: "rayquaza-vmax-hr", nameJa: "レックウザVMAX (HR)", nameKo: "레쿠쟈 VMAX", set: "蒼空ストリーム", number: "076/067", rarity: "HR", year: 2021, basePrice: 21000, trend: 0.38, volatility: 0.04, image: "#26a69a,#00695c" },
  { id: "iono-sar-snow", nameJa: "ナンジャモ (SAR)", nameKo: "남경", set: "クレイバースト", number: "091/071", rarity: "SAR", year: 2023, basePrice: 39000, trend: 0.18, volatility: 0.055, image: "#ec407a,#ad1457" },
  { id: "lillie-sr", nameJa: "リーリエ (SR)", nameKo: "릴리에", set: "禁断の光", number: "060/049", rarity: "SR", year: 2017, basePrice: 95000, trend: 0.25, volatility: 0.035, image: "#ffca28,#ff8f00" },
  { id: "ganbarillie", nameJa: "がんばリーリエ (SR)", nameKo: "힘내라 릴리에", set: "ドリームリーグ", number: "066/049", rarity: "SR", year: 2019, basePrice: 240000, trend: 0.42, volatility: 0.04, image: "#ab47bc,#6a1b9a" },
  { id: "marnie-sr", nameJa: "マリィ (SR)", nameKo: "마리", set: "ソード&シールド", number: "198/202", rarity: "SR", year: 2019, basePrice: 33000, trend: -0.12, volatility: 0.038, image: "#78909c,#37474f" },
  { id: "pikachu-promo-yokoku", nameJa: "ピカチュウ (PROMO)", nameKo: "피카츄 프로모", set: "プロモ", number: "208/SM-P", rarity: "PROMO", year: 2018, basePrice: 14000, trend: 0.08, volatility: 0.06, image: "#fdd835,#f9a825" },
  { id: "mewtwo-ex-sar", nameJa: "ミュウツーex (SAR)", nameKo: "뮤츠 ex", set: "ポケモンカード151", number: "201/165", rarity: "SAR", year: 2023, basePrice: 17000, trend: 0.3, volatility: 0.042, image: "#7e57c2,#4527a0" },
  { id: "mew-ex-ur", nameJa: "ミュウex (UR)", nameKo: "뮤 ex", set: "ポケモンカード151", number: "205/165", rarity: "UR", year: 2023, basePrice: 26000, trend: 0.34, volatility: 0.04, image: "#f06292,#c2185b" },
  { id: "giratina-vstar-ur", nameJa: "ギラティナVSTAR (UR)", nameKo: "기라티나 VSTAR", set: "VSTARユニバース", number: "258/172", rarity: "UR", year: 2022, basePrice: 18000, trend: 0.22, volatility: 0.043, image: "#455a64,#263238" },
  { id: "leafeon-vstar-sar", nameJa: "リーフィアVSTAR (SAR)", nameKo: "리피아 VSTAR", set: "VSTARユニバース", number: "211/172", rarity: "SAR", year: 2022, basePrice: 11000, trend: 0.15, volatility: 0.05, image: "#9ccc65,#558b2f" },
  { id: "glaceon-vstar-sar", nameJa: "グレイシアVSTAR (SAR)", nameKo: "글레이시아 VSTAR", set: "VSTARユニバース", number: "212/172", rarity: "SAR", year: 2022, basePrice: 12500, trend: 0.2, volatility: 0.05, image: "#4fc3f7,#0277bd" },
  { id: "kirlia-cosplay", nameJa: "キルリア (AR)", nameKo: "킬리아", set: "トリプレットビート", number: "068/073", rarity: "AR", year: 2023, basePrice: 1800, trend: 0.65, volatility: 0.07, image: "#f48fb1,#ec407a" },
  { id: "gardevoir-ex-sar", nameJa: "サーナイトex (SAR)", nameKo: "가디안 ex", set: "クレイバースト", number: "086/071", rarity: "SAR", year: 2023, basePrice: 9000, trend: 0.28, volatility: 0.05, image: "#ce93d8,#8e24aa" },
  { id: "boss-orders-cyllene", nameJa: "シマボシ (SAR)", nameKo: "시마보시", set: "白熱のアルカナ", number: "086/068", rarity: "SAR", year: 2022, basePrice: 6500, trend: -0.2, volatility: 0.045, image: "#90a4ae,#546e7a" },
  { id: "clay-burst-tulip", nameJa: "チューリップ (SAR)", nameKo: "튤립", set: "黒炎の支配者", number: "100/071", rarity: "SAR", year: 2023, basePrice: 7800, trend: 0.1, volatility: 0.055, image: "#ba68c8,#7b1fa2" },
  { id: "miriam-sar", nameJa: "ミモザ (SAR)", nameKo: "미모사", set: "トリプレットビート", number: "095/073", rarity: "SAR", year: 2023, basePrice: 5200, trend: 0.05, volatility: 0.06, image: "#aed581,#689f38" },
  { id: "vstar-arceus-ur", nameJa: "アルセウスVSTAR (UR)", nameKo: "아르세우스 VSTAR", set: "スターバース", number: "123/100", rarity: "UR", year: 2022, basePrice: 8800, trend: -0.05, volatility: 0.04, image: "#fff176,#fbc02d" },
  { id: "shiny-charizard-svp", nameJa: "リザードンex (UR/金色)", nameKo: "리자몽 ex 금색", set: "シャイニートレジャーex", number: "335/190", rarity: "UR", year: 2023, basePrice: 15000, trend: 0.48, volatility: 0.05, image: "#ffd54f,#ff6f00" },
  { id: "skyla-sr-classic", nameJa: "フウロ (SR)", nameKo: "후로", set: "プラズマゲイル", number: "082/070", rarity: "SR", year: 2014, basePrice: 41000, trend: 0.15, volatility: 0.05, image: "#4dd0e1,#00838f" },
  { id: "n-sr-classic", nameJa: "N (SR)", nameKo: "엔(N)", set: "プラズマゲイル", number: "083/070", rarity: "SR", year: 2014, basePrice: 36000, trend: 0.12, volatility: 0.05, image: "#9fa8da,#3949ab" },
  { id: "acerola-sr", nameJa: "アセロラ (SR)", nameKo: "아세로라", set: "オルタージェネシス", number: "086/095", rarity: "SR", year: 2019, basePrice: 58000, trend: 0.3, volatility: 0.045, image: "#f8bbd0,#e91e63" },
  { id: "serena-sar-151", nameJa: "セレナ (SAR)", nameKo: "세레나", set: "クリムゾンヘイズ", number: "087/066", rarity: "SAR", year: 2024, basePrice: 22000, trend: 0.6, volatility: 0.065, image: "#f06292,#880e4f" },
];
