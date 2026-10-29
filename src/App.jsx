import { useMemo, useState } from 'react';
import { FAKE_ALERTS } from './fakeData.js';

const LEVEL_CONFIG = {
  high: { label: 'High risk' },
  medium: { label: 'Medium risk' },
  low: { label: 'Low risk' },
};

const FILTERS = [
  { id: 'all', label: 'All seniors' },
  { id: 'high', label: 'High risk' },
  { id: 'medium', label: 'Medium risk' },
];

export default function App() {
  const ranked = useMemo(() => [...FAKE_ALERTS].sort((a, b) => b.final_score - a.final_score), []);
  const [selectedId, setSelectedId] = useState(ranked[0].senior_id);
  const [filter, setFilter] = useState('all');
  const selected = ranked.find((person) => person.senior_id === selectedId) || ranked[0];
  const visible = filter === 'all' ? ranked : ranked.filter((person) => person.level === filter);
  const counts = {
    high: ranked.filter((person) => person.level === 'high').length,
    medium: ranked.filter((person) => person.level === 'medium').length,
    low: ranked.filter((person) => person.level === 'low').length,
  };

  const choosePerson = (id) => {
    setSelectedId(id);
    if (window.innerWidth < 840) {
      setTimeout(() => document.getElementById('senior-detail')?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 21s-7-4.35-7-10.15A4.85 4.85 0 0 1 12 7a4.85 4.85 0 0 1 7 3.85C19 16.65 12 21 12 21Z"/><path d="M12 11v4M10 13h4"/></svg></div>
          <div><strong>Care</strong><span>Coordinator</span></div>
        </div>
        <nav className="nav" aria-label="Primary navigation">
          <button className="nav-item active"><span className="nav-icon">⌂</span> Today</button>
          <button className="nav-item"><span className="nav-icon">♙</span> Seniors</button>
          <button className="nav-item"><span className="nav-icon">▦</span> Reports</button>
        </nav>
        <div className="profile"><div className="avatar">PA</div><div><strong>Priya Aggarwal</strong><span>Care Coordinator</span></div></div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div><p>Wednesday, 29 October</p><h1>Today's priority list</h1></div>
          <button className="notification" aria-label="Notifications"><span>♢</span><i /></button>
        </header>

        <section className="summary-grid" aria-label="Risk summary">
          <article className="summary-card high"><div><span className="summary-dot"/><p>High risk</p></div><strong>{counts.high}</strong></article>
          <article className="summary-card medium"><div><span className="summary-dot"/><p>Medium risk</p></div><strong>{counts.medium}</strong></article>
          <article className="summary-card low"><div><span className="summary-dot"/><p>Low risk</p></div><strong>{counts.low}</strong></article>
        </section>

        <div className="content-grid">
          <section className="priority-panel">
            <div className="panel-header"><div><p>PRIORITY QUEUE</p><h2>{visible.length} seniors</h2></div><button className="sort-button">↓ Risk score</button></div>
            <div className="filters" role="group" aria-label="Filter senior list">
              {FILTERS.map((item) => <button key={item.id} className={filter === item.id ? 'filter active' : 'filter'} onClick={() => setFilter(item.id)}>{item.label}</button>)}
            </div>
            <ol className="priority-list">
              {visible.map((person) => {
                const rank = ranked.findIndex((item) => item.senior_id === person.senior_id) + 1;
                return (
                  <li key={person.senior_id}><button className={`priority-row ${person.level} ${person.senior_id === selectedId ? 'selected' : ''}`} onClick={() => choosePerson(person.senior_id)}>
                    <span className="rank">{String(rank).padStart(2, '0')}</span>
                    <span className="initials">{person.name.split(' ').map((word) => word[0]).join('').slice(0, 2)}</span>
                    <span className="person-info"><strong>{person.name}</strong><small>{person.age} years · {person.city}</small></span>
                    <span className="row-score"><strong>{person.final_score}</strong><small>/100</small></span><span className="chevron">›</span>
                  </button></li>
                );
              })}
            </ol>
          </section>

          <article id="senior-detail" className={`detail-card ${selected.level}`} aria-live="polite">
            <div className="detail-accent" />
            <header className="detail-header">
              <div className="senior-title"><div className="large-avatar">{selected.name.split(' ').map((word) => word[0]).join('').slice(0, 2)}</div><div><p>SELECTED SENIOR</p><h2>{selected.name}</h2><span>{selected.age} years · {selected.city}</span></div></div>
              <div className="score-ring"><div><strong>{selected.final_score}</strong><span>RISK SCORE</span></div></div>
            </header>
            <div className="risk-status"><span className={`status-pill ${selected.level}`}><i />{LEVEL_CONFIG[selected.level].label}</span><span>Coordinator {selected.coordinator_id}</span></div>
            <section className="detail-section">
              <div className="section-title"><span className="section-icon">!</span><h3>Why this senior needs attention</h3></div>
              {selected.reasons.length ? <ul className="reason-list">{selected.reasons.map((reason) => <li key={reason}><span>•</span><p>{reason}</p></li>)}</ul> : <p className="no-reasons">No significant risk signals detected.</p>}
            </section>
            <section className="action-card"><div className="action-heading"><span>↗</span><h3>Recommended next action</h3></div><p>{selected.action}</p><button className="primary-button"><span>✓</span> Mark as reviewed</button></section>
            <footer className="detail-footer"><span>Last updated 29 Oct 2026</span><button>View full profile ›</button></footer>
          </article>
        </div>
      </main>
    </div>
  );
}
