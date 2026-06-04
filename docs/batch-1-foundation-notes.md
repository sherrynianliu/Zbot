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

