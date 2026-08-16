import React, { useState } from 'react'
import axiosClient from '../../api/axiosClient'
import InsightsCard from './InsightsCard'
import AIChat from './AIChat'
import LoadingSpinner from './LoadingSpinner'

export default function AIDashboard() {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const analyze = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axiosClient.post('/ai/analyze')
      setInsights(res.data.insights || [])
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">AI Spending Analysis</h1>
        <button
          onClick={analyze}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Analyze my expenses
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.length > 0 ? (
          insights.map((ins, i) => (
            <InsightsCard
              key={i}
              title={ins.title}
              value={ins.value}
              description={ins.description}
            />
          ))
        ) : (
          <div className="col-span-3 text-gray-500">No insights yet. Click Analyze.</div>
        )}
      </div>

      <div className="mt-6">
        <AIChat />
      </div>
    </div>
  )
}
