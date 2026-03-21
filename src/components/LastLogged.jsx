export default function LastLogged({ entries }) {
  if (!entries || entries.length === 0) return null;

  return (
    <div className="last-logged">
      <div className="section-header">
        <h2>Last Logged</h2>
        <p>{entries.length} dig{entries.length !== 1 ? 's' : ''}</p>
      </div>
      <div className="last-logged-grid">
        {entries.slice(0, 6).map((entry) => (
          <a
            key={`${entry.releaseId}-${entry.loggedAt}`}
            href={`https://www.discogs.com/release/${entry.releaseId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="log-entry"
            style={{ textDecoration: 'none' }}
          >
            {entry.thumb ? (
              <img
                src={entry.thumb}
                className="log-entry-thumb"
                alt={entry.title}
                loading="lazy"
              />
            ) : (
              <div className="log-entry-thumb-placeholder">🎵</div>
            )}
            <div className="log-entry-info">
              <div className="log-entry-title">{entry.title}</div>
              <div className="log-entry-meta">
                {[entry.country, entry.year].filter(Boolean).join(' · ') || 'Unknown'}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
