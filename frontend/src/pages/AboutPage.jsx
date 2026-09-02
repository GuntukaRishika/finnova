import { FaChartBar, FaUsers, FaLightbulb } from 'react-icons/fa'

const values = [
  {
    title: 'Clarity first',
    description: 'We design financial tools that simplify complex decisions and make progress easy to follow.',
    icon: FaChartBar,
  },
  {
    title: 'People-centered',
    description: 'Every feature is shaped around real-life money habits, not abstract accounting theory.',
    icon: FaUsers,
  },
  {
    title: 'Practical guidance',
    description: 'Finnova helps users act with confidence by turning data into useful recommendations.',
    icon: FaLightbulb,
  },
]

function AboutPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
            About Finnova
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Built to help people feel more in control of their money.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Finnova was created for people who want to build better financial habits without the stress of complicated spreadsheets or confusing dashboards.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="rounded-2xl bg-slate-900 p-6 text-white">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Our mission</p>
            <p className="mt-4 text-lg leading-8 text-slate-200">
              We believe smarter financial decisions start with better visibility, better planning, and better support.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {values.map(({ title, description, icon: Icon }) => (
          <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <Icon size={20} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AboutPage
