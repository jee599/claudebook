# Docs Crawler — 공식 문서 크롤링

$ARGUMENTS: [페이지명] (예: `overview`, `quickstart`, `mcp`)

## 역할
code.claude.com/docs/ko 공식 문서를 fetch하여 raw-docs/ 에 정리된 형태로 저장

## 실행 순서
1. `https://code.claude.com/docs/ko/$ARGUMENTS` 페이지 fetch
2. 아래 구조로 파싱하여 `raw-docs/$ARGUMENTS.md` 저장
3. progress.md 크롤링 현황 업데이트

## 저장 형식
```markdown
# [페이지 제목]

> 원본 URL: https://code.claude.com/docs/ko/$ARGUMENTS
> 크롤링 날짜: [날짜]

## 원본 내용 요약
[공식 문서 핵심 내용 — 번역 아님, 구조적 정리]

## 주요 개념
[핵심 용어 및 개념 목록]

## 코드 예시
[공식 문서에 포함된 코드 블록들]

## 주의사항 / 제한사항
[공식 문서의 경고, 제한사항]

## Writer Agent 참고 메모
[챕터 작성 시 강조할 포인트, 빠진 설명 보완 필요한 부분]
```

## 크롤링 대상 전체 목록
### 1권 (개인 개발자)
- overview
- quickstart
- changelog
- how-it-works
- extending-claude-code
- memory
- common-workflows
- best-practices
- remote-control
- web
- desktop
- chrome-extension
- vscode
- jetbrains
- github-actions
- gitlab
- slack
- custom-subagents
- agent-teams
- plugins
- marketplace
- skills
- output-styles
- hooks
- programmatic-usage
- mcp
- troubleshooting
- settings
- permissions
- sandboxing
- terminal-config
- model-config
- fast-mode
- status-bar
- keyboard-shortcuts

### 2권 (팀/엔터프라이즈)
- deploy-overview
- amazon-bedrock
- google-vertex
- microsoft-foundry
- network-config
- llm-gateway
- dev-containers
- advanced-install
- authentication
- security
- server-management
- data-usage
- zero-data-retention
- monitoring
- costs
- analytics
- plugin-marketplace-deploy
