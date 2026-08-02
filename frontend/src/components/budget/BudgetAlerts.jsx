import { FaExclamationTriangle, FaCheckDouble } from 'react-icons/fa'

function timeAgo(value) {
  if (!value) return ''
  const diffMs = Date.now() - new Date(value).getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function BudgetAlerts({ notifications, isLoading, onMarkAsRead, onMarkAllAsRead }) {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-amber-600">
          <FaExclamationTriangle />
          <h2 className="text-lg font-semibold text-slate-900">Budget alerts</h2>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-emerald-600"
          >
            <FaCheckDouble /> Mark all read
          </button>
        )}
      </div>

      <ul className="mt-4 space-y-3">
        {isLoading && <p className="text-sm text-slate-500">Loading...</p>}

        {!isLoading && notifications.length === 0 && (
          <p className="text-sm text-slate-500">No alerts yet. We'll let you know if a budget runs high.</p>
        )}

        {!isLoading &&
          notifications.map((notification) => (
            <li
              key={notification.id}
              onClick={() => !notification.read && onMarkAsRead(notification.id)}
              className={`rounded-2xl px-4 py-3 text-sm ${
                notification.type === 'BUDGET_EXCEEDED'
                  ? 'bg-red-50 text-red-800'
                  : 'bg-amber-50 text-amber-800'
              } ${!notification.read ? 'cursor-pointer ring-1 ring-inset ring-current/20' : 'opacity-70'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <p>{notification.message}</p>
                {!notification.read && (
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-current" aria-hidden="true" />
                )}
              </div>
              <p className="mt-1 text-xs opacity-70">{timeAgo(notification.createdAt)}</p>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default BudgetAlerts
