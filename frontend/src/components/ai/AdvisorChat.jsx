import React, { useEffect, useState } from 'react'
import axiosClient from '../../api/axiosClient'

const HISTORY_KEY = 'advisor_chat_history_v1'

export default function AdvisorChat() {
const [messages, setMessages] = useState(() => {
    try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : [{ from: 'system', text: 'Ask the financial assistant.' }]
    } catch (e) {
    return [{ from: 'system', text: 'Ask the financial assistant.' }]
    }
})
const [input, setInput] = useState('')
const [loading, setLoading] = useState(false)

useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(messages))
}, [messages])

const send = async () => {
    if (!input.trim()) return
    const userMsg = { from: 'user', text: input, time: new Date().toISOString() }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
        const res = await axiosClient.post('/ai/assistant', { message: input })
        const reply = res.data?.reply || 'No response.'
        setMessages((m) => [...m, { from: 'ai', text: reply, time: new Date().toISOString() }])
    } catch (e) {
        setMessages((m) => [...m, { from: 'ai', text: 'Error: ' + (e.message || 'unknown') }])
    } finally {
        setLoading(false)
    }
}

const clearHistory = () => {
    setMessages([{ from: 'system', text: 'Ask the financial assistant.' }])
    localStorage.removeItem(HISTORY_KEY)
}

return (
    <div>
        <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium">Advisor Chat</h2>
        <div>
            <button onClick={clearHistory} className="text-sm text-red-500 mr-2">
            Clear
            </button>
        </div>
        </div>

    <div className="bg-white rounded shadow p-4 h-64 overflow-y-auto mb-2">
        {messages.map((m, i) => (
        <div key={i} className={`mb-2 ${m.from === 'user' ? 'text-right' : ''}`}>
            <div className={`inline-block px-3 py-1 rounded ${m.from === 'ai' ? 'bg-gray-100' : m.from === 'user' ? 'bg-blue-100' : 'bg-gray-50'}`}>
                {m.text}
            </div>
        </div>
        ))}
        {loading && <div className="text-gray-500">AI is thinking...</div>}
    </div>

    <div className="flex">
        <input
            className="flex-1 px-3 py-2 border rounded-l"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the advisor..."
            onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <button onClick={send} className="px-4 py-2 bg-green-600 text-white rounded-r">
            Send
        </button>
        </div>
    </div>
)
}
