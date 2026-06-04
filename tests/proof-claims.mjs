import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const allowlist = JSON.parse(fs.readFileSync(path.join(root, "docs/proof-claim-allowlist.json"), "utf8"));

const files = [
  ...fs.readdirSync(root).filter((file) => /\.(html|xml|txt)$/i.test(file)),
  ...walk(path.join(root, "js/i18n")).filter((file) => /\.json$/i.test(file)).map((file) => path.relative(root, file)),
];

const proofPatterns = [
  {
    label: "team institution or employer claim",
    regex: /(?:来自|曾任职于|曾在|核心成员来自|团队.{0,12}来自|experience at|worked at)[^。；\n<]{0,120}(?:IBM|Samsung|S&amp;P Global|S&P Global|Google|LinkedIn|多伦多大学|高校|教授|实验室)/gi,
  },
  {
    label: "partnership, authorization, or official-channel claim",
    regex: /(?:联合研发|顾问指导|官方授权|官方渠道|认证合作|官方合作|certified partner|authorized partner|official channel|officially authorized)/gi,
  },
  {
    label: "quantified performance or coverage claim",
    regex: /(?:(?:客户|线索|数据|数据库|准确|覆盖|触达|回复|增长|提升|转化|成交|国家|companies|leads|accuracy|coverage|conversion|reply)[\s\S]{0,90}\d+(?:\.\d+)?\s*(?:亿|万|%|\+|个国家|国家|countries|companies|leads)|\d+(?:\.\d+)?\s*(?:亿|万|%|\+|个国家|国家|countries|companies|leads)[\s\S]{0,90}(?:客户|线索|数据|数据库|准确|覆盖|触达|回复|增长|提升|转化|成交|国家|companies|leads|accuracy|coverage|conversion|reply))/gi,
  },
  {
    label: "public research proof claim",
    regex: /(?:发表(?:过)?(?:的)?(?:文章|论文)|论文|Google Scholar|JMIR|research-backed|peer-reviewed)/gi,
  },
  {
    label: "customer logo claim",
    regex: /(?:客户\s*logo|客户\s*Logo|client\s*logo|customer\s*logo)/gi,
  },
];

const findings = [];

for (const file of files) {
  const raw = fs.readFileSync(path.join(root, file), "utf8");
  const text = toScanText(raw);
  for (const pattern of proofPatterns) {
    for (const match of text.matchAll(pattern.regex)) {
      if (pattern.label === "quantified performance or coverage claim" && isLikelyMetricNoise(match[0])) continue;
      if (!isAllowlisted({ file, raw, value: match[0] })) {
        findings.push(`${file}: ${pattern.label} needs page-specific allowlist/source note: "${trim(match[0])}"`);
      }
    }
  }
}

if (findings.length) {
  console.error("Proof-claim findings:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log("Proof-claim scan passed.");

function isAllowlisted({ file, raw, value }) {
  return allowlist.some((entry) => {
    if (!entry.allowedPages?.includes(file)) return false;
    const requiredSources = entry.requiredSources ?? [entry.source].filter(Boolean);
    const hasSources = requiredSources.every((source) => raw.includes(source));
    const snippets = entry.allowedSnippets ?? [entry.claim, entry.allowedWording].filter(Boolean);
    const hasSnippet = snippets.some((snippet) => value.includes(snippet) || raw.includes(snippet));
    return hasSources && hasSnippet;
  });
}

function toScanText(value) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
}

function trim(value) {
  return value.replace(/\s+/g, " ").slice(0, 140);
}

function isLikelyMetricNoise(value) {
  if (/\+\d{1,3}\s*\d{3,4}\s*\d{3,4}/.test(value)) return true;
  return !/(?:准确率|平均回复率|回复率|提升|增长|覆盖超过|全球企业|全球数据|数据库|数据资源|国家地区|覆盖国家|转化率|成交率|研究生|博士|海外工作经验|performance|accuracy|coverage|conversion|reply rate)/i.test(value);
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
