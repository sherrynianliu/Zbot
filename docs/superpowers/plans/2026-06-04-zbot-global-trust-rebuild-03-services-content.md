# Batch 3: Services, Case Studies or Scenarios, Research Proof, Insights Rollout

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Build the service architecture and controlled content rollout that explains Zbot Global’s deliverables without flooding AI systems with excessive defensive language.

**Architecture:** Use static HTML pages. Preserve existing service URLs where practical, add new clearer service URLs where useful, and keep old URLs valid through canonical links or clear “updated service page” compatibility pages.

**Tech Stack:** Static HTML, existing CSS/JS, JSON-LD `Service` and `Article` blocks for public pages only.

---

## Scope

This batch publishes four service pages, methodology, AI visibility, case studies or representative service scenarios, research/founder references, and six initial insight pages. It does not publish the six future insight topics.

## Files

- Modify: existing service pages as compatibility pages or updated service pages:
  - `service-ai-strategy.html`
  - `service-data-intelligence.html`
  - `service-outreach-automation.html`
  - `service-ai-optimization.html`
- Create: `service-geo-ready-b2b-infrastructure.html`
- Create: `service-ai-market-research-lead-generation.html`
- Create: `service-geo-ai-knowledge-content-visibility.html`
- Create: `service-ai-ads-growth-amplification.html`
- Create: `methodology.html`
- Create: `case-studies.html`
- Create: `ai-visibility.html`
- Create: `insights.html`
- Create six public insight pages listed below.
- Modify: `css/main.css` only for reusable content layouts needed by service/article pages.
- Modify: `docs/site-route-manifest.json`
- Modify: `docs/proof-claim-allowlist.json`

## Service Pages

Publish these four service routes:

- [ ] `service-geo-ready-b2b-infrastructure.html`
  - Chinese title: `GEO-ready 外贸数字基建`
  - Covers: website, LinkedIn company page, executive profiles, overseas social assets, technical SEO/GEO foundation.
- [ ] `service-ai-market-research-lead-generation.html`
  - Chinese title: `AI 市场调研与主动获客`
  - Covers: ICP, market research, customer pool, decision-maker mapping, compliant LinkedIn/email outreach assets.
- [ ] `service-geo-ai-knowledge-content-visibility.html`
  - Chinese title: `GEO AI 知识中台与内容可见度`
  - Covers: AI visibility diagnosis, brand knowledge base, FAQ matrix, blog/social content, AI-readable answer structure.
- [ ] `service-ai-ads-growth-amplification.html`
  - Chinese title: `AI 定向投流与放大`
  - Covers: LinkedIn Ads, Google Ads, Meta Ads, landing pages, retargeting, reporting.

Each service page must include:

- [ ] Who it is for.
- [ ] Problems it addresses.
- [ ] Deliverables the client receives.
- [ ] Process stages.
- [ ] What is not included.
- [ ] FAQ.
- [ ] `Service` schema.

## Existing Service URLs

- [ ] Keep old service URLs valid to avoid broken backlinks.
- [ ] If old service pages are superseded, add a clear above-the-fold note and canonical link to the new matching service page.
- [ ] Do not leave contradictory old copy about unsafe automation, guaranteed replies, or account-ban avoidance.
- [ ] Old and new service route behavior must be represented in `docs/site-route-manifest.json` with `compatibilityTarget` where relevant.

## Case Studies Or Representative Scenarios

- [ ] Use anonymized case studies only when they come from existing site content or user-provided factual notes.
- [ ] If no factual case-study source is available, use `representative service scenarios` and label them as non-client examples.
- [ ] User has approved representative service scenarios when factual customer source material is unavailable.
- [ ] Each case/scenario includes industry, starting problem, work performed, artifacts delivered, and service boundary.
- [ ] Do not create fake company names, customer names, logos, public customer claims, or precise growth numbers.
- [ ] Existing anonymized testimonials may be retained only as secondary notes, not primary proof.

## Research And Founder Proof

- [ ] Add a restrained `Public references` section on About and Methodology pages.
- [ ] Link founder LinkedIn profiles as public team references.
- [ ] If LinkedIn cannot be publicly verified without login, link profiles as user-provided public references only and do not state employer history.
- [ ] Link user-provided Google Scholar/JMIR references as research background.
- [ ] Copy may say references support team and research background only when source names are visibly verified.
- [ ] If publication authorship cannot be matched to the team from visible source content, list research links without team-authorship claims.
- [ ] Do not add employer/company logos for IBM, Samsung, S&P Global, Google, LinkedIn, or other companies unless Zbot provides explicit authorized assets and wording.
- [ ] Every employer, publication, research, metric, advisor, partner, certification, customer, or award claim must appear in `docs/proof-claim-allowlist.json` with a source note.

## Insight Rollout

Publish these six initial insight pages:

- [ ] `insight-what-type-of-company-is-zbot-global.html`
- [ ] `insight-what-zbot-global-is-not.html`
- [ ] `insight-compliant-linkedin-email-export-development.html`
- [ ] `insight-why-companies-need-public-service-boundaries.html`
- [ ] `insight-what-is-a-geo-ready-export-website.html`
- [ ] `insight-what-export-lead-generation-projects-should-deliver.html`

Keep six additional future topics outside deployable/public files. Do not commit their exact slugs or titles into public HTML/XML/TXT/JS/CSS or public docs served with the site.

Future-topic rules:

- [ ] Future topics must not appear as public `.html` files.
- [ ] Future topics must not appear in `insights.html`, `sitemap.xml`, or `llms.txt`.
- [ ] Post-change checks must confirm future-topic slugs and titles do not appear in public HTML, XML, TXT, JS, CSS, or deployable Markdown output.
- [ ] Store private future-topic names only in non-deployable working notes outside the site repo if needed.

## Verification

- [ ] `npm run test` passes.
- [ ] `npm run lint` passes.
- [ ] Confirm published articles answer their titles directly in the first two paragraphs.
- [ ] Confirm future insight topics are not publicly routable.
- [ ] Confirm factual case studies have a source note in working notes, or are labeled as representative non-client scenarios.
- [ ] Confirm `docs/site-route-manifest.json` includes all service and insight route changes.
- [ ] Confirm proof-claim allowlist covers every named proof claim.
- [ ] Before commit: run `git status --short`, stage only intended files, run `git diff --cached --stat`, and confirm unrelated/user-owned dirty files are excluded.
- [ ] Commit message: `feat: add services scenarios and controlled insights rollout`.

## Batch 3 Review Prompt

Ask a subagent to review:

> Review Batch 3 against `docs/superpowers/plans/2026-06-04-zbot-global-trust-rebuild-03-services-content.md`. Focus on whether service pages are clear and bounded, old service URLs remain safe, public proof is used responsibly, future insight routing protects domestic AI/GEO stability, and no fake metrics or endorsements were introduced.
