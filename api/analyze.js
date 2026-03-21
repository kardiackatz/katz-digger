const Anthropic = require('@anthropic-ai/sdk');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image, mediaType = 'image/jpeg' } = req.body || {};
  if (!image) {
    return res.status(400).json({ error: 'image (base64) is required' });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: image },
            },
            {
              type: 'text',
              text: `You are an expert vinyl record pressing identifier. Analyze this photo of a vinyl record label or dead wax/runout groove area and extract all identifying information.

Return a JSON object with these fields (use null if not visible/applicable):
{
  "artist": "Artist name as printed on the label",
  "title": "Album or single title",
  "catalog_number": "Catalog number from label (e.g. RSO 2394 176, ILPS 9105)",
  "label": "Record label name (e.g. Island, Harvest, Atlantic)",
  "matrix": "Full matrix/runout etching exactly as engraved (e.g. A-1, PORKY, YEX-1234-1, stamper letters)",
  "country": "Country of manufacture if visible",
  "year": "Year if visible on label",
  "barcode": "Barcode number if visible",
  "format": "Format (LP, 12\\", 7\\", 45 RPM, 33 RPM, Single, EP, etc.)",
  "label_details": "Visual description: label color, logo style, rim text, any distinguishing pressing features",
  "side": "Which side (A/B/1/2) if identifiable",
  "notes": "Any other pressing-specific info (e.g. 'Monarch pressing', 'Specialty pressing', promo markings)"
}

Return ONLY valid JSON, no explanation.`,
            },
          ],
        },
      ],
    });

    const text = message.content[0].text.trim();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) data = JSON.parse(match[0]);
      else throw new Error('Could not parse Claude response as JSON');
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('[analyze]', err.message);
    res.status(500).json({ error: err.message });
  }
};
