const MONO_FIELDS = new Set(['Catalog #', 'Matrix', 'Barcode']);

export default function ExtractedDetails({ details }) {
  const fields = [
    ['Artist',        details.artist],
    ['Title',         details.title],
    ['Label',         details.label],
    ['Catalog #',     details.catalog_number],
    ['Matrix',        details.matrix],
    ['Country',       details.country],
    ['Year',          details.year],
    ['Barcode',       details.barcode],
    ['Format',        details.format],
    ['Side',          details.side],
    ['Label details', details.label_details],
    ['Notes',         details.notes],
  ].filter(([, v]) => v);

  if (fields.length === 0) return null;

  return (
    <div className="extracted-card">
      <div className="extracted-header">
        <span className="extracted-badge">Extracted</span>
      </div>
      <div className="extracted-fields">
        {fields.map(([key, value]) => (
          <div key={key} className="extracted-field">
            <span className="field-key">{key}</span>
            <span className={`field-value${MONO_FIELDS.has(key) ? ' mono' : ''}`}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
