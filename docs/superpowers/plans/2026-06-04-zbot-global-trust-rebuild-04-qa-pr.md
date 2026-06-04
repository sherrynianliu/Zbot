# Batch 4: AI Entry Points, Browser QA, Subagent Review, PR Prep

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Make the static site crawlable, AI-readable, verifiable, and ready for one reviewed PR without deploying prematurely.

**Architecture:** Update crawler entrypoints from the final public-route inventory, run automated and browser checks, request subagent review, then prepare PR summary and rollout notes.

**Tech Stack:** Static `sitemap.xml`, `robots.txt`, `llms.txt`, Node QA scripts, Playwright, GitHub PR workflow.

---

## Scope

This batch finalizes public crawl entrypoints, verifies all requirements, and prepares the PR. It does not deploy unless the user explicitly asks.

## Files

- Modify: `sitemap.xml`
- Modify: `robots.txt`
- Create: `llms.txt`
- Modify: `tests/route-inventory.mjs`
- Modify: `tests/risk-copy.mjs`
- Modify: `tests/proof-claims.mjs`
- Modify: `tests/schema-jsonld.mjs`
- Modify: `tests/e2e/site-smoke.spec.mjs`
- Modify: `docs/site-route-manifest.json`
- Modify: `docs/proof-claim-allowlist.json`
- Modify: `docs/contact-inventory.json`
- Modify: HTML/CSS only if verification reveals defects.

## AI And Crawler Entry Points

- [ ] Update `sitemap.xml` from `docs/site-route-manifest.json`.
- [ ] Update `robots.txt` to allow normal crawling and reference `https://www.zbotglobal.com/sitemap.xml`.
- [ ] Create `llms.txt` from `docs/site-route-manifest.json`.
- [ ] `llms.txt` must include:
  - Zbot Global identity.
  - Chinese and English positioning.
  - Legal entity.
  - What Zbot Global does.
  - What Zbot Global does not do.
  - Every public trust page.
  - Every public service page.
  - `methodology.html`, `case-studies.html`, `ai-visibility.html`, `insights.html`.
  - Six published insight detail pages.
- [ ] Contact page appears in `llms.txt` only if official contact data is verified.
- [ ] Future insight topics must not appear in `llms.txt`, `sitemap.xml`, public HTML, public JSON, JS, or CSS.
- [ ] Route inventory tests must compare every public page canonical link, sitemap entry, `llms.txt` entry, and nav/footer internal link against `docs/site-route-manifest.json`.

## Browser QA

- [ ] Add Playwright checks for every public HTML route in `docs/site-route-manifest.json`.
- [ ] Assertions:
  - Desktop nav remains usable and does not wrap incoherently.
  - Hero CTA visible without scrolling.
  - Footer legal entity visible.
  - No obvious text overflow.
  - Risky terms appear only in allowed boundary contexts.
  - Internal links do not 404.
  - Referenced assets do not 404.
  - Browser console has no errors.
- [ ] Capture final screenshots for homepage desktop/mobile and brand clarification desktop/mobile.
- [ ] Capture final screenshots for each page family: homepage, trust page, FAQ, service page, scenario/case page, insight page, contact page if verified.
- [ ] Compare final screenshots against Batch 1 baseline screenshots to confirm the current style was preserved rather than replaced.
- [ ] Add CSS review gate: compare palette, typography, logo treatment, max-width system, nav height, and major layout spacing against baseline style.
- [ ] Inspect screenshots manually before claiming completion.

## Final Verification

- [ ] Run `npm run test`.
- [ ] Run `npm run lint`.
- [ ] Run a local static server such as `python3 -m http.server 4173`.
- [ ] Run `npm run test:e2e`.
- [ ] Run `git status --short`.
- [ ] Run `git diff --stat`.
- [ ] Run `git diff -- docs/superpowers/plans`.
- [ ] Run proof-claim allowlist scan over visible/AI-readable copy only, excluding CSS and private plan docs.
- [ ] Run future-topic leakage scan across public HTML, XML, TXT, JS, CSS, and deployable Markdown.
- [ ] Confirm changed files match the four-batch plan.

## Subagent Review

- [ ] Request subagent review of the full PR diff before PR creation.
- [ ] Reviewer focus:
  - AI misclassification risk.
  - Legal/entity overclaiming.
  - Founder/research proof wording.
  - Domestic AI/GEO content rollout risk.
  - Static SEO and schema validity.
  - Visual style preservation.
  - Mobile/desktop layout quality.
- [ ] Fix Critical and Important review findings before PR.
- [ ] Record Minor findings in PR notes if not fixed.

## PR Prep

- [ ] Confirm base branch and remote URL again.
- [ ] Confirm GitHub authentication with `gh auth status` if using GitHub CLI.
- [ ] Push branch to the correct remote only after final verification and user approval to push.
- [ ] Create PR for supervisor review. Do not merge.
- [ ] PR title: `Rebuild Zbot Global website as trust-first AI-readable service site`.
- [ ] PR summary sections:
  - Static QA contracts and baseline capture.
  - Homepage, trust pages, FAQ, and brand clarification.
  - Services, scenarios/case studies, research references, and controlled insights rollout.
  - AI entrypoints and browser QA.
- [ ] PR risk notes:
  - Six insight topics are intentionally not published to reduce abrupt domestic AI/GEO signal changes.
  - Founder LinkedIn and research links are public references, not endorsements or client proof.
  - LinkedIn discount/campaign page is intentionally hidden/noindex in this PR to avoid polluting the main GEO trust signal.
  - The PR does not deploy by itself.
- [ ] Create the PR with `gh pr create` only if GitHub CLI is authenticated and the user has approved pushing. Otherwise, provide the PR title/body for manual creation.
- [ ] Deployment note: Vercel CLI is not installed. Recommend `npm i -g vercel` if preview deployment, env pull, deploy, or logs are needed.

## Acceptance Criteria

- [ ] Public static site is crawlable and AI-readable.
- [ ] No unverified proof is encoded in schema or visible copy.
- [ ] All proof claims are allowlisted with sources.
- [ ] `llms.txt` and `sitemap.xml` include all public trust and service routes.
- [ ] Future insight topics are absent from public routes and crawl entrypoints.
- [ ] Contact data is verified or PR is blocked.
- [ ] Tests, lint, all-route Playwright, internal-link checks, asset checks, console checks, CSS style review, and screenshot review pass.
- [ ] Subagent review completed and Critical/Important findings resolved.
