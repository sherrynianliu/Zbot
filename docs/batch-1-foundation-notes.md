# Batch 1 Foundation Notes

Date: 2026-06-04

Branch: `feature/zbot-global-trust-rebuild`

Remote: `https://github.com/JHSHdhb/Zbot.git`

## Dirty State At Batch Start

- Existing tracked files were clean.
- `docs/` plan files were untracked before Batch 1 and are intentionally preserved for this PR.

## Approved Contact Set

- Email: `customer@zbotglobal.com`
- North America phone / WhatsApp: `+1 647-864-5968`
- China phone: `+86 173-3618-8628`
- WeChat ID: `zbotglobal`
- LinkedIn company page: `https://www.linkedin.com/company/zbottechnology/posts/?feedView=all`

## Baseline Captures

Desktop screenshots were captured through Playwright MCP:

- `baseline-home-desktop.png`
- `baseline-faq-desktop.png`
- `baseline-about-desktop.png`
- `baseline-service-desktop.png`
- `baseline-contact-desktop.png`
- `baseline-client-request-desktop.png`
- `baseline-linkedin-campaign-desktop.png`

Mobile screenshots timed out in the MCP screenshot tool, so mobile accessibility snapshots were captured:

- `baseline-home-mobile-snapshot.md`
- `baseline-faq-mobile-snapshot.md`
- `baseline-about-mobile-snapshot.md`

Local Playwright browser install was not used for screenshots because the bundled Chromium was unavailable and system Chrome headless exited with `SIGABRT`. Playwright MCP was used for baseline capture instead.

## Current QA Baseline

`npm test` currently fails at `risk-copy`, as expected before page rewrites:

- `faq.html`: `不封号`, `100% 安全`, `高触达`
- `zbot-linkedin-landing.html`: `100% 官方通道`, `绝对安全`
- `js/i18n/en.json`: `100% Safe`, `Absolutely Safe`
- `js/i18n/zh.json`: `100% 官方通道`, `绝对安全`

Additional individual script findings:

- `proof-claims`: flags current unverifiable About/team/research/partner and LinkedIn campaign claims.
- `route-inventory`: flags missing canonical URLs and sitemap gaps.
- `schema-jsonld`: passes; no forbidden JSON-LD type detected.
- `html-sanity`: flags missing descriptions/canonicals and one weak campaign page title.

These failures define the current risk baseline. Later batches must reduce them to zero before PR creation.

## Post-review Contract Fixes

After subagent review, Batch 1 QA contracts were tightened before Batch 2 implementation:

- `route-inventory`: now requires `llms.txt` when routes opt in, rejects extra sitemap/llms URLs, checks excluded routes for `noindex`, verifies compatibility targets, and flags public links to excluded pages.
- `contact-inventory`: now enforces approved visible contact text, approved `mailto:` / `tel:` / WhatsApp / LinkedIn hrefs, blocked legacy values, and the confirmed WeChat ID `zbotglobal`.
- `proof-claims`: now uses page-specific allowlist entries with required source URLs and allowed snippets instead of global substring matching.
- `risk-copy`: now scans CSS and validates risky wording against the actual HTML ancestor carrying `data-risk-context="boundary"`.
- `schema-jsonld`: now checks nested JSON-LD graph items and blocks unverified customer/case `Organization` entries.

Expected failures after these fixes include old contact values, missing `llms.txt`, excluded pages without `noindex`, and old proof-style claims. Those are content debt for the next batches, not QA setup failures.
