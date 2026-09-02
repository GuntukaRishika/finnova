import { Link } from 'react-router-dom'
import {
  FaChartLine,
  FaBullseye,
  FaReceipt,
  FaBrain,
  FaShieldAlt,
  FaRocket,
} from 'react-icons/fa'

const featureGroups = [
  {
    title: 'Smart money tracking',
    description: 'Capture income, expenses, and recurring costs from a single dashboard built for clarity.',
    icon: FaChartLine,
  },
  {
    title: 'Goal-based planning',
    description: 'Set meaningful financial targets and monitor progress as your habits improve.',
    icon: FaBullseye,
  },
  {
    title: 'Receipt scanning',
    description: 'Turn paper or digital receipts into tracked expenses without manual entry headaches.',
    icon: FaReceipt,
  },
  {
    title: 'AI analysis',
    description: 'Use intelligent recommendations to understand trends and discover smarter opportunities.',
    icon: FaBrain,
  },
  {
    title: 'Reliable security',
    description: 'Keep financial records protected with secure access and a focused, personal workflow.',
    icon: FaShieldAlt,
  },
  {
    title: 'Momentum built in',
    description: 'From budgets to investment insights, every tool is designed to help you move forward.',
    icon: FaRocket,
  },
]

function FeaturesPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="mb-10 max-w-3xl">
        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
          Features
        </span>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Everything you need to manage money with more confidence.
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Finnova brings together budgeting, analysis, and planning in one digital toolkit designed for everyday life.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {featureGroups.map(({ title, description, icon: Icon }) => (
          <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <Icon size={22} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-3xl border border-emerald-100 bg-emerald-50 p-8 text-center">
        <h2 className="text-2xl font-semibold text-slate-900">Ready to start?</h2>
        <p className="mt-2 text-slate-600">Create an account and turn your financial goals into a clearer plan.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link to="/register" className="rounded-full bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-700">
            Create account
          </Link>
          <Link to="/login" className="rounded-full border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 hover:border-emerald-500 hover:text-emerald-600">
            Sign in
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturesPage
