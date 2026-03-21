const { verifyRequest } = require('./_auth');

module.exports = async function handler(req, res) {
  if (!verifyRequest(req)) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { artist, title, catno, barcode, q } = req.query || {};

  const params = new URLSearchParams({ type: 'release', per_page: '25', page: '1' });
  if (q)      params.set('q', q);
  if (artist) params.set('artist', artist);
  if (title)  params.set('release_title', title);
  if (catno)  params.set('catno', catno);
  if (barcode) params.set('barcode', barcode);

  try {
    const response = await fetch(`https://api.discogs.com/database/search?${params}`, {
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
    console.error('[search]', err.message);
    res.status(500).json({ error: err.message });
  }
};
