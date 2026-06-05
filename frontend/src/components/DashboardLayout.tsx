import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Settings, Zap, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  children: ReactNode
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
]

function NavLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-8">
        <img
          src="/logo.png"
          alt="Handicap Pro"
          className="h-8 w-auto object-contain"
          onError={(e) => {
            const el = e.target as HTMLImageElement
            el.style.display = 'none'
          }}
        />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-white text-sm font-bold tracking-widest uppercase">HANDICAP</span>
        <span className="text-yellow-400 text-[9px] font-semibold tracking-[0.35em] uppercase">Pro</span>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: Props) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-dark-400 bg-dark-800/80 backdrop-blur-md">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <NavLogo />

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  location.pathname === item.href
                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-dark-600'
                )}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-8 h-8 rounded-full bg-dark-500 border border-dark-400 flex items-center justify-center">
                <Settings size={14} className="text-gray-500" />
              </div>
              <span className="hidden md:block font-medium text-gray-300">Operador</span>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b border-dark-700 bg-dark-800/40">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-2.5 flex items-center gap-2 text-xs text-gray-600">
          <Zap size={12} className="text-yellow-500" />
          <span>Handicap Pro</span>
          <ChevronRight size={10} />
          <span className="text-gray-400">Dashboard</span>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 md:px-6 py-6 animate-fade-in">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-700 px-6 py-4">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between text-xs text-gray-700">
          <span>Handicap Pro v1.0.0</span>
          <span>Progressive Bankroll Management System</span>
        </div>
      </footer>
    </div>
  )
}
