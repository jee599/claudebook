# 1권 새 목차 — Claude Code 완전 정복: 실전 입문

> 회의 합의 반영: 프로젝트 여정 순서 / 4부 17장 / 각 챕터에 실습 포함
> 상태: 확정 대기 (검토 후 기존 목차 교체)

---

## 0부. 프롤로그

### 0장. AI 코딩 도구의 지형과 이 책의 약속
- AI 코딩 도구 지형도 (Copilot, Cursor, Claude Code, Codex 비교)
- Claude Code는 어디에 위치하는가
- 이 책이 다루는 범위와 다루지 않는 것
- 대상 독자 / 사전 지식 / 환경 요구사항
- **공식 문서 소스**: —
- **분량 목표**: 5~8p

---

## 1부. 시작하기 — "첫 프로젝트 완성까지"

> 🎯 이 파트가 끝나면: CLI 할일 앱을 Claude Code로 만들어본 경험이 생깁니다.

### 1장. Claude Code란 무엇인가
- 에이전틱 코딩이란
- Claude Code가 할 수 있는 것 / 할 수 없는 것
- 터미널, IDE, 데스크톱, 웹 — 어디서든 사용 가능
- **공식 문서**: overview
- **실습**: 없음 (개념 챕터)

### 2장. 5분 만에 설치하고 첫 명령 실행하기
- 네이티브 설치 (macOS / Linux / Windows)
- npm 설치 (대안)
- 인증 (Anthropic 계정 / API 키)
- 첫 번째 명령: `claude "안녕, 내 프로젝트 구조 알려줘"`
- **공식 문서**: quickstart
- **실습**: 설치 + 인증 + 첫 대화

### 3장. 작동 원리 — Claude는 어떻게 코드를 짜는가
- 에이전틱 루프: 맥락 수집 → 행동 → 검증
- 모델 선택 (Opus / Sonnet / Haiku)
- 도구 체계 (Read, Edit, Bash, Agent...)
- 컨텍스트 윈도우와 컴팩션
- 세션, 체크포인트, --resume
- **공식 문서**: how-claude-code-works
- **실습**: CLI 할일 앱 만들기 (1부 관통 프로젝트 시작)
  ```
  claude "Node.js로 CLI 할일 앱을 만들어줘. 
  추가/완료/목록 기능이 있고, JSON 파일에 저장해."
  ```

---

## 2부. 핵심 무기 익히기 — "프로젝트를 고도화하며 배우기"

> 🎯 이 파트가 끝나면: CLAUDE.md, MCP, Hooks, Skills를 조합하여 자기 워크플로우를 구성할 수 있습니다.
> 📌 1부에서 만든 할일 앱을 계속 발전시킵니다.

### 4장. CLAUDE.md로 Claude에게 프로젝트 맥락 심어주기
- CLAUDE.md가 필요한 이유 (시나리오: "매번 같은 설명을 반복하는 문제")
- 파일 위치와 로딩 우선순위 (프로젝트 / 사용자 / 시스템)
- 자동 메모리 vs 수동 CLAUDE.md
- .claude/rules/ 로 관심사 분리
- **공식 문서**: memory
- **실습**: 할일 앱에 CLAUDE.md 작성 → Claude 동작 변화 확인
- **템플릿**: 부록 B에 전체 템플릿 수록

### 5장. 실전 워크플로우 패턴과 모범 사례
- 코드베이스 탐색 ("이 프로젝트 구조 설명해줘")
- 버그 수정 흐름 (탐색 → 계획 → 수정 → 검증)
- 리팩토링 + 테스트 추가
- PR 생성과 코드 리뷰
- Plan Mode 활용법
- 워크트리로 병렬 작업
- **공식 문서**: common-workflows, best-practices
- **실습**: 할일 앱에 우선순위 기능 추가 + 테스트 작성 + PR 생성

### 6장. 어디서든 Claude Code 쓰기 — IDE, 데스크톱, 웹
- VS Code 확장: 인라인 편집, 터미널 통합
- JetBrains IDE: 도구 창, 터미널 연동
- 데스크톱 앱: diff 뷰, 앱 미리보기
- 웹 버전: 브라우저에서 바로 사용
- Chrome 확장(베타): 웹페이지 컨텍스트 활용
- 환경별 장단점 비교표
- **공식 문서**: vscode, jetbrains, desktop, web, chrome-extension
- **실습**: VS Code에서 할일 앱 수정 → 터미널과 IDE 모드 비교

### 7장. Skills, Hooks, 슬래시 커맨드로 워크플로우 자동화하기
- 확장 기능 전체 지도 (언제 뭘 쓰는가)
- 슬래시 커맨드: 반복 작업을 한 줄로
- Skills: 자동 활성화되는 전문 지식
- Hooks: 라이프사이클 이벤트에 코드 걸기
  - PreToolUse / PostToolUse / SessionStart / Stop
  - 실전 예: 파일 저장 후 자동 린트, 커밋 전 테스트
- **공식 문서**: features-overview, skills, hooks
- **실습**: 할일 앱에 커스텀 `/add-feature` 커맨드 + 저장 후 자동 포맷팅 Hook 추가

### 8장. MCP로 외부 도구와 연결하기
- MCP란 무엇인가 (Model Context Protocol)
- 기본 제공 MCP 서버 (GitHub, Linear, Slack, Puppeteer...)
- MCP 서버 설치와 설정
- 커스텀 MCP 서버 만들기 (기초)
- 보안 고려사항
- **공식 문서**: mcp
- **실습**: 할일 앱 + GitHub MCP 연결 → Claude가 직접 이슈 생성

