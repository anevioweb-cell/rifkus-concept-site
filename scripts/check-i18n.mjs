// Copy guard (English-only site). Fails (exit 1) when:
//  1. a value in src/i18n/en.js is empty or not a string;
//  2. a key referenced in src/ as t('a.b'), xxxKey: 'a.b' is missing;
//  3. Arabic text appears anywhere in src/ other than the approved brand
//     words of docs/DESIGN_SYSTEM.md (Arabic words) (owner rule: English copy, Arabic only
//     for «زفيطي» and the official slogan).
// Dynamic keys (template literals) are not checked statically.
import fs from 'node:fs';
import path from 'node:path';
import en from '../src/i18n/en.js';

const APPROVED_ARABIC = ['زفيطي', 'محاجب', 'مع ريفكوس تحلى القعدوس'];

const flatten = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? flatten(v, `${prefix}${k}.`) : [[`${prefix}${k}`, v]]));

const keys = new Map(flatten(en));
const problems = [];
for (const [k, v] of keys) if (typeof v !== 'string' || !v.trim()) problems.push(`empty value: ${k}`);

const srcDir = path.resolve(import.meta.dirname, '../src');
const files = fs.readdirSync(srcDir, { recursive: true }).filter((f) => /\.(jsx?|mjs|css)$/.test(f));
const keyPattern = /(?:\bt\(\s*|[A-Za-z]+Key:\s*)'([a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)+)'/g;
const arabicRun = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]+(?:[\s،]+[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]+)*/g;
let used = 0;
let arabic = 0;
for (const file of files) {
  const text = fs.readFileSync(path.join(srcDir, file), 'utf8');
  // Comments may quote keys or Arabic for documentation: strip them first.
  const code = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  if (/\.jsx?$|\.mjs$/.test(file)) {
    for (const [, key] of code.matchAll(keyPattern)) {
      used += 1;
      if (!keys.has(key)) problems.push(`used but undefined: ${key} (src/${file})`);
    }
  }
  // Official Arabic place names of the wilayas are reference data (not
  // rendered on this English site; docs/DESIGN_SYSTEM.md (Arabic words)), not copy.
  if (file === 'data/wilayas.js') continue;
  for (const [run] of code.matchAll(arabicRun)) {
    arabic += 1;
    if (!APPROVED_ARABIC.includes(run.trim())) problems.push(`unapproved Arabic "${run}" (src/${file}); see docs/DESIGN_SYSTEM.md (Arabic words)`);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`i18n OK: ${keys.size} English keys, ${used} static references checked, ${arabic} Arabic strings (all approved brand words).`);
