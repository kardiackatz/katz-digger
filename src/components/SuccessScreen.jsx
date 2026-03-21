export default function SuccessScreen({ release, onReset }) {
  const releaseUrl = release?.releaseId
    ? `https://www.discogs.com/release/${release.releaseId}`
    : 'https://www.discogs.com/user/kardiaclp/collection';

  return (
    <div className="success-screen">
      <svg className="success-logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="50" cy="50" r="49" fill="#0d0b08"/>
        <circle cx="50" cy="50" r="46" fill="none" stroke="#252015" strokeWidth="1.8"/>
        <circle cx="50" cy="50" r="42" fill="none" stroke="#1e1a0e" strokeWidth="1.8"/>
        <circle cx="50" cy="50" r="38" fill="none" stroke="#252015" strokeWidth="1.8"/>
        <circle cx="50" cy="50" r="34" fill="none" stroke="#1e1a0e" strokeWidth="1.5"/>
        <circle cx="50" cy="50" r="24" fill="#6aaa42"/>
        <text x="50" y="39" textAnchor="middle" fontFamily="'Courier New', Courier, monospace" fontWeight="700" fontSize="7.5" letterSpacing="2" fill="#0f1a0a">KATZ</text>
        <line x1="34" y1="50.5" x2="42" y2="50.5" stroke="#0f1a0a" strokeWidth="0.7"/>
        <text x="50" y="53.5" textAnchor="middle" fontFamily="'Courier New', Courier, monospace" fontSize="3.8" letterSpacing="0.8" fill="#0f1a0a">RECORDS</text>
        <line x1="58" y1="50.5" x2="66" y2="50.5" stroke="#0f1a0a" strokeWidth="0.7"/>
        <text x="50" y="64" textAnchor="middle" fontFamily="'Courier New', Courier, monospace" fontWeight="700" fontSize="6.5" letterSpacing="1.5" fill="#0f1a0a">DIGGER</text>
        <circle cx="50" cy="50" r="3.5" fill="#0d0b08"/>
      </svg>

      <h2 className="success-title">Logged!</h2>
      <p className="success-sub">Pressing added to your Discogs collection.</p>

      <div className="success-actions">
        <a href={releaseUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
          View on Discogs ↗
        </a>
        <button className="btn-secondary" onClick={onReset}>
          Dig Another Crate
        </button>
      </div>
    </div>
  );
}
