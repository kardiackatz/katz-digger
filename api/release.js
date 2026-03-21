const { verifyRequest } = require('./_auth');

module.exports = async function handler(req, res) {
  if (!verifyRequest(req)) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query || {};
  if (!id) return res.status(400).json({ error: 'id is required' });

  try {
    const response = await fetch(`https://api.discogs.com/releases/${id}`, {
      headers: {
        Authorization: `Discogs token=${process.env.DISCOGS_TOKEN}`,
        'User-Agent': 'KatzDigger/1.0',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('[release]', err.message);
    res.status(500).json({ error: err.message });
  }
};
