import React, { useState } from 'react'
import axiosClient from '../../api/axiosClient'

export default function AIChat() {
  const [messages, setMessages] = useState([
    { from: 'system', text: 'Ask about your finances or request recommendations.' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input.trim()) return
    const userMsg = { from: 'user', text: input }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await axiosClient.post('/ai/chat', { message: input })
      const reply = res.data?.reply || 'No response from AI.'
      setMessages((m) => [...m, { from: 'ai', text: reply }])
    } catch (e) {
      setMessages((m) => [...m, { from: 'ai', text: 'Error: ' + (e.message || 'unknown') }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-6">
      <div className="bg-white rounded shadow p-4 h-64 overflow-y-auto" id="ai-chat">
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 ${m.from === 'user' ? 'text-right' : ''}`}>
            <div className={`inline-block px-3 py-1 rounded ${m.from === 'ai' ? 'bg-gray-100' : 'bg-blue-100'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-500">AI is typing...</div>}
      </div>

      <div className="flex mt-2">
        <input
          className="flex-1 px-3 py-2 border rounded-l"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the AI..."
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <button onClick={send} className="px-4 py-2 bg-blue-600 text-white rounded-r">
          Send
        </button>
      </div>
    </div>
  )
}
