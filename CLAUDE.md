# Claude Code 완전 정복 — 집필 프로젝트

## 레포
git@github.com:jee599/claudebook.git

## 프로젝트 개요
Claude Code 공식 문서(code.claude.com/docs/ko) 기반
한국어 + 영어 실전 가이드 2권 집필

- 1권: 개인 개발자용 (시작하기 → 핵심 개념 → 플랫폼 통합 → 빌드하기 → 구성)
- 2권: 팀/엔터프라이즈용 (배포 → 관리)

## 폴더 구조
```
claudebook/
├── ko/book1/chapters/       한국어 1권 챕터 (마스터 소스)
├── ko/book2/chapters/       한국어 2권 챕터
├── en/book1/chapters/       영어 1권 (ko 기반 번역)
├── en/book2/chapters/       영어 2권
├── raw-docs/                공식 docs 크롤링 원본
├── screenshots/             공용 이미지 + TODO.md
├── docs/                    GitHub Pages 미리보기
├── export/                  PDF, WikiDocs 산출물
├── .claude/commands/        커스텀 에이전트 명령어
├── progress.md              전체 작업 현황
└── CLAUDE.md                (이 파일)
```

## 에이전트 팀 구성
총 3개의 서브에이전트가 협업한다.

| 에이전트 | 명령어 | 역할 |
|---------|--------|------|
| Writer Agent | /agent-writer | 챕터 초안 작성 + 배경지식 보강 |
| Reviewer Agent | /agent-reviewer | 한국어 검수 + 영어 번역 + 품질 관리 |
| Assets Agent | /agent-assets | 스크린샷 마킹 + ko/en 동기화 확인 |

## 챕터 작업 파이프라인
```
1. /crawl-docs [페이지명]     공식 docs 크롤링 → raw-docs/ 저장
        ↓
2. /agent-writer [권] [장]    초안 작성 → ko/book[n]/chapters/ 저장
        ↓
3. /agent-reviewer ko [권] [장]  한국어 검수 + 수정
        ↓
4. /agent-assets mark         스크린샷 주석 수집 → screenshots/TODO.md 업데이트
        ↓
5. /agent-reviewer en [권] [장]  영어 번역 → en/book[n]/chapters/ 저장
        ↓
6. /agent-reviewer check-en [권] [장]  영어 품질 검수
        ↓
7. progress.md 업데이트 → git commit
```

## 챕터 작성 원칙
1. 번역체 금지 — 실제 개발자가 쓰는 한국어 말투
2. 구조: 개념 → 실전 예시 → 💡 팁 박스 → 이미지 마킹 → 핵심 요약
3. 코드는 반드시 코드 블록으로 감쌀 것
4. 이미지 마킹 형식:
   `<!-- SCREENSHOT: [한국어 설명] | EN: [English desc] | URL: [캡처 URL] | ELEMENT: [CSS selector 또는 영역] | PRIORITY: high/mid/low -->`
5. 챕터 끝 `## 핵심 요약` 섹션 필수
6. 각 기능마다 "언제 쓰면 좋은가" 실전 맥락 반드시 포함
7. 처음 등장하는 전문 용어는 괄호 안에 간단히 설명

## 언어 정책
- 한국어(ko)가 마스터. 항상 ko 먼저 완성 후 en 번역
- 이미지, 코드 블록은 공용 (언어 무관)
- 코드 내 주석만 해당 언어로 변환

## Git 규칙
- 메인 작업 브랜치: `draft/book1`
- 챕터별: `ch[번호]` 브랜치 → 완성 시 `draft/book1` 에 merge
- 커밋 메시지 형식:
  - `feat(ko): ch01 overview 초안`
  - `feat(en): ch01 번역 완성`
  - `fix(ko): ch02 검수 반영`
  - `chore: screenshots TODO 업데이트`
- `main`: 완성된 챕터만 merge (WikiDocs 업로드 기준)

## 주의사항
- IMPORTANT: 공식 문서를 직접 번역하지 말 것. 핵심 추출 후 재해석
- IMPORTANT: 각 챕터 저장 전 반드시 progress.md 업데이트
- YOU MUST: 에이전트 간 파일 충돌 방지를 위해 동시에 같은 파일 수정 금지
