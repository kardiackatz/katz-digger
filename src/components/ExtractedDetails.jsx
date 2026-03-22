import { useState } from 'react';

const ALL_FIELDS = [
  { key: 'artist',        label: 'Artist',        mono: false },
  { key: 'title',         label: 'Title',         mono: false },
  { key: 'label',         label: 'Label',         mono: false },
  { key: 'catalog_number',label: 'Catalog #',     mono: true  },
  { key: 'matrix',        label: 'Matrix',        mono: true  },
  { key: 'country',       label: 'Country',       mono: false },
  { key: 'year',          label: 'Year',          mono: false },
  { key: 'barcode',       label: 'Barcode',       mono: true  },
  { key: 'format',        label: 'Format',        mono: false },
  { key: 'side',          label: 'Side',          mono: false },
  { key: 'label_details', label: 'Label details', mono: false },
  { key: 'notes',         label: 'Notes',         mono: false },
];

// Fields that feed into the Discogs search query
const SEARCH_KEYS = new Set(['artist','title','label','catalog_number','matrix','country','year','barcode','format']);
const SEARCH_TOTAL = SEARCH_KEYS.size; // 9

export default function ExtractedDetails({ details, onChange, showEmpty = false }) {
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue]   = useState('');

  const isEditable = !!onChange;

  // Completeness: how many of the 9 search fields are filled
  const filled = ALL_FIELDS.filter(({ key }) => SEARCH_KEYS.has(key) && details[key]).length;

  // Which fields to render:
  // - always show filled fields
  // - show empty fields when showEmpty=true or when editing that field
  const visibleFields = ALL_FIELDS.filter(({ key }) =>
    details[key] || (isEditable && (showEmpty || editingKey === key))
  );

  // When not editable at all (read-only mode), fall back to original filter
  const displayFields = isEditable ? visibleFields : ALL_FIELDS.filter(({ key }) => details[key]);

  const startEdit = (key, currentValue) => {
    if (!isEditable) return;
    setEditingKey(key);
    setEditValue(currentValue || '');
  };

  const commitEdit = (key) => {
    if (!isEditable) return;
    const trimmed = editValue.trim() || null;
    onChange({ ...details, [key]: trimmed });
    setEditingKey(null);
    setEditValue('');
  };

  if (displayFields.length === 0 && !isEditable) return null;

  return (
    <div className="extracted-card">
      <div className="extracted-header">
        <span className="extracted-badge">Extracted</span>
        {isEditable && (
          <span className="extracted-completeness">{filled}/{SEARCH_TOTAL} identified</span>
        )}
      </div>
      <div className="extracted-fields">
        {displayFields.map(({ key, label, mono }) => {
          const value    = details[key];
          const isEditing = editingKey === key;
          const isEmpty   = !value;

          return (
            <div
              key={key}
              className={[
                'extracted-field',
                isEditable  ? 'extracted-field--editable'  : '',
                isEditing   ? 'extracted-field--editing'   : '',
                isEmpty && isEditable ? 'extracted-field--empty' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => !isEditing && startEdit(key, value)}
            >
              <span className="field-key">{label}</span>

              {isEditing ? (
                <input
                  className={`field-edit-input${mono ? ' mono' : ''}`}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => commitEdit(key)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter')  { e.preventDefault(); commitEdit(key); }
                    if (e.key === 'Escape') { setEditingKey(null); }
                  }}
                  autoFocus
                />
              ) : (
                <span className={[
                  'field-value',
                  mono    ? 'mono'              : '',
                  isEmpty ? 'field-value--empty': '',
                ].filter(Boolean).join(' ')}>
                  {value || (isEditable ? 'tap to add' : '—')}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
