import { useState } from 'react';
import { FAKE_ALERTS } from './fakeData.js';

const LEVEL_LABELS = {
  high: 'Zyada jokhim',
  medium: 'Madhyam',
  low: 'Kam jokhim',
};

export default function App() {
  const ranked = [...FAKE_ALERTS].sort((a, b) => b.final_score - a.final_score);
  const [selectedId, setSelectedId] = useState(ranked[0].senior_id);
  const selected = ranked.find((person) => person.senior_id === selectedId) || ranked[0];

  return (
    <div className="app-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">CARE COORDINATOR</p>
          <h1>Aaj ki priority list</h1>
        </div>
        <p className="date">29 Oct 2026</p>
      </header>

      <main className="dashboard">
        <section className="ranked-list" aria-label="Ranked senior list">
          <div className="section-heading">
            <h2>Sabse pehle call</h2>
            <span>{ranked.length} seniors</span>
          </div>
          <ol>
            {ranked.map((person, index) => (
              <li key={person.senior_id}>
                <button
                  className={`ranked-row ${person.level} ${person.senior_id === selectedId ? 'active' : ''}`}
                  onClick={() => setSelectedId(person.senior_id)}
                >
                  <span className="rank">{index + 1}</span>
                  <span className="person">
                    <strong>{person.name}</strong>
                    <small>{person.age} saal · {person.city}</small>
                  </span>
                  <span className="list-score">{person.final_score}</span>
                </button>
              </li>
            ))}
          </ol>
        </section>

        <article className={`risk-card ${selected.level}`} aria-live="polite">
          <div className="risk-card-header">
            <div>
              <p className="risk-label">SELECTED SENIOR</p>
              <h2>{selected.name}</h2>
              <p>{selected.age} saal · {selected.city}</p>
            </div>
            <div className="risk-score" aria-label={`Risk score ${selected.final_score}`}>
              <strong>{selected.final_score}</strong>
              <span>/ 100</span>
            </div>
          </div>

          <div className="risk-level">
            <span>{LEVEL_LABELS[selected.level]}</span>
            <span>Coordinator {selected.coordinator_id}</span>
          </div>

          <section className="card-section">
            <h3>Risk reason</h3>
            {selected.reasons.length ? (
              <ul>
                {selected.reasons.map((reason) => <li key={reason}>{reason}</li>)}
              </ul>
            ) : <p className="muted-text">Abhi koi khaas risk signal nahi mila.</p>}
          </section>

          <section className="card-section action-box">
            <h3>Suggested action</h3>
            <p>{selected.action}</p>
          </section>
        </article>
      </main>
    </div>
  );
}
