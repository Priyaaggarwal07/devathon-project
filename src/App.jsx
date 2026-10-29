import { useEffect, useMemo, useState } from 'react';
import { fetchAlerts, fetchSenior } from './api.js';
import AlertList from './components/AlertList.jsx';
import SeniorDetail from './components/SeniorDetail.jsx';
import { fmtDate } from './constants.js';

const FILTERS = [
  { id: 'attention', label: 'Dhyan chahiye' },
  { id: 'high', label: 'Sirf zyada jokhim' },
  { id: 'all', label: 'Sabhi seniors' },
];

export default function App() {
  const [alerts, setAlerts] = useState([]);
  const [demo, setDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('attention');
  const [coord, setCoord] = useState('all');
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    fetchAlerts().then(({ data, demo }) => {
      setAlerts(data);
      setDemo(demo);
      setLoading(false);
      if (data[0]) setSelected(data[0].senior_id);
    });
  }, []);

  useEffect(() => {
    if (selected == null) return;
    let cancelled = false;
    setDetail(null);
    fetchSenior(selected, demo).then((d) => { if (!cancelled) setDetail(d); });
    return () => { cancelled = true; };
  }, [selected, demo]);

  const coords = useMemo(
    () => [...new Set(alerts.map((a) => a.coordinator_id))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
    [alerts]
  );
  const mine = useMemo(() => alerts.filter((a) => coord === 'all' || a.coordinator_id === coord), [alerts, coord]);
  const visible = useMemo(
    () => mine.filter((a) => filter === 'all' || (filter === 'high' ? a.level === 'high' : a.level !== 'low')),
    [mine, filter]
  );
  const count = (lvl) => mine.filter((a) => a.level === lvl).length;
  const today = alerts[0]?.date;

  const pick = (id) => {
    setSelected(id);
    if (window.matchMedia('(max-width: 900px)').matches) {
      setTimeout(() => document.getElementById('detail')?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  };

  return (
    <div className="app">
      <header className="top">
        <div>
          <h1>Aaj ki priority list</h1>
          <p className="sub">{today ? fmtDate(today) : ''} &nbsp;Pehle upar wale seniors ko call karein</p>
        </div>
        <label className="coord">
          Coordinator
          <select value={coord} onChange={(e) => setCoord(e.target.value)}>
            <option value="all">Sabhi</option>
            {coords.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
      </header>

      {demo && (
        <p className="banner" role="status">
          Demo data dikh raha hai: API (localhost:4000) se connect nahi hua. Harsh ka server chalao: <code>npm start</code>
        </p>
      )}

      <section className="summary" aria-label="Aaj ka saar">
        <div className="stat high"><b>{count('high')}</b><span>Zyada jokhim</span></div>
        <div className="stat medium"><b>{count('medium')}</b><span>Madhyam</span></div>
        <div className="stat low"><b>{count('low')}</b><span>Kam jokhim</span></div>
      </section>

      <main className="split">
        <aside className="listpane" aria-label="Seniors ki list">
          <div className="filters" role="group" aria-label="Filter">
            {FILTERS.map((f) => (
              <button key={f.id} className={filter === f.id ? 'chip on' : 'chip'} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {f.label}
              </button>
            ))}
          </div>
          {loading ? <p className="empty">Load ho raha hai...</p> : <AlertList items={visible} selected={selected} onSelect={pick} />}
        </aside>
        <section id="detail" className="detailpane" aria-label="Senior ki detail">
          <SeniorDetail detail={detail} />
        </section>
      </main>

      <footer className="note">
        Ye diagnosis nahi hai. Ye sirf risk flag hai jo coordinator ko batata hai ki kis par pehle dhyan dena hai. Aakhri faisla coordinator aur doctor ka hai.
      </footer>
    </div>
  );
}
