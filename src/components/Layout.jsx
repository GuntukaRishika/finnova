import { Link } from 'react-router-dom'
import { FaWallet, FaBars } from 'react-icons/fa'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-slate-900">
            <FaWallet className="text-emerald-600" />
            Finnova
          </Link>
          <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="hover:text-emerald-600">Features</a>
            <a href="#about" className="hover:text-emerald-600">About</a>
            <a href="#contact" className="hover:text-emerald-600">Contact</a>
          </nav>
          <button className="rounded-full border border-slate-200 p-2 text-slate-600 md:hidden">
            <FaBars />
          </button>
        </div>
      </header>

      <main>{children}</main>

      <footer id="contact" className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-slate-600">
          © 2026 Finnova. Built for mindful money management.
        </div>
      </footer>
    </div>
  )
}

export default Layout
