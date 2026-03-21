/**
 * Shared auth middleware — NOT a Vercel endpoint (underscore prefix).
 * Token is HMAC-SHA256 of a fixed string keyed on the stored password hash.
 * Stateless: no server-side token storage needed.
 */
const crypto = require('crypto');

const SESSION_NONCE = 'katz-digger-session-v1';

function generateToken(passwordHash) {
  return crypto
    .createHmac('sha256', passwordHash)
    .update(SESSION_NONCE)
    .digest('hex');
}

function verifyRequest(req) {
  const authHeader = req.headers['authorization'] || '';
  if (!authHeader.startsWith('Bearer ')) return false;

  const token = authHeader.slice(7).trim();
  const passwordHash = process.env.KATZ_DIGGER_PASSWORD;
  if (!passwordHash || token.length !== 64) return false;

  const expected = generateToken(passwordHash);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(token,    'hex'),
      Buffer.from(expected, 'hex')
    );
  } catch {
    return false;
  }
}

module.exports = { verifyRequest, generateToken };
