import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const inventory = JSON.parse(fs.readFileSync(path.join(root, "docs/contact-inventory.json"), "utf8"));
const files = [
  ...fs.readdirSync(root).filter((file) => /\.(html|xml|txt)$/i.test(file)),
  ...walk(path.join(root, "js")).filter((file) => /\.(js|json)$/i.test(file)).map((file) => path.relative(root, file)),
];
const findings = [];
const approvedEmails = new Set([inventory.approved.email.toLowerCase()]);
const approvedPhones = new Set([
  normalizePhone(inventory.approved.phoneNorthAmerica),
  normalizePhone(inventory.approved.phoneChina),
]);
const approvedWhatsApp = normalizePhone(inventory.approved.whatsapp);

for (const file of files) {
  const text = fs.readFileSync(path.join(root, file), "utf8");
  for (const blocked of inventory.blockedValues ?? []) {
    if (text.includes(blocked.value)) {
      findings.push(`${file}: blocked contact value "${blocked.value}" should be replaced with "${blocked.replacement}"`);
    }
  }
  for (const href of extractHrefs(text)) {
    checkHref({ file, href });
  }
  for (const match of text.matchAll(/微信号[:：]\s*([^<\s]+)/g)) {
    if (match[1] !== inventory.approved.wechat) {
      findings.push(`${file}: unapproved WeChat ID "${match[1]}"`);
    }
  }
  for (const match of text.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)) {
    const email = match[0].toLowerCase();
    if (email.endsWith("zbot.ai") || email.endsWith("zbotglobal.com")) {
      if (!approvedEmails.has(email)) findings.push(`${file}: unapproved public email "${match[0]}"`);
    }
  }
}

const combined = files.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");
for (const required of inventory.requiredVisibleContacts ?? []) {
  if (required.visibleText && !combined.includes(required.visibleText)) {
    findings.push(`site: required visible ${required.type} text is missing: "${required.visibleText}"`);
  }
  if (required.href && !combined.includes(required.href)) {
    findings.push(`site: required ${required.type} href is missing: "${required.href}"`);
  }
}

if (findings.length) {
  console.error("Contact-inventory findings:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log("Contact inventory passed.");

function extractHrefs(text) {
  return [...text.matchAll(/\shref=["']([^"']+)["']/gi)].map((match) => match[1]);
}

function checkHref({ file, href }) {
  if (/^mailto:/i.test(href)) {
    const email = href.replace(/^mailto:/i, "").split("?")[0].toLowerCase();
    if (!approvedEmails.has(email)) findings.push(`${file}: unapproved mailto href "${href}"`);
  }
  if (/^tel:/i.test(href)) {
    const phone = normalizePhone(href.replace(/^tel:/i, ""));
    if (!approvedPhones.has(phone)) findings.push(`${file}: unapproved tel href "${href}"`);
  }
  if (/^https:\/\/wa\.me\//i.test(href)) {
    const phone = normalizePhone(href.replace(/^https:\/\/wa\.me\//i, "").split(/[?#]/)[0]);
    if (phone !== approvedWhatsApp) findings.push(`${file}: unapproved WhatsApp href "${href}"`);
  }
  if (/linkedin\.com\/company\//i.test(href) && href !== inventory.approved.linkedinCompany) {
    findings.push(`${file}: unapproved LinkedIn company href "${href}"`);
  }
}

function normalizePhone(value) {
  const digits = String(value).replace(/\D/g, "");
  if (digits.startsWith("1") && digits.length === 11) return `+${digits}`;
  if (digits.startsWith("86") && digits.length === 13) return `+${digits}`;
  return `+${digits}`;
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
