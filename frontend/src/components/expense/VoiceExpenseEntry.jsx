import { useEffect, useRef, useState } from 'react'
import { FaCheck, FaMicrophone, FaRedo, FaStop } from 'react-icons/fa'
import { parseVoiceExpense } from '../../utils/voiceExpenseParser'

const EMPTY_FORM = { categoryId: '', amount: '', expenseDate: new Date().toISOString().slice(0, 10), description: '' }

function VoiceExpenseEntry({ categories, onSubmit, isSubmitting }) {
  const recognitionRef = useRef(null)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  useEffect(() => () => recognitionRef.current?.stop(), [])

  const startListening = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!Recognition) {
      setError('Speech recognition is not supported in this browser. Try Chrome or Edge.')
      return
    }
    const recognition = new Recognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.onstart = () => { setError(''); setIsListening(true) }
    recognition.onresult = (event) => {
      const value = Array.from(event.results).map((result) => result[0].transcript).join(' ')
      setTranscript(value)
      if (event.results[event.results.length - 1].isFinal) setForm(parseVoiceExpense(value, categories))
    }
    recognition.onerror = () => { setError('Microphone access or speech recognition failed.'); setIsListening(false) }
    recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition
    recognition.start()
  }

  const reset = () => {
    recognitionRef.current?.stop()
    setTranscript('')
    setForm(EMPTY_FORM)
    setError('')
  }

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const submit = async (event) => {
    event.preventDefault()
    await onSubmit({ categoryId: Number(form.categoryId), amount: Number(form.amount), expenseDate: form.expenseDate, description: form.description.trim() || null })
    reset()
  }

  return (
    <section className="rounded-3xl border border-sky-200 bg-sky-50 p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Voice entry</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">Speak an expense</h2>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={isListening ? () => recognitionRef.current?.stop() : startListening} className={`voice-mic flex items-center gap-2 rounded-full px-4 py-2.5 font-medium text-white ${isListening ? 'bg-rose-600' : 'bg-sky-600 hover:bg-sky-700'}`}>
            {isListening ? <FaStop /> : <FaMicrophone />} {isListening ? 'Stop' : 'Start listening'}
          </button>
          {transcript && <button type="button" onClick={reset} className="rounded-full border border-slate-200 bg-white p-3 text-slate-600" aria-label="Reset voice entry"><FaRedo /></button>}
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-600">Try: “spent 25 dollars on groceries yesterday.”</p>
      {isListening && <div className="voice-pulse mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-sky-700">Listening...</div>}
      {error && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
      {transcript && (
        <form onSubmit={submit} className="mt-5 space-y-4 rounded-2xl bg-white p-4">
          <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700"><strong>Heard:</strong> {transcript}</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm text-slate-600">Amount<input required min="0.01" step="0.01" type="number" value={form.amount} onChange={(event) => update('amount', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" /></label>
            <label className="text-sm text-slate-600">Category<select required value={form.categoryId} onChange={(event) => update('categoryId', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
            <label className="text-sm text-slate-600">Date<input required type="date" value={form.expenseDate} onChange={(event) => update('expenseDate', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" /></label>
            <label className="text-sm text-slate-600">Description<input maxLength="255" value={form.description} onChange={(event) => update('description', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" /></label>
          </div>
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 font-medium text-white disabled:opacity-60"><FaCheck /> {isSubmitting ? 'Saving...' : 'Confirm and save expense'}</button>
        </form>
      )}
    </section>
  )
}

export default VoiceExpenseEntry