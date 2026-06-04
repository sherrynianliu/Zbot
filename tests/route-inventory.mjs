import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, "docs/site-route-manifest.json"), "utf8"));
const sitemap = fs.existsSync("sitemap.xml") ? fs.readFileSync("sitemap.xml", "utf8") : "";
const llms = fs.existsSync("llms.txt") ? fs.readFileSync("llms.txt", "utf8") : "";
const findings = [];

const manifestPaths = new Set(manifest.map((route) => route.path));
const routesByPath = new Map(manifest.map((route) => [route.path, route]));
const expectedSitemapUrls = new Set(manifest.filter((route) => route.includeInSitemap).map((route) => route.canonicalUrl));
const expectedLlmsUrls = new Set(manifest.filter((route) => route.includeInLlms).map((route) => route.canonicalUrl));
const sitemapUrls = new Set([...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => match[1]));
const llmsUrls = new Set([...llms.matchAll(/https:\/\/www\.zbotglobal\.com\/[^\s)]+/gi)].map((match) => match[0]));

for (const file of fs.readdirSync(root).filter((entry) => entry.endsWith(".html"))) {
  if (!manifestPaths.has(file)) findings.push(`${file}: root HTML file is missing from docs/site-route-manifest.json`);
}

if (expectedSitemapUrls.size && !sitemap) {
  findings.push("sitemap.xml: required because manifest contains includeInSitemap=true routes");
}

if (expectedLlmsUrls.size && !llms) {
  findings.push("llms.txt: required because manifest contains includeInLlms=true routes");
}

for (const url of sitemapUrls) {
  if (!expectedSitemapUrls.has(url)) findings.push(`sitemap.xml: extra URL not approved by docs/site-route-manifest.json: ${url}`);
}

for (const url of llmsUrls) {
  if (!expectedLlmsUrls.has(url)) findings.push(`llms.txt: extra URL not approved by docs/site-route-manifest.json: ${url}`);
}

for (const route of manifest) {
  if (!fs.existsSync(path.join(root, route.path))) {
    findings.push(`${route.path}: manifest route file does not exist`);
    continue;
  }
  const html = fs.readFileSync(path.join(root, route.path), "utf8");
  if (route.status !== "excluded" && !html.includes(route.canonicalUrl)) {
    findings.push(`${route.path}: missing canonical URL ${route.canonicalUrl}`);
  }
  if (route.status === "excluded" && !/<meta\s+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)) {
    findings.push(`${route.path}: excluded route must include a robots noindex meta tag`);
  }
  if (route.compatibilityTarget && !manifestPaths.has(route.compatibilityTarget)) {
    findings.push(`${route.path}: compatibilityTarget ${route.compatibilityTarget} is not present in manifest`);
  }
  if (route.includeInSitemap && !sitemap.includes(route.canonicalUrl)) {
    findings.push(`${route.path}: includeInSitemap=true but sitemap.xml lacks ${route.canonicalUrl}`);
  }
  if (!route.includeInSitemap && sitemap.includes(route.canonicalUrl)) {
    findings.push(`${route.path}: includeInSitemap=false but sitemap.xml includes ${route.canonicalUrl}`);
  }
  if (route.includeInLlms && !llms.includes(route.canonicalUrl)) {
    findings.push(`${route.path}: includeInLlms=true but llms.txt lacks ${route.canonicalUrl}`);
  }
  if (!route.includeInLlms && llms.includes(route.canonicalUrl)) {
    findings.push(`${route.path}: includeInLlms=false but llms.txt includes ${route.canonicalUrl}`);
  }
}

for (const route of manifest.filter((entry) => entry.status !== "excluded")) {
  const htmlPath = path.join(root, route.path);
  if (!fs.existsSync(htmlPath)) continue;
  const html = fs.readFileSync(htmlPath, "utf8");
  for (const href of extractHrefs(html)) {
    const target = normalizeInternalHref(href);
    if (!target) continue;
    const targetRoute = routesByPath.get(target);
    if (targetRoute?.status === "excluded") {
      findings.push(`${route.path}: links to excluded route ${target}`);
    }
  }
}

if (findings.length) {
  console.error("Route-inventory findings:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log("Route inventory passed.");

function extractHrefs(html) {
  return [...html.matchAll(/\shref=["']([^"']+)["']/gi)].map((match) => match[1]);
}

function normalizeInternalHref(href) {
  if (/^(mailto:|tel:|javascript:|#)/i.test(href)) return null;
  if (/^https?:\/\//i.test(href)) {
    let parsed;
    try {
      parsed = new URL(href);
    } catch {
      return null;
    }
    if (parsed.hostname !== "www.zbotglobal.com" && parsed.hostname !== "zbotglobal.com") return null;
    return parsed.pathname.replace(/^\/+/, "") || "index.html";
  }
  if (/^[a-z]+:/i.test(href)) return null;
  return href.split("#")[0].split("?")[0].replace(/^\/+/, "") || "index.html";
}
