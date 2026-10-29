import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
import { CUE_LABELS, LEVEL, fmtDate } from '../constants.js';

const avg = (rows, key, n = 20) => {
  const v = rows.slice(0, n).map((r) => r[key]).filter((x) => x !== null && x !== undefined);
  return v.length ? v.reduce((s, x) => s + x, 0) / v.length : null;
};

// One small trend chart. `baseKey` draws a dashed line for the senior's OWN normal (average of the first 20 days).
function Trend({ title, data, lines, baseKey, domain }) {
  const base = baseKey ? avg(data, baseKey) : null;
  return (
    <div className="chart">
      <h4>{title}</h4>
      <div className="chartbox">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 6, right: 8, bottom: 0, left: -18 }}>
            <CartesianGrid stroke="#DCE5E3" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" minTickGap={36} />
            <YAxis tick={{ fontSize: 11 }} domain={domain || ['auto', 'auto']} />
            <Tooltip />
            {base !== null && <ReferenceLine y={base} stroke="#5B7371" strokeDasharray="4 4" />}
            {lines.map((l) => (
              <Line key={l.key} dataKey={l.key} name={l.name} stroke={l.color} strokeWidth={2} dot={false} connectNulls />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function RiskTrend({ data }) {
  return (
    <div className="chart wide">
      <h4>Risk score (pichhle 60 din tak)</h4>
      <div className="chartbox">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 6, right: 8, bottom: 0, left: -18 }}>
            <CartesianGrid stroke="#DCE5E3" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" minTickGap={36} />
            <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
            <Tooltip />
            <ReferenceLine y={65} stroke="#B5342B" strokeDasharray="4 4" label={{ value: 'zyada jokhim', fontSize: 11, fill: '#B5342B', position: 'insideTopLeft' }} />
            <ReferenceLine y={40} stroke="#A8700A" strokeDasharray="4 4" label={{ value: 'madhyam', fontSize: 11, fill: '#A8700A', position: 'insideTopLeft' }} />
            <Line dataKey="final_score" name="Score" stroke="#1F5F5B" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Adherence({ days }) {
  return (
    <div>
      <div className="strip" role="img" aria-label="Roz ki dawai ka record">
        {days.map((d) => {
          const cls = d.taken === d.total ? 'ok' : d.taken === 0 ? 'miss' : 'part';
          return <span key={d.date} className={`sq ${cls}`} title={`${fmtDate(d.date)}: ${d.taken}/${d.total} dawai li`} />;
        })}
      </div>
      <p className="legend"><span className="sq ok" /> Sab li <span className="sq part" /> Kuch chhooti <span className="sq miss" /> Koi nahi li</p>
    </div>
  );
}

export default function SeniorDetail({ detail }) {
  if (!detail) return <p className="empty">Senior ki detail load ho rahi hai...</p>;
  const { senior, alert, vitals, medication, notes, risk_history } = detail;
  const v = vitals.map((r) => ({ ...r, label: fmtDate(r.date) }));
  const risk = risk_history.map((r) => ({ ...r, label: fmtDate(r.date) }));
  const level = alert?.level || 'low';

  return (
    <article className="detail">
      <header className={`dhead ${level}`}>
        <div>
          <h2>{senior.name}</h2>
          <p className="meta">{senior.age} saal, {senior.city}, Coordinator {senior.coordinator_id}</p>
        </div>
        <div className="bigscore" aria-label={`Risk score ${alert?.final_score ?? 0}`}>
          <b>{alert?.final_score ?? 0}</b>
          <span>{LEVEL[level].label}</span>
        </div>
      </header>

      <section>
        <h3>Kyun dhyan chahiye</h3>
        {alert?.reasons?.length ? (
          <ul className="reasons">{alert.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
        ) : (
          <p className="muted">Abhi koi khaas badlav nahi mila.</p>
        )}
      </section>

      <section className="action">
        <h3>Suggested action</h3>
        <p>{alert?.action || 'Routine call'}</p>
      </section>

      <section>
        <h3>Trends (dashed line = senior ki apni normal)</h3>
        <div className="charts">
          <Trend title="BP (upar wala / neeche wala)" data={v} baseKey="bp_sys"
            lines={[{ key: 'bp_sys', name: 'Upar wala', color: '#B5342B' }, { key: 'bp_dia', name: 'Neeche wala', color: '#1F5F5B' }]} />
          <Trend title="Sugar" data={v} baseKey="sugar" lines={[{ key: 'sugar', name: 'Sugar', color: '#A8700A' }]} />
          <Trend title="SpO2" data={v} baseKey="spo2" domain={[88, 100]} lines={[{ key: 'spo2', name: 'SpO2', color: '#2F7D6B' }]} />
          <Trend title="Weight (kg)" data={v} baseKey="weight" lines={[{ key: 'weight', name: 'Weight', color: '#4B5E7A' }]} />
          <RiskTrend data={risk} />
        </div>
      </section>

      <section>
        <h3>Dawai (pichhle 45 din)</h3>
        <Adherence days={medication} />
      </section>

      <section>
        <h3>Haal ke call notes</h3>
        <ul className="notes">
          {notes.map((n) => (
            <li key={n.date + n.note_text}>
              <span className="nd">{fmtDate(n.date)}</span>
              <span className="nt" lang={n.language === 'hi' ? 'hi' : 'en'}>{n.note_text}</span>
              {n.cues.map((c) => <span key={c} className="cue">{CUE_LABELS[c] || c}</span>)}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
