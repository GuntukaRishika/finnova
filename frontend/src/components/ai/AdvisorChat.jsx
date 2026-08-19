import React, { useEffect, useState } from 'react'
import axiosClient from '../../api/axiosClient'

const EMPTY_MESSAGES = [{ from: 'system', text: 'Ask the financial assistant.' }]

export default function AdvisorChat() {
const [messages, setMessages] = useState(EMPTY_MESSAGES)
const [input, setInput] = useState('')
const [loading, setLoading] = useState(false)

useEffect(() => {
    axiosClient.get('/ai/assistant/history')
        .then((res) => {
            const history = (res.data || []).flatMap((item) => [
                { from: 'user', text: item.question, time: item.createdAt },
                { from: 'ai', text: item.answer, time: item.createdAt },
            ])
            setMessages(history.length ? history : EMPTY_MESSAGES)
        })
        .catch(() => setMessages(EMPTY_MESSAGES))
}, [])

const send = async () => {
    if (!input.trim()) return
    const userMsg = { from: 'user', text: input, time: new Date().toISOString() }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
        const res = await axiosClient.post('/ai/assistant', { message: input })
        const reply = res.data?.reply || 'No response.'
        const decision = res.data?.decision && res.data.decision !== 'NONE'
            ? `\n\nDecision: ${res.data.decision === 'BUY_NOW' ? 'Buy now' : 'Wait'}${res.data.decisionReason ? ` - ${res.data.decisionReason}` : ''}`
            : ''
        setMessages((m) => [...m, { from: 'ai', text: `${reply}${decision}`, time: new Date().toISOString() }])
    } catch (e) {
        setMessages((m) => [...m, { from: 'ai', text: 'Error: ' + (e.message || 'unknown') }])
    } finally {
        setLoading(false)
    }
}

const clearHistory = async () => {
    await axiosClient.delete('/ai/assistant/history')
    setMessages(EMPTY_MESSAGES)
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
