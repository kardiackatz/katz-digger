export default function TabToggle({ mode, onChange, disabled }) {
  return (
    <div className="tab-toggle" role="tablist">
      <button
        role="tab"
        aria-selected={mode === 'photo'}
        className={`tab${mode === 'photo' ? ' tab--active' : ''}`}
        onClick={() => onChange('photo')}
        disabled={disabled}
      >
        📷 Snap It
      </button>
      <button
        role="tab"
        aria-selected={mode === 'manual'}
        className={`tab${mode === 'manual' ? ' tab--active' : ''}`}
        onClick={() => onChange('manual')}
        disabled={disabled}
      >
        ⌨ Type It
      </button>
    </div>
  );
}
