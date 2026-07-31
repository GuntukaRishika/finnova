import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEnvelope, FaArrowRight } from 'react-icons/fa'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center px-6 py-16">
      <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[1fr_0.95fr]">
        <div className="bg-gradient-to-br from-emerald-600 to-slate-900 p-10 text-white">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-100">Week 2</p>
          <h1 className="mt-3 text-3xl font-semibold">Reset your password</h1>
          <p className="mt-4 text-sm leading-7 text-emerald-50">
            Enter the email on your account and we'll send you a link to reset your password.
          </p>
        </div>

        <div className="p-8 sm:p-10">
          {submitted ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-slate-900">Check your inbox</h2>
              <p className="text-sm text-slate-600">
                If an account exists for <span className="font-medium">{email}</span>, a reset link
                is on its way.
              </p>
              <Link
                to="/login"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-700"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Forgot password</h2>
                <p className="mt-2 text-sm text-slate-600">
                  We'll email you a link to get back into your account.
                </p>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <FaEnvelope className="text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </label>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-700"
              >
                Send reset link <FaArrowRight />
              </button>

              <p className="text-center text-sm text-slate-600">
                Remembered it?{' '}
                <Link to="/login" className="font-semibold text-emerald-600">
                  Back to login
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
