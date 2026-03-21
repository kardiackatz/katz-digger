/**
 * Reusable vinyl record SVG logo.
 * "KATZ" curves along the top of the gold label via textPath arc.
 * "DIGGER" curves along the bottom via textPath arc.
 * Uses a unique uid derived from `size` so IDs don't clash when
 * multiple sizes appear in the same document.
 */
export default function VinylLogo({ size = 52, className = '' }) {
  // IDs must be unique per rendered instance (login vs header are
  // mutually exclusive in the DOM, but guard anyway).
  const uid = `vl${size}`;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Top arc  — clockwise left→top→right, KATZ curves upward */}
        <path id={`${uid}-top`}    d="M 33,50 A 17,17 0 0,1 67,50" />
        {/* Bottom arc — CCW left→bottom→right, DIGGER curves downward */}
        <path id={`${uid}-bot`}    d="M 33,50 A 17,17 0 0,0 67,50" />
      </defs>

      {/* ── Record body ── */}
      <circle cx="50" cy="50" r="49" fill="#0d0b08"/>

      {/* ── Grooves ── */}
      <circle cx="50" cy="50" r="46" fill="none" stroke="#252015" strokeWidth="1.8"/>
      <circle cx="50" cy="50" r="42" fill="none" stroke="#1e1a0e" strokeWidth="1.8"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="#252015" strokeWidth="1.8"/>
      <circle cx="50" cy="50" r="34" fill="none" stroke="#1e1a0e" strokeWidth="1.8"/>
      <circle cx="50" cy="50" r="30" fill="none" stroke="#252015" strokeWidth="1.5"/>

      {/* ── Gold label ── */}
      <circle cx="50" cy="50" r="24" fill="#d4a44a"/>

      {/* ── KATZ — top arc ── */}
      <text
        fontFamily="'Courier New', Courier, monospace"
        fontWeight="700"
        fontSize="7"
        letterSpacing="2"
        fill="#3a2200"
      >
        <textPath href={`#${uid}-top`} startOffset="50%" textAnchor="middle">
          KATZ
        </textPath>
      </text>

      {/* ── RECORDS — horizontal rule either side ── */}
      <line x1="35" y1="50.5" x2="43" y2="50.5" stroke="#3a2200" strokeWidth="0.65"/>
      <text
        x="50" y="53.5"
        textAnchor="middle"
        fontFamily="'Courier New', Courier, monospace"
        fontSize="3.4"
        letterSpacing="0.7"
        fill="#3a2200"
      >
        RECORDS
      </text>
      <line x1="57" y1="50.5" x2="65" y2="50.5" stroke="#3a2200" strokeWidth="0.65"/>

      {/* ── DIGGER — bottom arc ── */}
      <text
        fontFamily="'Courier New', Courier, monospace"
        fontWeight="700"
        fontSize="6"
        letterSpacing="1.5"
        fill="#3a2200"
      >
        <textPath href={`#${uid}-bot`} startOffset="50%" textAnchor="middle">
          DIGGER
        </textPath>
      </text>

      {/* ── Spindle hole ── */}
      <circle cx="50" cy="50" r="3.5" fill="#0d0b08"/>
    </svg>
  );
}
