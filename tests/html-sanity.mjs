import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const findings = [];

for (const file of fs.readdirSync(root).filter((entry) => entry.endsWith(".html"))) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  if (!/<title>[^<]{8,}<\/title>/i.test(html)) findings.push(`${file}: missing useful <title>`);
  if (!/<meta\s+name=["']description["']/i.test(html)) findings.push(`${file}: missing meta description`);
  if (!/<link\s+rel=["']canonical["']/i.test(html) && !isExcluded(file)) findings.push(`${file}: missing canonical link`);
  const ids = [...html.matchAll(/\sid=["']([^"']+)["']/gi)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  for (const id of new Set(duplicates)) findings.push(`${file}: duplicate id "${id}"`);
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\salt=["'][^"']*["']/i.test(match[0])) findings.push(`${file}: image missing alt text: ${match[0].slice(0, 100)}`);
  }
}

if (findings.length) {
  console.error("HTML sanity findings:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log("HTML sanity passed.");

function isExcluded(file) {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "docs/site-route-manifest.json"), "utf8"));
  return manifest.find((route) => route.path === file)?.status === "excluded";
}
