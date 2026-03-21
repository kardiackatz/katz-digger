function scoreColor(score) {
  if (score >= 80) return 'var(--green)';
  if (score >= 60) return 'var(--amber)';
  return 'var(--red-score)';
}

export default function VariantCard({ match, release, isTop, onAdd }) {
  const { score = 0, confidence, match_reasons = [], mismatch_reasons = [] } = match;

  const identifiers = release?.identifiers || [];
  const matrices    = identifiers.filter((i) => i.type === 'Matrix / Runout');
  const barcodes    = identifiers.filter((i) => i.type === 'Barcode');

  const label  = release?.labels?.[0];
  const format = release?.formats?.[0];
  const thumb  = release?._thumb || release?.thumb || release?.images?.[0]?.uri150;

  const formatStr = format
    ? [format.name, ...(format.descriptions || [])].filter(Boolean).join(', ')
    : null;

  const color = scoreColor(score);

  const releaseInfo = {
    releaseId: match.release_id,
    title:   release?.title || `Release ${match.release_id}`,
    artist:  release?.artists_sort || label?.name || '',
    country: release?.country || '',
    year:    String(release?.year || ''),
    thumb,
  };

  return (
    <div className={`variant-card${isTop ? ' variant-card--top' : ''}`}>
      {/* Header */}
      <div className="variant-header">
        {thumb ? (
          <img src={thumb} className="variant-thumb" alt={release?.title} loading="lazy" />
        ) : (
          <div className="variant-thumb" aria-hidden="true" />
        )}
        <div className="variant-meta">
          {isTop && <span className="best-match-pill">Best Match</span>}
          <div className="variant-title">
            {release?.title || `Release ${match.release_id}`}
          </div>
          <div className="variant-pills">
            {release?.country && <span className="pill">{release.country}</span>}
            {release?.year    && <span className="pill">{release.year}</span>}
            {label?.name      && <span className="pill">{label.name}</span>}
            {label?.catno     && <span className="pill pill--gold mono">{label.catno}</span>}
          </div>
          {formatStr && <div className="variant-format mono">{formatStr}</div>}
        </div>
      </div>

      {/* Identifiers */}
      {(matrices.length > 0 || barcodes.length > 0) && (
        <div className="variant-identifiers">
          {matrices.map((m, i) => (
            <div key={i} className="identifier">
              <span className="identifier-type">Matrix</span>
              <span className="identifier-value mono">{m.value}</span>
            </div>
          ))}
          {barcodes.map((b, i) => (
            <div key={i} className="identifier">
              <span className="identifier-type">Barcode</span>
              <span className="identifier-value mono">{b.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Score bar */}
      <div className="variant-score">
        <div className="score-label">
          <span>Confidence{confidence ? ` · ${confidence}` : ''}</span>
          <span className="score-value" style={{ color }}>{score}%</span>
        </div>
        <div className="score-bar">
          <div className="score-fill" style={{ width: `${score}%`, background: color }} />
        </div>
        {release?.community && (
          <div className="community-stats">
            <span>♦ {release.community.have?.toLocaleString() ?? '?'} have</span>
            <span>♡ {release.community.want?.toLocaleString() ?? '?'} want</span>
          </div>
        )}
      </div>

      {/* Reasons */}
      {(match_reasons.length > 0 || mismatch_reasons.length > 0) && (
        <div className="match-reasons">
          {match_reasons.map((r, i)    => <span key={i} className="reason reason--match">✓ {r}</span>)}
          {mismatch_reasons.map((r, i) => <span key={i} className="reason reason--mismatch">✗ {r}</span>)}
        </div>
      )}

      {/* CTA */}
      {isTop ? (
        <div className="confirm-section">
          <span className="confirm-label">Log this pressing?</span>
          <button className="btn-log" onClick={() => onAdd(match.release_id, releaseInfo)}>
            Add to Collection
          </button>
        </div>
      ) : (
        <button className="btn-add" onClick={() => onAdd(match.release_id, releaseInfo)}>
          Add to Collection
        </button>
      )}
    </div>
  );
}
