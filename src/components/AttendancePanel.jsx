import { useEffect, useMemo, useState } from 'react'
import { Clock, LogIn, LogOut } from 'lucide-react'
import { findUser } from '../constants/auth'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { inputClass } from './FormField'
import {
  todayDate,
  formatTime,
  formatDuration,
  calcDurationMinutes,
  getActiveRecord,
  getTodayRecord,
} from '../utils/attendance'
import { formatDate } from './Badge'

export default function AttendancePanel({ standalone = false }) {
  const { data, addItem, updateItem } = useData()
  const { user: sessionUser } = useAuth()
  const attendance = data.attendance || []

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [localUser, setLocalUser] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const activeUser =
    sessionUser?.role === 'partner'
      ? sessionUser
      : localUser

  const resolvePartner = () => {
    if (sessionUser?.role === 'partner') return sessionUser
    if (localUser) return localUser
    const account = findUser(username.trim(), password)
    if (!account) {
      setError('Invalid username or password')
      return null
    }
    if (account.role !== 'partner') {
      setError('Check-in is available for partner accounts only')
      return null
    }
    const user = { username: account.username, name: account.name, role: account.role }
    setLocalUser(user)
    setError('')
    return user
  }

  const activeRecord = useMemo(
    () => (activeUser ? getActiveRecord(attendance, activeUser.username) : null),
    [attendance, activeUser],
  )

  const todayRecord = useMemo(
    () => (activeUser ? getTodayRecord(attendance, activeUser.username) : null),
    [attendance, activeUser],
  )

  const myHistory = useMemo(() => {
    if (!activeUser) return []
    return attendance
      .filter((r) => r.partnerUsername === activeUser.username)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10)
  }, [attendance, activeUser])

  const liveDuration = activeRecord
    ? Math.round((now - new Date(activeRecord.checkInAt)) / 60000)
    : null

  const handleCheckIn = () => {
    setError('')
    setMessage('')
    const user = resolvePartner()
    if (!user) return

    if (getActiveRecord(attendance, user.username)) {
      setError('You are already checked in. Please check out first.')
      return
    }

    const checkInAt = new Date().toISOString()
    addItem('attendance', {
      partnerUsername: user.username,
      partnerName: user.name,
      date: todayDate(),
      checkInAt,
      checkOutAt: null,
      durationMinutes: null,
      status: 'checked-in',
    })
    setMessage(`Checked in at ${formatTime(checkInAt)}`)
  }

  const handleCheckOut = () => {
    setError('')
    setMessage('')
    const user = resolvePartner()
    if (!user) return

    const record = getActiveRecord(attendance, user.username)
    if (!record) {
      setError('No active check-in found for today.')
      return
    }

    const checkOutAt = new Date().toISOString()
    const durationMinutes = calcDurationMinutes(record.checkInAt, checkOutAt)

    updateItem('attendance', record.id, {
      checkOutAt,
      durationMinutes,
      status: 'checked-out',
    })
    setMessage(
      `Checked out at ${formatTime(checkOutAt)} · Total: ${formatDuration(durationMinutes)}`,
    )
  }

  const showCredentialForm = standalone && sessionUser?.role !== 'partner' && !localUser

  return (
    <div className="space-y-6">
      {showCredentialForm && (
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Partner Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
              placeholder="partner@realestate"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="Enter password"
            />
          </div>
        </div>
      )}

      {localUser && standalone && (
        <div className="rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
          Signed in as <strong>{localUser.name}</strong>
          <button
            type="button"
            onClick={() => {
              setLocalUser(null)
              setUsername('')
              setPassword('')
            }}
            className="ml-2 text-xs underline"
          >
            Change
          </button>
        </div>
      )}

      {(activeUser || showCredentialForm) && (
        <>
          {activeUser && (
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Today · {formatDate(todayDate())}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {activeUser.name}
                  </p>
                </div>
                <div className="rounded-xl bg-brand-50 p-3 dark:bg-brand-900/30">
                  <Clock className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-white p-3 dark:bg-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Check In</p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                    {todayRecord ? formatTime(todayRecord.checkInAt) : '—'}
                  </p>
                </div>
                <div className="rounded-xl bg-white p-3 dark:bg-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Check Out</p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                    {todayRecord?.checkOutAt ? formatTime(todayRecord.checkOutAt) : '—'}
                  </p>
                </div>
                <div className="rounded-xl bg-white p-3 dark:bg-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {activeRecord ? 'Live Duration' : 'Total Time'}
                  </p>
                  <p className="mt-1 font-semibold text-brand-600 dark:text-brand-400">
                    {activeRecord
                      ? formatDuration(liveDuration)
                      : formatDuration(todayRecord?.durationMinutes)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCheckIn}
              disabled={!!activeRecord}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogIn className="h-4 w-4" />
              Check In
            </button>
            <button
              type="button"
              onClick={handleCheckOut}
              disabled={activeUser ? !activeRecord : false}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <LogOut className="h-4 w-4" />
              Check Out
            </button>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          )}
          {message && (
            <div className="rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
              {message}
            </div>
          )}

          {activeUser && myHistory.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                Recent Attendance
              </h3>
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
                      <th className="px-4 py-2.5 font-medium text-slate-600 dark:text-slate-400">Date</th>
                      <th className="px-4 py-2.5 font-medium text-slate-600 dark:text-slate-400">In</th>
                      <th className="px-4 py-2.5 font-medium text-slate-600 dark:text-slate-400">Out</th>
                      <th className="px-4 py-2.5 font-medium text-slate-600 dark:text-slate-400">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {myHistory.map((r) => (
                      <tr key={r.id}>
                        <td className="px-4 py-2.5 text-slate-900 dark:text-slate-100">
                          {formatDate(r.date)}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">
                          {formatTime(r.checkInAt)}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">
                          {formatTime(r.checkOutAt)}
                        </td>
                        <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-slate-100">
                          {r.status === 'checked-in'
                            ? formatDuration(
                                Math.round((Date.now() - new Date(r.checkInAt)) / 60000),
                              )
                            : formatDuration(r.durationMinutes)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {standalone && !activeUser && !showCredentialForm && (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Enter partner credentials above to check in or check out
        </p>
      )}
    </div>
  )
}
