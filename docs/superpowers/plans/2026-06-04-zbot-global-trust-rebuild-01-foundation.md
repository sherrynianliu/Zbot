# Batch 1: Repo Safety, Static Site Audit, QA Contracts

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Verify the real website repo, document the current static site structure, preserve the existing visual style, and add QA contracts that prevent unverified proof and risky copy from shipping.

**Architecture:** Keep the existing static HTML/CSS/JS architecture. Add lightweight QA scripts and route/copy/schema checks without changing the public site yet.

**Tech Stack:** Static HTML/CSS/JS, Node scripts for tests, Playwright config for browser checks.

---

## Scope

This batch must not rewrite visible marketing pages. It verifies repo state, captures baseline evidence, and adds test infrastructure.

## Files

- Modify or create: `package.json`
- Create: `tests/risk-copy.mjs`
- Create: `tests/proof-claims.mjs`
- Create: `tests/route-inventory.mjs`
- Create: `tests/schema-jsonld.mjs`
- Create: `tests/html-sanity.mjs`
- Create: `docs/site-route-manifest.json`
- Create: `docs/proof-claim-allowlist.json`
- Create: `docs/contact-inventory.json`
- Create: `playwright.config.mjs`
- Create: `tests/e2e/site-smoke.spec.mjs`
- Create: `docs/superpowers/plans/*` if these plan files are not already present in the real repo

## Tasks

- [ ] Run `pwd`, `git status`, `git branch --show-current`, `git remote -v`, and `git status --short`.
- [ ] Confirm remote is `https://github.com/JHSHdhb/Zbot.git`. If not, stop.
- [ ] Record base branch, remote URL, and dirty worktree inventory.
- [ ] If dirty files exist, identify which are user-owned and preserve them. Do not overwrite or revert unrelated edits.
- [ ] Create branch `feature/zbot-global-trust-rebuild`.
- [ ] Capture baseline screenshots of current production pages:
  - `https://www.zbotglobal.com/`
  - `https://www.zbotglobal.com/faq.html`
  - `https://www.zbotglobal.com/about-us.html`
  - one current service page.
  - `https://www.zbotglobal.com/contact.html` if it exists.
  - `https://www.zbotglobal.com/client-request.html` if it remains public.
  - `https://www.zbotglobal.com/zbot-linkedin-landing.html` if it remains public.
  - desktop and mobile for each page.
- [ ] Inventory every root HTML file and classify each as public, compatibility, private campaign, or intentionally excluded:
  - `index.html`
  - `about-us.html`
  - `faq.html`
  - `contact.html`
  - `blog.html`
  - `blog-post-1.html`
  - `client-request.html`
  - `demo.html`
  - `zbot-landing.html`
  - `zbot-linkedin-landing.html`
  - existing service pages
- [ ] Default route classification decisions unless implementation discovers a technical conflict:
  - `client-request.html`: public, but must pass risk/proof checks.
  - `zbot-linkedin-landing.html`: intentionally excluded, noindex, not in sitemap, not in `llms.txt`, not linked from main navigation.
  - `demo.html`: intentionally excluded or noindex unless rewritten later.
  - `zbot-landing.html`: intentionally excluded or noindex unless rewritten later.
- [ ] Inventory sitemap, robots, JS, CSS, i18n JSON, and media assets.
- [ ] Create `docs/site-route-manifest.json` with one object per route:
  - `path`
  - `canonicalUrl`
  - `title`
  - `includeInSitemap`
  - `includeInLlms`
  - `pageType`
  - `compatibilityTarget`
  - `status`
- [ ] Update route inventory tests to validate `sitemap.xml`, `llms.txt`, canonical links, and navigation links against `docs/site-route-manifest.json`.
- [ ] Inventory current navigation/footer patterns so later edits preserve style and do not create inconsistent repeated markup.
- [ ] Inventory all current contact values into `docs/contact-inventory.json`: visible text, `href`, source file, and whether the value is approved for reuse.
- [ ] Use the approved contact set: `customer@zbotglobal.com`, `+1 647-864-5968`, `+86 173-3618-8628`, WhatsApp `+1 647-864-5968`, company LinkedIn link, and WeChat ID `zbotglobal`.
- [ ] Stop before Batch 2 only if existing assets or markup contradict this approved contact set in a way that cannot be safely normalized.
- [ ] Add `package.json` scripts:
  - `test`: run risk-copy, proof-claims, route-inventory, schema-jsonld, and html-sanity scripts.
  - `lint`: run html-sanity.
  - `test:e2e`: run Playwright.
  - `qa`: run test and e2e.
