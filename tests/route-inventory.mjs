import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, "docs/site-route-manifest.json"), "utf8"));
const sitemap = fs.existsSync("sitemap.xml") ? fs.readFileSync("sitemap.xml", "utf8") : "";
const llms = fs.existsSync("llms.txt") ? fs.readFileSync("llms.txt", "utf8") : "";
const findings = [];

const manifestPaths = new Set(manifest.map((route) => route.path));
for (const file of fs.readdirSync(root).filter((entry) => entry.endsWith(".html"))) {
  if (!manifestPaths.has(file)) findings.push(`${file}: root HTML file is missing from docs/site-route-manifest.json`);
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
  if (route.includeInSitemap && !sitemap.includes(route.canonicalUrl)) {
    findings.push(`${route.path}: includeInSitemap=true but sitemap.xml lacks ${route.canonicalUrl}`);
  }
  if (!route.includeInSitemap && sitemap.includes(route.canonicalUrl)) {
    findings.push(`${route.path}: includeInSitemap=false but sitemap.xml includes ${route.canonicalUrl}`);
  }
  if (route.includeInLlms && llms && !llms.includes(route.canonicalUrl)) {
    findings.push(`${route.path}: includeInLlms=true but llms.txt lacks ${route.canonicalUrl}`);
  }
}

if (findings.length) {
  console.error("Route-inventory findings:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log("Route inventory passed.");
