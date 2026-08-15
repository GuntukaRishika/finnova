const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const compactCurrencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 })

export const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0)
}

export function formatCompactCurrency(value) {
  return compactCurrencyFormatter.format(Number(value) || 0)
}

export function formatPercent(value) {
  if (value === null || value === undefined) return '—'
  const num = Number(value)
  return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`
}

export function monthLabel(month) {
  return MONTH_LABELS[month - 1] || ''
}
