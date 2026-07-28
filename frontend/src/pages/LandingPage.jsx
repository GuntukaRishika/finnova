import { Link } from 'react-router-dom'
import { FaChartLine, FaShieldAlt, FaRocket } from 'react-icons/fa'

const features = [
  {
    title: 'Track every expense',
    description: 'Capture your daily transactions with simple, intuitive forms.',
    icon: FaChartLine,
  },
  {
    title: 'Understand your habits',
    description: 'Review summaries, charts, and monthly reports at a glance.',
    icon: FaShieldAlt,
  },
  {
    title: 'Plan with confidence',
    description: 'Set budgets and savings goals to keep your money aligned.',
    icon: FaRocket,
  },
]

function LandingPage() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-16 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
            AI-powered finance management
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Make every financial decision feel clear and calm.
          </h1>
          <p className="max-w-xl text-lg text-slate-600">
            Finnova helps you manage income, expenses, budgets, and savings goals in one polished experience.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/" className="rounded-full bg-emerald-600 px-5 py-3 font-medium text-white shadow-sm hover:bg-emerald-700">
              Get started
            </Link>
            <a href="#features" className="rounded-full border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:border-emerald-500 hover:text-emerald-600">
              Explore features
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="rounded-2xl bg-slate-900 p-6 text-white">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">This week</p>
            <h2 className="mt-2 text-2xl font-semibold">Project setup & architecture</h2>
            <p className="mt-3 text-sm text-slate-300">
              Foundation work for the frontend includes routing, layout, styling, and initial UX planning.
            </p>
          </div>
        </div>
      </div>

      <div id="features" className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <Icon size={20} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default LandingPage
