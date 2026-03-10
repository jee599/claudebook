# 📘 Claude Code 완전 정복

> Claude Code 공식 문서 기반 한국어 + 영어 실전 가이드

[![집필 중](https://img.shields.io/badge/status-집필%20중-orange)](https://github.com/jee599/claudebook)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## 미리보기
🌐 **https://jee599.github.io/claudebook**

## 책 구성

| | 권 | 대상 | 상태 |
|---|---|---|---|
| 📗 | 1권 실전 입문 가이드 | 개인 개발자, Claude Code 입문~고급 | 집필 중 |
| 📘 | 2권 팀 & 엔터프라이즈 | 팀 도입, 기업 환경 | 예정 |

## WikiDocs
| 언어 | 링크 |
|------|------|
| 🇰🇷 한국어 | https://wikidocs.net/book/XXXX |
| 🇺🇸 English | (번역 후 공개) |

## 레포 구조

```
claudebook/
├── ko/                      # 한국어 (마스터 소스)
│   ├── book1/chapters/      # 1권 챕터
│   └── book2/chapters/      # 2권 챕터
├── en/                      # 영어 (ko 기반 번역)
│   ├── book1/chapters/
│   └── book2/chapters/
├── raw-docs/                # 공식 docs 크롤링 원본
├── screenshots/             # 캡처 TODO + 이미지
├── .claude/commands/        # Claude Code 에이전트 명령어
│   ├── agent-writer.md      # 챕터 초안 작성
│   ├── agent-reviewer.md    # 검수 + 영어 번역
│   ├── agent-assets.md      # 스크린샷 + 동기화
│   ├── crawl-docs.md        # 공식 docs 크롤링
│   └── export-pdf.md        # PDF + WikiDocs 내보내기
├── docs/                    # GitHub Pages
├── progress.md              # 작업 현황
└── CLAUDE.md                # Claude Code 컨텍스트
```

## 에이전트 팀

이 책은 Claude Code의 서브에이전트 기능을 활용하여 집필됩니다.

| 에이전트 | 명령어 | 역할 |
|---------|--------|------|
| Writer | `/agent-writer` | 챕터 초안 작성 + 배경지식 보강 |
| Reviewer | `/agent-reviewer` | 한국어 검수 + 영어 번역 |
| Assets | `/agent-assets` | 스크린샷 마킹 + ko/en 동기화 |

## 로컬 실행

```bash
git clone git@github.com:jee599/claudebook.git
cd claudebook
claude
# → CLAUDE.md 자동 로드, 에이전트 팀 사용 가능
```

## 기여
오탈자, 오류, 보완이 필요한 내용은 Issue 또는 PR로 알려주세요.

## 라이선스
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
