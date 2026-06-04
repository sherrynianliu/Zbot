import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const allowlist = JSON.parse(fs.readFileSync(path.join(root, "docs/proof-claim-allowlist.json"), "utf8"));
const allowedSources = new Set(allowlist.flatMap((entry) => [entry.source, entry.claim]));

const files = [
  ...fs.readdirSync(root).filter((file) => /\.(html|xml|txt)$/i.test(file)),
  ...walk(path.join(root, "js/i18n")).filter((file) => /\.json$/i.test(file)).map((file) => path.relative(root, file)),
];

const proofPatterns = [
  /(?:来自|核心成员来自|团队.*来自)[^。<]*(?:IBM|Samsung|S&amp;P Global|S&P Global|Google|LinkedIn|多伦多大学|高校|教授|实验室)/g,
  /(?:联合研发|顾问指导|官方授权|官方渠道|合作伙伴|认证|certified|certification|authorized)/gi,
  /(?:准确率|覆盖超过|研究生及以上|博士研究员|提升|增长|转化率|回复率)[^。<]{0,30}(?:\d+%|\d+\+|超过|以上|达)/g,
  /(?:发表|论文|research-backed|Google Scholar|JMIR)/gi,
  /(?:客户logo|客户 Logo|client logo|customer logo)/gi,
];

const findings = [];

for (const file of files) {
  const text = fs.readFileSync(path.join(root, file), "utf8");
  for (const pattern of proofPatterns) {
    for (const match of text.matchAll(pattern)) {
      if (!isAllowlisted(match[0])) {
        findings.push(`${file}: proof-style claim needs allowlist/source note: "${trim(match[0])}"`);
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

function isAllowlisted(value) {
  return [...allowedSources].some((source) => value.includes(source) || source.includes(value));
}

function trim(value) {
  return value.replace(/\s+/g, " ").slice(0, 140);
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
