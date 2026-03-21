const crypto = require('crypto');
const { generateToken } = require('./_auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body || {};
  if (!password) return res.status(400).json({ error: 'Password required' });

  const storedHash = process.env.KATZ_DIGGER_PASSWORD;
  if (!storedHash) {
    console.error('[auth] KATZ_DIGGER_PASSWORD is not set');
    return res.status(500).json({ error: 'Auth not configured' });
  }

  const inputHash = crypto.createHash('sha256').update(password).digest('hex');

  // Constant-time comparison to prevent timing attacks
  const isValid = (() => {
    try {
      return crypto.timingSafeEqual(
        Buffer.from(inputHash,  'hex'),
        Buffer.from(storedHash, 'hex')
      );
    } catch {
      return false;
    }
  })();

  if (!isValid) {
    return res.status(401).json({ error: 'Wrong password' });
  }

  const token = generateToken(storedHash);
  res.status(200).json({ token });
};
