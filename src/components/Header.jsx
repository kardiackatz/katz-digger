export default function Header() {
  return (
    <header className="header">
      <svg className="header-logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Record body */}
        <circle cx="50" cy="50" r="49" fill="#0d0b08"/>
        {/* Grooves */}
        <circle cx="50" cy="50" r="46" fill="none" stroke="#252015" strokeWidth="1.8"/>
        <circle cx="50" cy="50" r="42" fill="none" stroke="#1e1a0e" strokeWidth="1.8"/>
        <circle cx="50" cy="50" r="38" fill="none" stroke="#252015" strokeWidth="1.8"/>
        <circle cx="50" cy="50" r="34" fill="none" stroke="#1e1a0e" strokeWidth="1.8"/>
        <circle cx="50" cy="50" r="30" fill="none" stroke="#252015" strokeWidth="1.5"/>
        {/* Gold label */}
        <circle cx="50" cy="50" r="24" fill="#d4a44a"/>
        {/* KATZ */}
        <text x="50" y="39" textAnchor="middle" fontFamily="'Courier New', Courier, monospace" fontWeight="700" fontSize="7.5" letterSpacing="2" fill="#3a2200">KATZ</text>
        {/* ── RECORDS ── */}
        <line x1="34" y1="50.5" x2="42" y2="50.5" stroke="#3a2200" strokeWidth="0.7"/>
        <text x="50" y="53.5" textAnchor="middle" fontFamily="'Courier New', Courier, monospace" fontSize="3.8" letterSpacing="0.8" fill="#3a2200">RECORDS</text>
        <line x1="58" y1="50.5" x2="66" y2="50.5" stroke="#3a2200" strokeWidth="0.7"/>
        {/* DIGGER */}
        <text x="50" y="64" textAnchor="middle" fontFamily="'Courier New', Courier, monospace" fontWeight="700" fontSize="6.5" letterSpacing="1.5" fill="#3a2200">DIGGER</text>
        {/* Spindle hole */}
        <circle cx="50" cy="50" r="3.5" fill="#0d0b08"/>
      </svg>

      <div className="header-info">
        <div className="header-title">Katz Digger</div>
        <div className="header-subtitle">ID Your Wax</div>
      </div>
    </header>
  );
}