- [ ] Add risk-copy script that scans public `.html`, `.xml`, `.txt`, `.js`, `.css` files and flags high-risk claims outside explicit boundary pages.
- [ ] Risk-copy script must allow risky terms only inside elements with `data-risk-context="boundary"`.
- [ ] Add proof-claim allowlist script that scans visible or AI-readable copy only: public `.html`, `.xml`, `.txt`, `js/i18n/*.json`, and text-bearing JavaScript strings that are rendered to users.
- [ ] Exclude CSS, layout-only JavaScript, private working notes, and `docs/superpowers/plans/*.md` from proof-claim scanning.
- [ ] The proof scanner must be context-aware. It should flag evidence-style patterns, not every occurrence of service names:
  - Named employer or institution claims such as `来自 IBM`, `来自 Samsung`, `S&P Global`, `Google`, `LinkedIn`, `多伦多大学`, `高校教授`, `实验室`.
  - Partnership/endorsement claims such as `合作伙伴`, `官方授权`, `认证`, `顾问指导`, `联合研发`.
  - Quantified proof claims such as `准确率`, `增长`, `提升`, `覆盖超过`, `研究生及以上`, `%` when attached to a business/result/team claim.
  - Research/publication claims such as `发表`, `论文`, `research-backed`, `JMIR`, `Google Scholar`.
- [ ] The proof scanner must not flag ordinary service descriptions such as `LinkedIn Ads`, `Google Ads`, `LinkedIn 公司页`, `LinkedIn 主页`, or CSS percentages.
- [ ] `docs/proof-claim-allowlist.json` must record allowed claim text, source URL/file, source type, and allowed page(s).
- [ ] Add route inventory script that asserts all required public pages exist.
- [ ] Add schema script that parses JSON-LD blocks and rejects unsupported schema types such as `aggregateRating`, `review`, `award`, and fake customer `Organization`.
- [ ] Add HTML sanity script for missing titles, missing meta descriptions, broken canonical tags, missing alt text on new images, and duplicate IDs.

## Risk-Copy Rules

Flag these outside elements marked with `data-risk-context="boundary"`:

- `不封号`
- `100%安全`
- `100% 安全`
- `100% 官方通道`
- `100% Safe`
- `Absolutely Safe`
- `绝对安全`
- `保证回复率`
- `高触达`
- `百万数据`
- `百万数据上传`
- `1 人顶 10 人`
- `虚拟币交易`
- `自动炒币`
- `投资理财`
- `自动交易`
- `资金盘`
- `稳赚`
- `保收益`
- `account-ban bypass`
- `guaranteed results`
- `crypto trading`
- `investment advice`
- `automated trading`

Allowed use must be negative or boundary-setting, for example: `Zbot Global 不提供虚拟币交易、自动交易或投资理财服务。`

## Verification

- [ ] `npm install` completes. If network sandboxing blocks it, request approval for `npm install`.
- [ ] `npm run test` runs and reports current risks before page rewrites.
- [ ] `npm run lint` runs.
- [ ] Baseline screenshots are saved under `tests/artifacts/baseline/` or documented in working notes if artifact storage is unsuitable.
- [ ] `docs/site-route-manifest.json`, `docs/proof-claim-allowlist.json`, and `docs/contact-inventory.json` exist and are validated by tests.
- [ ] Before commit: run `git status --short`, stage only intended files, run `git diff --cached --stat`, and confirm unrelated/user-owned dirty files are excluded.
- [ ] Commit message: `chore: add static-site QA contracts for trust rebuild`.

## Batch 1 Review Prompt

Ask a subagent to review:

> Review Batch 1 against `docs/superpowers/plans/2026-06-04-zbot-global-trust-rebuild-01-foundation.md`. Focus on repo safety, static-site fit, baseline capture, high-risk copy detection, schema checks, and whether the plan preserves current user work.
