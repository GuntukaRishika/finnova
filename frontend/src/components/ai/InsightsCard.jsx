import React from 'react'

export default function InsightsCard({ title, value, description }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <div className="text-2xl font-bold mb-2">{value}</div>
      {description && <div className="text-sm text-gray-600">{description}</div>}
    </div>
  )
}
