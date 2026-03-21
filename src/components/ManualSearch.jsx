import { useState } from 'react';

export default function ManualSearch({ phase, results, onSearch, onAdd }) {
  const [artist, setArtist] = useState('');
  const [title,  setTitle]  = useState('');
  const [catno,  setCatno]  = useState('');

  const isLoading = phase === 'searching';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!artist.trim() && !title.trim() && !catno.trim()) return;
    onSearch({ artist: artist.trim(), title: title.trim(), catno: catno.trim() });
  };

  return (
    <div className="manual-search">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="search-input"
          autoCapitalize="words"
        />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="search-input"
          autoCapitalize="words"
        />
        <input
          type="text"
          placeholder="Catalog number (e.g. ILPS 9105)"
          value={catno}
          onChange={(e) => setCatno(e.target.value)}
          className="search-input mono"
          autoCapitalize="characters"
          autoCorrect="off"
        />
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
              Searching...
            </>
          ) : 'Search Discogs'}
        </button>
      </form>

      {results.length > 0 && (
        <div className="manual-results">
          <p className="results-count">{results.length} result{results.length !== 1 ? 's' : ''}</p>
          {results.slice(0, 25).map((r) => {
            const releaseInfo = {
              releaseId: r.id,
              title:   r.title,
              artist:  r.title,
              country: r.country || '',
              year:    r.year    || '',
              thumb:   r.thumb   || '',
            };
            return (
              <div key={r.id} className="manual-result-card">
                {r.thumb ? (
                  <img src={r.thumb} className="result-thumb" alt={r.title} loading="lazy" />
                ) : (
                  <div className="result-thumb" aria-hidden="true" />
                )}
                <div className="result-info">
                  <div className="result-title">{r.title}</div>
                  <div className="result-meta">
                    {r.country    && <span>{r.country}</span>}
                    {r.year       && <span>{r.year}</span>}
                    {r.label?.[0] && <span>{r.label[0]}</span>}
                    {r.catno      && <span className="mono">{r.catno}</span>}
                  </div>
                  {r.format && <div className="result-format">{r.format.join(', ')}</div>}
                </div>
                <button
                  className="btn-add-sm"
                  onClick={() => onAdd(r.id, releaseInfo)}
                  title="Add to Discogs collection"
                  aria-label={`Add ${r.title} to collection`}
                >+</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
