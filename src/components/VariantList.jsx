import VariantCard from './VariantCard.jsx';

export default function VariantList({ matches, releaseDetails, onAdd }) {
  return (
    <div className="variant-list">
      <div className="section-header">
        <h2>Pressing Matches</h2>
        <p>{matches.length} variant{matches.length !== 1 ? 's' : ''} ranked</p>
      </div>
      {matches.map((match, i) => (
        <VariantCard
          key={match.release_id}
          match={match}
          release={releaseDetails[match.release_id]}
          isTop={i === 0}
          onAdd={onAdd}
        />
      ))}
    </div>
  );
}
