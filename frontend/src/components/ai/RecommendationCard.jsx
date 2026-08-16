import React from 'react'

export default function RecommendationCard({ title, summary }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div className="text-sm text-gray-700">{summary}</div>
    </div>
  )
}
