import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Building2, Clock, Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AttendancePanel from '../components/AttendancePanel'
import { inputClass } from '../components/FormField'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const [tab, setTab] = useState('signin')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = login(username.trim(), password)
    if (!result.success) {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-bold">Real Estate</p>
            <p className="text-sm text-brand-100">Management</p>
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight">
            Manage your portfolio with confidence
          </h1>
          <p className="mt-4 max-w-md text-lg text-brand-100">
            Track projects, properties, customers, and team members — all in one partner portal.
          </p>
        </div>

        <p className="text-sm text-brand-200">© 2026 Real Estate Management</p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-slate-50 p-6 dark:bg-slate-900">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">Real Estate Management</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Partner Portal</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-6 flex rounded-xl bg-slate-100 p-1 dark:bg-slate-700/50">
              <button
                type="button"
                onClick={() => {
                  setTab('signin')
                  setError('')
                }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition ${
                  tab === 'signin'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('attendance')
                  setError('')
                }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition ${
                  tab === 'attendance'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Clock className="h-4 w-4" />
                Check In / Out
              </button>
            </div>

            {tab === 'signin' ? (
              <>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome back</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Sign in to access your dashboard
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Username
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`${inputClass} pl-10`}
                        placeholder="alex.mp@realestate"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${inputClass} pl-10 pr-10`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>

                <div className="mt-6 rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Demo accounts
                  </p>
                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <p>
                      <span className="font-medium text-slate-700 dark:text-slate-300">Admin:</span>{' '}
                      alex.mp@realestate / Sample
                    </p>
                    <p>
                      <span className="font-medium text-slate-700 dark:text-slate-300">Partner:</span>{' '}
                      partner@realestate / Sample
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Partner Attendance</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Check in or check out without signing in to the dashboard
                </p>
                <div className="mt-6">
                  <AttendancePanel standalone />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
