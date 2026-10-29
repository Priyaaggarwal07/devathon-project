export const LEVEL = {
  high: { label: 'Zyada jokhim' },
  medium: { label: 'Madhyam' },
  low: { label: 'Kam' },
};

// Same cue names as Gauri's nlp.js
export const CUE_LABELS = {
  fall: 'Gir jaana (fall)', pain: 'Dard', low_appetite: 'Kam bhookh', fatigue: 'Thakaan/kamzori',
  loneliness: 'Akelapan', poor_sleep: 'Neend ki dikkat', confusion: 'Confusion/bhoolna',
  dizziness: 'Chakkar', breathless: 'Saans ki takleef', mood_low: 'Udaasi',
};

export const fmtDate = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
