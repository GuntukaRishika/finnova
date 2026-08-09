import { FaBell } from 'react-icons/fa6'

function formatTimeAgo(value) {
  const diffSeconds = Math.floor((Date.now() - new Date(value)) / 1000)
  if (diffSeconds < 60) return `${diffSeconds}s ago`
  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

function BillNotifications({ notifications, isLoading, onMarkAsRead, onMarkAllAsRead }) {
  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-amber-600">
          <FaBell size={18} />
          <div>
            <p className="text-lg font-semibold text-slate-900">Reminder alerts</p>
            <p className="text-sm text-slate-500">Stay on top of due bills and notifications.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onMarkAllAsRead}
          className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
        >
          Mark all read
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {isLoading ? (
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No alerts yet. Once a bill is due, you’ll see it here.</div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => !notification.read && onMarkAsRead(notification.id)}
              className={`w-full rounded-3xl border px-4 py-4 text-left transition ${
                notification.read ? 'border-slate-200 bg-slate-50 text-slate-500' : 'border-emerald-200 bg-emerald-50 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium">{notification.message}</p>
                <span className="text-xs text-slate-500">{formatTimeAgo(notification.createdAt)}</span>
              </div>
            </button>
          ))
        )}
      </div>

      {unreadCount > 0 && (
        <p className="mt-4 text-sm text-slate-500">You have {unreadCount} unread reminder{unreadCount === 1 ? '' : 's'}.</p>
      )}
    </div>
  )
}

export default BillNotifications
