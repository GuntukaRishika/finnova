import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FaUser, FaLock, FaArrowRight } from 'react-icons/fa'
import { login } from '../api/authApi'
import { credentialsSet } from '../redux/authSlice'

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const data = await login(form)
      dispatch(
        credentialsSet({
          user: { id: data.id, username: data.username, email: data.email, roles: data.roles },
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        })
      )
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center px-6 py-16">
      <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[1fr_0.95fr]">
        <div className="bg-gradient-to-br from-emerald-600 to-slate-900 p-10 text-white">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-100">Week 2</p>
          <h1 className="mt-3 text-3xl font-semibold">Welcome back</h1>
          <p className="mt-4 text-sm leading-7 text-emerald-50">
            Sign in to access your dashboard, protected routes, and personal finance tools.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-8 sm:p-10">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Login</h2>
            <p className="mt-2 text-sm text-slate-600">Use your username and password to continue.</p>
          </div>

          {location.state?.registered && !error && (
            <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Account created. Sign in to continue.
            </p>
          )}

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Username</span>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <FaUser className="text-slate-400" />
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full bg-transparent outline-none"
                placeholder="yourname"
              />
            </div>
          </label>

          <label className="block">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <Link to="/forgot-password" className="text-xs font-semibold text-emerald-600">
                Forgot password?
              </Link>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <FaLock className="text-slate-400" />
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-transparent outline-none"
                placeholder="••••••••"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Signing in...' : 'Continue'} <FaArrowRight />
          </button>

          <p className="text-center text-sm text-slate-600">
            No account yet?{' '}
            <Link to="/register" className="font-semibold text-emerald-600">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
