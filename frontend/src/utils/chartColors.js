// Validated categorical palette (light surface), fixed hue order — see dataviz skill palette.md.
// Assign in sequence (slot 1, 2, 3, ...); never cycle or reassign by rank.
export const CATEGORICAL = [
  '#2a78d6', // 1 blue
  '#eb6834', // 2 orange
  '#1baf7a', // 3 aqua
  '#eda100', // 4 yellow
  '#e87ba4', // 5 magenta
  '#008300', // 6 green
  '#4a3aa7', // 7 violet
  '#e34948', // 8 red
]

export const OTHER_SLOT = '#898781' // muted, for folded "Other" bucket beyond 8 series

// Sequential single-hue ramp (blue), light -> dark, for magnitude encodings (heatmap cells).
export const SEQUENTIAL_BLUE = {
  100: '#cde2fb',
  150: '#b7d3f6',
  200: '#9ec5f4',
  250: '#86b6ef',
  300: '#6da7ec',
  350: '#5598e7',
  400: '#3987e5',
  450: '#2a78d6',
  500: '#256abf',
  550: '#1c5cab',
  600: '#184f95',
  650: '#104281',
  700: '#0d366b',
}

export const STATUS = {
  good: '#0ca30c',
  warning: '#fab219',
  serious: '#ec835a',
  critical: '#d03b3b',
}

export const INK = {
  primary: '#0b0b0b',
  secondary: '#52514e',
  muted: '#898781',
  gridline: '#e1e0d9',
  baseline: '#c3c2b7',
  surface: '#fcfcfb',
}

// Type -> fixed categorical slot, independent of API row order.
export const INVESTMENT_TYPE_COLORS = {
  STOCK: CATEGORICAL[0],
  MUTUAL_FUND: CATEGORICAL[1],
  FD: CATEGORICAL[2],
  GOLD: CATEGORICAL[3],
  CRYPTO: CATEGORICAL[6],
}

export function categoricalColor(index) {
  return index < CATEGORICAL.length ? CATEGORICAL[index] : OTHER_SLOT
}

export function niceCeil(value) {
  if (value <= 0) return 10
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)))
  const normalized = value / magnitude
  let step
  if (normalized <= 1) step = 1
  else if (normalized <= 2) step = 2
  else if (normalized <= 5) step = 5
  else step = 10
  return step * magnitude
}
