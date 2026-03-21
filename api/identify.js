const Anthropic = require('@anthropic-ai/sdk');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { extracted, releases } = req.body || {};
  if (!extracted || !Array.isArray(releases) || releases.length === 0) {
    return res.status(400).json({ error: 'extracted and releases[] are required' });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    // Trim to fields Claude needs — keeps tokens low
    const candidates = releases.map((r) => ({
      id: r.id,
      title: r.title,
      artists_sort: r.artists_sort,
      year: r.year,
      country: r.country,
      labels: r.labels?.map((l) => ({ name: l.name, catno: l.catno })),
      formats: r.formats?.map((f) => ({
        name: f.name,
        qty: f.qty,
        descriptions: f.descriptions,
        text: f.text,
      })),
      // identifiers contains Matrix/Runout, Barcode, ASIN, etc.
      identifiers: r.identifiers,
      community: { have: r.community?.have, want: r.community?.want },
    }));

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `You are an expert vinyl record pressing identifier.

DETAILS EXTRACTED FROM PHOTO:
${JSON.stringify(extracted, null, 2)}

CANDIDATE DISCOGS RELEASES (${candidates.length}):
${JSON.stringify(candidates, null, 2)}

Score each release 0–100 on how well it matches the photo.
Scoring weight: matrix/runout codes 40%, catalog number 25%, label 15%, country 10%, year 10%.
If a field is null in the extracted data, skip it in scoring.

Return a JSON array sorted by score descending. Include ALL candidates even if score is 0.

[
  {
    "release_id": 123456,
    "score": 95,
    "confidence": "high",
    "match_reasons": ["Matrix 'A-1 PORKY' matches exactly", "RSO catalog matches"],
    "mismatch_reasons": []
  }
]

Confidence: "high" ≥80, "medium" 60–79, "low" <60.
Return ONLY the JSON array.`,
        },
      ],
    });

    const text = message.content[0].text.trim();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      const match = text.match(/\[[\s\S]*\]/);
      if (match) data = JSON.parse(match[0]);
      else throw new Error('Could not parse ranking response as JSON');
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('[identify]', err.message);
    res.status(500).json({ error: err.message });
  }
};
