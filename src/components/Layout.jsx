import {
  Building2,
  Clock,
  FolderKanban,
  Handshake,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  UserCircle,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'

const adminNavItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/properties', label: 'Properties', icon: Home },
  { to: '/customers', label: 'Customers', icon: UserCircle },
  { to: '/members', label: 'Team Members', icon: Users },
  { to: '/partners', label: 'Partners', icon: Handshake },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const partnerNavItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/site-sales-manager', label: 'Site/Sales Manager', icon: Handshake },
  { to: '/attendance', label: 'Attendance', icon: Clock },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function SidebarContent({ onNavigate, companyName, navItems, roleLabel }) {
  return (
    <>
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Real Estate</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{companyName}</p>
        </div>
      </div>

      <div className="mx-3 mb-2">
        <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
          {roleLabel}
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-4 dark:border-slate-700">
        <p className="text-center text-xs text-slate-400">© 2026 Real Estate Management</p>
      </div>
    </>
  )
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout, isAdmin, isPartner } = useAuth()
  const { settings } = useSettings()
  const navigate = useNavigate()

  const navItems = isPartner ? partnerNavItems : adminNavItems
  const roleLabel = isAdmin ? 'Admin' : 'Partner'
  const portalLabel = isAdmin ? 'Admin Portal' : 'Partner Portal'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const sidebarProps = {
    companyName: settings.companyName,
    navItems,
    roleLabel,
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 lg:flex">
        <SidebarContent {...sidebarProps} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex h-full w-64 flex-col bg-white shadow-xl dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent {...sidebarProps} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80 lg:px-8">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-brand-600 dark:text-brand-400">
              {portalLabel}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-600 dark:text-slate-400 sm:inline">
              {user?.name || user?.username}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
