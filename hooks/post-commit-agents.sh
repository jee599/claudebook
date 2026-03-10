#!/usr/bin/env bash
# hooks/post-commit-agents.sh
# git commit 후 Editorial + Business Agent를 자동 실행하는 스크립트
#
# 설치: Claude Code hooks 설정에 등록 (.claude/settings.json)
# 또는: cp hooks/post-commit-agents.sh .git/hooks/post-commit && chmod +x .git/hooks/post-commit

set -euo pipefail

# ─── 설정 ───
PROJECT_ROOT="$(git rev-parse --show-toplevel)"
COMMIT_MSG="$(git log -1 --pretty=%B)"
COMMIT_HASH="$(git log -1 --pretty=%h)"
TODAY="$(date +%Y-%m-%d)"
NOW="$(date '+%Y-%m-%d %H:%M')"

# 결과물 디렉토리 확인/생성
mkdir -p "$PROJECT_ROOT/editorial/feedback"
mkdir -p "$PROJECT_ROOT/business/market-reports"

# ─── 챕터 커밋 감지 ───
# feat(ko): ch05 ... 형태의 커밋만 Editorial Agent 트리거
CHAPTER_PATTERN='feat\(ko\): ch([0-9]+)'

if [[ "$COMMIT_MSG" =~ $CHAPTER_PATTERN ]]; then
    CH_NUM="${BASH_REMATCH[1]}"
    CH_PADDED=$(printf "%02d" "$CH_NUM")

    # 권 번호 추출 (경로에서 book1/book2 판별)
    CHANGED_FILES="$(git diff --name-only HEAD~1 HEAD 2>/dev/null || echo '')"
    if echo "$CHANGED_FILES" | grep -q "book2"; then
        BOOK_NUM=2
    else
        BOOK_NUM=1
    fi

    echo ""
    echo "╔══════════════════════════════════════════════════╗"
    echo "║  📝 Editorial Agent 실행 중...                   ║"
    echo "║  대상: ${BOOK_NUM}권 ${CH_PADDED}장              ║"
    echo "╚══════════════════════════════════════════════════╝"

    # Editorial Agent 실행 (Claude Code CLI)
    EDITORIAL_OUTPUT="$PROJECT_ROOT/editorial/feedback/book${BOOK_NUM}-ch${CH_PADDED}-${TODAY}.md"

    if claude -p "/agent-editorial ${BOOK_NUM} ${CH_PADDED}" 2>/dev/null; then
        echo "✅ 편집 피드백 저장됨 → editorial/feedback/book${BOOK_NUM}-ch${CH_PADDED}-${TODAY}.md"
    else
        echo "⚠️  Editorial Agent 실행 실패 (Claude Code CLI 확인 필요)"
    fi
else
    echo "ℹ️  챕터 커밋이 아님 — Editorial Agent 스킵"
fi

# ─── Business Agent ───
# 매 커밋마다 실행하면 과도하므로, 조건부 실행
# 조건: 하루에 한 번만 / 또는 --market 플래그

LATEST_REPORT="$PROJECT_ROOT/business/market-reports/${TODAY}.md"
FORCE_MARKET="${FORCE_MARKET:-false}"

if [[ "$FORCE_MARKET" == "true" ]] || [[ ! -f "$LATEST_REPORT" ]]; then
    echo ""
    echo "╔══════════════════════════════════════════════════╗"
    echo "║  📊 Business Agent 실행 중...                    ║"
    echo "╚══════════════════════════════════════════════════╝"

    if claude -p "/agent-business" 2>/dev/null; then
        echo "✅ 시장 보고서 저장됨 → business/market-reports/${TODAY}.md"
    else
        echo "⚠️  Business Agent 실행 실패 (Claude Code CLI 확인 필요)"
    fi
else
    echo "ℹ️  오늘 시장 보고서 이미 존재 — Business Agent 스킵 (강제 실행: FORCE_MARKET=true)"
fi

echo ""
echo "─── Hook 완료 [${COMMIT_HASH}] ───"
