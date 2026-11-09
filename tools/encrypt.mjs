// 重新加密網站資料：把明文 data.plain.js + app.plain.js 加密成 data.enc.js
// 用法： FQR_PASS=<密碼> node tools/encrypt.mjs [明文資料夾，預設 /workspace/fqr-src]
// 明文來源（不要 commit）：<src>/data.plain.js（RULES/GROUPS/XINREN 資料）、<src>/app.plain.js（卡片畫面程式與期間/重點/截止資料）
// salt 固定（tools/salt.txt），所以重新加密後已登入的手機不用重登。
import { webcrypto as c } from 'node:crypto';
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = process.argv[2] || '/workspace/fqr-src';
const pass = (process.env.FQR_PASS || '').trim().toUpperCase();
if (!pass) { console.error('請設定 FQR_PASS 環境變數'); process.exit(1); }
const ITER = 150000;
const salt = Buffer.from(fs.readFileSync(path.join(root, 'tools/salt.txt'), 'utf8').trim(), 'hex');
const plain = fs.readFileSync(path.join(src, 'data.plain.js'), 'utf8') + '\n;\n' + fs.readFileSync(path.join(src, 'app.plain.js'), 'utf8');
const base = await c.subtle.importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveKey']);
const key = await c.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
const iv = c.getRandomValues(new Uint8Array(12));
const ct = Buffer.from(await c.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plain)));
const b64 = b => Buffer.from(b).toString('base64');
const out = `window.ENC={v:1,iter:${ITER},salt:"${b64(salt)}",iv:"${b64(iv)}",ct:"${ct.toString('base64')}"};\n`;
fs.writeFileSync(path.join(root, 'data.enc.js'), out);
console.log('已寫入 data.enc.js，', plain.length, '字元 →', out.length, 'bytes');
