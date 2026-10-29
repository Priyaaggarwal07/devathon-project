# Priya: Frontend (Day 1, Thursday)

React (Vite) + Recharts. Coordinator ka "aaj ki priority list" dashboard.

```bash
npm install
npm run dev          # http://localhost:5173
```

- **Harsh ka API chal raha ho** (`npm start`, port 4000) toh real data dikhega. Vite `/api` ko apne aap `localhost:4000` par bhej deta hai.
- **API band ho** toh upar peela "Demo data" banner aata hai aur `src/fakeData.js` ka fake data dikhta hai. Isliye aap Harsh ka wait kiye bina UI par kaam kar sakti ho.
- Alag server ke liye: `VITE_API_URL=http://192.168.x.x:4000/api npm run dev`

## Kya-kya hai
| File | Kaam |
|---|---|
| `src/App.jsx` | Page layout, filters (Dhyan chahiye / Sirf zyada jokhim / Sabhi), coordinator select, summary |
| `src/components/AlertList.jsx` | Urgency se sorted list: score, naam, pehli wajah, level |
| `src/components/SeniorDetail.jsx` | Kyun (reasons), Suggested action, BP/sugar/SpO2/weight trends (dashed line = senior ki apni normal), risk trend, dawai strip, call notes + cue chips |
| `src/api.js` | API calls + fake-data fallback |
| `src/fakeData.js` | API jaisa hi format ka demo data |
| `src/styles.css` | Poora design (colors, layout, mobile) |

## Design ke faisle
- Rang ke saath **text label bhi** (Zyada jokhim / Madhyam / Kam), sirf rang par depend nahi (colour-blind users ke liye).
- Font **Atkinson Hyperlegible** (kam nazar waalon ke liye banaya gaya), bada base size.
- Footer mein **"Ye diagnosis nahi hai"** line (PDF ka safety constraint).
- Do-pane layout: left mein list, right mein selected senior ki detail. Mobile par ek ke neeche ek.

## Day 2 (kal) ke liye
- Family view: haftawar summary, sirf `consent_family = 1` waale seniors
- Ops view: `/api/ops/summary` se alert counts ka chart
- Role switch (coordinator / family / ops)
- "Alert useful tha ya nahi" feedback buttons
