#!/usr/bin/env node
/**
 * Claude Code 공식 문서 크롤러
 * 
 * 사용법:
 *   npm install puppeteer    # 최초 1회
 *   node scripts/crawl-docs.js          # 전체 크롤링
 *   node scripts/crawl-docs.js overview # 특정 페이지만
 * 
 * 결과: raw-docs/{slug}.md 로 저장
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// ─── 크롤링 대상 전체 목록 ───
const PAGES = [
  // Getting Started
  { slug: 'overview', path: '/docs/en/overview', category: 'getting-started' },
  { slug: 'quickstart', path: '/docs/en/quickstart', category: 'getting-started' },
  { slug: 'changelog', path: '/docs/en/changelog', category: 'getting-started' },

  // Core Concepts
  { slug: 'how-claude-code-works', path: '/docs/en/how-claude-code-works', category: 'core' },
  { slug: 'features-overview', path: '/docs/en/features-overview', category: 'core' },
  { slug: 'memory', path: '/docs/en/memory', category: 'core' },
  { slug: 'common-workflows', path: '/docs/en/common-workflows', category: 'core' },
  { slug: 'best-practices', path: '/docs/en/best-practices', category: 'core' },

  // Interfaces
  { slug: 'vscode', path: '/docs/en/vscode', category: 'interfaces' },
  { slug: 'jetbrains', path: '/docs/en/jetbrains', category: 'interfaces' },
  { slug: 'web', path: '/docs/en/web', category: 'interfaces' },
  { slug: 'desktop', path: '/docs/en/desktop', category: 'interfaces' },
  { slug: 'chrome-extension', path: '/docs/en/chrome-extension', category: 'interfaces' },
  { slug: 'remote-control', path: '/docs/en/remote-control', category: 'interfaces' },

  // CI/CD & Review
  { slug: 'code-review', path: '/docs/en/code-review', category: 'cicd' },
  { slug: 'github-actions', path: '/docs/en/github-actions', category: 'cicd' },
  { slug: 'gitlab', path: '/docs/en/gitlab', category: 'cicd' },
  { slug: 'slack', path: '/docs/en/slack', category: 'cicd' },

  // Advanced
  { slug: 'sub-agents', path: '/docs/en/sub-agents', category: 'advanced' },
  { slug: 'agent-teams', path: '/docs/en/agent-teams', category: 'advanced' },
  { slug: 'plugins', path: '/docs/en/plugins', category: 'advanced' },
  { slug: 'marketplace', path: '/docs/en/marketplace', category: 'advanced' },
  { slug: 'skills', path: '/docs/en/skills', category: 'advanced' },
  { slug: 'hooks', path: '/docs/en/hooks', category: 'advanced' },
  { slug: 'mcp', path: '/docs/en/mcp', category: 'advanced' },

  // Programmatic
  { slug: 'programmatic-usage', path: '/docs/en/programmatic-usage', category: 'programmatic' },
  { slug: 'sdk-overview', path: '/docs/en/sdk/sdk-overview', category: 'programmatic' },
  { slug: 'sdk-typescript', path: '/docs/en/sdk/sdk-typescript', category: 'programmatic' },
  { slug: 'sdk-python', path: '/docs/en/sdk/sdk-python', category: 'programmatic' },

  // Configuration
  { slug: 'settings', path: '/docs/en/settings', category: 'config' },
  { slug: 'permissions', path: '/docs/en/permissions', category: 'config' },
  { slug: 'sandboxing', path: '/docs/en/sandboxing', category: 'config' },
  { slug: 'terminal-config', path: '/docs/en/terminal-config', category: 'config' },
  { slug: 'model-config', path: '/docs/en/model-config', category: 'config' },
  { slug: 'keyboard-shortcuts', path: '/docs/en/keyboard-shortcuts', category: 'config' },

  // Reference
  { slug: 'cli-reference', path: '/docs/en/cli-reference', category: 'reference' },
  { slug: 'troubleshooting', path: '/docs/en/troubleshooting', category: 'reference' },

  // Deployment (2권용)
  { slug: 'deploy-overview', path: '/docs/en/third-party-integrations', category: 'deploy' },
  { slug: 'amazon-bedrock', path: '/docs/en/amazon-bedrock', category: 'deploy' },
  { slug: 'google-vertex', path: '/docs/en/google-vertex', category: 'deploy' },
  { slug: 'microsoft-foundry', path: '/docs/en/microsoft-foundry', category: 'deploy' },
  { slug: 'network-config', path: '/docs/en/network-config', category: 'deploy' },
  { slug: 'llm-gateway', path: '/docs/en/llm-gateway', category: 'deploy' },
  { slug: 'dev-containers', path: '/docs/en/dev-containers', category: 'deploy' },

  // Administration (2권용)
  { slug: 'advanced-install', path: '/docs/en/advanced-install', category: 'admin' },
  { slug: 'authentication', path: '/docs/en/authentication', category: 'admin' },
  { slug: 'security', path: '/docs/en/security', category: 'admin' },
  { slug: 'data-usage', path: '/docs/en/data-usage', category: 'admin' },
  { slug: 'zero-data-retention', path: '/docs/en/zero-data-retention', category: 'admin' },
  { slug: 'monitoring', path: '/docs/en/monitoring', category: 'admin' },
  { slug: 'costs', path: '/docs/en/costs', category: 'admin' },
  { slug: 'analytics', path: '/docs/en/analytics', category: 'admin' },
];

const BASE_URL = 'https://code.claude.com';
const OUTPUT_DIR = path.resolve(process.cwd(), 'raw-docs');

// ─── 페이지에서 콘텐츠 추출하는 함수 (브라우저 내에서 실행) ───
function extractContent() {
  // 메인 콘텐츠 영역 찾기 (여러 셀렉터 시도)
  const selectors = [
    'article',
    'main',
    '[class*="content"]',
    '[class*="article"]',
    '[role="main"]',
    '.docs-content',
    '#content',
  ];

  let contentEl = null;
  for (const sel of selectors) {
    contentEl = document.querySelector(sel);
    if (contentEl && contentEl.textContent.trim().length > 200) break;
  }

  if (!contentEl) {
    contentEl = document.body;
  }

  // 네비게이션, 사이드바, 푸터 제거
  const removeSelectors = [
    'nav', 'header', 'footer',
    '[class*="sidebar"]', '[class*="nav"]', '[class*="menu"]',
    '[class*="toc"]', '[class*="breadcrumb"]',
    '[class*="footer"]', '[class*="header"]',
    'script', 'style',
  ];
  
  const clone = contentEl.cloneNode(true);
  removeSelectors.forEach(sel => {
    clone.querySelectorAll(sel).forEach(el => el.remove());
  });

  // HTML → 간이 마크다운 변환
  function htmlToMd(el) {
    let md = '';
    
    for (const node of el.childNodes) {
      if (node.nodeType === 3) { // 텍스트 노드
        md += node.textContent;
        continue;
      }
      if (node.nodeType !== 1) continue; // 엘리먼트만

      const tag = node.tagName.toLowerCase();
      
      if (tag === 'h1') md += `\n# ${node.textContent.trim()}\n\n`;
      else if (tag === 'h2') md += `\n## ${node.textContent.trim()}\n\n`;
      else if (tag === 'h3') md += `\n### ${node.textContent.trim()}\n\n`;
      else if (tag === 'h4') md += `\n#### ${node.textContent.trim()}\n\n`;
      else if (tag === 'p') md += `${htmlToMd(node).trim()}\n\n`;
      else if (tag === 'pre' || tag === 'code') {
        const lang = node.className?.match(/language-(\w+)/)?.[1] || '';
        const code = node.textContent.trim();
        if (tag === 'pre' || code.includes('\n')) {
          md += `\n\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
        } else {
          md += `\`${code}\``;
        }
      }
      else if (tag === 'ul') {
        node.querySelectorAll(':scope > li').forEach(li => {
          md += `- ${li.textContent.trim()}\n`;
        });
        md += '\n';
      }
      else if (tag === 'ol') {
        let i = 1;
        node.querySelectorAll(':scope > li').forEach(li => {
          md += `${i}. ${li.textContent.trim()}\n`;
          i++;
        });
        md += '\n';
      }
      else if (tag === 'table') {
        const rows = node.querySelectorAll('tr');
        rows.forEach((row, idx) => {
          const cells = row.querySelectorAll('th, td');
          const line = Array.from(cells).map(c => c.textContent.trim()).join(' | ');
          md += `| ${line} |\n`;
          if (idx === 0) {
            md += `| ${Array.from(cells).map(() => '---').join(' | ')} |\n`;
          }
        });
        md += '\n';
      }
      else if (tag === 'blockquote') {
        md += `> ${node.textContent.trim()}\n\n`;
      }
      else if (tag === 'a') {
        const href = node.getAttribute('href') || '';
        md += `[${node.textContent.trim()}](${href})`;
      }
      else if (tag === 'strong' || tag === 'b') {
        md += `**${node.textContent.trim()}**`;
      }
      else if (tag === 'em' || tag === 'i') {
        md += `*${node.textContent.trim()}*`;
      }
      else if (tag === 'br') {
        md += '\n';
      }
      else if (tag === 'img') {
        const alt = node.getAttribute('alt') || '';
        const src = node.getAttribute('src') || '';
        md += `![${alt}](${src})\n\n`;
      }
      else if (['div', 'section', 'span', 'li', 'dd', 'dt'].includes(tag)) {
        md += htmlToMd(node);
      }
    }
    return md;
  }

  const title = document.querySelector('h1')?.textContent?.trim() || document.title;
  const markdown = htmlToMd(clone);

  return { title, markdown };
}

// ─── 메인 크롤링 로직 ───
async function crawl(targetSlug) {
  // 대상 페이지 필터
  let pages = PAGES;
  if (targetSlug) {
    pages = PAGES.filter(p => p.slug === targetSlug);
    if (pages.length === 0) {
      console.error(`❌ 알 수 없는 페이지: ${targetSlug}`);
      console.log('사용 가능한 슬러그:', PAGES.map(p => p.slug).join(', '));
      process.exit(1);
    }
  }

  // 출력 디렉토리 생성
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log(`\n🚀 크롤링 시작: ${pages.length}페이지\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const results = { success: 0, fail: 0, skipped: 0 };

  for (const pageInfo of pages) {
    const url = `${BASE_URL}${pageInfo.path}`;
    const outFile = path.join(OUTPUT_DIR, `${pageInfo.slug}.md`);

    // 이미 크롤링된 파일이 있으면 스킵 (--force로 덮어쓰기)
    if (fs.existsSync(outFile) && !process.argv.includes('--force')) {
      console.log(`⏭️  ${pageInfo.slug} — 이미 존재 (--force로 덮어쓰기)`);
      results.skipped++;
      continue;
    }

    try {
      const page = await browser.newPage();
      
      // 불필요한 리소스 차단 (속도 향상)
      await page.setRequestInterception(true);
      page.on('request', req => {
        const type = req.resourceType();
        if (['image', 'font', 'media'].includes(type)) {
          req.abort();
        } else {
          req.continue();
        }
      });

      // 페이지 로드
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      // SPA 렌더링 대기
      await page.waitForTimeout(2000);

      // 콘텐츠 추출
      const { title, markdown } = await page.evaluate(extractContent);

      // 메타데이터 헤더 + 마크다운 저장
      const content = [
        `---`,
        `source: ${url}`,
        `slug: ${pageInfo.slug}`,
        `category: ${pageInfo.category}`,
        `crawled_at: ${new Date().toISOString()}`,
        `title: "${title}"`,
        `---`,
        ``,
        markdown.trim(),
        ``,
      ].join('\n');

      fs.writeFileSync(outFile, content, 'utf-8');

      const lineCount = content.split('\n').length;
      console.log(`✅ ${pageInfo.slug} — ${lineCount}줄 저장됨`);
      results.success++;

      await page.close();

      // 서버 부담 경감
      await new Promise(r => setTimeout(r, 1500));

    } catch (err) {
      console.error(`❌ ${pageInfo.slug} — ${err.message}`);
      results.fail++;
    }
  }

  await browser.close();

  // ─── 결과 요약 ───
  console.log(`\n${'═'.repeat(50)}`);
  console.log(`📊 크롤링 완료`);
  console.log(`   ✅ 성공: ${results.success}`);
  console.log(`   ❌ 실패: ${results.fail}`);
  console.log(`   ⏭️  스킵: ${results.skipped}`);
  console.log(`   📁 저장: ${OUTPUT_DIR}`);
  console.log(`${'═'.repeat(50)}\n`);

  // 실패한 항목 목록
  if (results.fail > 0) {
    console.log('💡 실패한 페이지는 개별 재실행하세요:');
    console.log('   node scripts/crawl-docs.js [slug]\n');
  }
}

// ─── 실행 ───
const targetSlug = process.argv[2]?.replace('--force', '').trim() || null;
crawl(targetSlug === '' ? null : targetSlug).catch(console.error);
