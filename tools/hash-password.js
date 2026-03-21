#!/usr/bin/env node
/**
 * Generate the SHA-256 hash of a password for KATZ_DIGGER_PASSWORD env var.
 * Usage: node tools/hash-password.js yourpassword
 */
const crypto = require('crypto');

const password = process.argv[2];
if (!password) {
  console.error('Usage: node tools/hash-password.js <password>');
  process.exit(1);
}

const hash = crypto.createHash('sha256').update(password).digest('hex');
console.log(`\nAdd this to your .env and Vercel environment variables:\n`);
console.log(`KATZ_DIGGER_PASSWORD=${hash}\n`);
