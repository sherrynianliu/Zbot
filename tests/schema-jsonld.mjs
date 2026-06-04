import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const forbiddenTypes = new Set(["AggregateRating", "Review", "Award"]);
const forbiddenNestedKeys = new Set(["aggregateRating", "review", "award"]);
const findings = [];

for (const file of fs.readdirSync(root).filter((entry) => entry.endsWith(".html"))) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const block of blocks) {
    try {
      const parsed = JSON.parse(block[1].trim());
      visitJsonLd(parsed, file);
    } catch (error) {
      findings.push(`${file}: invalid JSON-LD (${error.message})`);
    }
  }
}

if (findings.length) {
  console.error("Schema findings:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log("Schema scan passed.");

function visitJsonLd(value, file) {
  if (Array.isArray(value)) {
    for (const item of value) visitJsonLd(item, file);
    return;
  }
  if (!value || typeof value !== "object") return;

  const types = Array.isArray(value["@type"]) ? value["@type"] : [value["@type"]];
  for (const type of types.filter(Boolean)) {
    if (forbiddenTypes.has(type)) findings.push(`${file}: forbidden JSON-LD type ${type}`);
    if (type === "Organization" && looksLikeFakeCustomerOrganization(value)) {
      findings.push(`${file}: JSON-LD Organization appears to describe an unverified customer/case: ${value.name ?? "(unnamed)"}`);
    }
  }

  for (const [key, child] of Object.entries(value)) {
    if (forbiddenNestedKeys.has(key)) findings.push(`${file}: forbidden nested JSON-LD key ${key}`);
    visitJsonLd(child, file);
  }
}

function looksLikeFakeCustomerOrganization(value) {
  const combined = [value.name, value.description, value.url, value.sameAs].flat().filter(Boolean).join(" ");
  if (/Zbot Global|Shenzhen Zbot Global|深圳智博出海/i.test(combined)) return false;
  return /(?:客户|案例|client|customer|case study|testimonial)/i.test(combined);
}
