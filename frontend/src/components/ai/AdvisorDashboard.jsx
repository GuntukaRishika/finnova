import React, { useEffect, useState } from 'react'
import axiosClient from '../../api/axiosClient'
import RecommendationCard from './RecommendationCard'
import AdvisorChat from './AdvisorChat'

export default function AdvisorDashboard() {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchRecommendations = async () => {
    setLoading(true)
    try {
      const res = await axiosClient.get('/ai/advice')
      setRecommendations(res.data.recommendations || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendations()
  }, [])

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">AI Financial Advisor</h1>
        <button
          onClick={fetchRecommendations}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Refresh Recommendations
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {recommendations.length > 0 ? (
          recommendations.map((r, i) => (
            <RecommendationCard key={i} title={r.title} summary={r.summary} />
          ))
        ) : (
          <div className="col-span-3 text-gray-500">No recommendations yet.</div>
        )}
      </div>

      <AdvisorChat />
    </div>
  )
}
