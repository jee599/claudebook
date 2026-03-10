# /crawl-docs — 공식 문서 크롤링 커맨드

공식 문서(code.claude.com/docs/en)에서 지정된 페이지를 읽어 raw-docs/ 에 마크다운으로 저장합니다.

## 사용법

```
/crawl-docs [slug]       — 특정 페이지 크롤링
/crawl-docs all          — 전체 페이지 순차 크롤링
/crawl-docs p0           — P0 우선순위(overview, quickstart, how-claude-code-works)만
/crawl-docs p1           — P1 우선순위(memory~mcp)만
```

## 실행 방법

$ARGUMENTS 를 파싱하세요:
- 첫 번째 인자 → slug 또는 그룹명 (all/p0/p1/p2/p3/p4)

## 페이지 매핑

### P0 (1부 작성 필수)
| slug | URL |
|------|-----|
| overview | https://code.claude.com/docs/en/overview |
| quickstart | https://code.claude.com/docs/en/quickstart |
| how-claude-code-works | https://code.claude.com/docs/en/how-claude-code-works |

### P1 (2부 작성 필수)
| slug | URL |
|------|-----|
| memory | https://code.claude.com/docs/en/memory |
| features-overview | https://code.claude.com/docs/en/features-overview |
| common-workflows | https://code.claude.com/docs/en/common-workflows |
| best-practices | https://code.claude.com/docs/en/best-practices |
| skills | https://code.claude.com/docs/en/skills |
| hooks | https://code.claude.com/docs/en/hooks |
| mcp | https://code.claude.com/docs/en/mcp |

### P2 (3부 작성 필요)
| slug | URL |
|------|-----|
| sub-agents | https://code.claude.com/docs/en/sub-agents |
| agent-teams | https://code.claude.com/docs/en/agent-teams |
| code-review | https://code.claude.com/docs/en/code-review |
| github-actions | https://code.claude.com/docs/en/github-actions |
| gitlab | https://code.claude.com/docs/en/gitlab |
| vscode | https://code.claude.com/docs/en/vscode |
| jetbrains | https://code.claude.com/docs/en/jetbrains |
| desktop | https://code.claude.com/docs/en/desktop |
| web | https://code.claude.com/docs/en/web |
| chrome-extension | https://code.claude.com/docs/en/chrome-extension |
| slack | https://code.claude.com/docs/en/slack |

### P3 (4부 + 부록)
| slug | URL |
|------|-----|
| plugins | https://code.claude.com/docs/en/plugins |
| marketplace | https://code.claude.com/docs/en/marketplace |
| programmatic-usage | https://code.claude.com/docs/en/programmatic-usage |
| sdk-overview | https://code.claude.com/docs/en/sdk/sdk-overview |
| sdk-typescript | https://code.claude.com/docs/en/sdk/sdk-typescript |
| sdk-python | https://code.claude.com/docs/en/sdk/sdk-python |
| remote-control | https://code.claude.com/docs/en/remote-control |
| settings | https://code.claude.com/docs/en/settings |
| permissions | https://code.claude.com/docs/en/permissions |
| sandboxing | https://code.claude.com/docs/en/sandboxing |
| terminal-config | https://code.claude.com/docs/en/terminal-config |
| model-config | https://code.claude.com/docs/en/model-config |
| keyboard-shortcuts | https://code.claude.com/docs/en/keyboard-shortcuts |
| cli-reference | https://code.claude.com/docs/en/cli-reference |
| troubleshooting | https://code.claude.com/docs/en/troubleshooting |
| changelog | https://code.claude.com/docs/en/changelog |

### P4 (2권용)
| slug | URL |
|------|-----|
| deploy-overview | https://code.claude.com/docs/en/third-party-integrations |
| amazon-bedrock | https://code.claude.com/docs/en/amazon-bedrock |
| google-vertex | https://code.claude.com/docs/en/google-vertex |
| microsoft-foundry | https://code.claude.com/docs/en/microsoft-foundry |
| network-config | https://code.claude.com/docs/en/network-config |
| llm-gateway | https://code.claude.com/docs/en/llm-gateway |
| dev-containers | https://code.claude.com/docs/en/dev-containers |
| advanced-install | https://code.claude.com/docs/en/advanced-install |
| authentication | https://code.claude.com/docs/en/authentication |
| security | https://code.claude.com/docs/en/security |
| data-usage | https://code.claude.com/docs/en/data-usage |
| zero-data-retention | https://code.claude.com/docs/en/zero-data-retention |
| monitoring | https://code.claude.com/docs/en/monitoring |
| costs | https://code.claude.com/docs/en/costs |
| analytics | https://code.claude.com/docs/en/analytics |

## 저장 형식

각 페이지를 `raw-docs/{slug}.md`로 저장하세요.

파일 구조:
```markdown
---
source: [URL]
slug: [slug]
crawled_at: [ISO 날짜]
---

[페이지 전체 내용을 마크다운으로 변환]
```

## 크롤링 규칙

1. WebFetch 도구로 URL을 가져옵니다
2. 네비게이션, 사이드바, 푸터는 제거하고 본문만 추출합니다
3. HTML을 깨끗한 마크다운으로 변환합니다
4. 코드 블록은 언어 태그를 유지합니다
5. 이미지 URL은 절대 경로로 변환합니다
6. 이미 raw-docs/에 해당 slug 파일이 있으면 스킵합니다 (덮어쓰려면 파일을 먼저 삭제)
7. 크롤링 완료 후 progress.md의 해당 항목 상태를 ✅로 업데이트합니다

## 그룹 크롤링 시

all/p0/p1 등 그룹으로 요청받으면:
- 해당 그룹의 모든 페이지를 순서대로 크롤링합니다
- 각 페이지 완료 시 터미널에 `✅ {slug} 완료` 출력
- 전체 완료 시 요약 출력 (성공/실패/스킵 개수)
