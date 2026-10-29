import { LEVEL } from '../constants.js';

export default function AlertList({ items, selected, onSelect }) {
  if (!items.length) {
    return <p className="empty">Is filter mein koi senior nahi hai. Upar se filter badal kar dekhein.</p>;
  }
  return (
    <ul className="alerts">
      {items.map((a) => (
        <li key={a.senior_id}>
          <button
            className={`row ${a.level}${a.senior_id === selected ? ' sel' : ''}`}
            aria-pressed={a.senior_id === selected}
            onClick={() => onSelect(a.senior_id)}
          >
            <span className="score" aria-label={`Risk score ${a.final_score}`}>{a.final_score}</span>
            <span className="who">
              <strong>{a.name}</strong>
              <span className="meta">{a.age} saal, {a.city}, {a.coordinator_id}</span>
              <span className="why">{a.reasons[0] || 'Koi khaas badlav nahi'}</span>
            </span>
            <span className="lvl">{LEVEL[a.level].label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
