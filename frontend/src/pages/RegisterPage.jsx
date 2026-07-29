import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FaUser, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa'

function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch({ type: 'auth/login', payload: { email: form.email, name: form.name } })
    navigate('/dashboard')
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center px-6 py-16">
      <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[1fr_0.95fr]">
        <div className="bg-gradient-to-br from-slate-900 to-emerald-700 p-10 text-white">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-100">Week 2</p>
          <h1 className="mt-3 text-3xl font-semibold">Create your account</h1>
          <p className="mt-4 text-sm leading-7 text-emerald-50">
            Register to start tracking income, expenses, and goals with a secure first step.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-8 sm:p-10">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Register</h2>
            <p className="mt-2 text-sm text-slate-600">Set up your account in one step.</p>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Name</span>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <FaUser className="text-slate-400" />
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-transparent outline-none"
                placeholder="Ava Stone"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <FaEnvelope className="text-slate-400" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-transparent outline-none"
                placeholder="you@example.com"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
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
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-700"
          >
            Create account <FaArrowRight />
          </button>

          <p className="text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-emerald-600">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
