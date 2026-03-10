# raw-docs 크롤링 체크리스트

> 기준: code.claude.com/docs/en (2026-03-10 확인)
> 크롤링 명령: `/crawl-docs [페이지명]`
> 저장 위치: `raw-docs/{페이지명}.md`

---

## Getting Started

| # | 페이지명 | URL 슬러그 | 1권 매핑 | 상태 |
|---|----------|-----------|----------|------|
| 1 | Overview | overview | 1부 1장 | ⬜ |
| 2 | Quickstart | quickstart | 1부 2장 | ⬜ |
| 3 | Changelog | changelog | 부록 참조 | ⬜ |

## Core Concepts

| # | 페이지명 | URL 슬러그 | 1권 매핑 | 상태 |
|---|----------|-----------|----------|------|
| 4 | How Claude Code works | how-claude-code-works | 1부 3장 | ⬜ |
| 5 | Extend Claude Code (features overview) | features-overview | 2부 도입 | ⬜ |
| 6 | Store instructions and memories | memory | 2부 4장 | ⬜ |
| 7 | Common workflows | common-workflows | 2부 5장 | ⬜ |
| 8 | Best practices | best-practices | 2부 5장 | ⬜ |

## Interfaces (Build with Claude Code)

| # | 페이지명 | URL 슬러그 | 1권 매핑 | 상태 |
|---|----------|-----------|----------|------|
| 9 | Visual Studio Code | vscode | 2부 6장 | ⬜ |
| 10 | JetBrains IDEs | jetbrains | 2부 6장 (합본) | ⬜ |
| 11 | Claude Code on the web | web | 2부 6장 (합본) | ⬜ |
| 12 | Claude Code on desktop | desktop | 2부 6장 (합본) | ⬜ |
| 13 | Chrome extension (beta) | chrome-extension | 2부 6장 (합본) | ⬜ |
| 14 | Remote Control | remote-control | 4부 15장 | ⬜ |
| 15 | Code Review & CI/CD | code-review | 3부 10장 | ⬜ |
| 16 | GitHub Actions | github-actions | 3부 10장 | ⬜ |
| 17 | GitLab CI/CD | gitlab | 3부 10장 (합본) | ⬜ |
| 18 | Claude Code in Slack | slack | 3부 참조 | ⬜ |

## Advanced (Build with Claude Code)

| # | 페이지명 | URL 슬러그 | 1권 매핑 | 상태 |
|---|----------|-----------|----------|------|
| 19 | Custom subagents | sub-agents | 3부 11장 | ⬜ |
| 20 | Agent teams | agent-teams | 3부 12장 | ⬜ |
| 21 | Plugins & Marketplace | plugins, marketplace | 4부 14장 | ⬜ |
| 22 | Skills | skills | 2부 7장 | ⬜ |
| 23 | Hooks | hooks | 2부 7장 (합본) | ⬜ |
| 24 | Programmatic usage / Agent SDK | programmatic-usage, sdk-overview | 4부 15장 | ⬜ |
| 25 | MCP | mcp | 2부 8장 | ⬜ |

## Configuration

| # | 페이지명 | URL 슬러그 | 1권 매핑 | 상태 |
|---|----------|-----------|----------|------|
| 26 | Settings | settings | 4부 16장 | ⬜ |
| 27 | Permissions | permissions | 4부 16장 (합본) | ⬜ |
| 28 | Sandboxing | sandboxing | 4부 16장 (합본) | ⬜ |
| 29 | Terminal config | terminal-config | 4부 16장 (합본) | ⬜ |
| 30 | Model config | model-config | 4부 16장 (합본) | ⬜ |
| 31 | Keyboard shortcuts | keyboard-shortcuts | 부록 A | ⬜ |

## Reference

| # | 페이지명 | URL 슬러그 | 1권 매핑 | 상태 |
|---|----------|-----------|----------|------|
| 32 | CLI reference | cli-reference | 부록 A | ⬜ |
| 33 | Troubleshooting | troubleshooting | 부록 C | ⬜ |

## Deployment & Administration (2권용)

| # | 페이지명 | URL 슬러그 | 2권 매핑 | 상태 |
|---|----------|-----------|----------|------|
| 34 | Enterprise deployment overview | third-party-integrations | 2권 1장 | ⬜ |
| 35 | Amazon Bedrock | amazon-bedrock | 2권 2장 | ⬜ |
| 36 | Google Vertex AI | google-vertex | 2권 3장 | ⬜ |
| 37 | Microsoft Foundry | microsoft-foundry | 2권 4장 | ⬜ |
| 38 | Network configuration | network-config | 2권 5장 | ⬜ |
| 39 | LLM gateway | llm-gateway | 2권 5장 | ⬜ |
| 40 | Development containers | dev-containers | 2권 6장 | ⬜ |
| 41 | Advanced install | advanced-install | 2권 7장 | ⬜ |
| 42 | Authentication | authentication | 2권 7장 | ⬜ |
| 43 | Security | security | 2권 8장 | ⬜ |
| 44 | Data usage | data-usage | 2권 10장 | ⬜ |
| 45 | Zero Data Retention | zero-data-retention | 2권 10장 | ⬜ |
| 46 | Monitoring | monitoring | 2권 11장 | ⬜ |
| 47 | Costs | costs | 2권 11장 | ⬜ |
| 48 | Analytics API | analytics | 2권 12장 | ⬜ |

---

## 크롤링 우선순위

### P0 — 1부 작성에 필수 (이번 주)
1. overview
2. quickstart
3. how-claude-code-works

### P1 — 2부 작성에 필수 (다음 주)
4. memory
5. features-overview
6. common-workflows
7. best-practices
8. skills
9. hooks
10. mcp

### P2 — 3부 작성에 필요
11. sub-agents
12. agent-teams
13. code-review
14. github-actions
15. vscode

### P3 — 4부 + 부록
16~33: 나머지 전부

### P4 — 2권용 (나중에)
34~48: 1권 완성 후
