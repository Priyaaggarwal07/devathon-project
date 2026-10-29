// Fake data in the SAME format as the real API (see Harsh's README). Used when the API is offline.
const D = '2026-10-29';
const A = (senior_id, name, age, city, coordinator_id, final_score, reasons, action) => ({
  senior_id, name, age, city, coordinator_id, date: D, final_score,
  level: final_score >= 65 ? 'high' : final_score >= 40 ? 'medium' : 'low', reasons, action,
});

export const FAKE_ALERTS = [
  A(199, 'Sunita Devi', 79, 'Mathura', 'C1', 92, ['Sugar apni normal se 54 zyada (normal 142, ab 196)', 'Pichhle 7 din mein 6 din dawai miss (lagatar 4 din)', 'Call notes mein kam bhookh ka zikr (3 baar, pichhle 7 din)', '3 alag signals ek saath badle hain'], 'Aaj call karke dawai review karein. 1-2 din mein vitals dobara check karwayein; badhta rahe toh doctor visit'),
  A(12, 'Ramesh Sharma', 74, 'Agra', 'C1', 84, ['Call note mein gir jaane (fall) ka zikr', 'Call notes mein dard ka zikr (2 baar, pichhle 7 din)'], 'Aaj hi senior ko call karein, chot/dard ke baare mein poochein; zaroorat ho toh doctor visit arrange karein'),
  A(47, 'Kamla Gupta', 81, 'Noida', 'C2', 71, ['BP apni normal se 27 points zyada (normal 129, ab 156)', 'SpO2 apni normal se 2.6 kam (normal 96.6, ab 94.0)', 'Call notes mein chakkar ka zikr (2 baar, pichhle 7 din)'], 'Aaj hi call karein aur doctor visit arrange karein'),
  A(88, 'Hari Mishra', 77, 'Jaipur', 'C2', 55, ['Pichhle 7 din mein 4 din dawai miss', 'Call notes mein akelapan ka zikr (2 baar, pichhle 7 din)'], 'Aaj call karke dawai review karein. Friendly check-in call karein'),
  A(23, 'Geeta Verma', 69, 'Pune', 'C3', 44, ['Weight apni normal se 2.1 kg kam (normal 58.0, ab 55.9 kg)', 'Call notes mein thakaan/kamzori ka zikr (1 baar, pichhle 7 din)'], '1-2 din mein vitals dobara check karwayein; badhta rahe toh doctor visit'),
  A(61, 'Prakash Yadav', 72, 'Indore', 'C3', 21, ['Call notes mein dard ka zikr (1 baar, pichhle 7 din)'], 'Koi khaas action nahi, routine call'),
  A(140, 'Usha Jain', 83, 'Bhopal', 'C4', 12, [], 'Koi khaas action nahi, routine call'),
  A(5, 'Mohan Tiwari', 66, 'Lucknow', 'C4', 6, [], 'Koi khaas action nahi, routine call'),
];

// deterministic wobble (no randomness, so charts do not change on refresh)
const wob = (id, i, k) => Math.sin(id * 13.7 + i * 7.1) * k;

export function fakeSenior(id) {
  const alert = FAKE_ALERTS.find((a) => a.senior_id === id) || FAKE_ALERTS[0];
  const sick = alert.final_score >= 40;
  const dates = Array.from({ length: 45 }, (_, i) => {
    const d = new Date('2026-09-15T00:00:00Z'); d.setUTCDate(d.getUTCDate() + i); return d.toISOString().slice(0, 10);
  });
  const vitals = dates.map((date, i) => {
    const p = sick ? Math.min(1, Math.max(0, (i - 22) / 21)) : 0;
    const skip = (i * 7 + id) % 6 === 0; // some missing days
    return {
      date,
      bp_sys: skip ? null : Math.round(130 + 26 * p + wob(id, i, 5)),
      bp_dia: skip ? null : Math.round(82 + 10 * p + wob(id, i + 3, 3)),
      sugar: skip ? null : Math.round(110 + 45 * p + wob(id, i + 5, 8)),
      spo2: skip ? null : +(96.5 - 2.5 * p + wob(id, i + 9, 0.6)).toFixed(1),
      weight: i % 2 ? null : +(64 - 2.5 * p + wob(id, i + 2, 0.3)).toFixed(1),
    };
  });
  const medication = dates.map((date, i) => {
    const missLikely = sick && i > 36 && (i + id) % 3 !== 0;
    return { date, taken: missLikely ? 0 : 2, total: 2 };
  });
  const risk_history = dates.slice(-30).map((date, i) => ({
    date, final_score: Math.round(sick ? Math.min(alert.final_score, 8 + i * (alert.final_score / 29)) : 6 + Math.abs(wob(id, i, 5))),
  }));
  const notes = [
    { date: '2026-10-28', language: 'hinglish', note_text: sick ? 'Bhookh nahi lag rahi, khana kam kha rahe hain.' : 'Sab theek hai, dawai time par le rahe hain.', cues: sick ? ['low_appetite'] : [] },
    { date: '2026-10-26', language: 'en', note_text: sick ? 'Feels very tired and weak, stayed in bed most of the day.' : 'Doing well today. Went for a short walk in the evening.', cues: sick ? ['fatigue'] : [] },
    { date: '2026-10-22', language: 'hi', note_text: 'सब ठीक है, दवाई समय पर ले रहे हैं।', cues: [] },
  ];
  return {
    senior: { senior_id: alert.senior_id, name: alert.name, age: alert.age, city: alert.city, coordinator_id: alert.coordinator_id, consent_family: 1 },
    alert, vitals, medication, notes, risk_history,
  };
}
