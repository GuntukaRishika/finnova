const NUMBER_WORDS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
  sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
  thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70,
  eighty: 80, ninety: 90,
}

function amountFromWords(text) {
  const words = text.toLowerCase().split(/\s+/)
  let total = 0
  let found = false
  for (const word of words) {
    if (NUMBER_WORDS[word] === undefined) continue
    total += NUMBER_WORDS[word]
    found = true
  }
  return found ? total : null
}

function toDatePhrase(text) {
  const today = new Date()
  if (/yesterday|last night/.test(text)) today.setDate(today.getDate() - 1)
  return today.toISOString().slice(0, 10)
}

function findCategory(text, categories) {
  const normalized = text.toLowerCase()
  return categories.find((category) => normalized.includes(category.name.toLowerCase()))?.id || ''
}

export function parseVoiceExpense(transcript, categories = []) {
  const text = transcript.trim().replace(/[.?!]+$/, '')
  const numericMatch = text.match(/(?:[$€£]\s*)?(\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)/)
  const amount = numericMatch ? Number(numericMatch[1].replace(/,/g, '')) : amountFromWords(text)
  const categoryId = findCategory(text, categories)
  const matchedCategory = categories.find((category) => category.id === categoryId)
  const description = text
    .replace(/\b(add|record|log|expense|spent|spend|for|on|today|yesterday|last night|dollars?|bucks?)\b/gi, ' ')
    .replace(numericMatch?.[0] || '', ' ')
    .replace(matchedCategory?.name || '', ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return {
    categoryId: categoryId ? String(categoryId) : '',
    amount: amount || '',
    expenseDate: toDatePhrase(text.toLowerCase()),
    description: description || (matchedCategory?.name || ''),
  }
}