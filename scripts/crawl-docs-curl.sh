#!/usr/bin/env bash
# Claude Code 공식 문서 크롤러 (curl 버전, Puppeteer 없을 때 대안)
#
# 사용법:
#   chmod +x scripts/crawl-docs-curl.sh
#   ./scripts/crawl-docs-curl.sh          # 전체 크롤링
#   ./scripts/crawl-docs-curl.sh overview # 특정 페이지만
#
# 주의: SPA 사이트는 curl로 제대로 안 될 수 있음 → Puppeteer 버전 사용 권장

set -euo pipefail

OUTPUT_DIR="raw-docs"
BASE_URL="https://code.claude.com"
TARGET="${1:-all}"
FORCE="${2:-}"

mkdir -p "$OUTPUT_DIR"

# 전체 페이지 목록 (slug|path|category)
PAGES=(
  # Getting Started
  "overview|/docs/en/overview|getting-started"
  "quickstart|/docs/en/quickstart|getting-started"
  "changelog|/docs/en/changelog|getting-started"
  # Core
  "how-claude-code-works|/docs/en/how-claude-code-works|core"
  "features-overview|/docs/en/features-overview|core"
  "memory|/docs/en/memory|core"
  "common-workflows|/docs/en/common-workflows|core"
  "best-practices|/docs/en/best-practices|core"
  # Interfaces
  "vscode|/docs/en/vscode|interfaces"
  "jetbrains|/docs/en/jetbrains|interfaces"
  "web|/docs/en/web|interfaces"
  "desktop|/docs/en/desktop|interfaces"
  "chrome-extension|/docs/en/chrome-extension|interfaces"
  "remote-control|/docs/en/remote-control|interfaces"
  # CI/CD
  "code-review|/docs/en/code-review|cicd"
  "github-actions|/docs/en/github-actions|cicd"
  "gitlab|/docs/en/gitlab|cicd"
  "slack|/docs/en/slack|cicd"
  # Advanced
  "sub-agents|/docs/en/sub-agents|advanced"
  "agent-teams|/docs/en/agent-teams|advanced"
  "plugins|/docs/en/plugins|advanced"
  "marketplace|/docs/en/marketplace|advanced"
  "skills|/docs/en/skills|advanced"
  "hooks|/docs/en/hooks|advanced"
  "mcp|/docs/en/mcp|advanced"
  # Programmatic
  "programmatic-usage|/docs/en/programmatic-usage|programmatic"
  "sdk-overview|/docs/en/sdk/sdk-overview|programmatic"
  "sdk-typescript|/docs/en/sdk/sdk-typescript|programmatic"
  "sdk-python|/docs/en/sdk/sdk-python|programmatic"
  # Config
  "settings|/docs/en/settings|config"
  "permissions|/docs/en/permissions|config"
  "sandboxing|/docs/en/sandboxing|config"
  "terminal-config|/docs/en/terminal-config|config"
  "model-config|/docs/en/model-config|config"
  "keyboard-shortcuts|/docs/en/keyboard-shortcuts|config"
  # Reference
  "cli-reference|/docs/en/cli-reference|reference"
  "troubleshooting|/docs/en/troubleshooting|reference"
  # Deploy (2권)
  "deploy-overview|/docs/en/third-party-integrations|deploy"
  "amazon-bedrock|/docs/en/amazon-bedrock|deploy"
  "google-vertex|/docs/en/google-vertex|deploy"
  "microsoft-foundry|/docs/en/microsoft-foundry|deploy"
  "network-config|/docs/en/network-config|deploy"
  "llm-gateway|/docs/en/llm-gateway|deploy"
  "dev-containers|/docs/en/dev-containers|deploy"
  # Admin (2권)
  "advanced-install|/docs/en/advanced-install|admin"
  "authentication|/docs/en/authentication|admin"
  "security|/docs/en/security|admin"
  "data-usage|/docs/en/data-usage|admin"
  "zero-data-retention|/docs/en/zero-data-retention|admin"
  "monitoring|/docs/en/monitoring|admin"
  "costs|/docs/en/costs|admin"
  "analytics|/docs/en/analytics|admin"
)

SUCCESS=0
FAIL=0
SKIP=0

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║  📚 Claude Code 공식 문서 크롤러 (curl)          ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

for entry in "${PAGES[@]}"; do
  IFS='|' read -r slug url_path category <<< "$entry"

  # 특정 페이지만 크롤링
  if [[ "$TARGET" != "all" && "$slug" != "$TARGET" ]]; then
    continue
  fi

  outfile="$OUTPUT_DIR/${slug}.md"

  # 이미 존재하면 스킵
  if [[ -f "$outfile" && "$FORCE" != "--force" ]]; then
    echo "⏭️  $slug — 이미 존재 (--force로 덮어쓰기)"
    ((SKIP++))
    continue
  fi

  url="${BASE_URL}${url_path}"

  # curl로 가져오기
  html=$(curl -sL --max-time 30 \
    -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
    -H "Accept: text/html" \
    "$url" 2>/dev/null) || true

  if [[ -z "$html" || ${#html} -lt 500 ]]; then
    echo "❌ $slug — 가져오기 실패 (빈 응답)"
    ((FAIL++))
    continue
  fi

  # HTML → 텍스트 변환 (간이 방식)
  # pandoc이 있으면 사용, 없으면 sed로 태그 제거
  if command -v pandoc &> /dev/null; then
    content=$(echo "$html" | pandoc -f html -t markdown --wrap=none 2>/dev/null || echo "$html" | sed 's/<[^>]*>//g')
  else
    # sed로 기본적인 태그 제거
    content=$(echo "$html" | \
      sed 's/<script[^>]*>.*<\/script>//g' | \
      sed 's/<style[^>]*>.*<\/style>//g' | \
      sed 's/<nav[^>]*>.*<\/nav>//g' | \
      sed 's/<header[^>]*>.*<\/header>//g' | \
      sed 's/<footer[^>]*>.*<\/footer>//g' | \
      sed 's/<[^>]*>//g' | \
      sed '/^$/d' | \
      sed 's/^[[:space:]]*//')
  fi

  # 메타데이터 헤더 추가
  {
    echo "---"
    echo "source: $url"
    echo "slug: $slug"
    echo "category: $category"
    echo "crawled_at: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo "method: curl"
    echo "---"
    echo ""
    echo "$content"
  } > "$outfile"

  lines=$(wc -l < "$outfile")
  echo "✅ $slug — ${lines}줄 저장됨"
  ((SUCCESS++))

  # 서버 부담 경감
  sleep 1.5
done

echo ""
echo "═══════════════════════════════════════════════════"
echo "📊 크롤링 완료"
echo "   ✅ 성공: $SUCCESS"
echo "   ❌ 실패: $FAIL"
echo "   ⏭️  스킵: $SKIP"
echo "   📁 저장: $OUTPUT_DIR/"
echo "═══════════════════════════════════════════════════"
echo ""

if [[ $FAIL -gt 0 ]]; then
  echo "💡 curl로 실패한 페이지는 Puppeteer 버전으로 재시도하세요:"
  echo "   node scripts/crawl-docs.js [slug]"
  echo ""
  echo "💡 또는 Claude Code에서 직접 읽기:"
  echo '   claude "https://code.claude.com/docs/en/[slug] 내용을 raw-docs/[slug].md로 저장해줘"'
  echo ""
fi
