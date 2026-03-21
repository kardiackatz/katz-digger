module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { releaseId, folderId = 1 } = req.body || {};
  if (!releaseId) return res.status(400).json({ error: 'releaseId is required' });

  const username = process.env.DISCOGS_USERNAME || 'kardiaclp';
  const url = `https://api.discogs.com/users/${username}/collection/folders/${folderId}/releases/${releaseId}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Discogs token=${process.env.DISCOGS_TOKEN}`,
        'User-Agent': 'KatzDigger/1.0',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    res.status(200).json({ ...data, releaseId: Number(releaseId) });
  } catch (err) {
    console.error('[collect]', err.message);
    res.status(500).json({ error: err.message });
  }
};
