import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = [
  ...fs.readdirSync(root).filter((file) => /\.(html|xml|txt)$/i.test(file)),
  ...walk(path.join(root, "js")).filter((file) => /\.(js|json)$/i.test(file)).map((file) => path.relative(root, file)),
];

const riskyPatterns = [
  /不封号/g,
  /100%\s*安全/g,
  /100%\s*官方通道/g,
  /100%\s*Safe/gi,
  /Absolutely\s*Safe/gi,
  /绝对安全/g,
  /保证回复率/g,
  /高触达/g,
  /百万数据(?:上传)?/g,
  /1\s*人\s*顶\s*10\s*人/g,
  /虚拟币交易/g,
  /自动炒币/g,
  /投资理财/g,
  /自动交易/g,
  /资金盘/g,
  /稳赚/g,
  /保收益/g,
  /account-ban bypass/gi,
  /guaranteed results/gi,
  /crypto trading/gi,
  /investment advice/gi,
  /automated trading/gi,
];

const findings = [];

for (const file of files) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) continue;
  const text = fs.readFileSync(fullPath, "utf8");
  for (const pattern of riskyPatterns) {
    for (const match of text.matchAll(pattern)) {
      if (!isAllowedBoundary(text, match.index ?? 0)) {
        findings.push(`${file}: risky copy "${match[0]}" is outside data-risk-context="boundary"`);
      }
    }
  }
}

if (findings.length) {
  console.error("Risk-copy findings:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log("Risk-copy scan passed.");

function isAllowedBoundary(text, index) {
  const before = text.slice(0, index);
  const marker = before.lastIndexOf('data-risk-context="boundary"');
  if (marker === -1) return false;
  const nextClose = text.indexOf("</", index);
  const nextMarker = text.indexOf('data-risk-context="boundary"', marker + 1);
  return nextClose !== -1 && (nextMarker === -1 || nextMarker > index);
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
