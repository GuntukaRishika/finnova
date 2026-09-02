import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa'

const contactDetails = [
  {
    icon: FaEnvelope,
    title: 'Email',
    value: 'hello@finnova.app',
    href: 'mailto:hello@finnova.app',
  },
  {
    icon: FaPhoneAlt,
    title: 'Phone',
    value: '+1 (555) 012-4567',
    href: 'tel:+15550124567',
  },
  {
    icon: FaMapMarkerAlt,
    title: 'Office',
    value: '1204 Harbor Avenue, San Diego, CA',
    href: '#',
  },
]

function ContactPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <div className="mb-10 max-w-3xl">
        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
          Contact
        </span>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          We’re here to help you build a stronger financial routine.
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Reach out with questions, partnership ideas, or feedback. We’d love to hear from you.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          {contactDetails.map(({ icon: Icon, title, value, href }) => (
            <a
              key={title}
              href={href}
              className="flex items-start gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:bg-emerald-50/40"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="mt-1 text-base font-semibold text-slate-900">{value}</p>
              </div>
            </a>
          ))}
        </div>

        <form className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Send a message</h2>
          <div className="mt-6 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Name</span>
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-400 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-400 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Message</span>
              <textarea
                rows="5"
                placeholder="Tell us how we can help"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-400 focus:bg-white"
              />
            </label>

            <button
              type="submit"
              className="rounded-full bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-700"
            >
              Send message
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default ContactPage
