import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const forbiddenTypes = new Set(["AggregateRating", "Review", "Award"]);
const findings = [];

for (const file of fs.readdirSync(root).filter((entry) => entry.endsWith(".html"))) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const block of blocks) {
    try {
      const parsed = JSON.parse(block[1].trim());
      for (const item of Array.isArray(parsed) ? parsed : [parsed]) {
        const types = Array.isArray(item["@type"]) ? item["@type"] : [item["@type"]];
        for (const type of types.filter(Boolean)) {
          if (forbiddenTypes.has(type)) findings.push(`${file}: forbidden JSON-LD type ${type}`);
        }
      }
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
