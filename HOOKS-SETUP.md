# Hooks 설정 가이드

## 파일 구성

```
claudebook/
├── .claude/
│   ├── settings.json              ← Claude Code hooks 설정 (PostToolUse)
│   └── commands/
│       ├── agent-editorial.md     ← /agent-editorial [권] [장]
│       ├── agent-business.md      ← /agent-business
│       ├── agent-writer.md        ← (기존)
│       ├── agent-reviewer.md      ← (기존)
│       └── agent-assets.md        ← (기존)
├── hooks/
│   └── post-commit-agents.sh      ← 실행 스크립트
├── editorial/
│   └── feedback/                  ← Editorial Agent 출력
│       └── book1-ch05-2026-03-10.md
└── business/
    └── market-reports/            ← Business Agent 출력
        └── 2026-03-10.md
```

## 동작 방식

### 트리거
Claude Code 안에서 `git commit`을 실행하면 → PostToolUse 훅이 감지 → `post-commit-agents.sh` 실행

### Editorial Agent
- **조건**: 커밋 메시지가 `feat(ko): ch{번호}` 패턴일 때만 실행
- **동작**: 해당 챕터를 5가지 기준으로 평가
- **출력**: `editorial/feedback/book{권}-ch{장}-{날짜}.md`
- **터미널**: `✅ 편집 피드백 저장됨 → editorial/feedback/...`

### Business Agent
- **조건**: 오늘 날짜 보고서가 없을 때 (하루 1회)
- **강제 실행**: `FORCE_MARKET=true git commit -m "..."`
- **출력**: `business/market-reports/{날짜}.md`
- **터미널**: `✅ 시장 보고서 저장됨 → business/market-reports/...`

## 설치

1. 새로 생성된 파일들을 레포에 복사
2. 실행 권한 부여: `chmod +x hooks/post-commit-agents.sh`
3. `.gitignore`에 추가 (선택):
   ```
   # 시장 보고서는 커밋하되, 임시 파일 제외
   business/market-reports/.tmp
   ```

## 수동 실행

훅을 거치지 않고 직접 실행할 수도 있습니다:

```bash
# Editorial Agent 수동 실행
claude /agent-editorial 1 05

# Business Agent 수동 실행
claude /agent-business

# Business Agent 강제 재실행 (오늘 보고서 있어도)
FORCE_MARKET=true bash hooks/post-commit-agents.sh
```

## 미결 → 결정 완료

| 항목 | 결정 |
|------|------|
| 결과물 형식 | **둘 다** — 파일 저장 + 터미널 요약 |
| Editorial 트리거 조건 | `feat(ko): ch{번호}` 커밋만 |
| Business 트리거 조건 | 하루 1회 (FORCE_MARKET으로 강제 가능) |
| Editorial 출력 경로 | `editorial/feedback/book{권}-ch{장}-{날짜}.md` |
| Business 출력 경로 | `business/market-reports/{날짜}.md` |
