function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-3xl items-center justify-center px-6 py-24 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-3 text-slate-600">The requested page does not exist yet.</p>
      </div>
    </div>
  )
}

export default NotFoundPage