---

## 3부. 실전 프로젝트 — "처음부터 끝까지 만들기"

> 🎯 이 파트가 끝나면: 4개의 실전 프로젝트를 완성하고, 팀 협업/자동화 패턴을 체득합니다.
> 📌 각 챕터는 독립 프로젝트입니다. 순서대로 읽지 않아도 됩니다.

### 9장. [프로젝트] 풀스택 웹앱을 Claude Code로 만들기
- 프로젝트: 북마크 관리 웹앱 (React + Express + SQLite)
- 기획 → Plan Mode → 구현 → 테스트 → 배포까지
- CLAUDE.md + Skills 조합
- **시간 목표**: 1시간
- **공식 문서**: common-workflows, best-practices 응용

### 10장. [프로젝트] GitHub Actions로 CI/CD 자동화하기
- 프로젝트: 9장 앱에 CI/CD 파이프라인 추가
- Code Review 설정 (REVIEW.md 포함)
- PR 자동 리뷰 + 머지 게이트
- GitLab CI/CD 대안
- **공식 문서**: code-review, github-actions, gitlab

### 11장. [프로젝트] Subagent로 멀티에이전트 코드 리뷰 만들기
- 프로젝트: 보안 검사 + 성능 분석 + 스타일 검사 3개 서브에이전트
- .claude/agents/ 에 에이전트 정의
- 병렬 실행과 결과 합산
- 서브에이전트 vs Skills vs 슬래시 커맨드 — 언제 뭘 쓰는가
- **공식 문서**: sub-agents

### 12장. [프로젝트] Agent Teams로 대규모 리팩토링하기
- 🧪 **실험적 기능**
- 프로젝트: 레거시 Express 앱을 모듈화 (Frontend / Backend / Tests / Docs 팀)
- Team Lead가 Teammates에게 작업 분배
- 공유 태스크 리스트 + 직접 메시지
- 비용 고려사항 (토큰 소모)
- **공식 문서**: agent-teams

---

## 4부. 프로 되기 — "나만의 시스템 설계하기"

> 🎯 이 파트가 끝나면: Claude Code를 자기 워크플로우에 맞게 커스터마이징하고, 문제를 스스로 해결할 수 있습니다.

### 13장. 플러그인 & 마켓플레이스로 생태계 활용하기
- 플러그인 설치와 관리
- buildwithclaude.com 마켓플레이스 탐색
- 나만의 플러그인 만들기 (커맨드 + 훅 + 스킬 번들)
- 팀에 플러그인 배포하기
- **공식 문서**: plugins, marketplace

### 14장. Agent SDK로 프로그래밍 방식 사용하기
- SDK 개요: TypeScript / Python
- `query()` 함수와 스트리밍
- CI/CD에서 Claude Code 호출하기
- Remote Control로 외부에서 세션 제어
- Slack 연동
- **공식 문서**: programmatic-usage, sdk-overview, remote-control, slack

### 15장. 성능 튜닝과 비용 최적화
- 모델 선택 전략 (Opus vs Sonnet vs Haiku)
- Adaptive Thinking / ultrathink 키워드
- 컨텍스트 관리: 언제 새 세션을 시작할까
- 비용 모니터링과 절감 팁
- **공식 문서**: model-config, costs

### 16장. 설정, 권한, 보안 한 방에 정리하기
- settings.json 완전 가이드
- 권한 모드: Ask / Auto / Plan / dontAsk
- 샌드박싱으로 안전하게 실행
- 터미널 설정 커스터마이징
- **공식 문서**: settings, permissions, sandboxing, terminal-config

### 17장. 문제가 생겼을 때 — 트러블슈팅 가이드
- `claude doctor` 로 진단
- 흔한 에러 TOP 10과 해결법
- 네트워크/프록시 문제
- 성능 저하 시 체크리스트
- 커뮤니티 리소스 (GitHub Issues, Discord)
- **공식 문서**: troubleshooting

---

## 부록

### A. CLI 참조표 & 키보드 단축키
- 전체 CLI 플래그 목록
- 인터랙티브 모드 단축키
- 슬래시 커맨드 기본 목록
- **공식 문서**: cli-reference, keyboard-shortcuts

### B. CLAUDE.md 템플릿 모음
- 개인 프로젝트용
- 팀 프로젝트용
- 모노레포용
- 오픈소스 프로젝트용

### C. Hooks & 플러그인 레시피
- 자동 린트/포맷 Hook
- 커밋 전 테스트 Hook
- 데스크톱 알림 Hook
- 코드 리뷰 플러그인 예시

---

## 구조 변경 요약 (기존 vs 신규)

| 기존 | 신규 | 변경 이유 |
|------|------|-----------|
| 5부 26장 | 4부 17장 + 부록 3개 | 과다한 챕터 수 압축 |
| 기능 카탈로그 순서 | 프로젝트 여정 순서 | "배우면서 만드는" 경험 |
| 플랫폼별 개별 챕터 (VS Code, JetBrains, Web, Desktop, Chrome) | 6장 합본 | 중복 제거, 비교표로 핵심 전달 |
| 설정 관련 3개 챕터 (24, 25, 26장) | 16장 합본 | 설정은 레퍼런스, 1개면 충분 |
| Skills / Hooks / 커맨드 별도 | 7장 합본 "워크플로우 자동화" | 독자는 목적 중심으로 배움 |
| 실전 프로젝트 없음 | 3부 전체가 독립 프로젝트 | 차별화 핵심 |
| 관통 프로젝트 없음 | 1부~2부 할일 앱 점진적 고도화 | 학습 연속성 |
