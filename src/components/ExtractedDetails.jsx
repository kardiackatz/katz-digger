const FIELDS = [
  { key: 'artist',         label: 'Artist'   },
  { key: 'title',          label: 'Title'    },
  { key: 'label',          label: 'Label'    },
  { key: 'catalog_number', label: 'Catalog #', mono: true },
  { key: 'country',        label: 'Country'  },
  { key: 'year',           label: 'Year'     },
  { key: 'barcode',        label: 'Barcode',  mono: true },
  { key: 'format',         label: 'Format'   },
];

export default function ExtractedDetails({ details }) {
  const fields = FIELDS.filter(({ key }) => details[key]);
  if (fields.length === 0) return null;

  return (
    <div className="extracted-card">
      <div className="extracted-header">
        <span className="extracted-badge">Extracted</span>
      </div>
      <div className="extracted-fields">
        {fields.map(({ key, label, mono }) => (
          <div key={key} className="extracted-field">
            <span className="field-key">{label}</span>
            <span className={`field-value${mono ? ' mono' : ''}`}>{details[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
